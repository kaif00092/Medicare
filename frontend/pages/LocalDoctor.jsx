import React, { useEffect, useState } from "react";

const LocalDoctor = () => {
  const params = new URLSearchParams(window.location.search);
  const doc = params.get("type");
  const [doctorType, setDoctorType] = useState(doc);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const normalizeDoctorType = (value) => {
    if (!value) return null;

    const normalized = value.trim().toLowerCase();

    if (normalized.includes("physician") || normalized.includes("doctor")) {
      return "doctors";
    }

    if (normalized.includes("clinic")) {
      return "clinic";
    }

    if (normalized.includes("hospital")) {
      return "hospital";
    }

    if (normalized.includes("dentist")) {
      return "dentist";
    }

    if (normalized.includes("pharmacy")) {
      return "pharmacy";
    }

    return null;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryType = params.get("type");
    const mappedType = normalizeDoctorType(queryType);

    if (mappedType) {
      setDoctorType(mappedType);
      getUserLocation(mappedType);
    } else {
      // If no query param, trigger a search on mount using the current doctorType
      getUserLocation(doctorType);
    }
  }, []);

  const getUserLocation = (selectedType = doctorType) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");
    setDoctors([]);
    setHasSearched(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        await findNearbyDoctors(latitude, longitude, selectedType);
      },
      (err) => {
        setLoading(false);

        if (err.code === 1) {
          setError("Location permission denied. Please allow location access.");
        } else if (err.code === 2) {
          setError("Location information is unavailable.");
        } else if (err.code === 3) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("Unable to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const findNearbyDoctors = async (
    latitude,
    longitude,
    selectedType = doctorType,
  ) => {
    try {
      const radius = 10000;

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="${selectedType === "emergency care" ? "hospital" : selectedType}"](around:${radius},${latitude},${longitude});
          way["amenity"="${selectedType}"](around:${radius},${latitude},${longitude});
          relation["amenity"="${selectedType}"](around:${radius},${latitude},${longitude});
        );
        out center tags;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from Overpass API");
      }

      const data = await response.json();
      console.log("Overpass API Response:", data);

      const formattedData = (data.elements || [])
        .map((place) => {
          const lat = place.lat || place.center?.lat;
          const lon = place.lon || place.center?.lon;

          return {
            ...place,
            lat,
            lon,
            distance:
              lat && lon
                ? calculateDistance(latitude, longitude, lat, lon)
                : null,
          };
        })
        .filter((place) => place.lat && place.lon)
        .filter((place) => place.tags?.amenity === selectedType)
        .sort((a, b) => a.distance - b.distance);

      setDoctors(formattedData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch nearby medical places. Please try again.");
      setLoading(false);
    }
  };

  const getAddress = (tags) => {
    if (!tags) return "Address not available";

    if (tags["addr:full"]) return tags["addr:full"];

    const street = tags["addr:street"];
    const city = tags["addr:city"];
    const postcode = tags["addr:postcode"];

    const addressParts = [street, city, postcode].filter(Boolean);

    return addressParts.length > 0
      ? addressParts.join(", ")
      : "Address not available";
  };

  const getTitle = () => {
    if (doctorType === "doctors") return "Doctors";
    if (doctorType === "clinic") return "Clinics";
    if (doctorType === "hospital") return "Hospitals";
    if (doctorType === "dentist") return "Dentists";
    if (doctorType === "pharmacy") return "Pharmacies";
    return "Medical Places";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">
            Find Local {getTitle()}
          </h1>

          <p className="mt-3 text-slate-600">
            Showing only nearby {getTitle().toLowerCase()} within 3 km of your
            current location.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Selected medical place
              </label>

              <select
                value={doctorType}
                onChange={(e) => setDoctorType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="doctors">Doctor</option>
                <option value="clinic">Clinic</option>
                <option value="hospital">Hospital</option>
                <option value="dentist">Dentist</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => getUserLocation(doctorType)}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 md:w-auto"
              >
                {loading ? "Searching..." : "Find Nearby"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-slate-600">Searching nearby {getTitle()}...</p>
          </div>
        )}

        {!loading && doctors.length > 0 && (
          <div>
            <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {getTitle()} within 10 km
              </h2>

              <p className="text-sm text-slate-500">
                {doctors.length} {getTitle().toLowerCase()} found
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => {
                const lat = doctor.lat;
                const lon = doctor.lon;

                return (
                  <div
                    key={`${doctor.type}-${doctor.id}`}
                    className="rounded-2xl border border-blue-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {doctor.tags?.name || "Name not available"}
                        </h3>

                        <p className="mt-1 text-sm capitalize text-blue-600">
                          {doctor.tags?.amenity || doctorType}
                        </p>
                      </div>

                      {doctor.distance && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {doctor.distance.toFixed(2)} km
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 text-sm text-slate-600">
                      {doctor.tags?.phone && (
                        <p>
                          <span className="font-semibold text-slate-700">
                            Phone:
                          </span>{" "}
                          {doctor.tags.phone}
                        </p>
                      )}

                      {doctor.tags?.opening_hours && (
                        <p>
                          <span className="font-semibold text-slate-700">
                            Opening Hours:
                          </span>{" "}
                          {doctor.tags.opening_hours}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex gap-3">
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-xl border border-blue-600 px-4 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Open Map
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Direction
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && hasSearched && doctors.length === 0 && !error && (
          <div className="mx-auto max-w-xl rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-center">
            <h3 className="text-lg font-bold text-yellow-800">
              No {getTitle()} found
            </h3>

            <p className="mt-2 text-sm text-yellow-700">
              No nearby {getTitle().toLowerCase()} found within 3 km. Try
              another medical type.
            </p>
          </div>
        )}

        <footer className="mt-12 border-t border-blue-100 pt-6 text-center">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-slate-900"
          >
            Go to Dashboard
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LocalDoctor;

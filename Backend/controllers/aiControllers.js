import User from "../models/user.model.js";
import { generateGeminiResponse } from "../services/geminiServices.js";

export const getHomeRemedy = async (req, res) => {
  try {
    const { symptoms } = req.body;
    console.log("HomeRemedy request - symptoms:", symptoms);
    console.log("HomeRemedy request - user:", req.user);

    if (!symptoms) {
      return res.status(400).json({
        message: "Symptoms are required",
      });
    }

    const user = await User.findById(req.user._id);
    console.log("HomeRemedy - user found:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const profile = {
      age: user.age,
      gender: user.gender,
      bloodGroup: user.bloodGroup,
      city: user.city,
      conditions: user.conditions || [],
      allergies: user.allergies || [],
    };
    console.log("HomeRemedy - profile:", profile);

    const prompt = `
You are a safe healthcare assistant.

User Profile:
Age: ${profile.age || "Not provided"}
Gender: ${profile.gender || "Not provided"}
Blood Group: ${profile.bloodGroup || "Not provided"}
City: ${profile.city || "Not provided"}
Medical Conditions: ${
      profile.conditions.length > 0 ? profile.conditions.join(", ") : "None"
    }
Allergies: ${
      profile.allergies.length > 0 ? profile.allergies.join(", ") : "None"
    }

Symptoms:
${symptoms}

Give safe home remedies only for minor symptoms.

Rules:
1. Use simple English.
2. Do not give medicine names.
3. Do not suggest anything that conflicts with allergies or medical conditions.
4. Mention when the user should visit a doctor.
5. Always tell with the help of symptoms tell the patient to which doctor they should go to.
6. Add disclaimer: This is not a replacement for professional medical advice.

Return response in this format:

Possible Reason:
Safe Home Remedies:
Things to Avoid:
Which Doctor to Visit:
Based only on the symptoms, choose the most suitable doctor category from this list:
- general physician
- dermatologist
- dentist
- ENT specialist
- ophthalmologist
- gastroenterologist
- cardiologist
- pulmonologist
- neurologist
- orthopedician
- gynecologist
- pediatrician
- urologist
- psychiatrist
- emergency care

Rules for doctor category:
1. Return only one category.
2. Do not write explanation.
3. Do not write extra text.
4. If symptoms are common/minor or unclear, return "general physician".
5. If symptoms look urgent or serious, return "emergency care"
When to See Doctor:
Disclaimer:
`;

    console.log("HomeRemedy - calling generateGeminiResponse");
    const remedy = await generateGeminiResponse(prompt);
    console.log(
      "HomeRemedy - remedy generated:",
      remedy ? remedy.substring(0, 100) + "..." : null,
    );

    if (!remedy) {
      return res.status(500).json({
        message: "Failed to generate AI response",
      });
    }

    const parseRemedy = (text = "") => {
      console.log("parseRemedy - input text length:", text.length);
      const sections = {
        possibleReason: "",
        safeRemedies: [],
        thingsToAvoid: [],
        whichDoctorToVisit: "",
        whenToSeeDoctor: "",
        disclaimer: "",
      };

      const lines = text.split("\n");
      console.log("parseRemedy - number of lines:", lines.length);
      let currentSection = null;

      for (let line of lines) {
        line = line.trim();

        if (line.includes("Possible Reason:")) {
          currentSection = "possibleReason";
          sections.possibleReason = line.replace("Possible Reason:", "").trim();
        } else if (line.includes("Safe Home Remedies:")) {
          currentSection = "safeRemedies";
        } else if (line.includes("Things to Avoid:")) {
          currentSection = "thingsToAvoid";
        } else if (line.includes("Which Doctor to Visit:")) {
          currentSection = "whichDoctorToVisit";
          sections.whichDoctorToVisit = line
            .replace("Which Doctor to Visit:", "")
            .trim();
        } else if (line.includes("When to See Doctor:")) {
          currentSection = "whenToSeeDoctor";
          sections.whenToSeeDoctor = line
            .replace("When to See Doctor:", "")
            .trim();
        } else if (line.includes("Disclaimer:")) {
          currentSection = "disclaimer";
          sections.disclaimer = line.replace("Disclaimer:", "").trim();
        } else if (
          line &&
          (currentSection === "safeRemedies" ||
            currentSection === "thingsToAvoid")
        ) {
          // Remove bullet points and numbers
          const cleanedLine = line
            .replace(/^[-*•]\s*/, "")
            .replace(/^\d+\.\s*/, "");
          if (cleanedLine) {
            sections[currentSection].push(cleanedLine);
          }
        } else if (
          line &&
          currentSection &&
          currentSection !== "safeRemedies" &&
          currentSection !== "thingsToAvoid"
        ) {
          sections[currentSection] +=
            (sections[currentSection] ? " " : "") + line;
        }
      }

      console.log("parseRemedy - parsed sections:", sections);
      return sections;
    };

    const parsedRemedy = parseRemedy(remedy);
    console.log("HomeRemedy - final response:", parsedRemedy);

    res.status(200).json({
      message: "Home remedy generated successfully",
      remedy: parsedRemedy,
    });
  } catch (error) {
    console.log("AI Home Remedy Error:", error);
    res.status(500).json({
      message: "AI home remedy error",
      error: error.message,
    });
  }
};

import axios from "axios";

export const generateGeminiResponse = async (prompt) => {
  try {
    console.log("===== Gemini Service Starting =====");
    console.log("GEMINI_URL:", process.env.GEMINI_URL);
    console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_URL) {
      throw new Error("CRITICAL: GEMINI_URL environment variable is not set");
    }
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "CRITICAL: GEMINI_API_KEY environment variable is not set",
      );
    }

    console.log("Making request to Gemini API...");
    const response = await axios.post(
      process.env.GEMINI_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      },
    );

    console.log("Gemini response received successfully");
    console.log("Response status:", response.status);

    const result =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.data?.candidates?.[0]?.content?.[0]?.text ||
      response.data?.candidates?.[0]?.output ||
      null;

    if (!result) {
      console.warn("Gemini response was parsed but returned empty/null");
      console.log("Full response:", JSON.stringify(response.data));
    }

    console.log("===== Gemini Service Completed Successfully =====");
    return result;
  } catch (error) {
    console.error("===== Gemini REST Error =====");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      console.error("Response headers:", error.response.headers);
    }
    throw new Error(
      `Failed to generate response from Gemini: ${error.message}`,
    );
  }
};

import axios from "axios";

export const analyzeReports = async ({ prompt, fileBuffer, mimeType }) => {
  try {
    const base64File = fileBuffer.toString("base64");

    const response = await axios.post(
      process.env.GEMINI_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType,
                  data: base64File,
                },
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

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No analysis received from Gemini");
    }

    return text;
  } catch (error) {
    console.log("Gemini Report Error:", error.response?.data || error.message);
    throw new Error("Failed to analyze report");
  }
};

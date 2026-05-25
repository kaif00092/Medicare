import axios from "axios";

export const generateGeminiResponse = async (prompt) => {
  try {
    const url = `${process.env.GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
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
        },
      },
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.log("Gemini REST Error:", error.response?.data || error.message);
    throw new Error("Failed to generate response from Gemini");
  }
};

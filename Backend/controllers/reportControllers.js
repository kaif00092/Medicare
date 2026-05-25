import { analyzeReports } from "../services/geminiReportServices.js";

export const analyzeMedicalReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { language } = req.body;

    const selectedLanguage = language === "Hindi" ? "Hindi" : "English";

    const prompt = `
You are a careful healthcare report explainer.

Analyze the uploaded medical report and explain it for a normal patient.

The user wants the report explanation in: ${selectedLanguage}

Rules:
1. Use ${selectedLanguage} language only.
2. explain the report in a simple way that a non medical person can understand. Avoid medical jargon or explain it in simple terms if you have to use it. Use simple language and short sentences. If the report is in a language other than ${selectedLanguage}, translate it to ${selectedLanguage} before explaining.
3. Do not diagnose the patient.
4. Do not prescribe medicine.
5. Explain abnormal values if visible.
6. Mention what values look normal and what values may need doctor attention.
7. If the report image/PDF is unclear, say that clearly.
8. Return ONLY valid JSON. Do not include markdown.
9. Only the values should be in ${selectedLanguage}. The keys in the JSON should be in English.

JSON format:
{
  "summary": "short overall summary",
  "normalFindings": ["normal point 1", "normal point 2"],
  "attentionNeeded": ["point that may need doctor attention"],
  "simpleExplanation": "explain report in simple patient-friendly language",
  "questionsForDoctor": ["question 1", "question 2"],
  "disclaimer": "This explanation is for understanding only and is not a medical diagnosis."
}
`;

    const analyzeText = await analyzeReports({
      prompt,
      fileBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });
    let analysis;

    try {
      analysis = JSON.parse(analyzeText.replace(/```json|```/g, "").trim());
    } catch (error) {
      return res.status(500).json({
        message: "AI response was not valid JSON",
        rawResponse: analyzeText,
      });
    }

    res.status(200).json({
      message: "Report analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing report:", error.message);
    res
      .status(500)
      .json({ message: "Failed to analyze report", error: error.message });
  }
};

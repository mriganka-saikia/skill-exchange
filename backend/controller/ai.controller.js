const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateDescription = async (req, res) => {
    const { title, category } = req.body;
    if (!title) return res.status(400).send({ message: "Title is required to generate a description" });

    const prompt = `Write a short, friendly 2-3 sentence description (max 60 words) for a skill-exchange listing titled "${title}"${category ? ` in the "${category}" category` : ""}. Highlight what a learner will gain. No markdown, no quotes.`;

    try {
        const response = await ai.models.generateContent({ model: "gemini-3.6-flash", contents: prompt });
        res.status(200).send({ message: "Description generated successfully", output: response.text || "" });
    } catch (error) {
        res.status(500).send({ message: "Failed to generate description", error: error.message });
    }
};

module.exports = { generateDescription };
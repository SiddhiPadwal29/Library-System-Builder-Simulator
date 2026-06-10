import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crash if API key is missing
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please set it in the Secrets panel.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// API endpoint for Java Coding Coach Q&A
app.post("/api/gemini/qa", async (req, res) => {
  try {
    const { prompt, currentCodeContext } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const gemini = getGeminiClient();
    const systemInstruction = `You are an expert Java Programming Professor, grading TA, and helper coach.
The student is working on: "Task 3 - Week 3: Java Programming Basics: Console-Based Library Management System".
They are studying a high-quality Java console app codebase that teaches Encapsulation, ArrayLists, File I/O for text files, and fine calculations.

Provide precise, friendly, and academically solid answers. Explain Java keywords, principles, and architectural trade-offs using code segments from the library codebase.
Format your responses using beautiful clean Markdown structure. Do not use promotional language or emojis excessively.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: `Here is the current Java library codebase context:\n${JSON.stringify(currentCodeContext || {})}` },
        { text: prompt }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini QA Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Coach." });
  }
});

// Start the server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

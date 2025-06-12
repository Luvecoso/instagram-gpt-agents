// api/copy.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    // Health-check para GET
    if (req.method === "GET") {
      return res.status(200).json({ status: "🤖 Copywriter Agent ativo!" });
    }

    // Lógica principal para POST
    if (req.method === "POST") {
      const { tema, objetivo_especifico, cta } = req.body;
      if (!tema || !objetivo_especifico || !cta) {
        return res
          .status(400)
          .json({ error: "Faltam campos: tema, objetivo_especifico ou cta." });
      }

      const messages = [
        {
          role: "system",
          content: "Você é um copywriter expert em conteúdo para Instagram."
        },
        {
          role: "user",
          content: `

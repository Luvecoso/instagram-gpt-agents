import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ status: "🤖 Strategic Agent ativo!" });
  }

  if (req.method === "POST") {
    try {
      const { objetivo, persona, performance } = req.body;
      if (!objetivo || !persona?.descricao || !performance?.views) {
        return res.status(400).json({ error: "Faltam campos obrigatórios." });
      }
      const messages = [
        { role: "system", content: "Você é um consultor estratégico de marketing digital." },
        {
          role: "user",
          content: `

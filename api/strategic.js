// api/strategic.js

import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ status: "Strategic Agent está ativo 🎯" });
  }
  if (req.method === "POST") {
    try {
      const { objetivo, persona, performance } = req.body;
      const messages = [
        { role: "system", content: "Você é um consultor estratégico de marketing digital." },
        {
          role: "user",
          content: `
Meta: ${objetivo}
Público: ${persona.descricao}
Dados anteriores: views ${performance.views}, salvamentos ${performance.salvamentos}

Gere:
1. Plano de 4 semanas (temas + formatos)
2. 3 ganchos por semana
3. CTA sugerido para cada post
4. Principais KPIs a monitorar
          `,
        },
      ];
      const completion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      });
      return res.status(200).json({
        plano: completion.data.choices[0].message.content.trim(),
      });
    } catch (error) {
      console.error("Erro no Strategic Agent:", error);
      return res.status(500).json({ error: "Falha ao gerar plano estratégico." });
    }
  }
  res.setHeader("Allow", ["GET","POST"]);
  res.status(405).end(`Método ${req.method} não permitido`);
}


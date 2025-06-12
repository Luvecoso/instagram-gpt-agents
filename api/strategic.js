// api/strategic.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    // Health-check para GET
    if (req.method === "GET") {
      return res.status(200).json({ status: "🤖 Strategic Agent ativo!" });
    }

    // Lógica principal para POST
    if (req.method === "POST") {
      const { objetivo, persona, performance } = req.body;
      if (!objetivo || !persona?.descricao || !performance?.views) {
        return res.status(400).json({ error: "Faltam campos obrigatórios." });
      }

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

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      });

      const plano = completion.choices[0].message.content.trim();
      return res.status(200).json({ plano });
    }

    // Métodos não suportados
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  } catch (err) {
    console.error("Erro no Strategic Agent:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}

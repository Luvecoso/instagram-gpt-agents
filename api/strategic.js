// api/strategic.js

import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  try {
    // 1. Ler o brief enviado no corpo da requisição (JSON)
    const { objetivo, persona, performance } = req.body;

    // 2. Montar as mensagens para o ChatGPT
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

    // 3. Chamar a API de Chat Completions
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",      // ou o modelo que preferir
      messages,
      temperature: 0.7,
      max_tokens: 600,
    });

    // 4. Enviar a resposta de volta
    res.status(200).json({
      plano: completion.data.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("Erro no Strategic Agent:", error);
    res.status(500).json({ error: "Falha ao gerar plano estratégico." });
  }
}

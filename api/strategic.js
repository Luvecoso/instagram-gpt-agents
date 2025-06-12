// api/strategic.js

export default async function handler(req, res) {
  try {
    // 1) Health check simples para GET, sem importar nada
    if (req.method === "GET") {
      return res.status(200).json({ status: "🤖 Strategic Agent ativo!" });
    }

    // 2) Apenas no POST carregamos a OpenAI
    if (req.method === "POST") {
      // Import dinâmico para só falhar se realmente for usar a OpenAI
      const { Configuration, OpenAIApi } = await import("openai");

      const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(config);

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

      const completion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      });

      return res.status(200).json({
        plano: completion.data.choices[0].message.content.trim(),
      });
    }

    // 3) Métodos não suportados
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  } catch (err) {
    // Qualquer erro, retornamos a mensagem para diagnóstico
    console.error("Erro na Function:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}


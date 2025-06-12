// api/copy.js

export default async function handler(req, res) {
  try {
    // Health-check para GET
    if (req.method === "GET") {
      return res.status(200).json({ status: "🤖 Copywriter Agent ativo!" });
    }

    // Lógica principal para POST
    if (req.method === "POST") {
      // Import dinâmico aqui
      const { default: OpenAI } = await import("openai");

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

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
Sub-brief de conteúdo:
- Tema: ${tema}
- Objetivo: ${objetivo_especifico}
- CTA: ${cta}

Gere:
A) Roteiro de Reels: 00:00–00:15 (hook), 00:15–01:00 (corpo).
B) Legenda otimizada (gancho inicial, emojis, 3 hashtags).
C) 2 variações de título.
          `
        }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      });

      const copy = completion.choices[0].message.content.trim();
      return res.status(200).json({ copy });
    }

    // Métodos não suportados
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  } catch (err) {
    console.error("Erro no Copywriter Agent:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}


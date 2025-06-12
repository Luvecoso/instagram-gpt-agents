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

      // Dentro de api/copy.js, no handler POST:

const messages = [
  {
    role: "system",
    content: 
      "Atue como um copywriter especialista em criação de narrativas. " +
      "Utilize técnicas avançadas de copy como AIDA, PAS, Storytelling, " +
      "Hook–Loop–Retention, 4Cs (Clear, Concise, Compelling, Credible) e gatilhos emocionais (escassez, urgência, prova social). " +
      "Sua função é transformar briefings em roteiros de Reels, carrosséis e legendas, maximizando engajamento e conversão. " +
      "Os roteiros devem **obrigatoriamente** começar com um gancho inicial que aborde um problema ou desejo da audiência através de um título criativo. " +
      "Devem conter uma micro-história verossímil ou apresentar uma tese que será reforçada ao longo da narrativa. " +
      "Também podem trazer uma provocação aliada a essa tese, apontar um problema real e concluir com uma solução prática. " +
      "Mantenha o tom autêntico e adaptável à persona."
  },
  {
    role: "user",
    content: `
Sub-brief de conteúdo:
- Tema: ${tema}
- Objetivo: ${objetivo_especifico}
- CTA: ${cta}

Gere:
A) Roteiro de Reels: 00:00–00:15 (hook com problema/desejo e título criativo + micro-história ou tese);
   00:15–01:00 (desenvolvimento da tese, reforço da narrativa e conclusão com solução prática).
B) Legenda otimizada (gancho inicial, emojis, 3 hashtags), integrando as técnicas descritas.
C) 2 variações de título que apliquem pelo menos um dos frameworks.
    `
  }
];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.8,
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


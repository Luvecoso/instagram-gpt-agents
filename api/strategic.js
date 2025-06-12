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
      if (!objetivo || !persona?.perfil || !performance?.views) {
  return res
    .status(400)
    .json({ error: "Faltam campos obrigatórios: objetivo, persona.perfil ou performance.views." });
}

      // dentro de api/strategic.js, no handler POST:

const messages = [
  {
    role: "system",
    content: "Você é um consultor estratégico de marketing digital, especialista em perfis de criadoras de conteúdo."
  },
  {
    role: "user",
    content: `
Meta de negócio: ${objetivo}

Detalhes da persona:
- Perfil: ${persona.perfil}
- Faixa etária: ${persona.faixa_etaria}
- Nível de conhecimento: ${persona.nivel_conhecimento}
- Principais problemas:
  • ${persona.problemas.join("\n  • ")}
- Desejos e motivações:
  • ${persona.desejos.join("\n  • ")}

Dados de performance recentes:
- Views: ${performance.views}
- Salvamentos: ${performance.salvamentos}
- Compartilhamentos: ${performance.compartilhamentos}
- Novos seguidores: ${performance.novos_seguidores}

Com base nisso, gere:
1. Um plano de conteúdo de 4 semanas (tema + formato) alinhado a essa persona.
2. 3 ganchos textuais por semana que falem diretamente das dores e desejos listados.
3. Sugestão de CTA para cada post.
4. Principais KPIs a monitorar a cada semana.
    `
  }
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

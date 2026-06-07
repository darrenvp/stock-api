import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const symbol = req.query.symbol || "NVDA";

    // 1️⃣ 抓你自己的 quote API
    const stockRes = await fetch(
      `https://stock-api-five-nu.vercel.app/api/quote?symbol=${symbol}`
    );

    const stock = await stockRes.json();

    // 2️⃣ GPT
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "你是美股短線交易員，用非常精簡方式給操作建議（不要廢話）",
        },
        {
          role: "user",
          content: `
股票：${symbol}
價格資料：${JSON.stringify(stock)}

請輸出：
1. 多 / 空
2. 操作建議（買 / 賣 / 觀望）
3. 風險一句話
          `,
        },
      ],
    });

    res.status(200).json({
      symbol,
      stock,
      analysis: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

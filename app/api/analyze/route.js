import OpenAI from "openai";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    // 1️⃣ 抓你的 quote API
    const stockRes = await fetch(
      `https://stock-api-five-nu.vercel.app/api/quote?symbol=${symbol}`
    );

    const stock = await stockRes.json();

    // 2️⃣ OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "你是短線交易分析員，用極簡方式回答（多/空/觀望 + 一句風險）",
        },
        {
          role: "user",
          content: `
股票：${symbol}
價格資料：${JSON.stringify(stock)}

請輸出：
1. 多 / 空 / 觀望
2. 操作建議（簡短）
3. 風險一句話
          `,
        },
      ],
    });

    return Response.json({
      symbol,
      stock,
      analysis: completion.choices[0].message.content,
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

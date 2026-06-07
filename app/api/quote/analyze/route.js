import OpenAI from "openai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    // 1️⃣ 抓你自己的 quote API
    const stockRes = await fetch(
      `https://stock-api-five-nu.vercel.app/api/quote?symbol=${symbol}`
    );

    const stock = await stockRes.json();

    // 2️⃣ 初始化 OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3️⃣ GPT 分析
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "你是專業美股交易員，用極簡方式分析，不要廢話。",
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

    // 4️⃣ 回傳結果
    return Response.json({
      symbol,
      stock,
      analysis: completion.choices[0].message.content,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "server error" },
      { status: 500 }
    );
  }
}

import OpenAI from "openai";

// 💡 配合前端，將原本的 POST 改成 GET！
export async function GET(req) {
  try {
    // 🎯 從網址參數（URL Search Params）抓取前端傳過來的 symbol
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    // 💡 既然前端用網址傳參數，股價與漲跌幅如果沒在網址上，後端就給它貼心的預設值
    const price = searchParams.get("price") || "當前最新價";
    const change = searchParams.get("change") || "最新漲跌幅";

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "你是一位精通美股分析的 AI 助手。請用繁體中文回答。"
          },
          {
            role: "user",
            content: `請幫我分析股票 ${symbol}。當前狀況：${price}，漲跌幅為 ${change}。請給出週末盤後總結與下週的操作建議。`
          }
        ],
        temperature: 0.7,
      });

      const aiResult = response.choices[0].message.content;
      return Response.json({ result: aiResult });

    } catch (openAiError) {
      console.error("OpenAI API 失敗:", openAiError);
      // 🎯 如果 OpenAI 爆掉，把原因直接回傳，這樣網頁就不會卡住，而是會顯示這行字
      return Response.json({ 
        result: `❌ AI 分析失敗！原因：${openAiError.message || "OpenAI 金鑰或額度異常，請檢查 Vercel 環境變數。"}` 
      });
    }

  } catch (error) {
    console.error("Analyze 系統錯誤:", error);
    return Response.json({ result: `❌ 系統錯誤：${error.message}` });
  }
}

import OpenAI from "openai";

export async function POST(req) {
  try {
    // 💡 保險機制 1：防止前端傳進來的 JSON 解析失敗
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      console.error("解析前端 JSON 失敗，使用預設空物件");
    }

    // 💡 保險機制 2：如果前端沒給 symbol，至少給個預設值，不讓程式崩潰
    const symbol = body.symbol || "NVDA";
    
    // 💡 保險機制 3：不管前端給的是 rawPrice 還是帶有字串的 price，後端通通包容
    const price = body.rawPrice || body.price || "暫無數據";
    const change = body.rawChange || body.change || "暫無數據";

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 🛠️ 這裡加上 try-catch 安全網，如果 OpenAI Key 有問題，直接印在網頁上給你看
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // 使用最新最穩定的輕量模型
        messages: [
          {
            role: "system",
            content: "你是一位精通美股分析的 AI 助手。請用繁體中文回答。"
          },
          {
            role: "user",
            content: `請幫我分析股票 ${symbol}。當前股價為 ${price}，漲跌幅為 ${change}。請給出週末盤後總結與下週的操作建議。`
          }
        ],
        temperature: 0.7,
      });

      const aiResult = response.choices[0].message.content;
      return Response.json({ result: aiResult });

    } catch (openAiError) {
      console.error("OpenAI API 呼叫失敗:", openAiError);
      // 🎯 如果是金鑰過期或額度沒了，直接把真實原因吐給前端網頁，不要讓它卡在分析中！
      return Response.json({ 
        result: `❌ AI 分析失敗！原因：${openAiError.message || "OpenAI 金鑰或額度異常，請檢查 Vercel 環境變數。"}` 
      });
    }

  } catch (error) {
    console.error("Analyze API 系統錯誤:", error);
    return Response.json({ result: `❌ 系統錯誤：${error.message}` });
  }
}

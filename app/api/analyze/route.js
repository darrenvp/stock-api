import { NextResponse } from "next/server";
import OpenAI from "openai";

// 💡 確保初始化時直接將 Vercel 的環境變數注入進去
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { symbol, price, change, high, low } = body;

    // 🤖 呼叫 OpenAI 進行分析
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 使用高 CP 值且速度極快的 gpt-4o-mini 模型
      messages: [
        {
          role: "system",
          content: "你是一位精通美股的頂級投資分析師。請根據使用者提供的盤後數據，提供精準、客觀且有洞察力的投資建議與下週策略規劃。",
        },
        {
          role: "user",
          content: `請幫我分析這檔股票的盤後表現：
          股票代號: ${symbol}
          當前價格: ${price || "暫無"}
          今日漲跌: ${change || "暫無"}
          今日最高: ${high || "暫無"}
          今日最低: ${low || "暫無"}
          
          請給出短期的操作建議與下週開盤的關注焦點。`,
        },
      ],
      temperature: 0.7,
    });

    const analysis = response.choices[0].message.content;
    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("OpenAI API 發生錯誤:", error);
    
    // 🛠️ 這是最強大的防錯安全網！
    // 就算金鑰有問題，也會把錯誤訊息回傳給網頁，前端就不會抓瞎閃退
    return NextResponse.json(
      { 
        analysis: `❌ AI 分析失敗，錯誤原因：${error.message}。請檢查 Vercel 的 OPENAI_API_KEY 是否填寫正確，或帳戶額度是否充足。` 
      }, 
      { status: 200 } // 保持 200 讓前端文字框能順利把這行錯誤字串印出來
    );
  }
}


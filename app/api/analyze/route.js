export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "未知股票";

    // 💡 完全不呼叫 OpenAI，直接測試前後端到底有沒有通
    const testResult = `【系統測試成功】你點擊了 ${symbol} 的 AI 分析。這代表前端 GET 請求與後端完全接通！如果先前出現 500 錯誤，代表你的 Vercel 後台沒有設定好 OPENAI_API_KEY 環境變數，或是 Key 已過期。`;

    return Response.json({ result: testResult });

  } catch (error) {
    console.error("測試 API 錯誤:", error);
    return Response.json({ result: `❌ 系統錯誤：${error.message}` });
  }
}

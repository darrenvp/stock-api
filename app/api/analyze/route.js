export async function GET(req) {
  try {
    // 🎯 直接從前端傳來的網址網址參數拿 symbol
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    // 💡 割斷所有外部 API 連線，不連 stock-api-five-nu... 避免被別人拖累 404
    const testResult = `【連線大成功】後端已成功收到股票代號：${symbol}！這代表你的前端與後端路由路徑完全正確。下一步只要確認好 OpenAI Key 就能正式啟用 AI 分析功能！`;

    return Response.json({ result: testResult });

  } catch (error) {
    console.error("Analyze API 發生錯誤:", error);
    return Response.json({ result: `❌ 系統錯誤：${error.message}` }, { status: 500 });
  }
}

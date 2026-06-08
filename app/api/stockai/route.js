export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    const testResult = `【全新通道大成功】後端已成功收到股票代號：${symbol}！這代表全新的 /api/stockai 路由完全暢通，而且徹底甩開舊網址了！`;

    return Response.json({ result: testResult });

  } catch (error) {
    return Response.json({ result: `❌ 系統錯誤：${error.message}` }, { status: 500 });
  }
}

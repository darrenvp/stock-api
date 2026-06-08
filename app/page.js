"use client";

import { useEffect, useState } from "react";

// 💡 強制動態渲染，徹底破除 Vercel 靜態頁面快取
export const dynamic = "force-dynamic";

const stocks = ["NVDA", "AMD", "TSLA", "PLTR"];

export default function Home() {
  const [data, setData] = useState({});
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState({});

  // 📊 抓股價
  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        stocks.map(async (symbol) => {
          const res = await fetch(`/api/quote?symbol=${symbol}`);
          const json = await res.json();
          return { symbol, json };
        })
      );

      const map = {};
      results.forEach((r) => {
        map[r.symbol] = r.json;
      });

      setData(map);
    } catch (error) {
      console.error("前端抓取股價失敗:", error);
    }
    setLoading(false);
  };

  // 🤖 AI 分析
  const runAnalyze = async (symbol) => {
    setLoadingAI((prev) => ({ ...prev, [symbol]: true }));

    try {
      // 🎯 核心鎖定：確保精準呼叫新路由，不留任何舊路徑影子
      const res = await fetch(`/api/stockai?symbol=${symbol}`);
      const json = await res.json();

      setAnalysis((prev) => ({
        ...prev,
        [symbol]: json.result || "暫無分析結果",
      }));
    } catch (err) {
      setAnalysis((prev) => ({
        ...prev,
        [symbol]: "❌ 前端請求失敗",
      }));
    }

    setLoadingAI((prev) => ({ ...prev, [symbol]: false }));
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* 🎯 這裡多加了 v2 標記，用來強迫瀏覽器和 Vercel 辨識檔案已全面更新 */}
      <h1>📊 Stock AI Dashboard v2</h1>

      <button onClick={fetchData} style={{ padding: "8px 12px", cursor: "pointer", marginBottom: 10 }}>
        Refresh Prices
      </button>

      {loading && Object.keys(data).length === 0 && <p>Loading prices...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
          marginTop: 20,
        }}
      >
        {stocks.map((symbol) => {
          const s = data[symbol] || {};

          return (
            <div
              key={symbol}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                borderRadius: 8,
              }}
            >
              <h2>{symbol}</h2>

              <p>💰 Price: {s.price || "載入中..."}</p>
              <p style={{ color: s.rawChange >= 0 ? "green" : "red" }}>
                📊 Change: {s.change || "--%"}
              </p>

              <p>🔼 High: {s.high || "載入中..."}</p>
              <p>🔽 Low: {s.low || "載入中..."}</p>

              <hr />

              <button
                onClick={() => runAnalyze(symbol)}
                disabled={loadingAI[symbol] || !s.price}
                style={{ padding: "6px 10px", cursor: "pointer" }}
              >
                {loadingAI[symbol] ? "分析中..." : "🤖 AI 分析"}
              </button>

              {analysis[symbol] && (
                <div style={{ 
                  marginTop: 10, 
                  padding: 10, 
                  backgroundColor: "#f9f9f9", 
                  borderRadius: 4,
                  borderLeft: "4px solid orange",
                  whiteSpace: "pre-wrap",
                  color: "#333"
                }}>
                  {analysis[symbol]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

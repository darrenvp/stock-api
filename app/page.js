"use client";

import { useEffect, useState } from "react";

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
      // 🎯 修正：拿掉多打的斜線，改呼叫全新的乾淨通道 /api/stockai
      const res = await fetch(`/api/stockai?symbol=${symbol}`);
      const json = await res.json();

      // 🎯 修正：後端回傳的是 result 欄位，精準對齊 json.result
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
      <h1>📊 Stock AI Dashboard</h1>

      <button onClick={fetchData} style={{ padding: "8px 12px", cursor: "pointer" }}>
        Refresh Prices
      </button>

      {loading && <p>Loading prices...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
          marginTop: 20,
        }}
      >
        {stocks.map((symbol) => {
          const s = data[symbol];
          if (!s) return null;

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

              {/* 🎯 修正：精準對齊你後端吐出來的全新漂亮格式：price, change, high, low */}
              <p>💰 Price: {s.price}</p>
              <p style={{ color: s.rawChange >= 0 ? "green" : "red" }}>
                📊 Change: {s.change}
              </p>

              <p>🔼 High: {s.high}</p>
              <p>🔽 Low: {s.low}</p>

              <hr />

              <button
                onClick={() => runAnalyze(symbol)}
                disabled={loadingAI[symbol]}
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

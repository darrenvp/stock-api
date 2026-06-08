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
    setLoading(false);
  };

  // 🤖 AI 分析
  const runAnalyze = async (symbol) => {
    setLoadingAI((prev) => ({ ...prev, [symbol]: true }));

    try {
      const res = await fetch(`//api/stockai?symbol=${symbol}`);
      const json = await res.json();

      setAnalysis((prev) => ({
        ...prev,
        [symbol]: json.analysis,
      }));
    } catch (err) {
      setAnalysis((prev) => ({
        ...prev,
        [symbol]: "AI 分析失敗",
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

      <button onClick={fetchData}>Refresh Prices</button>

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

              <p>💰 Price: {s.c}</p>
              <p style={{ color: s.dp >= 0 ? "green" : "red" }}>
                📊 Change: {s.dp}%
              </p>

              <p>🔼 High: {s.h}</p>
              <p>🔽 Low: {s.l}</p>

              <hr />

              <button
                onClick={() => runAnalyze(symbol)}
                disabled={loadingAI[symbol]}
              >
                {loadingAI[symbol] ? "分析中..." : "🤖 AI 分析"}
              </button>

              {analysis[symbol] && (
                <p style={{ marginTop: 10, color: "orange" }}>
                  {analysis[symbol]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

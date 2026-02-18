import React, { useEffect, useState } from "react";
import { GameProgress } from "../utils/GameProgress";

export default function CoinDisplay() {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const currentCoins = GameProgress.getCoins();
    setCoins(currentCoins);
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(45deg, #FFD700, #FFA500)",
        padding: "8px 16px",
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "18px",
        color: "white",
        display: "inline-block"
      }}
    >
      🪙 {coins}
    </div>
  );
}

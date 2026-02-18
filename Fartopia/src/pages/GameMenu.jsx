import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoinDisplay from "../components/CoinDisplay";
import { GameProgress } from "../utils/GameProgress";

export default function GameMenu() {

  const navigate = useNavigate();

  // Initialize persistent progress system
  useEffect(() => {
    GameProgress.initialize();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center"
      }}
    >
      <h1>FARTOPIA ZOO</h1>

      <div style={{ marginBottom: "20px" }}>
        <CoinDisplay />
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        
        <button onClick={() => navigate("/play")}>
          Play Games!
        </button>

        <button onClick={() => navigate("/creatures")}>
          My Creatures
        </button>

        <button onClick={() => navigate("/shop")}>
          Shop
        </button>

        <button onClick={() => navigate("/settings")}>
          Settings
        </button>

      </div>

    </div>
  );
}

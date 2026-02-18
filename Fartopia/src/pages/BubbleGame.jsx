import React, { useState, useEffect } from "react";
import GameProgress from "../utils/GameProgress";
import { Sounds } from "../utils/sounds";

export default function BubbleGame() {
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    spawnBubble();
  }, []);

  function spawnBubble() {
    const id = Date.now();

    setBubbles((prev) => [
      ...prev,
      {
        id,
        left: Math.random() * 80 + "%",
        top: Math.random() * 80 + "%",
      },
    ]);

    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 2000);
  }

  function popBubble(id) {
    Sounds.play("fart1");

    setScore((prev) => prev + 1);

    GameProgress.addCoins(5);

    Sounds.play("coin");

    setBubbles((prev) => prev.filter((b) => b.id !== id));

    spawnBubble();
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Pop the Fart Bubbles!</h1>

      <h2>Score: {score}</h2>

      <div
        style={{
          position: "relative",
          height: "400px",
          border: "2px solid pink",
          borderRadius: "20px",
        }}
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            style={{
              position: "absolute",
              left: bubble.left,
              top: bubble.top,
              fontSize: "40px",
              cursor: "pointer",
            }}
          >
            💨
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect } from "react";

const Confetti = ({ onComplete }) => {
  useEffect(() => {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const confettiCount = 120;
    const confetti = [];
    const colors = ["#f87171", "#facc15", "#34d399", "#60a5fa", "#a78bfa", "#f472b6"];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < confettiCount; i++) {
      const fromLeft = i % 2 === 0;
      confetti.push({
        x: fromLeft ? 0 : canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: fromLeft ? Math.random() * 6 + 2 : -(Math.random() * 6 + 2),
        vy: Math.random() * 2 - 1,
        tilt: Math.random() * 10 - 5,
        tiltAngle: 0,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05
      });
    }

    let animationFrame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach(c => {
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
        ctx.stroke();
      });
      update();
      animationFrame = requestAnimationFrame(draw);
    }

    function update() {
      confetti.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.tiltAngle += c.tiltAngleIncrement;
        c.tilt = Math.sin(c.tiltAngle) * 15;
      });
    }

    draw();
    setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [onComplete]);

  return (
    <canvas
      id="confetti-canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 9999
      }}
    />
  );
};

export default Confetti;
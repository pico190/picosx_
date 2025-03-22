import { useEffect, useRef } from "react";

// i want to redo all this but with tailwind please this is a fucking horror mess
export default function Time() {
  const hourRef = useRef(null);
  const dayRef = useRef(null);
  useEffect(() => {
    const updateInterval = setInterval(() => {
      function getNowHour() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      }
      function getToday() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
      }

      hourRef.current.innerText = getNowHour();
      dayRef.current.innerText = getToday();
    }, 100);
    return () => {
      clearInterval(updateInterval);
    };
  }, []);
  return (
    <div className="page">
      <div className="full-center">
        <div className="time-container">
          <h1 ref={hourRef}>HH:MM:SS</h1>
          <br />
          <br />
          <br />
          <h2
            ref={dayRef}
            style={{ textAlign: "center", fontWeight: "normal" }}
          >
            DD/MM/AAAA
          </h2>
        </div>
      </div>
    </div>
  );
}

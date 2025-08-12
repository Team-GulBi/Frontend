// src/components/Chat/date.ts
export const convertToKST = (
  utcString: string | undefined,
  type: "time" | "date" = "time"
) => {
  if (!utcString) return type === "time" ? "--:--" : "날짜 없음";
  const d = new Date(utcString);

  if (type === "date") {
    // yyyy-mm-dd
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  }

  // HH:MM (24h)
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
};

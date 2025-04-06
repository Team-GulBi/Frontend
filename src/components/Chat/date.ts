export const convertToKST = (
    utcString: string | undefined,
    type: "time" | "date" = "time" // 기본은 시간 반환
  ) => {
    if (!utcString) return type === "time" ? "--:--" : "날짜 없음";
    const date = new Date(utcString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  
    if (type === "date") {
      const year = kstDate.getFullYear();
      const month = (kstDate.getMonth() + 1).toString().padStart(2, "0");
      const day = kstDate.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`; // yyyy-mm-dd
    }
  
    const hours = kstDate.getHours().toString().padStart(2, "0");
    const minutes = kstDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`; // HH:MM
  };
  
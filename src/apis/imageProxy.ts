// src/apis/imageProxy.ts
import axios from "axios";

/**
 * 서명 이미지 같은 cross-origin 이미지를 same-origin으로 받아와
 * html2canvas tainted 문제를 회피하기 위한 프록시 클라이언트.
 *
 * Vite dev server에서:
 *   "/s3" -> "https://yazoba-img-s3.s3.ap-northeast-2.amazonaws.com"
 * 같은 식으로 proxy 설정이 되어 있어야 함.
 */
export const imgRequest = axios.create({
  baseURL: "/s3",
  responseType: "blob",
});

// S3 호스트 매치 (현재 도메인 대응)
const S3_HOSTS = [
  /^https:\/\/yazoba-img-s3\.s3\.ap-northeast-2\.amazonaws\.com/i,
];

// 절대 URL을 프록시 베이스(/s3) 기준으로 변환
function toProxyPath(absUrl: string) {
  for (const host of S3_HOSTS) {
    if (host.test(absUrl)) {
      return absUrl.replace(host, ""); // host 부분 제거 → "/<key>" 형태
    }
  }
  // 매치 안 되면 그대로 사용 (서버 프록시가 처리 못 할 수 있음)
  return absUrl;
}

/** Blob(ObjectURL) 로 변환해 <img src=...> 등에 사용 */
export async function fetchImage(imageUrl: string): Promise<string> {
  try {
    const proxiedPath = toProxyPath(imageUrl);
    const res = await imgRequest.get(proxiedPath);
    const blob = res.data as Blob;
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("이미지 요청 중 오류:", err);
    throw err;
  }
}

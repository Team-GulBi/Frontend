import axios from 'axios';
export const imgRequest = axios.create({
  baseURL: "/s3",
  headers: {
    "Content-Type": "image/png",
  },
  responseType: "blob", // 응답 데이터를 blob 형태로 받기
});
imgRequest.interceptors.request.use((config) => {
  return { ...config, url: config.url?.replace(/^https:\/\/yajoba.s3.ap-northeast-2.amazonaws\.com/, "") };
});
export const fetchImage = async (imageUrl: string): Promise<string> => {
  try {
    const response = await imgRequest({
      url: imageUrl, // 실제 이미지 URL
    });
    const blob = response.data;
    return URL.createObjectURL(blob); // ObjectURL 생성
  } catch (error) {
    console.error("이미지 요청 중 오류 발생:", error);
    throw error;
  }
};
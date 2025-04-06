import axios from 'axios';

const BASE_URL = import.meta.env.VITE_YAJOBA_SEVER_URL; // ✅ .env에서 가져오기

export const getChatMessages = async (chatRoomId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/messages/${chatRoomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log('📦 서버 응답:', response.data); // ✅ 응답 확인용
    return response.data;
  } catch (error) {
    console.error('❌ 채팅 메시지 불러오기 실패:', error);
    return [];
  }
};

export const markMessageAsRead = async (messageId: number) => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`${BASE_URL}/messages/${messageId}/read`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('❌ 메시지 읽음 처리 실패:', error);
  }
};

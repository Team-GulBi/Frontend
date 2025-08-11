import client from "./client";
// 채팅방 정보 타입 정의
export interface ChatRoom {
  id: number;
  user1Id: string;
  user1Nickname: string;
  user2Id: string;
  user2Nickname: string;
  createdAt: string;
  updatedAt: string;
  };

// 채팅방 목록 가져오기 API
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기
    if (!token) throw new Error("로그인이 필요합니다.");
    const response = await client.get<ChatRoom[]>("/chatrooms", {
      headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 추가
    });
    return response.data;
  } catch (error) {
    console.error("채팅방 목록 불러오기 실패:", error);
    return [];
  }
};



// id: number;
//   user1: {
//     id: number;
//     nickname: string;
//     email: string;
//     phoneNumber: string;
//     password: string;
//     createdAt: string;
//     updatedAt: string;
//     deletedAt: string;
//     deleted: boolean;
//   };
//   user2: {
//     id: number;
//     nickname: string;
//     email: string;
//     phoneNumber: string;
//     password: string;
//     createdAt: string;
//     updatedAt: string;
//     deletedAt: string;
//     deleted: boolean;
//   };
//   createdAt: string;
//   updatedAt: string;
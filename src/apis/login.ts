import client from './client';
import { useUserStore } from '../libraries/stores';
// import { useNavigate } from "react-router-dom"
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number; // 사용자 고유 ID
  token: string; // 서버응답 토큰
}

// 로그인 API 함수
const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/signin', data);
  const { id, token } = response.data;

  // 토큰을 로컬 스토리지에 저장
  localStorage.setItem('token', token);
  
  const setUserId = useUserStore.getState().setUserId;
  setUserId(id);

  console.log("로그인 후 userId:", useUserStore.getState().userId); // :흰색_확인_표시: 확인용 로그 추가

  // const navigate = useNavigate(); // :불: useNavigate 추가
  // navigate("/"); // :불: 새로고침 없이 이동
  return response.data;
};

export default login;

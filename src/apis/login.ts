import client from './client';
import { useUserStore } from '../libraries/stores';
// import { useNavigate } from "react-router-dom"
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  nickname: string;
  userId: string;
}

// 로그인 API 함수
const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/auth/login', data);
  const { accessToken, nickname, userId } = response.data;

  localStorage.setItem('token', accessToken);
  localStorage.setItem('nickname', nickname);
  localStorage.setItem('userId', userId);
  
  const setUserId = useUserStore.getState().setUserId;
  setUserId(userId);

  window.location.replace("/");
  return response.data;
};

export default login;

import client from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
}

// 로그인 API 함수
const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/auth/login', data);
  const { accessToken, userId } = response.data;

  localStorage.setItem('token', accessToken);
  localStorage.setItem('userId', userId);
  
  window.location.replace("/");
  return response.data;
};

export default login;

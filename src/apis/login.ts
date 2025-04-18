import client from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  token: string; // 서버응답 토큰
}

// 로그인 API 함수
const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/signin', data);
  const token = response.data.token;
  const id = response.data.id;

  // 토큰을 로컬 스토리지에 저장
  localStorage.setItem('token', token);
  localStorage.setItem('userId', id.toString());
  window.location.replace("/");
  return response.data;
};

export default login;

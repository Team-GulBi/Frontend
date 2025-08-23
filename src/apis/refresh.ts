import client from './client';

export interface RefreshResponse {
  accessToken: string;
  nickname: string;
  userId: string;
}

const refreshToken = async (): Promise<RefreshResponse> => {
  const response = await client.post<RefreshResponse>('/auth/refresh');
  const { accessToken, nickname, userId } = response.data;

  localStorage.setItem('token', accessToken);
  localStorage.setItem('nickname', nickname);
  localStorage.setItem('userId', userId);
  
  return response.data;
};

export default refreshToken;

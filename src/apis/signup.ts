import client from './client';

export interface SignupRequest {
  nickname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export type SignupResponse = string;

const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await client.post<SignupResponse>('/signup', data);
  return response.data;
};

export default signup;
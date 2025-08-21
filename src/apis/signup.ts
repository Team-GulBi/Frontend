import client from './client';

export interface SignupRequest {
  nickname: string;
  email: string;
  password: string;
  phoneNumber: string;
  signature: File;
}

const signup = async (data: SignupRequest): Promise<void> => {
  const formData = new FormData();

  const request = {
    nickname: data.nickname,
    email: data.email,
    password: data.password,
    phoneNumber: data.phoneNumber,
  };

  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' }),
  );
  formData.append('signature', data.signature);

  await client.post('/users/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default signup;

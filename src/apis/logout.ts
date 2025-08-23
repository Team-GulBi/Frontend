import client from './client';

const logout = async (): Promise<void> => {
  await client.post('/auth/logout');
  
  localStorage.clear();
  
  window.location.replace("/");
};

export default logout;

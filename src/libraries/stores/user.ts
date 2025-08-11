import { create } from 'zustand';
interface UserState {
  userId: string | null;
  setUserId: (id: string) => void;
}
export const useUserStore = create<UserState>((set) => ({
  userId: localStorage.getItem('userId'), // ← 여기!
  setUserId: (id: string) => {
  localStorage.setItem('userId', id);
  set({ userId: id });
},
}));
import { IUser } from '@/types/user.types';
import { create } from 'zustand';

interface AuthState {
	user: IUser | undefined;
	setUser: (user: IUser) => void;
	resetUser: () => void;
}

const useAuthStore = create<AuthState>()(set => ({
	user: undefined,
	setUser: (user: IUser | undefined) => set({ user }),
	resetUser: () => set({ user: undefined })
}));

export default useAuthStore;

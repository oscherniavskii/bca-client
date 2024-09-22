import { useEffect, useState, type FC, type PropsWithChildren } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Loader from './components/Loader';
import { apiClient } from './lib/api-client';
import { AuthPage, ChatPage, ProfilePage } from './pages';
import useAuthStore from './store/auth.store';
import { IUser } from './types/user.types';
import { GET_USER_INFO } from './utils/constants';

const PrivatRoute: FC<PropsWithChildren> = ({ children }) => {
	const { user } = useAuthStore();
	const isAuth = !!user;
	return isAuth ? children : <Navigate to={'/auth'} />;
};

const AuthRoute: FC<PropsWithChildren> = ({ children }) => {
	const { user } = useAuthStore();
	const isAuth = !!user;
	return isAuth ? <Navigate to={'/'} /> : children;
};

const App: FC = () => {
	const { user, setUser, resetUser } = useAuthStore();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const getUserData = async () => {
			await apiClient
				.get<IUser>(GET_USER_INFO)
				.then(({ data }) => {
					if (data) setUser(data);
				})
				.catch(error => {
					console.log(error);
					resetUser();
				})
				.finally(() => setLoading(false));
		};

		if (!user) {
			getUserData();
		} else {
			setLoading(false);
		}
	}, [user, setUser]);

	if (loading) {
		return <Loader />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/auth'
					element={
						<AuthRoute>
							<AuthPage />
						</AuthRoute>
					}
				/>
				<Route
					path='/'
					element={
						<PrivatRoute>
							<ChatPage />
						</PrivatRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<PrivatRoute>
							<ProfilePage />
						</PrivatRoute>
					}
				/>
				<Route path='*' element={<Navigate to='/auth' />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;

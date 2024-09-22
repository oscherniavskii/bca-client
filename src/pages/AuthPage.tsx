import { loginImage, victoryIcon } from '@/assets/img';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api-client';
import useAuthStore from '@/store/auth.store';
import { IUser } from '@/types/user.types';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { validateLogin, validateSignup } from '@/utils/validate.utils';
import { AxiosError } from 'axios';
import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthPage: FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const { setUser } = useAuthStore();

	const handleLogin = async () => {
		if (validateLogin(email, password)) {
			await apiClient
				.post<IUser>(LOGIN_ROUTE, { email, password })
				.then(({ data }) => {
					setUser(data);
					if (data.profileSetup) {
						navigate('/');
					} else {
						navigate('/profile');
					}
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
					toast.error(
						'Authorization error. Please enter the correct login and password!'
					);
				});
		}
	};

	const handleSignup = async () => {
		if (validateSignup(email, password, confirmPassword)) {
			await apiClient
				.post<IUser>(SIGNUP_ROUTE, { email, password })
				.then(({ data }) => {
					setUser(data);
					navigate('/profile');
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
					toast.error(
						'An error occurred during Sign up. Please try again later!'
					);
				});
		}
	};

	return (
		<main className='h-[100vh] w-[100vw] flex items-center justify-center bg-bcolor'>
			<div className='bg-bcolor border-2 border-white/20 text-white text-opacity-80 shadow-2xl rounded-3xl grid xl:grid-cols-2 gap-32 p-6 py-10 md:p-28 md:py-14 w-[90vw] md:w-auto'>
				<div className='flex flex-col gap-10 items-center justify-center min-h-max xl:min-h-[540px] shrink-0'>
					<div className='flex flex-col items-center justify-center'>
						<div className='flex items-center justify-center'>
							<h1 className='text-4xl font-bold md:text-6xl text-center'>
								Welcome
							</h1>
							<img src={victoryIcon} alt='victory' className='h-20 md:h-24' />
						</div>
						<p className='font-medium text-center'>
							Fill in the details to get started with the Best Chat App!
						</p>
					</div>
					<div className='flex items-center justify-center w-full'>
						<Tabs defaultValue='login' className='w-full max-w-[400px]'>
							<TabsList className='bg-transparent rounded-none w-full'>
								<TabsTrigger
									value='login'
									className='data-[state=active]:bg-gcolor/50 border-b-transparent data-[state=active]:rounded-t-lg text-white text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-secondary data-[state=active]:font-semibold data-[state=active]:border-b-secondary p-2 xs:p-3 transition-all duration-300 text-[16px]'
								>
									Login
								</TabsTrigger>
								<TabsTrigger
									value='signup'
									className='data-[state=active]:bg-gcolor/50 border-b-transparent data-[state=active]:rounded-t-lg text-white text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-secondary data-[state=active]:font-semibold data-[state=active]:border-b-secondary p-2 xs:p-3 transition-all duration-300 text-[16px]'
								>
									Sign up
								</TabsTrigger>
							</TabsList>
							<TabsContent value='login'>
								<div className='flex flex-col gap-5 pt-5'>
									<Input
										className='rounded-full p-5 xs:p-6 bg-gcolor border-none text-[16px] xs:text-lg placeholder:text-[15px] xs:placeholder:text-[16px]'
										placeholder='Email'
										type='email'
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
									<Input
										className='rounded-full p-5 xs:p-6 bg-gcolor border-none text-[16px] xs:text-lg placeholder:text-[15px] xs:placeholder:text-[16px]'
										placeholder='Password'
										type='password'
										value={password}
										onChange={e => setPassword(e.target.value)}
									/>
									<Button
										className='rounded-full p-5 xs:p-6 text-[16px] mt-1 bg-secondary hover:bg-primary'
										onClick={handleLogin}
									>
										Login
									</Button>
								</div>
							</TabsContent>
							<TabsContent value='signup'>
								<div className='flex flex-col gap-5 pt-5'>
									<Input
										className='rounded-full p-5 xs:p-6 bg-gcolor border-none text-[16px] xs:text-lg placeholder:text-[15px] xs:placeholder:text-[16px]'
										placeholder='Email'
										type='email'
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
									<Input
										className='rounded-full p-5 xs:p-6 bg-gcolor border-none text-[16px] xs:text-lg placeholder:text-[15px] xs:placeholder:text-[16px]'
										placeholder='Password'
										type='password'
										value={password}
										onChange={e => setPassword(e.target.value)}
									/>
									<Input
										className='rounded-full p-5 xs:p-6 bg-gcolor border-none text-[16px] xs:text-lg placeholder:text-[15px] xs:placeholder:text-[16px]'
										placeholder='Confirm password'
										type='password'
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
									/>
									<Button
										className='rounded-full p-5 xs:p-6 text-[16px] mt-1 bg-secondary hover:bg-primary'
										onClick={handleSignup}
									>
										Signup
									</Button>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<div className='hidden xl:flex justify-center items-center opacity-70 h-full max-h-[600px]'>
					<img src={loginImage} alt='background' />
				</div>
			</div>
		</main>
	);
};

export default AuthPage;

import { apiClient } from '@/lib/api-client';
import useAuthStore from '@/store/auth.store';
import { getColor } from '@/utils/color.utils';
import { HOST, LOGOUT_ROUTE } from '@/utils/constants';
import { AxiosError } from 'axios';
import { type FC } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

const ProfileInfo: FC = () => {
	const { user, resetUser } = useAuthStore();
	const navigate = useNavigate();

	const logout = async () => {
		await apiClient
			.post(LOGOUT_ROUTE)
			.then(() => {
				resetUser();
				navigate('/auth');
			})
			.catch((error: AxiosError) => {
				console.log(error.response?.data);
				toast.error('Something went wrong! Try again later.');
			});
	};

	return (
		<div className='absolute bottom-0 h-[70px] flex items-center justify-between px-5 w-full md:w-[35vw] lg:w-[30vw] xl:w-[25vw] bg-gcolor gap-3'>
			<div className='flex items-center justify-center gap-3'>
				<div className='w-12 h-12 relative'>
					<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
						{user?.image ? (
							<AvatarImage
								src={`${HOST}/${user.image}`}
								alt='profile'
								className='object-cover w-full h-full bg-black'
							/>
						) : (
							<AvatarFallback
								className={`uppercase h-12 w-12 text-lg font-bold border-[1px] flex items-center justify-center rounded-full ${getColor(
									user?.color
								)}`}
							>
								{user?.firstName
									? user.firstName.split('').shift()
									: user?.email.split('').shift()}
							</AvatarFallback>
						)}
					</Avatar>
				</div>
				<div>
					{user?.firstName && user.lastName
						? `${user.firstName} ${user.lastName}`
						: user?.email}
				</div>
			</div>
			<div className='flex gap-4 lg:gap-5'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<FaUserEdit
								className=' text-secondary text-xl font-medium'
								onClick={() => navigate('/profile')}
							/>
						</TooltipTrigger>
						<TooltipContent className='bg-tcolor border-none text-white'>
							Edit profile
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<IoLogOut
								className=' text-red-600 text-xl font-medium'
								onClick={logout}
							/>
						</TooltipTrigger>
						<TooltipContent className='bg-tcolor border-none text-white'>
							Logout
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

export default ProfileInfo;

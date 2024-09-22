import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import useAuthStore from '@/store/auth.store';
import { IUser } from '@/types/user.types';
import { colors, getColor } from '@/utils/color.utils';
import {
	ADD_PROFILE_IMAGE,
	HOST,
	REMOVE_PROFILE_IMAGE,
	UPDATE_PROFILE
} from '@/utils/constants';
import { validateProfile } from '@/utils/validate.utils';
import { AxiosError } from 'axios';
import { useEffect, useRef, useState, type FC } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfilePage: FC = () => {
	const { user, setUser } = useAuthStore();
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [image, setImage] = useState<string>('');
	const [hovered, setHovered] = useState<boolean>(false);
	const [selectedColor, setSelectedColor] = useState<number>(0);
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const saveChanges = async () => {
		if (validateProfile(firstName, lastName)) {
			await apiClient
				.post<IUser>(UPDATE_PROFILE, {
					firstName,
					lastName,
					color: selectedColor
				})
				.then(({ data }) => {
					setUser(data);
					toast.success('Profile update successfully!');
					navigate('/');
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
					toast.error('Something went wrong! Try again later.');
				});
		}
	};

	const handleNavigate = () => {
		if (user?.profileSetup) {
			navigate('/');
		} else {
			toast.error('Please setup profile.');
		}
	};

	const handleFileInputClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		let file;
		if (event.target.files?.length) file = event?.target?.files[0];

		if (file) {
			const formData = new FormData();
			formData.append('profile-image', file);

			await apiClient
				.post<IUser>(ADD_PROFILE_IMAGE, formData)
				.then(({ data }) => {
					setUser(data);
					toast.success('Image update successfully!');
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
					toast.error('Something went wrong! Try upload image later.');
				});
		}
	};

	const handleDeleteImage = async () => {
		await apiClient
			.delete<IUser>(REMOVE_PROFILE_IMAGE)
			.then(({ data }) => {
				setUser(data);
				toast.success('Image removed successfully!');
			})
			.catch((error: AxiosError) => {
				console.log(error.response?.data);
				toast.error('Something went wrong! Try remove image later.');
			});
	};

	useEffect(() => {
		if (user && user.profileSetup) {
			if (user.firstName) setFirstName(user.firstName);
			if (user.lastName) setLastName(user.lastName);
			if (user.color) setSelectedColor(user.color);
			if (user.image) {
				setImage(`${HOST}/${user.image}`);
			} else {
				setImage('');
			}
		}
	}, [user]);

	return (
		<main className='bg-bcolor h-screen flex items-center justify-center'>
			<div className='flex flex-col gap-1 md:gap-10 min-w-[300px]'>
				<div onClick={handleNavigate}>
					<IoArrowBack className='text-4xl lg:text-5xl text-white/90 cursor-pointer' />
				</div>
				<div className='md:grid md:grid-cols-2 md:gap-5'>
					<div
						className='h-full w-28 xs:w-32 md:w-48 md:h-48 relative mx-auto'
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						<Avatar className='w-28 h-28 xs:h-32 xs:w-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-4'>
							{image ? (
								<AvatarImage
									src={image}
									alt='profile'
									className='object-cover w-full h-full bg-black'
								/>
							) : (
								<AvatarFallback
									className={`uppercase h-32 w-32 md:w-48 md:h-48 text-6xl font-bold border-[1px] flex items-center justify-center rounded-full ${getColor(
										selectedColor
									)}`}
								>
									{firstName
										? firstName.split('').shift()
										: user?.email.split('').shift()}
								</AvatarFallback>
							)}
						</Avatar>
						{hovered && (
							<div
								className='absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer'
								onClick={image ? handleDeleteImage : handleFileInputClick}
							>
								{image ? (
									<FaTrash className='text-white text-3xl cursor-pointer' />
								) : (
									<FaPlus className='text-white text-3xl cursor-pointer' />
								)}
							</div>
						)}
						<input
							type='file'
							ref={fileInputRef}
							className='hidden'
							onChange={handleImageChange}
							name='profile-image'
							accept='.png,.jpg,.jpeg,.webp,.svg'
						/>
					</div>
					<div className='flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
						<div className='w-full'>
							<Input
								placeholder='Email'
								type='email'
								disabled
								value={user?.email}
								className='rounded-lg p-5 xs:p-6 bg-gcolor border-none'
							/>
						</div>
						<div className='w-full'>
							<Input
								placeholder='First Name'
								type='text'
								value={firstName}
								onChange={e => setFirstName(e.target.value)}
								className='rounded-lg p-5 xs:p-6 bg-gcolor border-none'
							/>
						</div>
						<div className='w-full'>
							<Input
								placeholder='Last Name'
								type='text'
								value={lastName}
								onChange={e => setLastName(e.target.value)}
								className='rounded-lg p-5 xs:p-6 bg-gcolor border-none'
							/>
						</div>
						<div className='flex w-full gap-5 justify-center'>
							{colors.map((color, index) => (
								<div
									key={index}
									className={`${color} w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${
										selectedColor === index
											? 'outline outline-white/50 outline-2'
											: ''
									}`}
									onClick={() => setSelectedColor(index)}
								></div>
							))}
						</div>
					</div>
				</div>
				<div className='w-full'>
					<Button
						className='h-12 md:h-16 w-full bg-secondary hover:bg-primary text-white font-medium transition-all duration-300 mt-4 md:mt-0'
						onClick={saveChanges}
					>
						Save changes
					</Button>
				</div>
			</div>
		</main>
	);
};

export default ProfilePage;

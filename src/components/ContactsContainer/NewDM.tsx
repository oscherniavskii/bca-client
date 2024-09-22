import lottieJson from '@/assets/lottie-purple.json';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { apiClient } from '@/lib/api-client';
import useChatStore from '@/store/chat.store';
import { IUser } from '@/types/user.types';
import { getColor } from '@/utils/color.utils';
import { HOST, SEARCH_CONTACTS_ROUTE } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { AxiosError } from 'axios';
import { useState, type FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import Lottie from 'react-lottie-player';
import { AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

const NewDM: FC = () => {
	const [openNewContactModal, setOpenNewContactModal] =
		useState<boolean>(false);
	const [searchedContacts, setSearchedContacts] = useState<IUser[]>([]);
	const { setSelectedChatType, setSelectedChatData } = useChatStore();

	const searchContacts = async (searchTerm: string) => {
		if (searchTerm.length) {
			await apiClient
				.post<IUser[]>(SEARCH_CONTACTS_ROUTE, { searchTerm })
				.then(({ data }) => {
					setSearchedContacts(data);
					console.log(data);
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
				});
		} else {
			setSearchedContacts([]);
		}
	};

	const selectNewContact = (contact: IUser) => {
		setOpenNewContactModal(false);
		setSelectedChatType('contact');
		setSelectedChatData(contact);
		setSearchedContacts([]);
	};

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							className=' text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
							onClick={() => setOpenNewContactModal(true)}
						/>
					</TooltipTrigger>
					<TooltipContent className='bg-tcolor border-none text-white mb-2 p-3'>
						Select new contact
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
				<DialogContent className='bg-bcolor border-none text-white w-[90vw] h-[60vh] xs:w-[350px] xs:h-[400px] rounded-lg flex flex-col'>
					<DialogHeader>
						<DialogTitle className='text-center'>
							Please select a contact
						</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<div>
						<Input
							placeholder='Search contacts'
							className='rounded-lg p-5 bg-gcolor border-none text-lg placeholder:text-[16px]'
							onChange={e => searchContacts(e.target.value)}
						/>
					</div>
					<ScrollArea>
						<ul className='flex flex-col gap-4'>
							{searchedContacts.map(contact => (
								<li
									key={contact._id}
									className='flex gap-3 items-center cursor-pointer'
									onClick={() => selectNewContact(contact)}
								>
									<div className='w-10 h-10 relative rounded-full overflow-hidden'>
										<Avatar className='h-10 w-10 rounded-full overflow-hidden'>
											{contact.image ? (
												<AvatarImage
													src={`${HOST}/${contact.image}`}
													alt='profile'
													className='object-cover w-full h-full bg-black'
												/>
											) : (
												<AvatarFallback
													className={`uppercase h-10 w-10 text-lg font-bold border-[1px] flex items-center justify-center rounded-full ${getColor(
														contact.color
													)}`}
												>
													{contact.firstName
														? contact.firstName.split('').shift()
														: contact.email.split('').shift()}
												</AvatarFallback>
											)}
										</Avatar>
									</div>
									<div className='flex flex-col'>
										<span className='text-[15px]'>
											{contact.firstName && contact.lastName
												? `${contact.firstName} ${contact.lastName}`
												: contact.email}
										</span>
										<span className='text-xs text-white/40'>
											{contact.email}
										</span>
									</div>
								</li>
							))}
						</ul>
					</ScrollArea>
					{!searchedContacts.length && (
						<div className='flex-1 flex flex-col items-center justify-center transition-all duration-1000 pb-12 xs:pb-8'>
							<Lottie
								loop
								animationData={lottieJson}
								play
								style={{ width: 100, height: 100 }}
								speed={2}
							/>
							<div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 xs:text-2xl text-xl transition-all duration-300 text-center'>
								<h3 className='poppins-medium'>
									Search new
									<span className='text-secondary'> contact</span>
								</h3>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default NewDM;

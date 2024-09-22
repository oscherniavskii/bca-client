import useChatStore from '@/store/chat.store';
import { getColor } from '@/utils/color.utils';
import { HOST } from '@/utils/constants';
import { type FC } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

const ChatHeader: FC = () => {
	const { closeChat, selectedChatData, selectedChatType } = useChatStore();

	return (
		<header className='h-[70px] border-b-2 border-gcolor flex items-center justify-between pl-5 md:pl-14 pr-5'>
			<div className='flex gap-5 items-center justify-between w-full'>
				<div className='flex gap-3 items-center justify-center'>
					{selectedChatType === 'contact' &&
						selectedChatData &&
						'firstName' in selectedChatData && (
							<>
								<div className='w-12 h-12 relative'>
									<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
										{selectedChatData?.image ? (
											<AvatarImage
												src={`${HOST}/${selectedChatData.image}`}
												alt='profile'
												className='object-cover w-full h-full bg-black'
											/>
										) : (
											<AvatarFallback
												className={`uppercase h-12 w-12 text-lg font-bold border-[1px] flex items-center justify-center rounded-full ${getColor(
													selectedChatData?.color
												)}`}
											>
												{selectedChatData?.firstName
													? selectedChatData.firstName.split('').shift()
													: selectedChatData?.email.split('').shift()}
											</AvatarFallback>
										)}
									</Avatar>
								</div>
								<div>
									{selectedChatData?.firstName && selectedChatData.lastName
										? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
										: selectedChatData?.email}
								</div>
							</>
						)}
					{selectedChatType === 'channel' &&
						selectedChatData &&
						'name' in selectedChatData && (
							<div className='flex gap-5 items-center text-neutral-300'>
								<div className='bg-gcolor h-10 w-10 flex items-center justify-center rounded-full'>
									#
								</div>
								<span>{selectedChatData.name}</span>
							</div>
						)}
				</div>
				<div className='flex gap-5 items-center justify-center'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger
								className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
								onClick={closeChat}
							>
								<RiCloseFill className='text-3xl' />
							</TooltipTrigger>
							<TooltipContent className='bg-tcolor border-none text-white'>
								Close chat
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</header>
	);
};

export default ChatHeader;

import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import useAuthStore from '@/store/auth.store';
import useChatStore from '@/store/chat.store';
import useFilesStore from '@/store/files.store';
import { HOST, UPLOAD_FILE_ROUTE } from '@/utils/constants';
import { generateSlug } from '@/utils/generate-slug';
import { AxiosError } from 'axios';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState, type FC } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { toast } from 'sonner';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

const MessageBar: FC = () => {
	const [message, setMessage] = useState<string>('');
	const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
	const emojiRef = useRef<HTMLDivElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { selectedChatType, selectedChatData } = useChatStore();
	const { user } = useAuthStore();
	const { setIsUploading, setFileUploadProgress } = useFilesStore();
	const socket = useSocket();

	const handleAddEmoji = (emoji: EmojiClickData) => {
		setMessage(msg => msg + emoji.emoji);
	};

	const handleSendMessage = () => {
		if (message.length) {
			if (!socket || !socket.connected) {
				console.error('Socket not connected');
				return;
			}

			if (selectedChatType === 'contact') {
				socket.emit('sendMessage', {
					sender: user?._id,
					content: message,
					recipient: selectedChatData?._id,
					messageType: 'text',
					fileUrl: undefined
				});
			} else if (selectedChatType === 'channel') {
				socket.emit('sendChannelMessage', {
					sender: user?._id,
					content: message,
					messageType: 'text',
					fileUrl: undefined,
					channelId: selectedChatData?._id
				});
			}

			setMessage('');
		}
	};

	const handleAttachmentClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleAttachmentChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		let file;
		if (event.target.files?.length) file = event?.target?.files[0];

		if (file) {
			const ext = file.name.split('.')[1];
			const name = file.name.split('.')[0];
			const fileName = generateSlug(name);
			const safeFileName = fileName + '.' + ext;

			const formData = new FormData();
			formData.append('msg-file', new File([file], safeFileName));

			setIsUploading(true);

			await apiClient
				.post<{ filePath: string }>(UPLOAD_FILE_ROUTE, formData, {
					baseURL: HOST,
					withCredentials: true,
					onUploadProgress: data => {
						if (data.total)
							setFileUploadProgress(
								Math.round((100 * data.loaded) / data.total)
							);
					}
				})
				.then(({ data }) => {
					if (!socket || !socket.connected) {
						console.error('Socket not connected');
						return;
					}

					if (selectedChatType === 'contact') {
						socket.emit('sendMessage', {
							sender: user?._id,
							content: undefined,
							recipient: selectedChatData?._id,
							messageType: 'file',
							fileUrl: data.filePath
						});
					} else if (selectedChatType === 'channel') {
						socket.emit('sendChannelMessage', {
							sender: user?._id,
							content: undefined,
							messageType: 'file',
							fileUrl: data.filePath,
							channelId: selectedChatData?._id
						});
					}
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
					toast.error('Something went wrong! Try upload file later.');
				})
				.finally(() => {
					if (fileInputRef.current) fileInputRef.current.value = '';
					setIsUploading(false);
					setFileUploadProgress(0);
				});
		}
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				emojiRef.current instanceof Node &&
				!emojiRef.current.contains(event.target as Node)
			) {
				setEmojiPickerOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [emojiRef]);

	return (
		<div className='h-[65px] xs:h-[78px] pt-1 xs:pt-2 pb-0 xs:pb-4 bg-bcolor flex justify-center items-center px-2 xs:px-5 gap-2 xs:gap-5'>
			<div className='flex-1 flex bg-gcolor rounded-md items-center gap-3 xs:gap-4 pr-3'>
				<input
					type='text'
					className='flex-1 p-3 xs:p-4 bg-transparent rounded-md focus:border-none focus:outline-none text-sm xs:text-[16px]'
					placeholder='Enter Message'
					value={message}
					onChange={e => setMessage(e.target.value)}
					onKeyUp={e => {
						if (e.key === 'Enter') {
							handleSendMessage();
						}
					}}
				/>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
							onClick={handleAttachmentClick}
						>
							<GrAttachment className='text-xl xs:text-xl' />
						</TooltipTrigger>
						<TooltipContent className='bg-tcolor border-none text-white'>
							Send file
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<input
					type='file'
					ref={fileInputRef}
					className='hidden'
					name='file'
					onChange={handleAttachmentChange}
				/>
				<div className='relative'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger
								className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
								onClick={() => setEmojiPickerOpen(true)}
							>
								<RiEmojiStickerLine className='text-xl xs:text-2xl mt-1' />
							</TooltipTrigger>
							<TooltipContent className='bg-tcolor border-none text-white'>
								Add emoji
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<div
						className='fixed bottom-[70px] xs:bottom-[80px] left-1 xs:left-5 xsm:left-auto xsm:absolute xsm:bottom-12 xsm:-right-5'
						ref={emojiRef}
					>
						<EmojiPicker
							theme={Theme.DARK}
							open={emojiPickerOpen}
							onEmojiClick={handleAddEmoji}
							autoFocusSearch={false}
							width={310}
						/>
					</div>
				</div>
			</div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger
						className='bg-primary rounded-md flex items-center justify-center p-3 xs:p-4 xs:h-[52px] focus:border-none hover:bg-secondary focus:bg-secondary focus:outline-none focus:text-white duration-300 transition-all'
						onClick={handleSendMessage}
					>
						<IoSend className='text-lg xs:text-2xl' />
					</TooltipTrigger>
					<TooltipContent className='bg-tcolor border-none text-white'>
						Send
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default MessageBar;

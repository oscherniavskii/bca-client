import { apiClient } from '@/lib/api-client';
import useAuthStore from '@/store/auth.store';
import useChatStore from '@/store/chat.store';
import useFilesStore from '@/store/files.store';
import { IMessage } from '@/types/message.types';
import { getColor } from '@/utils/color.utils';
import {
	GET_CHANNELS_MESSAGES_ROUTE,
	GET_DIRECT_MESSAGES,
	HOST
} from '@/utils/constants';
import { checkIsImage } from '@/utils/image.utils';
import { AvatarImage } from '@radix-ui/react-avatar';
import { AxiosError } from 'axios';
import moment from 'moment';
import { type FC, type ReactNode, useEffect, useRef, useState } from 'react';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { MdFolderZip } from 'react-icons/md';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

const MessageContainer: FC = () => {
	const {
		selectedChatType,
		selectedChatData,
		selectedChatMessages,
		setSelectedChatMessages
	} = useChatStore();
	const { user } = useAuthStore();
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [showImage, setShowImage] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>('');
	const { setIsDownloading, setFileDownloadProgress } = useFilesStore();

	const renderMessages = (): ReactNode => {
		let lastDate: string | null = null;

		return selectedChatMessages.map((msg, i) => {
			const messageDate = moment(msg.timestamp).format('YYYY-MM-DD');

			const showDate = messageDate !== lastDate;

			lastDate = messageDate;

			return (
				<article key={i} className='mt-2'>
					{showDate && (
						<div className='text-center text-gray-500 my-2'>
							{moment(msg.timestamp).format('LL')}
						</div>
					)}
					{selectedChatType === 'contact' && renderDirectMessages(msg)}
					{selectedChatType === 'channel' && renderChannelMessages(msg)}
				</article>
			);
		});
	};

	const renderDirectMessages = (message: IMessage) => (
		<div
			className={`${
				message.sender._id === selectedChatData?._id
					? 'text-left'
					: 'text-right'
			}`}
		>
			{message.messageType === 'text' && (
				<div
					className={`${
						message.sender._id !== selectedChatData?._id
							? 'bg-secondary/5 text-white/80 border-secondary/50'
							: 'bg-white/5 text-white/80 border-white/20'
					} border inline-block p-4 rounded my-1 max-w-[90%] xsm:max-w-[70%] md:max-w-[50%] break-words long-word`}
				>
					{message.content}
				</div>
			)}
			{message.messageType === 'file' && (
				<div
					className={`${
						message.sender._id !== selectedChatData?._id
							? 'bg-secondary/5 text-white/80 border-secondary/50'
							: 'bg-white/5 text-white/80 border-white/20'
					} border inline-block p-3 rounded my-1 max-w-[90%] xsm:max-w-[70%] md:max-w-[50%] break-words long-word`}
				>
					{message.fileUrl && checkIsImage(message.fileUrl) && (
						<div
							className='cursor-pointer'
							onClick={() => {
								setImageUrl(message.fileUrl || '');
								setShowImage(true);
							}}
						>
							<img
								src={`${HOST}/${message.fileUrl}`}
								alt='Attachment'
								height={300}
								width={300}
							/>
						</div>
					)}
					{message.fileUrl && !checkIsImage(message.fileUrl) && (
						<div className='flex items-center justify-center gap-3 lg:gap-4'>
							<span className='text-white text-2xl bg-black/20 rounded-full p-2'>
								<MdFolderZip />
							</span>
							<span className='text-left text-sm lg:text-[16px] long-word'>
								{message.fileUrl.split('/').pop()}
							</span>
							<span
								className='bg-black/20 p-1 text-lg rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
								onClick={() => {
									if (message.fileUrl) downloadFile(message.fileUrl);
								}}
							>
								<IoMdArrowRoundDown />
							</span>
						</div>
					)}
				</div>
			)}
			<div className='text-xs text-gray-600'>
				{moment(message.timestamp).format('LT')}
			</div>
		</div>
	);

	const renderChannelMessages = (message: IMessage) => (
		<div
			className={`mt-5 ${
				message.sender._id !== user?._id ? 'text-left' : 'text-right'
			}`}
		>
			{message.messageType === 'text' && (
				<div
					className={`${
						message.sender._id === user?._id
							? 'bg-secondary/5 text-white/80 border-secondary/50'
							: 'bg-white/5 text-white/80 border-white/20'
					} border inline-block p-4 rounded my-1 max-w-[90%] xsm:max-w-[70%] md:max-w-[50%] break-words long-word ml-10`}
				>
					{message.content}
				</div>
			)}
			{message.messageType === 'file' && (
				<div
					className={`${
						message.sender._id === user?._id
							? 'bg-secondary/5 text-white/80 border-secondary/50'
							: 'bg-white/5 text-white/80 border-white/20'
					} border inline-block p-3 rounded my-1 max-w-[90%] xsm:max-w-[70%] md:max-w-[50%] break-words long-word ml-10`}
				>
					{message.fileUrl && checkIsImage(message.fileUrl) && (
						<div
							className='cursor-pointer'
							onClick={() => {
								setImageUrl(message.fileUrl || '');
								setShowImage(true);
							}}
						>
							<img
								src={`${HOST}/${message.fileUrl}`}
								alt='Attachment'
								height={300}
								width={300}
							/>
						</div>
					)}
					{message.fileUrl && !checkIsImage(message.fileUrl) && (
						<div className='flex items-center justify-center gap-3 lg:gap-4'>
							<span className='text-white text-2xl bg-black/20 rounded-full p-2'>
								<MdFolderZip />
							</span>
							<span className='text-left text-sm lg:text-[16px] long-word'>
								{message.fileUrl.split('/').pop()}
							</span>
							<span
								className='bg-black/20 p-1 text-lg rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
								onClick={() => {
									if (message.fileUrl) downloadFile(message.fileUrl);
								}}
							>
								<IoMdArrowRoundDown />
							</span>
						</div>
					)}
				</div>
			)}
			{message.sender._id !== user?._id ? (
				<div className='flex items-center justify-start gap-3'>
					<Avatar className='h-8 w-8 rounded-full overflow-hidden'>
						{message.sender.image ? (
							<AvatarImage
								src={`${HOST}/${message.sender.image}`}
								alt='profile'
								className='object-cover w-full h-full bg-black'
							/>
						) : (
							<AvatarFallback
								className={`${
									selectedChatData &&
									selectedChatData._id === message.sender._id
										? 'bg-gcolor border border-white/70'
										: getColor(message.sender.color)
								} uppercase h-8 w-8 text-lg font-bold border-[1px] flex items-center justify-center rounded-full`}
							>
								{message.sender.firstName
									? message.sender.firstName.split('').shift()
									: message.sender.email.split('').shift()}
							</AvatarFallback>
						)}
					</Avatar>
					<span className='text-sm text-white/60'>
						{message.sender.firstName} {message.sender.lastName}
					</span>
					<span className='text-xs text-gray-600'>
						{moment(message.timestamp).format('LT')}
					</span>
				</div>
			) : (
				<div className='text-xs text-gray-600'>
					{moment(message.timestamp).format('LT')}
				</div>
			)}
		</div>
	);

	const downloadFile = async (fileUrl: string) => {
		if (fileUrl) {
			try {
				setIsDownloading(true);
				const response = await apiClient.get(`${HOST}/${fileUrl}`, {
					withCredentials: true,
					responseType: 'blob',
					onDownloadProgress: data => {
						if (data.total)
							setFileDownloadProgress(
								Math.round((100 * data.loaded) / data.total)
							);
					}
				});

				const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = urlBlob;
				link.setAttribute('download', fileUrl.split('/').pop() || 'download');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(urlBlob);
				setIsDownloading(false);
				setFileDownloadProgress(0);
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView();
		}
	}, [selectedChatMessages]);

	useEffect(() => {
		const getMessages = async () => {
			await apiClient
				.post<IMessage[]>(GET_DIRECT_MESSAGES, {
					id: selectedChatData?._id
				})
				.then(({ data }) => {
					setSelectedChatMessages(data);
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
				});
		};

		const getCannelMessages = async () => {
			await apiClient
				.post<IMessage[]>(GET_CHANNELS_MESSAGES_ROUTE, {
					channelId: selectedChatData?._id
				})
				.then(({ data }) => {
					setSelectedChatMessages(data);
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
				});
		};

		if (selectedChatData?._id) {
			if (selectedChatType === 'contact') getMessages();
			else if (selectedChatType === 'channel') getCannelMessages();
		}
	}, [selectedChatData]);

	return (
		<div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-3 xsm:px-5 w-full'>
			{renderMessages()}
			<div ref={scrollRef} />
			{showImage && (
				<div className='fixed z-50 top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center p-3 flex-col backdrop-blur-lg'>
					<div>
						<img
							src={`${HOST}/${imageUrl}`}
							alt='Attachmet image'
							className='h-[80vh] w-full bg-cover'
						/>
						<div className='flex gap-5 fixed top-0 right-0 mt-5 mr-5'>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger
										className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
										onClick={() => {
											setShowImage(false);
											downloadFile(imageUrl);
											setImageUrl('');
										}}
									>
										<IoMdArrowRoundDown />
									</TooltipTrigger>
									<TooltipContent className='bg-tcolor border-none text-white'>
										Download
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger
										className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
										onClick={() => {
											setShowImage(false);
											setImageUrl('');
										}}
									>
										<IoCloseSharp />
									</TooltipTrigger>
									<TooltipContent className='bg-tcolor border-none text-white'>
										Close
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MessageContainer;

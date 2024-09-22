import {
	ChatContainer,
	ContactsContainer,
	EmptyChatContainer
} from '@/components';
import useAuthStore from '@/store/auth.store';
import useChatStore from '@/store/chat.store';
import useFilesStore from '@/store/files.store';
import { useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ChatPage: FC = () => {
	const { user } = useAuthStore();
	const { selectedChatType } = useChatStore();
	const {
		isUploading,
		fileUploadingProgress,
		isDownloading,
		fileDownloadingProgress
	} = useFilesStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user?.profileSetup) {
			toast('Please setup profile to continue!');
			navigate('/profile');
		}
	}, [user, navigate]);
	return (
		<main className='flex h-[100vh] text-white overflow-hidden'>
			{isUploading && (
				<div className='h-[100vh] w-[100vw] fixed z-50 top-0 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
					<h5 className='text-3xl md:text-5xl animate-pulse'>Uploading File</h5>
					<span className='text-2xl md:text-4xl'>{fileUploadingProgress}%</span>
				</div>
			)}
			{isDownloading && (
				<div className='h-[100vh] w-[100vw] fixed z-50 top-0 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
					<h5 className='text-3xl md:text-5xl animate-pulse'>
						Downloading File
					</h5>
					<span className='text-2xl md:text-4xl'>
						{fileDownloadingProgress}%
					</span>
				</div>
			)}
			<ContactsContainer />
			{!selectedChatType ? <EmptyChatContainer /> : <ChatContainer />}
		</main>
	);
};

export default ChatPage;

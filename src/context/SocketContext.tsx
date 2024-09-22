import useAuthStore from '@/store/auth.store';
import useChatStore from '@/store/chat.store';
import { IMessage } from '@/types/message.types';
import { HOST } from '@/utils/constants';
import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useEffect,
	useState
} from 'react';
import { io, type Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | undefined>(undefined);

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
	const { user } = useAuthStore();
	const [socket, setSocket] = useState<Socket | undefined>();

	useEffect(() => {
		if (user) {
			const newSocket = io(HOST, {
				withCredentials: true,
				query: {
					userId: user._id
				}
			});

			setSocket(newSocket);

			newSocket.on('connect', () => {
				console.log('Connected to socket server');
			});

			newSocket.on('disconnect', () => {
				console.log('Disconnected from socket server');
			});

			newSocket.on('recieveMessage', (message: IMessage) => {
				const { selectedChatData, addMessage, addContactsInDMContacts } =
					useChatStore.getState();

				if (
					selectedChatData?._id === message.sender._id ||
					selectedChatData?._id === message.recipient?._id
				) {
					addMessage(message);
				}
				addContactsInDMContacts(message, user._id);
			});

			newSocket.on('recieveChannelMessage', (message: IMessage) => {
				const { selectedChatData, addMessage, addChannelInCannelList } =
					useChatStore.getState();

				if (selectedChatData?._id === message.channelId) {
					addMessage(message);
				}
				addChannelInCannelList(message);
			});

			return () => {
				newSocket.disconnect();
			};
		}
	}, [user]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

import { IChannel } from '@/types/channel.types';
import { IMessage } from '@/types/message.types';
import { DMContactUser, IUser } from '@/types/user.types';
import { create } from 'zustand';

interface ChatState {
	selectedChatType: 'contact' | 'channel' | undefined;
	selectedChatData: IUser | DMContactUser | IChannel | undefined;
	selectedChatMessages: IMessage[];
	directMessagesContacts: DMContactUser[];
	channels: IChannel[];

	setSelectedChatType: (selectedChatType: 'contact' | 'channel') => void;
	setSelectedChatData: (
		selectedChatData: IUser | DMContactUser | IChannel
	) => void;
	closeChat: () => void;
	setSelectedChatMessages: (selectedChatMessages: IMessage[]) => void;
	addMessage: (message: IMessage) => void;
	setDirectMessagesContacts: (directMessagesContacts: DMContactUser[]) => void;
	setChannels: (channels: IChannel[]) => void;
	addChannel: (channel: IChannel) => void;
	addChannelInCannelList: (message: IMessage) => void;
	addContactsInDMContacts: (message: IMessage, userId: string) => void;
}

const useChatStore = create<ChatState>()((set, get) => ({
	selectedChatType: undefined,
	selectedChatData: undefined,
	selectedChatMessages: [],
	directMessagesContacts: [],
	channels: [],

	setSelectedChatType: (selectedChatType: 'contact' | 'channel') =>
		set({ selectedChatType }),
	setSelectedChatData: (selectedChatData: IUser | DMContactUser | IChannel) =>
		set({ selectedChatData }),
	closeChat: () =>
		set({
			selectedChatData: undefined,
			selectedChatType: undefined,
			selectedChatMessages: []
		}),
	setSelectedChatMessages: (selectedChatMessages: IMessage[]) =>
		set({ selectedChatMessages }),

	addMessage: (message: IMessage) => {
		const selectedChatMessages = get().selectedChatMessages;

		set({
			selectedChatMessages: [
				...selectedChatMessages,
				{
					...message,
					recipient: message.recipient,
					sender: message.sender
				}
			]
		});
	},

	setDirectMessagesContacts: (directMessagesContacts: DMContactUser[]) =>
		set({ directMessagesContacts }),

	setChannels: (channels: IChannel[]) => set({ channels }),
	addChannel: (channel: IChannel) => {
		const channels = get().channels;
		set({ channels: [channel, ...channels] });
	},
	addChannelInCannelList: (message: IMessage) => {
		const channels = get().channels;
		const data = channels.find(channel => channel._id === message.channelId);
		const index = channels.findIndex(
			channel => channel._id === message.channelId
		);
		if (index && index !== -1) {
			channels.splice(index, 1);
			if (data) channels.unshift(data);
		}
	},
	addContactsInDMContacts: (message: IMessage, userId: string) => {
		const fromId =
			message.sender._id === userId
				? message.recipient?._id
				: message.sender._id;

		const fromData =
			message.sender._id === userId ? message.recipient : message.sender;

		const dmContacts = get().directMessagesContacts;
		const data = dmContacts.find(contact => contact._id === fromId);
		const index = dmContacts.findIndex(contact => contact._id === fromId);

		if (index && index !== -1) {
			dmContacts.splice(index, 1);
			if (data) dmContacts.unshift(data);
		} else {
			if (fromData) dmContacts.unshift(fromData as DMContactUser);
		}
		set({ directMessagesContacts: dmContacts });
	}
}));

export default useChatStore;

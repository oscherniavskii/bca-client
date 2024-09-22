import useChatStore from '@/store/chat.store';
import { IChannel } from '@/types/channel.types';
import { type FC } from 'react';

interface ChannelListProps {
	channels: IChannel[];
}

const ChannelList: FC<ChannelListProps> = ({ channels }) => {
	const {
		setSelectedChatType,
		setSelectedChatData,
		selectedChatData,
		setSelectedChatMessages
	} = useChatStore();

	const handleClickOnChannel = (channel: IChannel) => {
		setSelectedChatType('channel');
		setSelectedChatData(channel);

		if (selectedChatData && selectedChatData._id !== channel._id) {
			setSelectedChatMessages([]);
		}
	};

	return (
		<nav className='mt-5'>
			<ul>
				{channels.map(channel => (
					<li
						key={channel._id}
						className={`pl-5 py-2 transition-all duration-300 cursor-pointer ${
							selectedChatData && selectedChatData._id === channel._id
								? 'bg-primary hover:bg-secondary'
								: 'hover:bg-gcolor'
						}`}
						onClick={() => handleClickOnChannel(channel)}
					>
						<div className='flex gap-5 items-center text-neutral-300'>
							<div className='bg-gcolor h-10 w-10 flex items-center justify-center rounded-full'>
								#
							</div>
							<span>{channel.name}</span>
						</div>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default ChannelList;

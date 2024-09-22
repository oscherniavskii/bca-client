import { apiClient } from '@/lib/api-client';
import useChatStore from '@/store/chat.store';
import { IChannel } from '@/types/channel.types';
import { DMContactUser } from '@/types/user.types';
import {
	GET_ALL_CHANNELS_ROUTE,
	GET_CONTACTS_FOR_DM_ROUTE
} from '@/utils/constants';
import { AxiosError } from 'axios';
import { useEffect, useState, type FC } from 'react';
import { RiMenuFold3Line2, RiMenuUnfold3Line } from 'react-icons/ri';
import ChannelList from '../ChanelList';
import ContactList from '../ContactList';
import CreateChannel from './CreateChannel';
import Logo from './Logo';
import NewDM from './NewDM';
import ProfileInfo from './ProfileInfo';
import Title from './Title';

const ContactsContainer: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

	const {
		directMessagesContacts,
		setDirectMessagesContacts,
		channels,
		setChannels
	} = useChatStore();

	useEffect(() => {
		const getContacts = async () => {
			await apiClient
				.get<DMContactUser[]>(GET_CONTACTS_FOR_DM_ROUTE)
				.then(({ data }) => {
					setDirectMessagesContacts(data);
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
				});
		};
		const getChannels = async () => {
			await apiClient
				.get<IChannel[]>(GET_ALL_CHANNELS_ROUTE)
				.then(({ data }) => setChannels(data))
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
				});
		};
		getContacts();
		getChannels();
	}, []);

	return (
		<aside className={`relative shrink-0 transition-all duration-300`}>
			<div
				className={`overflow-hidden h-full transition-all duration-300 w-screen   ${
					isMenuOpen
						? 'md:w-[35vw] lg:w-[30vw] xl:w-[25vw]'
						: 'md:w-[0vw] lg:w-[0vw] xl:w-[0vw]'
				}`}
			>
				<div className='relative bg-bcolor border-r-2 border-gcolor w-full h-full transition-all duration-300 min-w-max'>
					<div className=''>
						<Logo />
					</div>
					<div className='my-5'>
						<div className='flex items-center justify-between pr-10'>
							<Title text='Direct Messages' />
							<NewDM />
						</div>
						<div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
							<ContactList contacts={directMessagesContacts} />
						</div>
					</div>
					<div className='my-5'>
						<div className='flex items-center justify-between pr-10'>
							<Title text='Channels' />
							<CreateChannel />
						</div>
						<div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
							<ChannelList channels={channels} />
						</div>
					</div>
					<ProfileInfo />
				</div>
			</div>
			<button
				className='bg-gcolor p-2 pl-1 text-xl rounded-r-lg cursor-pointer absolute top-4 right-0 translate-x-full md:z-10 flex items-center hidden md:block'
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				{isMenuOpen ? <RiMenuFold3Line2 /> : <RiMenuUnfold3Line />}
			</button>
		</aside>
	);
};

export default ContactsContainer;

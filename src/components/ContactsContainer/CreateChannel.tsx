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
import { IChannel } from '@/types/channel.types';
import { ChannelContact } from '@/types/user.types';
import { CHANNEL_CREATE_ROUTE, GET_ALL_CONTACTS } from '@/utils/constants';
import { AxiosError } from 'axios';
import { useEffect, useState, type FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import MultipleSelector, { Option } from '../ui/multiple-selector';

const CreateChannel: FC = () => {
	const [openNewChannelModal, setOpenNewChannelModal] =
		useState<boolean>(false);
	const [allContacts, setAllContacts] = useState<ChannelContact[]>([]);
	const [selectedContacts, setSelectedContacts] = useState<Option[]>([]);
	const [channelName, setChannelName] = useState<string>('');
	const { addChannel } = useChatStore();

	const createChannel = async () => {
		if (channelName.length && selectedContacts.length) {
			await apiClient
				.post<IChannel>(CHANNEL_CREATE_ROUTE, {
					name: channelName,
					members: selectedContacts.map(contact => contact.value)
				})
				.then(({ data }) => {
					addChannel(data);
					setOpenNewChannelModal(false);
					setChannelName('');
					setSelectedContacts([]);
				})
				.catch((error: AxiosError) => {
					console.log(error.response?.data);
				});
		} else {
			toast.error('Please enter channel name and members!');
		}
	};

	useEffect(() => {
		const getData = async () => {
			await apiClient
				.get<ChannelContact[]>(GET_ALL_CONTACTS)
				.then(({ data }) => {
					setAllContacts(data);
				})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		};

		getData();
	}, []);

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							className=' text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
							onClick={() => setOpenNewChannelModal(true)}
						/>
					</TooltipTrigger>
					<TooltipContent className='bg-tcolor border-none text-white mb-2 p-3'>
						Create new channel
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
				<DialogContent className='bg-bcolor border-none text-white w-[90vw] h-[60vh] xs:w-[400px] xs:h-[400px] rounded-lg flex flex-col'>
					<DialogHeader>
						<DialogTitle className='text-center'>
							Create new channel
						</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<div>
						<Input
							placeholder='Channel name'
							className='rounded-lg p-5 bg-gcolor border-none text-lg placeholder:text-[16px]'
							onChange={e => setChannelName(e.target.value)}
							value={channelName}
						/>
					</div>
					<div>
						<MultipleSelector
							className='rounded-lg bg-gcolor border-none py-2 text-white'
							defaultOptions={allContacts as Option[]}
							placeholder='Search Contacts'
							value={selectedContacts}
							onChange={setSelectedContacts}
							emptyIndicator={
								<p className='text-center text-lg leading-10 text-gray-600'>
									No results found
								</p>
							}
						/>
					</div>
					<div>
						<Button
							className='w-full bg-primary hover:bg-secondary focus:bg-secondary transition-all duration-300'
							onClick={createChannel}
						>
							Create channel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CreateChannel;

import useChatStore from '@/store/chat.store';
import { DMContactUser } from '@/types/user.types';
import { getColor } from '@/utils/color.utils';
import { HOST } from '@/utils/constants';
import { type FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ContactListProps {
	contacts: DMContactUser[];
}

const ContactList: FC<ContactListProps> = ({ contacts }) => {
	const {
		setSelectedChatType,
		setSelectedChatData,
		selectedChatData,
		setSelectedChatMessages
	} = useChatStore();

	const handleClickOnContact = (contact: DMContactUser) => {
		setSelectedChatType('contact');
		setSelectedChatData(contact);

		if (selectedChatData && selectedChatData._id !== contact._id) {
			setSelectedChatMessages([]);
		}
	};

	return (
		<nav className='mt-5'>
			<ul>
				{contacts.map(contact => (
					<li
						key={contact._id}
						className={`pl-5 py-2 transition-all duration-300 cursor-pointer ${
							selectedChatData && selectedChatData._id === contact._id
								? 'bg-primary hover:bg-secondary'
								: 'hover:bg-gcolor'
						}`}
						onClick={() => handleClickOnContact(contact)}
					>
						<div className='flex gap-5 items-center text-neutral-300'>
							<Avatar className='h-10 w-10 rounded-full overflow-hidden'>
								{contact.image ? (
									<AvatarImage
										src={`${HOST}/${contact.image}`}
										alt='profile'
										className='object-cover w-full h-full bg-black'
									/>
								) : (
									<AvatarFallback
										className={`${
											selectedChatData && selectedChatData._id === contact._id
												? 'bg-gcolor border border-white/70'
												: getColor(contact.color)
										} uppercase h-10 w-10 text-lg font-bold border-[1px] flex items-center justify-center rounded-full`}
									>
										{contact.firstName
											? contact.firstName.split('').shift()
											: contact.email.split('').shift()}
									</AvatarFallback>
								)}
							</Avatar>
							{contact.firstName && contact.lastName ? (
								<span>{`${contact.firstName} ${contact.lastName}`}</span>
							) : (
								<span>{contact.email}</span>
							)}
						</div>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default ContactList;

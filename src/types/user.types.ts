export interface IUser {
	_id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	color?: number;
	profileSetup: boolean;
	image?: string;
}

export interface DMContactUser extends IUser {
	lastMessageTime: string;
}

export interface ChannelContact {
	label: string;
	value: string;
}

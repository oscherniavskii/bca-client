import { IUser } from './user.types';

export interface IMessage {
	_id: string;
	sender: IUser;
	recipient?: IUser;
	messageType: 'text' | 'file';
	content?: string;
	fileUrl?: string;
	timestamp?: Date;
	channelId?: string;
}

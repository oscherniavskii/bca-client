import { type FC } from 'react';

interface TitleProps {
	text: string;
}

const Title: FC<TitleProps> = ({ text }) => {
	return (
		<h6 className='uppercase tracking-widest text-neutral-400 pl-5 font-light text-opacity-90 text-sm'>
			{text}
		</h6>
	);
};

export default Title;

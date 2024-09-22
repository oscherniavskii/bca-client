import { logo } from '@/assets/img';
import { type FC } from 'react';

const Logo: FC = () => {
	return (
		<div className='flex h-[70px] px-5 pt-3 justify-start items-center gap-2'>
			<div className='w-10 h-10'>
				<img src={logo} alt='Logo' />
			</div>
			<span className='text-4xl protest-guerrilla-regular text-secondary'>
				BCA
			</span>
		</div>
	);
};

export default Logo;

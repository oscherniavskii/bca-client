import lottieJson from '@/assets/lottie-purple.json';
import { type FC } from 'react';
import Lottie from 'react-lottie-player';

const EmptyChatContainer: FC = () => {
	return (
		<div className='flex-1 md:bg-bcolor md:flex flex-col justify-center items-center hidden transition-all duration-1000'>
			<Lottie
				loop
				animationData={lottieJson}
				play
				style={{ width: 200, height: 200 }}
				speed={2}
			/>
			<div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center'>
				<h3 className='poppins-medium'>
					Hi<span className='text-secondary'>!</span> Welcome to
					<span className='text-secondary protest-guerrilla-regular'>
						{' '}
						BCA.
					</span>
				</h3>
			</div>
		</div>
	);
};

export default EmptyChatContainer;

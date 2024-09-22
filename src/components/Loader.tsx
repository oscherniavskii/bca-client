import lottieJson from '@/assets/lottie-purple.json';
import { type FC } from 'react';
import Lottie from 'react-lottie-player';

const Loader: FC = () => {
	return (
		<div className='w-screen h-screen flex items-center justify-center p-2'>
			<Lottie
				loop
				animationData={lottieJson}
				play
				style={{ width: 250, height: 250 }}
				speed={5}
			/>
		</div>
	);
};

export default Loader;

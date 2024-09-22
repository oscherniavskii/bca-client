import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import { SocketProvider } from './context/SocketContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<SocketProvider>
		<App />
		<Toaster
			closeButton
			toastOptions={{
				classNames: {
					closeButton: 'bg-white hover:bg-gcolor/50 transition-all duration-300'
				}
			}}
		/>
	</SocketProvider>
);

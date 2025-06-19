import React from 'react';
import { ToastContainer, Slide } from 'react-toastify';

import { AuthProvider } from './context';
import { Navigation } from './routes';


function App() {
	return (
		<AuthProvider>
			<Navigation />

			<ToastContainer
				position='bottom-center'
				autoClose={5000}
				hideProgressBar
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={false}
				theme='colored'
				transition={Slide}
			/>
		</AuthProvider>
	);
}

export default App;

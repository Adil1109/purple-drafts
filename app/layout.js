import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { NextAuthProvider } from './Providers';
import DevelopmentPage from '@/components/DevelopmentPage';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Purple Drafts',
	description: 'Tech Stories with Impact!',
	metadataBase: new URL('https://purpledrafts.com'),
	openGraph: {
		title: 'Purple Drafts',
		description: 'Tech Stories with Impact!',
		url: 'https://purpledrafts.com',
		siteName: 'Purple Drafts',
		images: [
			{
				url: 'https://ftywvrnzwxxtrgpuezac.supabase.co/storage/v1/object/public/files/static-images/Youtube_Cover.png',
				width: 1920,
				height: 1080,
			},
		],
		locale: 'en_US',
		type: 'website',
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<NextAuthProvider>
					{process.env.DEV_STATUS === 'production' ? (
						<div className='max-w-full mx-auto text-white'>
							<Navbar />
							<div className='min-h-screen h-full w-full -mt-16 bg-gradient-to-t to-[#0f172a] from-[#12243c]'>
								{children}
							</div>
						</div>
					) : (
						<DevelopmentPage />
					)}
				</NextAuthProvider>
			</body>
		</html>
	);
}

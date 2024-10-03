/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,

	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
			{ protocol: 'https', hostname: 'i.postimg.cc' },
			{ protocol: 'https', hostname: 'odktnagnepyfmpvtseok.supabase.co' },
			{ protocol: 'https', hostname: 'ftywvrnzwxxtrgpuezac.supabase.co' },
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
		],
	},
	experimental: {
		serverActions: {
			allowedOrigins: ['purpledrafts.com', '*.purpledrafts.com'],
			bodySizeLimit: '50mb',
		},
	},
};

export default nextConfig;
// done

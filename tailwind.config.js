/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
		screens: {
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }
			aa: '875px',

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			s2xl: { max: '1535px' },
			// => @media (max-width: 1535px) { ... }

			sxl: { max: '1279px' },
			// => @media (max-width: 1279px) { ... }

			slg: { max: '1171px' },
			// => @media (max-width: 1023px) { ... }

			saa: { max: '860px' },

			smd: { max: '767px' },
			// => @media (max-width: 767px) { ... }

			ssm: { max: '639px' },
			// => @media (max-width: 639px) { ... }
			sxsm: { max: '385px' },
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				mytheme: {
					'base-100': '#1d232a',
					'base-200': '#111827',
					'base-300': '#15191e',
				},
			},
		],
	}, // applies background color and foreground color for root element by default
};

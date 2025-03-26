/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			pretendard: ["Pretendard"]
  		},
  		screens: {
  			xs: '390px',
  			sm: '640px',
  			md: '768px',
  			lg: '991px',
  			xl: '1280px',
  			'2xl': '1440px'
  		},
  		fontSize: {
  			xxlarge36: ["2.25rem", { lineHeight: "3rem" }],
  			xxlarge32: ["2rem", { lineHeight: "2.625rem" }],
  			xlarge28: ["1.75rem", { lineHeight: "2.375rem" }],
  			xlarge26: ["1.625rem", { lineHeight: "2.125rem" }],
  			large24: ["1.5rem", { lineHeight: "2rem" }],
  			large22: ["1.375rem", { lineHeight: "1.875rem" }],
  			medium20: ["1.25rem", { lineHeight: "1.75rem" }],
  			medium18: ["1.125rem", { lineHeight: "1.625rem" }],
  			small17: ["1.0625rem", { lineHeight: "1.625rem" }],
  			small16: ["1rem", { lineHeight: "1.5rem" }],
  			xsmall15: ["0.9375rem", { lineHeight: "1.5rem" }],
  			xsmall14: ["0.875rem", { lineHeight: "1.25rem" }],
  			xxsmall12: ["0.75rem", { lineHeight: "1rem" }],
  			xxsmall10: ["0.625rem", { lineHeight: "1rem" }]
  		},
  		borderRadius: {
  			none: '0',
  			xxs: '0.25rem',
  			xs: '0.375rem',
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: '1.25rem',
  			xxl: '1.5rem',
  			full: '9999px'
  		},
  		colors: {
  			primary: {
  				'0': '#FFFFFF',
  				'10': '#FFFAEE',
  				'20': '#FFF4D7',
  				'30': '#FFEFC3',
  				'40': '#FFE7A8',
  				'50': '#FFDF89',
  				'60': '#FFD872',
  				'70': '#FED057',
  				'80': '#FFCB42',
  				'90': '#FFC116',
  				'100': '#FCAF15',
  				DEFAULT: 'hsl(var(--primary))',
  				dark: '#FAC608',
  				light: '#FFEB03',
  				xlight: '#FFFF9F',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'0': '#FFFFFF',
  				'10': '#DFE0E2',
  				'20': '#B0B2B5',
  				'30': '#8D8F91',
  				'40': '#66696D',
  				'50': '#4E555E',
  				'60': '#43505F',
  				'70': '#26394E',
  				'80': '#152E49',
  				'90': '#0C2D51',
  				'100': '#002752',
  				DEFAULT: 'hsl(var(--secondary))',
  				dark: '#0B2D51',
  				light: '#4A5E75',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			tertiary: '#8BD94B',
  			fourth: '#F0FC61',
  			point: '#DAFF7C',
  			error: '#F65E39',
  			kakaoyellow: '#FFE600',
  			placeholder: '#808080',
  			neutral: {
  				'0': '#27272D',
  				'10': '#2A2D34',
  				'20': '#3E4148',
  				'30': '#4C4F56',
  				'35': '#5C5F66',
  				'40': '#7A7D84',
  				'45': '#989BA2',
  				'50': '#ACAFB6',
  				'60': '#BDBDBD',
  				'70': '#CFCFCF',
  				'75': '#D8D8D8',
  				'80': '#E7E7E7',
  				'85': '#EFEFEF',
  				'90': '#F3F3F3',
  				'95': '#F9F9F8',
  				'100': '#FAFAFA'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	},
  	minHeight: {
  		'real-screen': 'calc(var(--vh) * 100)'
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
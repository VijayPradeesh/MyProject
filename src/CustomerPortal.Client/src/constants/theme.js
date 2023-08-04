import { createTheme } from '@mui/material/styles';

export default createTheme({
	palette: {
		primary: {
			type: 'mears',
			main: '#F0941C'
		},
		secondary: {  //need to change
			type: 'dark',
			main: '#F29824'
		},
		error: { //need to change
			type: 'dark',
			main: '#FF0000'
		},
		white: {
			type: 'light',
			main: '#FFFFFF'
		}
	},
	typography: {
		useNextVariants: true,
		// Use the system font instead of the default Roboto font.
		fontFamily: ['Arial', 'Helvetica', 'sans-serif'].join(',')
	}
});

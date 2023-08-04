import green from '@mui/material/colors/green';

const styles = theme => ({
	button: {
		textTransform: 'capitalize',
		borderRadius: 0,
		padding: '5px 20px',
		backgroundColor: 'rgba(213,213,213,0.7)',
		boxShadow:
			'0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
		color: 'black',
		'&:hover': {
			backgroundColor: 'rgba(213, 213, 213, 1)'
		}
	},
	edge: {
		borderRadius: 5
	},
	fullHeight: {
		height: '100%'
	},
	primary: {
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&$outlined': {
			backgroundColor: 'transparent',
			color: theme.palette.primary.main,
			border: `2px solid ${theme.palette.primary.main}`,
			'&:hover': {
				backgroundColor: theme.palette.primary.dark,
				color: 'white',
				border: `2px solid ${theme.palette.primary.dark}`
			}
		}
	},
	outlined: {},
	secondary: {
		backgroundColor: theme.palette.secondary.main,
		color: 'white',
		'&:hover': {
			backgroundColor: theme.palette.secondary.dark
		}
	},
	danger: {
		backgroundColor: theme.palette.error.main,
		color: 'white',
		'&:hover': {
			backgroundColor: theme.palette.error.dark
		},
		'&$outlined': {
			backgroundColor: 'transparent',
			color: theme.palette.error.main,
			border: `2px solid ${theme.palette.error.main}`,
			'&:hover': {
				backgroundColor: theme.palette.error.dark,
				color: 'white',
				border: `2px solid ${theme.palette.error.dark}`
			}
		}
	},
	text:{
		fontWeight:'900',
		size:20
	},
	success: {
		backgroundColor: green[700],
		color: 'white',
		'&:hover': {
			backgroundColor: green[900]
		},
		'&$outlined': {
			backgroundColor: 'transparent',
			color: green[700],
			border: `2px solid ${green[700]}`,
			'&:hover': {
				backgroundColor: green[900],
				color: 'white',
				border: `2px solid ${green[900]}`
			}
		}
	}
});

export default styles;

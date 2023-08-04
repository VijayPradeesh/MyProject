const styles = theme => ({
	root: {
		flexGrow: 1,
		width: '100%',
		//	height: '40px',
		minWidth: '150px'
	},
	outlinedLabelRoot: {
		//	transform: 'translate(14px, 13px) scale(1)'
	},
	popoverHeight: {
		height: 600
	},
	formControlInput: {
		// border: '1px solid rgba(0,0,0,0.23)',
		'&:before': {
			height: '100%',
			border: '1px solid rgba(0,0,0,0.23)'
		},
		'&:after, &:hover': {
			border: `2px solid ${theme.palette.primary.main}`
		}
	}
});

export default styles;

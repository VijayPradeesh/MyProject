const styles = theme => ({
	paper: {
		borderRadius: 0,
		overflow: 'auto'
	},
	tableHeader: {
		zIndex: '1000',
		backgroundColor: `${theme.palette.primary.main}`
	},
	stickyHeader: {
		position: 'sticky',
		top: 0
	},
	noTableShadow: {
		boxShadow: 'none'
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	  },
});

export default styles;

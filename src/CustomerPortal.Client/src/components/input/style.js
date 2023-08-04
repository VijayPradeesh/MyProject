const styles = theme => ({
	root: {
		border: 'solid 3px #0ff',     // - For demonstration: set the TextField-root border
		padding: '3px',
		backgroundColor: "white"
	},
	iconButton: {
		padding: 0
	},
	textArea: {
		height: '120px',
		alignItems: 'baseline'
	},
	cssFocused: {
		backgroundColor: '#cfd8dc'
	},
	notchedOutline: {
		borderWidth: "1px",
		borderColor: "red !important"
	},
	autoCompleteInput: {
		padding: '10.5px 10px 10.5px; !important',
		'&::placeholder': {
			fontStyle: 'normal',
			//color: 'green'
		},
	}
});
export default styles;

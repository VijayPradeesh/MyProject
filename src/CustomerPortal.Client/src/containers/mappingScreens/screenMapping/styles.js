const styles = theme => ({
    spaceAroundGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& > *': {
            padding: '2px !important'
        }
    },
    actionTab: {
        display: 'flex',
        height: '60px',
        backgroundColor: '#201D1D',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    actionTabText: {
        color: `${theme.palette.primary.main} !important`,
        marginLeft: '38px'
    },
    containerTitle: {
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;
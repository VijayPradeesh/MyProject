const styles = theme => ({

    actionTab: {
        height: '140px',
        backgroundColor: '#201D1D'
    },
    actionTabGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    userAccessText: {
        color: `${theme.palette.primary.main} !important`,
        marginLeft: '38px'
    },
    filters: {
        backgroundColor: '#ffffff',
        borderRadius: '5px',
        minHeight: '66px',
        justifyContent: 'space-between'
    },
    filterOptions: {
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 8px 5px',
        alignItems: 'center',
        maxWidth: '260px'
    },
    filterOptionsDownload: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexStartGrid: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    tableCell: {
        padding: '5px 16px'

    },
    centerGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    multipleMenuItem: {
        '& > *': {
            padding: '2px 5px 2px 2px !important',
        },
    },
    multiSelectHeight: {
        height: '32px'
    },
    actionButtons: {
        height: '30px'
    },
    applyFilterButton: {
        height: '30px',
        marginRight: '10px'
    },
    spaceAroundGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& > *': {
            padding: '2px !important'
        },
    }
});

export default styles;
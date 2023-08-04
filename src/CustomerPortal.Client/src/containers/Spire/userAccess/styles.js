const styles = theme => ({
    container: {
        /* The image used */
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    buttonLength: {
        width: '20vw'
    },
    link: {
        color: `${theme.palette.primary.main} !important`,
        textDecoration: 'underline !important',
        cursor: 'pointer'
    },
    grid: {
        display: 'flex',
        gap: 20,
        maxWidth: '300px'
    },
    drawer: {
        width: '380px'
    },
    centerGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flexStartGrid: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    mobileNewUserButtons: {
        padding: '0px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchGrid: {
        padding: '0px 5px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    height60: {
        height: '60px',
        display: 'flex',
        alignItems: 'center'
    },
    height50: {
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px 20px'
    },
    newUserGrids: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '85px'
    },
    editSwitchGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        maxHeight: '65px',
    },
    margin15: {
        margin: '15px'
    },
    centeralignGrid: {
        display: 'flex',
        alignItems: 'center',
    },
    flexEndGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    closePopupIconAction: {
        cursor: 'pointer',
        color: '#000000',
        borderRadius: '10px',
        transition: '0.15s',
        // '&:hover': {
        //     backgroundColor: 'white',
        //     color: '#32789a',
        //     transform: 'scale(1.02)'
        // },
        // '&:active': {
        //     backgroundColor: 'white',
        //     color: '#32789a',
        //     transform: 'scale(1.02)'
        // }
    },
    padding25: {
        padding: '25px'
    },
    drawerTitleGrid: {
        padding: '25px',
        height: '77px'
    },
    actionTab: {
        height: '120px',
        backgroundColor: '#201D1D'
    },
    actionTabMobile: {
        backgroundColor: '#201D1D',
        padding: '1px 0px'
    },
    submitGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '65px'
    },
    submitGridMobile: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '55px'
    },
    mobileGrid: {
        padding: '2px 0px',
        backgroundColor: '#e4e4e4',
        height: 'calc(100vh - 150px)',
        overflowY: 'scroll',
        alignContent: 'flex-start'
    },
    drawerAlign: {
        padding: '15px 30px',
        position: 'sticky',
        top: '0px',
        zIndex: '9999',
        width: '100vw'
    },
    gridItemMobile: {
        margin: '3px 3px',
    },
    headerSpace: {
        flex: 1,
    },
    submitFilterGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '65px',
        padding: '0px 15px'
    },
    mobileLeftGrid: {
        alignSelf: 'center',
        padding: '0px 0px 0px 20px'
    },
    alignSelfCenter: {
        alignSelf: 'center',
    },
    actionTabGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    actionButtons: {
        width: '125px',
        '&:last-child': {
            marginRight: '40px'
        },
        textTransform: 'none'
    },
    actionButtonsMobile: {
        width: '125px',
        textTransform: 'none',
        padding: '0px 40px'
    },
    filterButtonMobile: {
        minWidth: 'inherit',
        textTransform: 'none',
        backgroundColor: '#FFFFFF'
    },
    editButtonMobile: {
        width: '100px',
        textTransform: 'none'
    },
    popOverMenu: {
        alignItems: 'center',
        padding: '15px 5px 10px 5px',
        maxWidth: '250px'
    },
    actionButtonsNewUser: {
        width: '125px',
        textTransform: 'none'
    },
    space: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
    },
    textTransform: {
        textTransform: 'none'
    },
    marginLeft38: {
        marginLeft: '38px',
        marginRight: '38px'
    },
    userAccessText: {
        color: `${theme.palette.primary.main} !important`,
        marginLeft: '38px'
    },
    heading: {
        color: '#f0941c',
        fontWeight: '600',
        display: "flex",
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            display: "flex",
            justifyContent: "center",
            fontWeight: '600',
            fontSize: '2.0rem'

        }
    },
});

export default styles;
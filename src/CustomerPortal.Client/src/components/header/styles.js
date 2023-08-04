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
    logo: {
        height: '34px',
        width: '86px',
        margin: '9px'
    },
    logoIcon: {
        height: '25px',
        width: '25px',
    },
    logoIconAbout: {
        height: '100px',
        width: '100px',
    },
    link: {
        color: `${theme.palette.primary.main} !important`,
        textDecoration: 'underline !important',
        cursor: 'pointer'
    },
    gridContainer: {
        display: 'flex',
        height: '72px'
    },
    gridLeft: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    gridTitle: {
        alignSelf: 'center',
        alignItems: 'flex-end'
    },
    logout: {
        marginRight: '31px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    centerGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: '500'
    },
    bgImage: {
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    customizeToolbar: {
        maxHeight: 50,
        padding: '0px 10px !important',
        maxWidth: '100vw',
        display: 'flex'
    },
    headerSpace: {
        flex: 1
    },
    closePopupIconAction: {
        cursor: 'pointer',
        color: '#000000',
        borderRadius: '10px',
        transition: '0.15s'
    },
    drawerTitleGrid: {
        padding: '25px',
        height: '77px',
        display: 'flex',
        alignItems: "center",
        gap: "5px"
    },
    newUserGrids: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '65px'
    },
    appbar: {
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
    },
    appbarHidden: {
        transform: 'translateY(-100%)',
    },
    userTag: {
        borderRadius: "1px !important",
        padding: "2px 5px !important",
        width: "fit-content",
        height: "fit-content !important",
        fontSize: "11px !important",
        "& .MuiChip-label": {
            padding: "0px"
        }
    },
    versionTag: {
        backgroundColor: "transparent !important"
    },
    helpBox: {
        display: "flex",
        alignItems: "center",
        gap: "5px"
    }
});

export default styles;
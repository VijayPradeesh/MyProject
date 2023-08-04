const styles = theme => ({
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
    actionTab: {
        height: '60px',
        backgroundColor: '#201D1D',
        alignItems: 'center',
        display: 'flex'
    },
    actionTabMobile: {
        backgroundColor: '#201D1D',
        padding: '1px 0px',
        height: '50px',
        alignItems: 'center',
        display: 'flex'
    },
    userAccessText: {
        color: `${theme.palette.primary.main} !important`,
        marginLeft: '38px'
    },
    profileContent: {
        display: 'flex',
        justifyContent: 'center'
    },
    profileCards: {
        backgroundColor: '#FFF',
        display: 'flex',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)'
    },
    newUserGrids: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '50px'
    },
    signatureCanvas: {
        border: "1px solid rgba(0, 0, 0, 0.42)",
        width: "100%",
        maxWidth: "538px",
        height: "152px",
        background: "#efefef"
    },
    signatureBtnContainer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: '0px 10px'
    },
    submitGridMobile: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '55px',
        padding: '0px 10px'
    },
    submitFlexEnd: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '60px',
        padding: '0px 10px'
    },
    submitFlexEndMobile: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '60px',
    },
    actionButtonsNewUser: {
        width: '125px',
        textTransform: 'none'
    },
    submitGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '60px',
    },
});

export default styles;
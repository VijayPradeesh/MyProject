import React from 'react'
import { withStyles } from '@mui/styles';
import { CircularProgress, Backdrop, Typography, Grid } from '@mui/material';


const styles = theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 5,
        color: '#fff'
    },
    centerGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});


function Loader(props) {
    const { open, classes, loadingText } = props;
    return (
        <React.Fragment>
            <Backdrop className={classes.backdrop} open={open} style={{ opacity: 0.95, backgroundColor: '#ffffff' }}>
                <Grid container gap={1}>
                    <Grid item xs={12} className={classes.centerGrid}>
                        <CircularProgress
                            thickness={5}
                            sx={{ borderRadius: 50 }}
                            value={100} color="primary" size={35} />
                    </Grid>
                    <Grid item xs={12} className={classes.centerGrid}>
                        {loadingText && <Typography style={{ color: "#000000" }}> {loadingText} </Typography>}
                    </Grid>
                </Grid >
            </Backdrop>
        </React.Fragment >
    )
}

export default withStyles(styles)(Loader);
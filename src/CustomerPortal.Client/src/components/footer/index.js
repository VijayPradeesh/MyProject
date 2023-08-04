import React from 'react';
import { Grid, Typography, Divider, Link } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { withStyles } from '@mui/styles';
import { withMediaQuery } from '../withMediaQuery';
import config from '../../config';

const styles = theme => ({
    centerGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    newUserGrids: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '65px'
    }
});

function Footer(props) {
    const { classes, isMobile } = props;
    // const emailText = `mailto:${config.CONTACT_EMAIL}`
    const copyrightText = config.COPYRIGHT
    // const version = config.VERSION;
    return (
        <React.Fragment>
            <Divider sx={{ width: 'inherit', mt: 3, mb: 0.5 }} orientation="horizontal" />
            <Grid container gap={1} sx={{ padding: '10px 0px', align: 'center', justifyContent: 'center' }}>
                <Grid item xs={12} className={classes.centerGrid}>
                    <Typography style={{ wordWrap: 'break-word', }} fontSize={16} align='center'> {copyrightText} </Typography>
                </Grid>
                {/* <Grid item xs={12} className={classes.centerGrid}>
                    <Link
                        href={emailText}
                        color="#3366CC"
                        fontWeight={600}
                        align='center'
                        fontSize={16}
                        style={{ cursor: 'pointer' }}
                        className={classes.forgotPassword}> Contact Us
                    </Link>
                </Grid> */}
            </Grid>
        </React.Fragment >
    );
}

export default compose(
    withStyles(styles, {
        name: 'Footer'
    }),
    connect(
        null,
        null
    ),
    withMediaQuery([
        ['isMobile', theme => theme.breakpoints.down('sm')],
        //['isDesktop', theme => theme.breakpoints.up('650')],
    ])
)(Footer);
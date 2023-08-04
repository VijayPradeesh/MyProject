import React from 'react'
import { compose } from 'redux';
import { withMediaQuery } from '../withMediaQuery';
import { withStyles } from '@mui/styles';
import styles from './styles';
import { Grid, Typography, Divider, Link } from '@mui/material';
import { MdClear } from 'react-icons/md';
import CustomIconButton from '../iconButton';
import logoIcon from '../../assets/mears-logoBG.png';
import config from '../../config';

const AboutInfo = (props) => {
    const { classes, isMobile, onClose, ...rest } = props;
    const emailText = `mailto:${config.CONTACT_EMAIL}`
    const copyrightText = config.COPYRIGHT
    const version = config.VERSION;
    return (
        <React.Fragment>
            <Grid display="flex" sx={{ height: window.innerHeight }} width={isMobile ? '100vw' : "380px"} justifyContent="space-between" flexDirection="column">
                <Grid container>
                    <Grid item xs={10} className={classes.drawerTitleGrid} backgroundColor="#E0E0E0">
                        <Typography style={{ size: '18px', fontWeight: '600' }}>About</Typography>
                    </Grid>
                    <Grid item xs={2} className={classes.centerGrid} backgroundColor="#E0E0E0">
                        <CustomIconButton title="Close" onClick={() => onClose(false)}>
                            <MdClear size={'18px'} className={classes.closePopupIconAction} />
                        </CustomIconButton>
                    </Grid>
                    <Grid container gap={2} sx={{ height: '100%' }}>
                        <Grid item xs={12} className={classes.centerGrid} sx={{ marginTop: '20px' }}>
                            <img id="mearsLogo" alt="CP" src={logoIcon} className={classes.logoIconAbout} />
                        </Grid>
                        <Grid item xs={12} className={classes.centerGrid} sx={{ marginTop: '5px' }}>
                            <Typography style={{ width: '100%' }} fontSize={18} color='primary' align='center'> Customer Portal </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.centerGrid} sx={{ marginTop: '5px' }}>
                            <Typography style={{ width: '100%' }} fontSize={16} align='center'> Version {version} </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.centerGrid} sx={{ marginTop: '5px' }}>
                            <Typography style={{ width: '280px', wordWrap: 'break-word', }} fontSize={16} align='center'> {copyrightText} </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container display="flex" justifySelf="flex-end">
                    <Divider sx={{ width: 'inherit' }} orientation="horizontal" />
                    <Grid item xs={12} className={classes.centerGrid} sx={{ margin: '15px 0px' }}>
                        <Link
                            href={emailText}
                            color="#3366CC"
                            fontWeight={600}
                            align='center'
                            fontSize={16}
                            style={{ cursor: 'pointer' }}
                            className={classes.forgotPassword}> Contact Us
                        </Link>
                    </Grid>
                </Grid>
            </Grid>

        </React.Fragment>
    )
}

export default compose(
    withStyles(styles, {
        name: 'Header'
    }),
    withMediaQuery([
        ['isMobile', theme => theme.breakpoints.down('sm')],
        //['isDesktop', theme => theme.breakpoints.up('650')],
    ])
)(AboutInfo);
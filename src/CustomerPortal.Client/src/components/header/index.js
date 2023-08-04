import { Grid, Typography, AppBar, Toolbar, Menu, Divider, Box, Collapse, Link, Drawer, Tabs, Tab, MenuItem, Tooltip, IconButton, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import { withStyles } from '@mui/styles';
import { MdAdd, MdClose, MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown, MdHistory, MdClear, MdInfoOutline, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { IoMdPower } from "react-icons/io";
import { AiOutlinePoweroff, AiOutlineMenu, AiOutlineHome } from 'react-icons/ai';
import { MdOutlineSpaceDashboard, MdOutlineHelpCenter } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import { FaSitemap } from 'react-icons/fa';
import jwt_decode from "jwt-decode";
import { TbFileInvoice, TbReportSearch } from 'react-icons/tb';
import { CgNotes, CgScreen } from 'react-icons/cg';
import logo from '../../assets/logo2.png';
import logoIcon from '../../assets/mears-logoBG.png';
import { withMediaQuery } from '../withMediaQuery';
import { withRouter } from '../withRouter';
import * as notifications from '../../store/notifyActions';
import * as customerPortalActions from '../../store/actions';
import CustomIconButton from '../iconButton';
import { areObjectsEqual } from '../../services/helpers';
import CustomButton from '../button';
import urls from '../../constants/routes.json';
import ConfirmDialog from '../confirmDialog';
import styles from './styles';
import About from './about';
import config from '../../config';

const Header = (props) => {
    const { classes, isMobile, login, profile } = props;
    const [headerData, setHeaderData] = useState({
        userName: '',
        shortName: '',
        screens: ''
    });
    const [confirmSignOutDialog, setConfirmSignOutDialog] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [aboutMenu, setAboutMenu] = useState(false);
    const version = config.VERSION;
    const emailText = `mailto:${config.CONTACT_EMAIL}`
    const copyrightText = config.COPYRIGHT
    const toggleNavMenu = (value) => {
        setDrawer(value);
    };
    const [collapseOpen, setCollapseOpen] = useState({
        reports: false
    });

    const logout = (props) => {
        sessionStorage.clear();
        props.navigate('/');
    };

    const jobDashboard = (props) => {
        props.navigate(urls.JOB_DASHBOARD);
        toggleNavMenu(false);
    };
    const currentURL = window.location.href;
    const desiredValue = urls.TUTORIAL;
    const regex = new RegExp(`\\b${desiredValue}\\b`);
    const tokenData = sessionStorage.getItem("token");
    const tokenObject = jwt_decode(tokenData);
    const organization = tokenObject.Organization;
    const role = tokenObject.Role;
    const org_role = organization + ' ' + role;

    const userAccess = (props) => {
        props.navigate(urls.USER_ACCESS);
        toggleNavMenu(false);
    };

    const contractRegionMapping = (props) => {
        props.navigate(urls.CONTRACT_MAPPING);
        toggleNavMenu(false);
    };

    const userProfile = (props) => {
        props.navigate(urls.PROFILE);
        toggleNavMenu(false);
    };

    const roleScreenMapping = (props) => {
        props.navigate(urls.SCREEN_MAPPING);
        toggleNavMenu(false);
    };

    const reports = (props) => {
        setCollapseOpen((prevState) => ({
            ...prevState,
            reports: !prevState.reports
        }))
    };

    const dailyActivityReports = (props) => {
        props.navigate(urls.REPORTS);
        toggleNavMenu(false);
        reports();
    };

    const resurfacingReports = (props) => {
        props.navigate(urls.RESURFACING_REPORTS);
        toggleNavMenu(false);
        reports();
    };


    const toggleAboutMenu = (value) => {
        setAboutMenu(value);
    }

    const tutorialPage = () => {
        props.navigate(urls.TUTORIAL);
        toggleNavMenu(false);
    }

    const toggleConfirmSignOut = (value) => {
        setConfirmSignOutDialog(value);
    };

    const prevProps = useRef(props);

    useEffect(() => {
        props.getProfileData().then(response => {
            const userName = sessionStorage.getItem('userName');
            // const updatedName = userName ? userName.replace('.', ' ') : '';
            const updatedName = response?.data?.firstName + ' ' + response?.data?.lastName;
            const shortNameArr = updatedName.split(' ').map(i => i.charAt(0)).slice(0, 2).toString().toUpperCase().split(',')
            const shortName = shortNameArr.join('')
            const screensAllowed = JSON.parse(sessionStorage.getItem('screens'))
            setHeaderData(prevState => {
                return {
                    ...prevState,
                    userName: updatedName,
                    shortName: shortName,
                    screens: screensAllowed
                }
            })
        });
    }, [props.profile.firstName, props.profile.lastName]);

    return (
        <React.Fragment>
            <ConfirmDialog
                open={confirmSignOutDialog}
                confirmationMessage='Are you sure you want to sign out?'
                onConfirm={() => logout(props)}
                onCancel={toggleConfirmSignOut} />
            {/* Drawer Menu */}
            <Drawer anchor='left' open={drawer} onClose={() => toggleNavMenu(false)} >
                <Grid display="flex" width={isMobile ? '80vw' : "350px"} justifyContent="space-between" flexDirection="column" sx={{ height: '100%' }}>
                    <Grid container>
                        <Grid item xs={10} className={classes.drawerTitleGrid} backgroundColor="#E0E0E0">
                            <Typography style={{ size: '18px', fontWeight: '600' }}>Customer Portal</Typography>
                        </Grid>
                        <Grid item xs={2} className={classes.centerGrid} backgroundColor="#E0E0E0">
                            <CustomIconButton title="Close" onClick={() => toggleNavMenu(false)}>
                                <MdClear size={'18px'} className={classes.closePopupIconAction} />
                            </CustomIconButton>
                        </Grid>
                        <Grid item xs={12} className={classes.newUserGrids}>
                            <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => userProfile(props)}>
                                <Grid item xs={3} className={classes.centerGrid}>
                                    <CustomIconButton style={{ backgroundColor: '#e2deed', width: '40px' }} title="Edit Profile" >
                                        <Typography color='#000000' size='20px'>{headerData.shortName} </Typography>
                                    </CustomIconButton>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{ width: '100%' }}> {headerData.userName || ''}</Typography>
                                    <Chip className={classes.userTag} label={org_role} />
                                </Grid>
                            </MenuItem>
                        </Grid>
                        {headerData.screens.length > 0 && headerData?.screens.find((item) => item.screen === "Dashboard")?.isAssigned && <Grid item xs={12} className={classes.newUserGrids} >
                            <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => jobDashboard(props)}>
                                <Grid item xs={3} className={classes.centerGrid}>
                                    <AiOutlineHome size='25px' />
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography style={{ width: '100%' }}>Dashboard</Typography>
                                </Grid>
                            </MenuItem>
                        </Grid>}
                        {!isMobile && headerData.screens.length > 0 && headerData?.screens.find((item) => item.screen === "Reports")?.isAssigned &&
                            <>
                                <Grid item xs={12} className={classes.newUserGrids} style={{ flexDirection: 'column' }}>
                                    <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => reports(props)}>
                                        <Grid container>
                                            <Grid item xs={3} className={classes.centerGrid}>
                                                <TbReportSearch size='25px' />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography style={{ width: '100%' }}>Reports</Typography>
                                            </Grid>
                                            {collapseOpen?.reports ?
                                                <MdOutlineKeyboardArrowUp style={{ alignSelf: 'center' }} /> : <MdOutlineKeyboardArrowDown style={{ alignSelf: 'center' }} />}
                                        </Grid>
                                    </MenuItem>
                                </Grid>
                                <Collapse in={collapseOpen?.reports} timeout='auto' unmountOnExit style={{ width: "100%" }}>
                                    <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => dailyActivityReports(props)}>
                                        <Grid item xs={3} />
                                        <Grid item xs={9}>
                                            <Typography style={{ width: '100%' }}>Daily activity</Typography>
                                        </Grid>
                                    </MenuItem>
                                    <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => resurfacingReports(props)}>
                                        <Grid item xs={3} />
                                        <Grid item xs={9}>
                                            <Typography style={{ width: '100%' }}>Resurfacing</Typography>
                                        </Grid>
                                    </MenuItem>
                                </Collapse>
                            </>
                        }
                        {headerData.screens.length > 0 && headerData?.screens.find((item) => item.screen === "User Access")?.isAssigned && <Grid item xs={12} className={classes.newUserGrids} >
                            <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => userAccess(props)}>
                                <Grid item xs={3} className={classes.centerGrid}>
                                    <GrUserAdmin size='21px' />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{ width: '100%' }}>User Access</Typography>
                                </Grid>
                            </MenuItem>
                        </Grid>}
                        {!isMobile && headerData.screens.length > 0 && headerData?.screens.find((item) => item.screen === "Contract Mapping")?.isAssigned && <Grid item xs={12} className={classes.newUserGrids} >
                            <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => contractRegionMapping(props)}>
                                <Grid item xs={3} className={classes.centerGrid}>
                                    <TbFileInvoice size='21px' />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{ width: '100%' }}> Contract Mapping </Typography>
                                </Grid>
                            </MenuItem>
                        </Grid>}
                        {!isMobile && headerData.screens.length > 0 && headerData?.screens.find((item) => item.screen === "Screen Mapping")?.isAssigned && <Grid item xs={12} className={classes.newUserGrids} >
                            <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => roleScreenMapping(props)}>
                                <Grid item xs={3} className={classes.centerGrid}>
                                    <CgScreen size='21px' />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{ width: '100%' }}> Screen Mapping </Typography>
                                </Grid>
                            </MenuItem>
                        </Grid>}
                        {!isMobile && headerData.screens.length > 0 && headerData?.screens.find((item) => item.screen === "HelpCenter")?.isAssigned && <Grid item xs={12} className={classes.newUserGrids} >
                            <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => tutorialPage(props)}>
                                <Grid item xs={3} className={classes.centerGrid}>
                                    <MdOutlineHelpCenter size='23px' />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{ width: '100%' }}> Help Center </Typography>
                                </Grid>
                            </MenuItem>
                        </Grid>}
                    </Grid>
                    <Grid container display="flex" justifySelf="flex-end" >
                        <Divider sx={{ width: 'inherit' }} orientation="horizontal" />
                        <Grid item xs={12} className={classes.newUserGrids} sx={{ display: { xs: 'flex', sm: 'none' } }}>
                            <MenuItem style={{ width: '100%', padding: '8px 0px' }} onClick={() => toggleAboutMenu(true)} >
                                <Grid item xs={3} className={classes.centerGrid}>
                                    <img id="mearsLogo" alt="CP" src={logoIcon} className={classes.logoIcon} />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{ width: '100%' }}>About</Typography>
                                </Grid>
                            </MenuItem>
                        </Grid>
                        <Grid item xs={12} className={classes.centerGrid} sx={{ display: { xs: 'none', sm: 'flex' }, margin: '3px 0px' }}>
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
                        <Grid item xs={12} className={classes.centerGrid} sx={{ display: { xs: 'none', sm: 'flex' }, margin: '2px 0px' }}>
                            <Typography style={{ wordBreak: 'break-word' }} fontSize={16} align='center'> {copyrightText.split('.')?.[0]} </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.centerGrid} sx={{ display: { xs: 'none', sm: 'flex' }, margin: '2px 0px' }}>
                            <Typography style={{ wordBreak: 'break-word' }} fontSize={16} align='center'> {copyrightText.split('.')?.[1]} </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Drawer >
            {/* Mobile About Menu */}
            < Drawer anchor='bottom' open={aboutMenu} onClose={() => toggleAboutMenu(false)} >
                <About onClose={toggleAboutMenu} />
            </Drawer >
            {/* Header Appbar */}
            < AppBar position='sticky' top={0} style={{ backgroundColor: '#ffffff' }}>
                <Toolbar id="dashboardHeader" className={classes.customizeToolbar} variant='dense'>
                    <Box>
                        <CustomIconButton title="Menu" onClick={() => toggleNavMenu(true)}>
                            <AiOutlineMenu size={'20px'} color='#000000' />
                        </CustomIconButton>
                    </Box>
                    <img id="mearsLogo" alt="LOGO" src={logo} className={classes.logo} />
                    <Typography textAlign="center"
                        sx={{
                            mr: 2,
                            ml: 4,
                            display: { xs: 'none', sm: 'flex' },
                            fontSize: '18px',
                            fontWeight: 600,
                            fontFamily: 'Roboto, sans-serif',
                            letterSpacing: '0.17px',
                            color: 'inherit',
                            textDecoration: 'none',
                            alignItems: 'baseline'
                        }}
                    > Customer Portal
                        <Chip sx={{ display: { xs: 'none', sm: 'flex' }, mr: 2 }} className={`${classes.userTag} ${classes.versionTag}`} label={version} />
                    </Typography>
                    <div className={classes.headerSpace} />
                    <Box>
                        {isMobile || (headerData.screens.length > 0 && !headerData?.screens.find((item) => item.screen === "HelpCenter")?.isAssigned) ?
                            <Link
                                href={emailText}
                                underline='none'
                                sx={{ display: 'flex', justifyContent: 'center' }}
                            >
                                <CustomButton
                                    primary=" Need Help?"
                                    //type="white"
                                    fontWeight='600'
                                    bgColor="#43a8d5"
                                    hoverBgColor="#FFF"
                                    textTransform='none'
                                    btnColor='#FFF'
                                    variant='outlined'
                                    hoverColor='#43a8d5'
                                    hoverBgOutlineColor='#43a8d5'
                                />
                            </Link> :
                            !regex.test(currentURL) &&
                            <CustomButton
                                primary=" Need Help?"
                                onClick={tutorialPage}
                                //type="white"
                                fontWeight='600'
                                bgColor="#43a8d5"
                                hoverBgColor="#FFF"
                                textTransform='none'
                                btnColor='#FFF'
                                variant='outlined'
                                hoverColor='#43a8d5'
                                hoverBgOutlineColor='#43a8d5'
                            />
                        }
                    </Box>
                    <Typography textAlign="center"
                        sx={{
                            mr: 1,
                            ml: 4,
                            display: { xs: 'none', sm: 'flex' },
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '0.1px',
                            textDecoration: 'none',
                            color: '#BA752A'
                        }}
                    > Welcome, {headerData.userName || ''}</Typography>
                    <Chip sx={{ display: { xs: 'none', sm: 'flex' }, mr: 2 }} className={classes.userTag} label={org_role} />
                    <Box>
                        <CustomIconButton title="Sign Out" onClick={() => toggleConfirmSignOut(true)}>
                            <IoMdPower size={'20px'} color='#000000' />
                        </CustomIconButton>
                    </Box>

                    {/* <CustomIconButton sx={{ display: { xs: 'none', sm: 'flex' } }} title="Logout" className={classes.logout} onClick={() => logout(props)}>
                        <AiOutlinePoweroff size={'20px'} color='#000000' />
                    </CustomIconButton> */}
                </Toolbar>
            </AppBar >
        </React.Fragment >
    )
}

Header.propTypes = {
    second: PropTypes.string
}

const mapStateToProps = state => {
    const { login, profile } = state.customerPortal;
    return {
        login,
        profile
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            ...notifications,
            ...customerPortalActions
        },
        dispatch
    );
export default compose(
    withStyles(styles, {
        name: 'Header'
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withMediaQuery([
        ['isMobile', theme => theme.breakpoints.down('sm')],
        //['isDesktop', theme => theme.breakpoints.up('650')],
    ]),
    withRouter
)(Header);
import React, { Component } from 'react'
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { Grid, InputAdornment, Paper, TextField, Skeleton, Divider, Zoom, Menu, MenuItem, Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography, Drawer, Tooltip, TableRow, TableCell } from '@mui/material';
import { connect } from 'react-redux';
import { withStyles, styled } from '@mui/styles';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import SignatureCanvas from "react-signature-canvas"
import { withRouter } from '../../components/withRouter';
import urls from '../../constants/routes.json';
import { withMediaQuery } from '../../components/withMediaQuery';
import * as customerPortalActions from '../../store/actions';
import CustomIconButton from '../../components/iconButton';
import CustomButton from '../../components/button';
import CustomInput from '../../components/input';
import { shortenEmail } from '../../services/helpers'
import * as notifications from '../../store/notifyActions';
import styles from './styles';

// const styles = theme => ({
//     container: {
//         /* The image used */
//         height: '100vh',
//         minHeight: '100%',
//         display: 'flex',
//         justifyContent: 'center'
//     }
// });

class Profile extends Component {

    state = {
        windowHeight: window.innerHeight,
        userDetails: {
            userName: '',
            shortName: '',
            email: '',
            firstName: '',
            lastName: '',
            shortEmail: '',
            signature: null
        },
        initialData: {
            userName: '',
            shortName: '',
            email: '',
            shortEmail: '',
            firstName: '',
            lastName: '',
            signature: null
        },
        regions: '',
        isSignature: false,
        showStampSign: false,
        stampBtnDisabled: false
    };

    cardsRef = React.createRef();
    signatureRef = React.createRef(null);
    signatureDivRef = React.createRef(null);
    componentDidMount() {
        this.init();
    };

    init() {
        this.props.getProfileData().then(response => {
            if (response) {
                const resData = response?.data;
                const regionString = resData?.region.map(obj => obj.regionType).join(', ');
                const firstName = resData?.firstName;
                const lastName = resData?.lastName;
                const email = resData?.email;
                const shortEmail = shortenEmail(email, 20, 15);
                const sign = resData?.signature;
                const fullName = firstName + ' ' + lastName;
                const shortNameArr = fullName.split(' ').map(i => i.charAt(0)).slice(0, 2).toString().toUpperCase().split(',')
                const shortName = shortNameArr.join('');
                this.setState(prevState => ({
                    userDetails: {
                        ...prevState.userDetails,
                        userName: fullName,
                        shortName,
                        email,
                        shortEmail,
                        firstName,
                        lastName,
                        signature: sign
                    },
                    initialData: {
                        ...prevState.initialData,
                        userName: fullName,
                        shortName,
                        email,
                        shortEmail,
                        firstName,
                        lastName,
                        signature: sign
                    },
                    regions: regionString
                }), () => {
                    this.toggleSignatureDisplay();
                });
            }
        })

    };

    toggleSignatureDisplay = () => {
        if (this.state.userDetails.signature) {
            this.setState({ isSignature: true })
            return;
        }
        this.setState({ isSignature: false })
    }

    newUserName = (firstName, lastName) => {
        const userName = firstName + ' ' + lastName;
        const shortNameArr = userName.split(' ').map(i => i.charAt(0)).slice(0, 2).toString().toUpperCase().split(',')
        const shortName = shortNameArr.join('');
        return { userName, shortName };
    };

    clearEditForm = () => {
        const { initialData } = this.state;
        this.setState(prevState => ({
            userDetails: {
                ...prevState.userDetails,
                userName: initialData.userName,
                shortName: initialData.shortName,
                firstName: initialData.firstName,
                lastName: initialData.lastName,
            }
        }));
    };

    onEditInputFieldChanged = evt => {
        const name = evt.target.name;
        let value = evt.target.value;
        this.setState(prevState => ({
            userDetails: {
                ...prevState.userDetails,
                [name]: value,
            }
        }))
    };

    saveEditChanges = (flag) => {
        const { userDetails } = this.state;
        const bodyParameters = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            signature: userDetails.signature || '',
            flag: flag
        };
        this.props.saveProfileData(bodyParameters).then(response => {
            if (response?.status == 200) {
                //once the data is saved update the initial state so the changes will be reflected
                this.props.addNotification({ message: response.data.message, type: 'success' });
                this.init();
            }
        }).catch(error => {
            this.props.addNotification({ message: 'Something went wrong', type: 'error' });
        });
    };

    updateStateAfterSuccessfulEdit = () => {
        const { userDetails } = this.state;
        this.setState(prevState => ({
            initialData: {
                ...prevState.initialData,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName
            }
        }), () => {
            const result = this.newUserName(this.state.initialData.firstName, this.state.initialData.lastName)
            this.setState(prevState => ({
                initialData: {
                    ...prevState.initialData,
                    userName: result?.userName,
                    shortName: result?.shortName
                }
            }));
        });
    };

    toggleSignature = () => {
        const { initialData } = this.state;
        this.setState({ isSignature: !this.state.isSignature }, () => {
            if (this.state.isSignature) {
                this.setState(prevState => ({
                    userDetails: {
                        ...prevState.userDetails,
                        signature: initialData.signature
                    }
                }), () => {
                    if (!this.state.userDetails.signature) {
                        this.signatureRef.current.clear();
                        this.setState({ isSignature: false })
                    }
                })
            }
        });
    }

    // handleStamp = () => {
    //     this.setState({
    //         showStampSign: true,
    //         stampBtnDisabled: true
    //     }, () => {
    //         if (this.state.showStampSign) {
    //             const stamp = document.getElementById('stamp');
    //             console.log("stamp height after click: ", stamp);
    //             stamp.width = this.signatureDivRef?.current?.offsetWidth - 25
    //             const ctx = stamp.getContext("2d")
    //             const fontSize = 16
    //             ctx.font = `${fontSize}px Arial`;
    //             ctx.fillStyle = "black";
    //             ctx.textAlign = "center";
    //             const timestamp = `${moment().format('MM-DD-YYYY, hh:mm:ss a')}`
    //             const tokenObject = jwtDecode(sessionStorage.getItem("token"))
    //             ctx.fillText(tokenObject.UserName, stamp.width / 2, ((stamp.height / 2) - fontSize));
    //             // ctx.fillText(tokenObject.Organization + tokenObject.Role, stamp.width / 2, stamp.height / 2);
    //             ctx.fillText(timestamp, stamp.width / 2, ((stamp.height / 2) + fontSize));
    //             this.setState(prevState => ({
    //                 userDetails: {
    //                     ...prevState.userDetails,
    //                     signature: stamp.toDataURL().split(',')[1]
    //                 }
    //             }));
    //         }
    //     });
    // }

    clearSignature = () => {
        if (!this.state.showStampSign && !this.state.isSignature) {
            this.signatureRef.current.clear()
            this.setState(prevState => ({
                userDetails: {
                    ...prevState.userDetails,
                    signature: null
                }
            }));
            return;
        }
        // This is for stamp
        // console.log("into else",)
        // this.setState({
        //     showStampSign: false,
        //     stampBtnDisabled: false
        // });
        // this.setState(prevState => ({
        //     userDetails: {
        //         ...prevState.userDetails,
        //         signature: null
        //     }
        // }));
    }

    handleSignatureEnd = () => {
        // Timestamp on signature changes 
        // if (!signature) {
        //     const timestamp = `${moment().format('MM-DD-YYYY, hh:mm:ss a')}`
        //     let signCanvas = signatureRef.current.getCanvas()
        //     // signCanvas.height = 400
        //     let canvasCtx = signCanvas.getContext("2d")
        //     const fontSize = isMobile ? 12 : 12;
        //     canvasCtx.font = `${fontSize}px Arial`;
        //     canvasCtx.fillStyle = "black";
        //     canvasCtx.textAlign = "center";
        //     const width = signatureDivRef?.current?.offsetWidth;
        //     const height = signatureDivRef?.current?.offsetHeight;
        //     console.log("Width:", width, 'height:', height);
        //     const stampStartPos = isMobile ? width * 0.75 : width * 0.80;
        //     canvasCtx.fillText(tokenObject.UserName, stampStartPos, ((height * 0.70) - fontSize * 0.75))
        //     canvasCtx.fillText(timestamp, stampStartPos, ((height * 0.70) + fontSize * 0.75))
        //     console.log(signCanvas.toDataURL(), "signCanvas")
        // }
        this.setState(prevState => ({
            userDetails: {
                ...prevState.userDetails,
                signature: this.signatureRef.current.toDataURL().split(',')[1]
            }
        }));
    }

    render() {
        const { classes, navigate, isMobile } = this.props;
        const { windowHeight, isSignature, regions, userDetails, stampBtnDisabled, initialData, showStampSign } = this.state;
        return (
            <React.Fragment>
                <Grid container sx={{ backgroundColor: '#f8f8f8' }}>
                    <Grid item xs={12} className={isMobile ? classes.actionTabMobile : classes.actionTab} >
                        <Typography style={{ fontSize: '22px', fontWeight: 600, marginLeft: isMobile ? '20px' : '38px' }} className={classes.userAccessText}> Profile </Typography>
                    </Grid>
                    <Grid container ref={this.cardsRef} className={classes.profileContent} padding={isMobile ? "10px" : "20px"} gap={2} sx={isMobile ? {
                        display: { height: `${windowHeight - this.cardsRef?.current?.offsetTop}px` }, overflowY: "scroll",
                        scrollSnapType: "y mandatory"
                    } : {
                        display: { minHeight: 'calc(100vh - 110px )' }
                    }}>
                        <Grid item xs={12} sm={3.5} className={classes.profileCards} justifyContent="space-between" flexDirection="column" sx={isMobile && { height: `${windowHeight - this.cardsRef?.current?.offsetTop - 20}px` }}>
                            <Grid container gap={2}>
                                <Grid item xs={12} className={classes.centerGrid} sx={{ margin: '40px 0px 5px', maxHeight: '120px' }}>
                                    <CustomIconButton style={{ backgroundColor: '#faf9f8', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)', width: '108px', height: '108px', cursor: 'default' }} title="" >
                                        <CustomIconButton style={{ backgroundColor: '#e2deed', width: '100px', height: '100px', cursor: 'default' }} title="" >
                                            <Typography color='#443d5b' fontSize='40px'>{initialData.shortName} </Typography>
                                        </CustomIconButton>
                                    </CustomIconButton>
                                </Grid>
                                <Grid item xs={12} className={classes.centerGrid} sx={{ margin: '0px 20px', maxHeight: '80px' }}>
                                    <Typography color='#000' style={{ wordWrap: "break-word" }} textAlign='center' fontSize='28px'>{initialData?.userName} </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.centerGrid} sx={{ margin: '10px 0px 10px', maxHeight: '20px' }}>
                                    <Tooltip title={initialData?.email}>
                                        <Typography color='#000' style={{ wordWrap: "break-word" }} textAlign='center' fontSize='16px'>{userDetails?.shortEmail} </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} className={classes.newUserGrids} >
                                    <CustomInput
                                        sx={{ width: 300 }}
                                        inputProps={{ maxLength: 15 }}
                                        name="firstName"
                                        label="First Name"
                                        disableSpace
                                        //placeholder="Enter the user's first name"
                                        //error={inputError.userName}
                                        variant="standard"
                                        autoComplete="off"
                                        value={userDetails.firstName || ''}
                                        onChange={this.onEditInputFieldChanged}
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.newUserGrids} >
                                    <CustomInput
                                        sx={{ width: 300 }}
                                        inputProps={{ maxLength: 15 }}
                                        name="lastName"
                                        label="Last Name"
                                        //placeholder="Enter the user's first name"
                                        //error={inputError.userName}
                                        variant="standard"
                                        autoComplete="off"
                                        value={userDetails.lastName || ''}
                                        onChange={this.onEditInputFieldChanged}
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.centerGrid} sx={{ margin: '0px 0px 10px', maxHeight: '20px' }}>
                                    <Typography color='#000' style={{ wordWrap: "break-word", width: '300px' }} textAlign='left-align' fontSize='15px'>Region(s): {regions} </Typography>
                                </Grid>
                            </Grid>
                            <Grid container display="flex" justifySelf="flex-end">
                                {/* <Divider sx={{ width: 'inherit' }} orientation="horizontal" /> */}
                                <Grid item xs={12} className={isMobile ? classes.submitGridMobile : classes.submitGrid} gap={3} >
                                    <CustomButton
                                        className={classes.actionButtonsNewUser}
                                        sizeValue='small'
                                        type="white"
                                        disabled={userDetails.firstName === initialData.firstName && userDetails.lastName === initialData.lastName}
                                        onClick={this.clearEditForm}
                                        primary='Cancel'
                                    />
                                    <CustomButton
                                        className={classes.actionButtonsNewUser}
                                        sizeValue='small'
                                        style={{ borderRadius: '20px' }}
                                        type="primary"
                                        onClick={() => this.saveEditChanges(true)}
                                        primary='Save'
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={5} className={classes.profileCards} justifyContent="space-between" flexDirection="column" sx={isMobile ? { height: `${windowHeight - this.cardsRef?.current?.offsetTop - 20}px`, width: '100%' } : { maxWidth: '556px' }} >
                            {/* This is the right Grid */}
                            < Grid container gap={2}>
                                <Grid item xs={12} className={classes.centerGrid} sx={{ margin: '40px 0px 10px' }}>
                                    <Typography color='#000' style={{ wordWrap: "break-word" }} fontSize='28px'> Signature </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.centerGrid}>
                                    <MdDriveFileRenameOutline size={50} />
                                </Grid>
                                <Grid item xs={12} className={classes.signatureBtnContainer} sx={{ marginTop: isMobile ? '30px' : '15px' }}>
                                    {/* <Grid item>
                                        <CustomButton
                                            sizeValue='small'
                                            style={{ borderRadius: '20px' }}
                                            type="primary"
                                            onClick={this.handleStamp}
                                            primary="Stamp"
                                            disabled={stampBtnDisabled}
                                        />
                                    </Grid> */}
                                    <Grid item>
                                        <CustomButton
                                            type="white"
                                            disabled={isSignature}
                                            sizeValue='small'
                                            style={{ borderRadius: '20px' }}
                                            onClick={this.clearSignature}
                                            primary='Clear'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} ref={this.signatureDivRef} sx={{ padding: '0px 10px', display: 'flex', justifyContent: 'center' }}>
                                    {isSignature && userDetails?.signature ?
                                        <img border='1px solid black' src={userDetails?.signature} height='152px' width={isMobile ? '100%' : '538px'} />
                                        :
                                        !showStampSign ? (
                                            <SignatureCanvas
                                                ref={this.signatureRef}
                                                velocityFilterWeight={1}
                                                canvasProps={{ className: classes.signatureCanvas }}
                                                onEnd={this.handleSignatureEnd}
                                            />
                                        ) : (
                                            <canvas id="stamp" className={classes.signatureCanvas}></canvas>
                                        )}
                                </Grid>
                                <Grid item xs={12} className={classes.centerGrid}>
                                    <Typography color='#000' style={{ wordWrap: "break-word" }} fontSize='16px'> Note: This signature will be used for the approvals </Typography>
                                </Grid>
                            </Grid>
                            <Grid container display="flex" justifySelf="flex-end">
                                {/* <Divider sx={{ width: 'inherit' }} orientation="horizontal" /> */}
                                <Grid item xs={12} className={isMobile ? classes.submitGridMobile : classes.submitGrid} gap={2} >
                                    <CustomButton
                                        className={classes.actionButtonsNewUser}
                                        sizeValue='small'
                                        type="white"
                                        onClick={this.toggleSignature}
                                        primary={isSignature ? 'Edit' : 'Cancel'}
                                    />
                                    <CustomButton
                                        className={classes.actionButtonsNewUser}
                                        sizeValue='small'
                                        disabled={userDetails?.signature == initialData?.signature}
                                        style={{ borderRadius: '20px' }}
                                        type="primary"
                                        onClick={() => this.saveEditChanges(false)}
                                        primary='Save'
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment >
        )
    }
}


Profile.propTypes = {

};

const mapStateToProps = state => {
    const { organizations } = state.customerPortal;
    return {
        companies: organizations
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            ...notifications,
            ...customerPortalActions
        },
        dispatch
    );
}

export default compose(
    withStyles(styles, {
        name: 'Profile'
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
)(Profile);
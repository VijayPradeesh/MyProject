
import React, { Component } from 'react';
import { Grid, InputAdornment, Paper, TextField, Box, Button, Dialog, Link } from '@mui/material';
import { MdVisibility, MdVisibilityOff, MdOutlineVpnKey, MdNoEncryption, MdWifiTetheringErrorRounded } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import jwt_decode from "jwt-decode";
import { withRouter } from '../../../components/withRouter';
import urls from '../../../constants/routes.json';
import CustomButton from '../../../components/button';
import CustomInput from '../../../components/input'
import Image from '../../../assets/Mears.svg';
import logo from '../../../assets/logo2.png';
import * as notifications from '../../../store/notifyActions';
import * as customerPortalActions from '../../../store/actions';
import * as validator from '../../../components/input/validator';
import Loader from '../../../components/loader';
import config from "../../../config";

const styles = theme => ({
    container: {
        /* The image used */
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    outerPaper: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5',
        padding: '3',
        borderRadius: '5',
        boxShadow: "5px 5px 10px #ccc"
    },
    buttonLength: {
        width: '20vw'
    },
    logo: {
        height: '50px',
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
    centerGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: '500'
    },
    forgotPassword: {
        fontSize: 16
    },
    bgImage: {
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    }
});

class Login extends Component {

    state = {
        passwordVisibility: false,
        loginForm: {
            userName: '',
            password: ''
        },
        inputError: {
            userName: false,
            password: false
        },
        loader: false
    };

    componentDidMount() {
        this.init();
    };

    init() {
    };

    setError = (name) => {
        this.setState({
            inputError: {
                [name]: true
            }
        });
        setTimeout(() => {
            this.setState(prevState => ({
                inputError: { ...prevState.inputError, [name]: !prevState.inputError[name] }
            }))
        }, 3000); //run this after 3 seconds
    }

    saveUserDetails = () => {
        const bodyParameters = {
            email: this.state.loginForm.userName,
            password: this.state.loginForm.password
        };
        const isEmailValid = validator.checkEmail(bodyParameters.email);
        const isPasswordValid = validator.checkPassword(bodyParameters.password);

        if (!bodyParameters.email) {
            this.props.addNotification({ message: 'Please enter the email', type: 'error' });
            this.setError('userName');
            return;
        }
        if (!isEmailValid) {
            this.props.addNotification({ message: 'Please enter a valid email', type: 'error' });
            this.setError('userName');
            return;
        }
        if (!bodyParameters.password) {
            this.props.addNotification({ message: 'Please enter the password', type: 'error' });
            this.setError('password');
            return;
        }
        this.setState({ loader: true }, () => {
            if (isPasswordValid) {
                this.props.login(bodyParameters).then(res => {
                    if (res && res.data.token) {
                        const tokenObject = jwt_decode(res.data.token);
                        this.props.addNotification({ message: res.data.message, type: 'success' });
                        sessionStorage.setItem("token", res.data.token);
                        res.data.screens = [...res.data.screens, ...[
                            {
                                "id": Math.floor(Math.random() * Date.now()),
                                "screen": "Profile",
                                "isAssigned": true
                            }]
                        ]
                        let reportElement = res?.data?.screens?.find(o => o.screen === 'Reports');
                        if (reportElement?.isAssigned) {
                            res.data.screens = [...res.data.screens, ...[
                                {
                                    "id": Math.floor(Math.random() * Date.now()),
                                    "screen": "ResurfacingReports",
                                    "isAssigned": true
                                }]
                            ]
                        }
                        sessionStorage.setItem("screens", JSON.stringify(res.data.screens))
                        sessionStorage.setItem("id", tokenObject.UserId);
                        sessionStorage.setItem("userName", tokenObject.UserName);
                        sessionStorage.setItem("email", tokenObject.Email);
                        const isAdmin = tokenObject.IsAdmin === "True";
                        if (res.data.isNewUser) {
                            this.props.navigate(urls.RESET_PASSWORD);
                        } else if (res.data.screens.find((item) => item.screen === 'Dashboard')?.isAssigned) {
                            this.props.navigate(urls.JOB_DASHBOARD);
                        } else if (res.data.screens.find((item) => item.screen === 'Reports')?.isAssigned) {
                            this.props.navigate(urls.REPORTS);
                        } else if (res.data.screens.find((item) => item.screen === 'User Access')?.isAssigned) {
                            this.props.navigate(urls.USER_ACCESS);
                        } else if (res.data.screens.find((item) => item.screen === 'HelpCenter')?.isAssigned) {
                            this.props.navigate(urls.TUTORIAL);
                        } else {
                            this.props.navigate(urls.LOGIN);
                            this.props.addNotification({ message: "You haven't been given access to any screen, please contact admin", type: 'error' })
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                    if (error.response.status == 404) {
                        this.props.addNotification({ message: 'Invalid Username/Password combination. Please try again.', type: 'error' });
                    }
                    if (error.response.status == 500) {
                        this.props.addNotification({ message: 'Login Failed" Internal Server Error - Please check with your administrator', type: 'error' });
                        return;
                    }
                    if (error.response.status == 401) {
                        this.props.addNotification({ message: 'Incorrect password', type: 'error' });
                        return;
                    }
                    if (error.response.status == 403) {
                        this.props.addNotification({ message: error.response.data.message, type: 'error' });
                        if (error?.response?.data?.isPasswordExpired) {
                            const tokenObject = jwt_decode(error?.response?.data?.token);
                            sessionStorage.setItem("id", tokenObject.UserId);
                            sessionStorage.setItem("email", tokenObject.Email);
                            sessionStorage.setItem("token", error?.response?.data?.token);
                            this.props.navigate(urls.RESET_PASSWORD);
                        }
                    }
                    if (error.response.status == 423) {
                        this.props.addNotification({ message: 'Your account is locked, please contact administrator', type: 'error' });
                        return;
                    }
                }).finally(() => {
                    this.setState({ loader: false });
                })
            } else {
                this.props.addNotification({ message: `Password doesn't meet the requirements`, type: 'error' });
                this.setError('password');
                this.setState({ loader: false });
                return;
            }
        })
    };

    forgotPassword = () => {
        this.props.navigate(urls.FORGOT_PASSWORD);
    };

    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            passwordVisibility: !prevState.passwordVisibility
        }));
    };

    onInputFieldChanged = evt => {
        const name = evt.target.name;
        let value = evt.target.value;
        if (name == 'userName') {
            value = evt.target.value.toLowerCase();
        }
        const selectionStart = evt.target.selectionStart;
        this.setState(
            state => ({ loginForm: { ...state.loginForm, [name]: value } }), () => {
                // to restore the cursor at the point where it was left off
                evt.target.setSelectionRange(selectionStart, selectionStart);
            });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.saveUserDetails()
        }
        if (event.keyCode === 32) { // 32 is the key code for space
            event.preventDefault();
        }
    }

    // componentWillUnmount() {
    // 	clearInterval(this.blink);
    // };

    render() {
        const { passwordVisibility, loginForm, inputError, loader } = this.state;
        const { classes, navigate } = this.props;
        return (
            <React.Fragment>
                <Loader open={loader} loadingText='Logging you in a moment !' />
                <Grid container className={classes.container}>
                    <Grid item md={4} display={{ xs: 'none', md: 'block' }} >
                        <img id="mearsLogo" alt="LOGO" src={Image} className={classes.bgImage} />
                    </Grid>
                    <Grid item xs={12} md={8} className={classes.centerGrid}>
                        <Grid container className={classes.grid}>
                            <Grid item xs={12} className={classes.centerGrid}>
                                <img id="mearsLogo" alt="LOGO" src={logo} className={classes.logo} />
                            </Grid>
                            <Grid item xs={12} className={classes.centerGrid}>
                                <span className={classes.text}>Customer Portal</span>
                            </Grid>
                            <Grid item xs={12} marginTop='10px' className={classes.centerGrid}>
                                <span className={classes.text}>Sign In</span>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomInput
                                    inputProps={{ maxLength: 100 }}
                                    name="userName"
                                    label="Email"
                                    placeholder="Enter your email address"
                                    error={inputError.userName}
                                    variant="outlined"
                                    autoComplete="off"
                                    fullWidth
                                    value={loginForm.userName || ''}
                                    onChange={this.onInputFieldChanged}
                                    onKeyPress={this.handleKeyDown}
                                    onKeyDown={this.handleKeyDown}
                                //startAdornment={<FiUser fontSize='medium' color='#424242' />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomInput
                                    inputProps={{ maxLength: 100 }}
                                    name="password"
                                    label="Password"
                                    error={inputError.password}
                                    placeholder="Enter your password"
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                    value={loginForm.password || ''}
                                    type={passwordVisibility ? 'text' : 'password'}
                                    onChange={this.onInputFieldChanged}
                                    onKeyPress={this.handleKeyDown}
                                    // startAdornment={<InputAdornment position="start">
                                    //     <MdOutlineVpnKey fontSize='medium' color='#424242' />
                                    // </InputAdornment>}
                                    endAdornment={passwordVisibility ? <MdVisibilityOff color='#424242' /> : <MdVisibility color='#424242' />}
                                    onClickEndAdornment={this.togglePasswordVisibility}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomButton
                                    fullHeight
                                    sizeValue='medium'
                                    type="primary"
                                    fullWidth
                                    onClick={this.saveUserDetails}
                                    primary='Login'
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.centerGrid}>
                                <Link onClick={() => this.forgotPassword()}
                                    underline="hover"
                                    color="#000000"
                                    style={{ cursor: 'pointer' }}
                                    className={classes.forgotPassword}> Forgot Password
                                </Link>
                            </Grid>
                            <Grid item xs={12} className={classes.centerGrid}>
                                <Link
                                    href={`mailto:${config.CONTACT_EMAIL}`}
                                    color="#3366CC"
                                    underline='hover'
                                    align='center'
                                    // fontSize={16}
                                    style={{ cursor: 'pointer' }}
                                    className={classes.forgotPassword}> Contact Us
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment >
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object
};

const mapStateToProps = state => {
    return {

    }
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
        name: 'Login'
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withRouter
)(Login);

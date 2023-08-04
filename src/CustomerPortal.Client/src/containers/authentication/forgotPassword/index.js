
import React, { Component } from 'react';
import { Grid, InputAdornment, Paper, TextField, Box, Button, Dialog, Link } from '@mui/material';
import { MdVisibility, MdVisibilityOff, MdOutlineVpnKey, MdNoEncryption, MdWifiTetheringErrorRounded } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { withRouter } from '../../../components/withRouter';
import urls from '../../../constants/routes.json';
import CustomButton from '../../../components/button';
import CustomInput from '../../../components/input'
import Image from '../../../assets/Mears.svg';
import logo from '../../../assets/logo2.png';
import * as notifications from '../../../store/notifyActions';
import * as customerPortalActions from '../../../store/actions';
import * as validator from '../../../components/input/validator';
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
    forgotPassword: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
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
    passwordText: {
        fontSize: 15
    },
    bgImage: {
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    }
});

class ForgotPassword extends Component {

    state = {
        passwordVisibility: false,
        loginForm: {
            userName: '',
            password: ''
        },
        inputError: {
            userName: false,
            password: false
        }
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
        // this.blink = setInterval(()=>{
        //     this.setState(prevState => ({ inputError: { ...prevState.inputError, [name]:!prevState.inputError[name] } })
        //     ,()=>{
        //         console.log("hello,",this.state.inputError[name])
        //     })
        // },500)
        setTimeout(() => {
            this.setState(prevState => ({
                inputError: { ...prevState.inputError, [name]: !prevState.inputError[name] }
            }))
        }, 3000); //run this after 3 seconds
    }

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.saveUserDetails()
        }
        if (event.keyCode === 32) { // 32 is the key code for space
            event.preventDefault();
        }
    }

    saveUserDetails = () => {
        const bodyParameters = {
            email: this.state.loginForm.userName
        };
        const isEmailValid = validator.checkEmail(bodyParameters.email);

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
        this.props.forgotPassword(bodyParameters).then(res => {
            if (res.data) {
                this.props.addNotification({ message: res.data.message, type: 'success' });
            }
        }).catch((error) => {
            console.log(error.response);
            if (error.response.status == 401) {
                this.props.addNotification({ message: 'Invalid Username/Password combination. Please try again.', type: 'error' });
            }
            if (error.response.status == 400) {
                this.props.addNotification({ message: 'Login Failed" Internal Server Error - Please check with your administrator', type: 'error' });
                return;
            }
            if (error.response.status == 404) {
                this.props.addNotification({ message: error.response.data.message, type: 'error' });
                return;
            }
        })

    };

    backToLogin = () => {
        this.props.navigate(urls.LOGIN);
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

    // componentWillUnmount() {
    // 	clearInterval(this.blink);
    // };

    render() {
        const { passwordVisibility, loginForm, inputError } = this.state;
        const { classes, navigate } = this.props;
        return (
            <React.Fragment>
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
                                <span className={classes.text}>Forgot Password</span>
                            </Grid>
                            <Grid item xs={12} className={classes.centerGrid}>
                                <span align="center" className={classes.passwordText}>
                                    Please enter your email and contact the administrator to reset your password
                                </span>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomInput
                                    inputProps={{ maxLength: 100 }}
                                    name="userName"
                                    label="Email"
                                    error={inputError.userName}
                                    variant="outlined"
                                    autoComplete="off"
                                    fullWidth
                                    onKeyPress={this.handleKeyDown}
                                    value={loginForm.userName || ''}
                                    onChange={this.onInputFieldChanged}
                                    onKeyDown={this.handleKeyDown}
                                    startAdornment={<FiUser fontSize='medium' color='#424242' />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomButton
                                    fullHeight
                                    sizeValue='medium'
                                    type="primary"
                                    fullWidth
                                    onClick={this.saveUserDetails}
                                    primary='Request for a Reset'
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.centerGrid}>
                                <Link onClick={() => this.backToLogin()}
                                    underline="hover"
                                    color="#000000"
                                    style={{ cursor: 'pointer' }}
                                    className={classes.forgotPassword}> Back to Login
                                </Link>
                            </Grid>
                            <Grid item xs={12} className={classes.centerGrid}>
                                <Link
                                    href={`mailto:${config.CONTACT_EMAIL}`}
                                    color="#3366CC"
                                    align='center'
                                    underline='hover'
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

ForgotPassword.propTypes = {
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
        name: 'ForgotPassword'
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withRouter
)(ForgotPassword);


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
import { validateBodyParameters } from '../../../services/helpers';

const styles = theme => ({
    container: {
        /* The image used */
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    logo: {
        height: '50px',
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

class ResetPassword extends Component {

    state = {
        passwordVisibility: {
            newPassword: false,
            confirmNewPassword: false
        },
        changePasswordForm: {
            userName: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    };

    componentDidMount() {
        this.init();
    };

    init() {
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.saveUserDetails()
        }
    };

    saveUserDetails = () => {
        //this.props.addNotification({ message: 'Logging In', type: 'info' });
        //this.props.navigate('/SignUp');
        const userId = parseInt(sessionStorage.getItem('id'));
        // const newUsername = sessionStorage.getItem('userName');
        const newUsername = sessionStorage.getItem('email');
        const { userName, newPassword, confirmNewPassword } = this.state.changePasswordForm;

        const bodyParameters = {
            userId,
            email: newUsername,
            newPassword,
            confirmNewPassword
        }
        const isPasswordValid = validator.checkPassword(bodyParameters.newPassword);

        //const finalBody = validateBodyParameters(bodyParameters);
        if (newPassword == '' || confirmNewPassword == '') {
            this.props.addNotification({ message: `Please enter all the necesssary fields`, type: 'error' });
            return;
        };

        if (newPassword != confirmNewPassword) {
            this.props.addNotification({ message: `Password doesn't match`, type: 'error' });
            return;
        };


        if (!isPasswordValid) {
            this.props.addNotification({ message: `Password doesn't meet the requirements`, type: 'error' });
            return;
        }

        if (!userId || !newUsername) {
            this.props.addNotification({ message: `Please try again later`, type: 'error' });
            return;
        };

        if (bodyParameters) {
            this.props.changePassword(bodyParameters).then(response => {
                this.props.addNotification({ message: response.data.message, type: 'success' });
                this.props.navigate(urls.LOGIN);
            }).catch((error) => {
                console.log(error.response);
                this.props.addNotification({ message: error.response.data.message, type: 'error' });
                return;
            })
        }
        // else {
        //     this.props.addNotification({ message: 'Please enter all the necesssary fields', type: 'error' });
        // }
    };



    togglePasswordVisibility = (name) => {
        this.setState(state => ({
            ...state,
            passwordVisibility: { ...state.passwordVisibility, [name]: !this.state.passwordVisibility[name] }
        }));
    };

    backToLogin = () => {
        this.props.navigate(urls.LOGIN);
    };

    onInputFieldChanged = evt => {
        const name = evt.target.name;
        const value = evt.target.value;
        this.setState(
            state => ({ changePasswordForm: { ...state.changePasswordForm, [name]: value } }));
    };

    render() {
        const { passwordVisibility, changePasswordForm } = this.state;
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
                                <span className={classes.text}>Reset Password</span>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomInput
                                    inputProps={{ maxLength: 100 }}
                                    name="newPassword"
                                    label="New Password"
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                    onKeyPress={this.handleKeyDown}
                                    passwordCriterion
                                    value={changePasswordForm.newPassword || ''}
                                    type={passwordVisibility.newPassword ? 'text' : 'password'}
                                    onChange={this.onInputFieldChanged}
                                    startAdornment={<InputAdornment position="start">
                                        <MdOutlineVpnKey fontSize='medium' color='#424242' />
                                    </InputAdornment>}
                                    endAdornment={passwordVisibility.newPassword ? <MdVisibilityOff color='#424242' /> : <MdVisibility color='#424242' />}
                                    onClickEndAdornment={() => this.togglePasswordVisibility('newPassword')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomInput
                                    inputProps={{ maxLength: 100 }}
                                    name="confirmNewPassword"
                                    label="Confirm Password"
                                    variant="outlined"
                                    fullWidth
                                    passwordCriterion
                                    autoComplete="off"
                                    onKeyPress={this.handleKeyDown}
                                    value={changePasswordForm.confirmNewPassword || ''}
                                    type={passwordVisibility.confirmNewPassword ? 'text' : 'password'}
                                    onChange={this.onInputFieldChanged}
                                    startAdornment={<InputAdornment position="start">
                                        <MdOutlineVpnKey fontSize='medium' color='#424242' />
                                    </InputAdornment>}
                                //endAdornment={passwordVisibility.confirmNewPassword ? <MdVisibilityOff color='#424242' /> : <MdVisibility color='#424242' />}
                                //onClickEndAdornment={() => this.togglePasswordVisibility('confirmNewPassword')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomButton
                                    fullHeight
                                    sizeValue='medium'
                                    fullWidth
                                    onClick={this.saveUserDetails}
                                    primary='Reset Password'
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
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment >
        );
    }
}

ResetPassword.propTypes = {
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
        name: 'ResetPassword'
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withRouter
)(ResetPassword);

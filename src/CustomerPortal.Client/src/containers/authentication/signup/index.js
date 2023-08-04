
import React, { Component } from 'react';
import { Grid, InputAdornment, Paper, TextField, Box, Button, Dialog } from '@mui/material';
import { MdVisibility, MdVisibilityOff, MdOutlineVpnKey, MdNoEncryption } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { withRouter } from '../../../components/withRouter';
import * as notifications from '../../../store/notifyActions';
import * as customerPortalActions from '../../../store/actions';
import urls from '../../../constants/routes.json';
import CustomButton from '../../../components/button';
import CustomInput from '../../../components/input'
import DropDown from '../../../components/dropdown';
import Image from '../../../assets/loginBgUpdated.png';
import logo from '../../../assets/logo1.png';
import { validateBodyParameters } from '../../../services/helpers';

const styles = theme => ({
    bgImage: {
        /* The image used */
        backgroundImage: `url(${Image})`,
        height: '100vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    outerPaper: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '700',
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
        gap: 20
    },
    centerGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const module = [
    {
        id: '2',
        name: 'Spire'
    },
];

const role = [
    {
        id: '3',
        name: 'Inspector'
    },
];
class SignUp extends Component {

    state = {
        signUpForm: {
            userFName: '',
            userLName: '',
            email: '',
            roleId: '',
            module: ''
        }
    };

    componentDidMount() {
        this.init();
    };

    init() {
        console.log("Get APIS");
    };

    saveUserDetails = () => {
        console.log("SignUp Credentials: ", this.state.signUpForm);
        const { userName } = sessionStorage.getItem('userName') || '';
        const { userFName: firstName, userLName: lastName, email, roleId } = this.state.signUpForm;
        const bodyParameters = {
            userName,
            firstName,
            lastName,
            email,
            roleId
        };
        const finalBody = validateBodyParameters(bodyParameters);
        if (finalBody) {
            console.log("BodyParameters: ", bodyParameters);
            this.props.signUp(bodyParameters)
                .then((response) => {
                    console.log("response: ", response);
                    this.props.navigate(urls.ALL_USERS);
                }).catch(error => {
                    this.props.addNotification({ message: 'Unable to create user, please try later', type: 'error' });
                    this.props.navigate(urls.ALL_USERS);
                })
        } else {
            this.props.addNotification({ message: 'Please enter all the necesssary fields', type: 'error' });
        }

        // .then((payload)=>{
        //     console.log("Payload in signUp response: ",payload);
        // })

    };

    displayAllUsers = () => {
        this.props.navigate(urls.ALL_USERS);
    };

    onDropdownChange = evt => {
        const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        const name = evt.target.name;
        console.log("evt ", evt);
        this.setState(
            state => ({ ...state, signUpForm: { ...state.signUpForm, [name]: value } }), () => {
                console.log("state: ", this.state)
            });
    };

    forgotPassword = () => {
        console.log("Forgot Password")
    };

    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            passwordVisibility: !prevState.passwordVisibility
        }));
    };

    onInputFieldChanged = evt => {
        const name = evt.target.name;
        const value = evt.target.value;
        this.setState(
            state => ({ signUpForm: { ...state.signUpForm, [name]: value } }));
    };

    render() {
        const { signUpForm } = this.state;
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Box
                    //className={classes.outerPaper}
                    margin='auto'
                    zIndex='10'
                    display='flex'
                    flexDirection='column'
                    maxWidth={320}
                    backgroundColor='white'
                    alignItems='center'
                    justifyContent='space-evenly'
                    gap={3}
                    padding={3}
                    borderRadius={5}
                    //lightmodeShadow
                    //boxShadow = 'rgba(0, 0, 0, 0.6) 5px 10px 10px, rgba(0, 0, 0, 0.4) 0px 30px 100px'
                    //darkmodeShadow
                    boxShadow=' rgba(0, 0, 0, 0.7) 3px 3px 3px, rgba(0, 0, 0, 0.4) 5px 10px 10px, rgba(255, 255, 255, 0.4) 0px 30px 130px'
                    sx={{
                        transition: '0.2s',
                        "&:hover": {
                            //light
                            //boxShadow : 'rgba(0, 0, 0, 0.1) 15px 25px 25px, rgba(0, 0, 0, 0.4) 0px 30px 90px',
                            //dark
                            //boxShadow : 'rgba(0, 0, 0, 0.1) 15px 25px 25px, rgba(0, 0, 0, 0.4) 0px 30px 90px',
                            backfaceVisibility: 'hidden'
                        },
                    }}
                >
                    <Grid container className={classes.grid}>
                        <Grid item xs={12} className={classes.centerGrid}>
                            <img id="mearsLogo" alt="LOGO" src={logo} className={classes.logo} />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomInput
                                inputProps={{ maxLength: 100 }}
                                name="email"
                                label="Username"
                                variant="outlined"
                                autoComplete="off"
                                fullWidth
                                value={signUpForm.email || ''}
                                onChange={this.onInputFieldChanged}
                                startAdornment={<FiUser fontSize='medium' />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container columnSpacing={{ xs: 1, sm: 1, md: 2 }}>
                                <Grid item xs={6}>
                                    <CustomInput
                                        inputProps={{ maxLength: 100 }}
                                        name="userFName"
                                        label="First Name"
                                        variant="outlined"
                                        autocomplete="off"
                                        value={signUpForm.userFName || ''}
                                        onChange={this.onInputFieldChanged}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInput
                                        inputProps={{ maxLength: 100 }}
                                        name="userLName"
                                        label="Last Name"
                                        variant="outlined"
                                        autocomplete="do-not-autofill"
                                        value={signUpForm.userLName || ''}
                                        onChange={this.onInputFieldChanged}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container columnSpacing={{ xs: 1, sm: 1, md: 2 }}>
                                <Grid item xs={6} id="module">
                                    <DropDown
                                        name="module"
                                        label="Module"
                                        keyToBind={{ key: 'id', value: 'name' }}
                                        options={module}
                                        value={signUpForm.module}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                                <Grid item xs={6} id="role">
                                    <DropDown
                                        name="roleId"
                                        label="Role"
                                        keyToBind={{ key: 'id', value: 'name' }}
                                        options={role}
                                        value={signUpForm.roleId}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* <Grid item xs={12}>
                                    <CustomInput
                                        inputProps={{ maxLength: 100 }}
                                        name="email"
                                        label="Email Address"
                                        variant="outlined"
                                        autocomplete="do-not-autofill"
                                        fullWidth
                                        value={signUpForm.email || ''}
                                        onChange={this.onInputFieldChanged}
                                        startAdornment={<MdOutlineEmail fontSize='large' />}
                                    />
                                </Grid> */}
                        <Grid item xs={12}>
                            <CustomButton
                                fullHeight
                                sizeValue='medium'
                                fullWidth
                                id="SignUp"
                                onClick={this.saveUserDetails}
                                type="success"
                                primary='Add User'
                                disabled={false}
                            />
                        </Grid>
                    </Grid>
                    <CustomButton
                        fullHeight
                        sizeValue='medium'
                        fullWidth
                        id="SignUp"
                        onClick={this.displayAllUsers}
                        type="primary"
                        primary='User List'
                        disabled={false}
                    />
                </Box>
            </React.Fragment >
        );
    }
}

SignUp.propTypes = {
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
        name: 'SignUp'
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withRouter
)(SignUp);

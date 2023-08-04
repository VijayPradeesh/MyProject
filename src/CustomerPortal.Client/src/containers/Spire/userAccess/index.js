
import React, { Component } from 'react';
import { Grid, InputAdornment, Paper, TextField, Skeleton, Divider, Zoom, Menu, MenuItem, Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography, Drawer, Tooltip, TableRow, TableCell } from '@mui/material';
import { MdVisibility, MdAdd, MdVisibilityOff, MdOutlineVpnKey, MdNoEncryption, MdWifiTetheringErrorRounded } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { GrAdd } from "react-icons/gr";
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles, styled } from '@mui/styles';
import PropTypes from 'prop-types';
import { withRouter } from '../../../components/withRouter';
import { withMediaQuery } from '../../../components/withMediaQuery';
import urls from '../../../constants/routes.json';
import CustomButton from '../../../components/button';
import Switch from '../../../components/switch';
import CustomInput from '../../../components/input';
import DropDown from '../../../components/dropdown';
import CustomSelect from '../../../components/multiselect';
import { AiOutlinePlus } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import * as notifications from '../../../store/notifyActions';
import * as customerPortalActions from '../../../store/actions';
import * as validator from '../../../components/input/validator';
import { validateBodyParameters } from '../../../services/helpers';
import CustomIconButton from '../../../components/iconButton';
import Header from '../../../components/header';
import SearchBar from '../../../components/searchBar';
import ReactVirtualizedTable from '../../../components/table';
import { USERS_HEADER, USERS_HEADER_MOBILE } from '../../../constants/tableHeaders';
import styles from './styles';
import Row from './Row';
import Select, { components } from "react-select";
import MultipleSelect from '../../../components/multiselect/test';
import MultiSelect from '../../../components/multiselect';
import SkeletonComponent from '../../../components/skeleton';
import UserCardMobile from './userCardMobile';
import FloatingButton from '../../../components/floatingButton';
import { RiFilter2Fill } from 'react-icons/ri';
import { NoDataFound } from '../../../components/staticComponents';
import Footer from '../../../components/footer';

function descendingComparator(a, b, orderBy) {
    if (orderBy == 'date' || orderBy == 'lastLogin') {
        if (new Date(b[orderBy]) < new Date(a[orderBy])) {
            return -1;
        }
        if (new Date(b[orderBy]) > new Date(a[orderBy])) {
            return 1;
        }
    }
    if (orderBy == 'roleId') {
        console.log("A and B role: ", a.role[0]?.role, b.role[0]?.role, b.role[0]?.role < a.role[0]?.roleId)
        if (b.role[0]?.role < a.role[0]?.role) {
            console.log("Type if")
            return -1;
        }
        if (b.role[0]?.role > a.role[0]?.role) {
            console.log("Type else")
            return 1;
        }
    }
    if (orderBy == 'typeId') {
        if (b.type[0]?.type < a.type[0]?.type) {
            return -1;
        }
        if (b.type[0]?.type > a.type[0]?.type) {
            return 1;
        }
    }
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    const abc = order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

    return abc
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

const DrawerHeader = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: "#E0E0E0"
}))

function MobileCardSkeleton(props) {
    const { rows, columns } = props;
    const skeletonArray = Array(8).fill('')
    return (
        skeletonArray.map((item, index) => {
            return (
                <>
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width='100%'
                        height='100px'
                        sx={{ margin: '2px 3px' }}
                    />
                </>
            )
        })
    )
}
class UserAccess extends Component {

    state = {
        searchText: '',
        filterOptions: {
            roleId: 0,
            regionId: 0,
            typeId: 0,
            isActive: true
        },
        toggleDrawer: false,
        toggleEditDrawer: false,
        toggleFilterDrawer: false,
        toggleSideMenuDrawer: false,
        order: '',
        orderBy: '',
        newUser: {
            email: '',
            firstName: '',
            lastName: '',
            typeId: '',
            roleId: '',
            region: [],
            roles: []
        },
        editUser: {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            typeId: 4,
            roleId: 6,
            region: [],
            active: false,
            roles: [],
            regionDropDown: []
        },
        userDetails: [],
        region: [],
        dropDown: {},
        role: [],
        typingTimeout: 0,
        newPassword: '',
        passwordDialogOpen: false,
        isFilterApplied: false,
        isNewAccountCreated: false,
        isLoading: true,
        windowHeight: window.innerHeight
    };

    cardsRef = React.createRef();

    componentDidMount() {
        this.init();
    };

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (
    //         this.state.windowHeight !== nextState.windowHeight
    //     ) {
    //         return true;
    //     }
    //     return true;
    // };

    // componentDidUpdate(prevProps, prevState) {
    //     // code to run after the component has update
    //     return prevProps.window.innerHeight != window.innerHeight
    // };

    init() {
        const bodyParameters = {
            searchKey: '',
            roleId: 0,
            regionId: 0,
            typeId: 0,
            isActive: true
        };

        this.props.getAdminDropDownData().then(response => {
            this.setState({ dropDown: this.props.dropdownData }, () => {
                this.searchAfterUpdate();
            });
        })
    };

    //Table function
    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({ order: (isAsc ? 'desc' : 'asc'), orderBy: property });
    };

    handleMenuClick = event => {
        this.setState({ toggleFilterDrawer: true });
    };

    clearFilters = () => {
        this.setState({
            filterOptions: {
                roleId: 0,
                regionId: 0,
                typeId: 0,
                isActive: true
            },
            role: [],
            isFilterApplied: false
        }, () => {
            this.searchAfterUpdate();
        })
    };

    toggleDrawer = (value) => {
        this.setState({ toggleDrawer: value });
    };

    toggleEditDrawer = (value) => {
        this.setState({ toggleEditDrawer: value });
    };

    toggleFilterDrawer = (value) => {
        this.setState({ toggleFilterDrawer: value });
    };

    clearAddForm = () => {
        this.toggleDrawer(false);
        this.setState({
            newUser: {
                email: '',
                firstName: '',
                lastName: '',
                typeId: '',
                roleId: '',
                region: [],
                roles: [],
                active: false
            },
        });
    };

    clearEditForm = () => {
        this.toggleEditDrawer(false);
        // this.setState({
        //     editUser: {
        //         email: '',
        //         firstName: '',
        //         lastName: '',
        //         typeId: [],
        //         roleId: [],
        //         region: [],
        //         active: false,
        //         roles: []
        //     }
        // });
    };

    handleChange = (values) => {
        this.setState({ region: values });
    };

    passwordDialogToggle = () => {
        this.setState({ passwordDialogOpen: false, newPassword: '', isNewAccountCreated: false })
    }
    resetClick = (props) => {
        const userId = parseInt(sessionStorage.getItem("id"));
        const bodyParameters = {
            userId,
            requestedUserId: props.id
        };
        this.props.resetPassword(bodyParameters).then((response) => {
            if (response.status == 200) {
                this.props.addNotification({ message: response.data.message, type: 'success' });
                this.setState({ newPassword: response.data.password }, () => {
                    this.setState({ passwordDialogOpen: true });
                });
            }
        })
    };

    copyToClipBoard = () => {
        this.props.addNotification({ message: "Copied to clipboard", type: 'success' });
        navigator.clipboard.writeText(this.state.newPassword);
    };

    addNewUser = () => {
        this.toggleDrawer(true);
        // this.props.getAllUsers().then(response => {
        //     console.log("res in init: ", response);
        // })
    };

    toggleSwitch = () => {
        this.setState(state => ({
            editUser: {
                ...state.editUser,
                active: !state.editUser.active
            }
        }))
    };

    toggleSwitchFilter = () => {
        this.setState(state => ({
            filterOptions: {
                ...state.filterOptions,
                isActive: !state.filterOptions.isActive
            }
        }))
    };

    setInitialStateEdit = (details) => {
        const roleType = this.state.dropDown.roleType;
        const regionDropDown = this.state.dropDown.region ? this.state.dropDown.region.map(function (item) {
            return item['regionType'];
        }) : [];
        const initialRegion = details.region ? details.region.map(function (item) {
            return item['regionType'];
        }) : [];
        this.setState(state => ({
            editUser: {
                ...state.editUser,
                id: details.id,
                email: details.email,
                firstName: details.firstName,
                lastName: details.lastName,
                roleId: details.roleId,
                region: initialRegion,
                active: details.isActive,
                typeId: details.typeId,
                regionDropDown: regionDropDown
            }
        }), () => {
            const selectedTypeId = this.state.editUser.typeId;
            let obj = roleType.find(ele => ele.typeId === selectedTypeId);
            this.setState(state => ({
                editUser: {
                    ...state.editUser,
                    roles: obj.roles
                }
            }))
        })

    };

    editUser = (details) => {
        this.toggleEditDrawer(true);
        this.setInitialStateEdit(details);
    };

    createUser = () => {
        const adminId = parseInt(sessionStorage.getItem('id'));
        const createUserData = this.state.newUser;
        const bodyParameters = {
            adminId,
            firstName: createUserData.firstName,
            lastName: createUserData.lastName,
            email: createUserData.email,
            roleId: createUserData.roleId,
            organisationId: createUserData.typeId,
            region: createUserData.region
        }
        const finalBody = validateBodyParameters(bodyParameters);
        if (!finalBody) {
            this.props.addNotification({ message: 'Please fill out all the details', type: 'error' });
            return;
        }
        const isEmailValid = validator.checkEmail(bodyParameters.email);
        if (!isEmailValid) {
            this.props.addNotification({ message: 'Please enter a valid email', type: 'error' });
            return;
        }
        this.toggleDrawer(false)
        this.props.registerNewUser(bodyParameters).then((response) => {
            if (response.status == 200) {
                this.props.addNotification({ message: 'User added successfully', type: 'success' });
                this.setState({ isNewAccountCreated: true, newPassword: response.data.password }, () => {
                    this.setState({
                        passwordDialogOpen: true,
                        newUser: {
                            email: '',
                            firstName: '',
                            lastName: '',
                            typeId: '',
                            roleId: '',
                            region: [],
                            active: false,
                            roles: []
                        },
                    });
                    this.searchAfterUpdate();
                });
            }
        }).catch(error => {
            console.log("error:", error.response)
            this.props.addNotification({ message: error.response.data.message, type: 'error' });
        })
    };

    handleKeyDown = evt => {
        if (evt.keyCode === 32) { // 32 is the key code for space
            evt.preventDefault();
        }
    };

    onInputFieldChanged = evt => {
        const name = evt.target.name;
        let value = evt.target.value;
        if (name == 'email') {
            value = evt.target.value.toLowerCase();
        }
        // const selectionStart = evt.target.selectionStart;
        this.setState(
            state => ({ ...state, newUser: { ...state.newUser, [name]: value } }), () => {
                // to restore the cursor at the point where it was left off
                // evt.target.setSelectionRange(selectionStart, selectionStart);
                if (name === 'typeId') {
                    const roleType = this.state.dropDown.roleType;
                    const selectedTypeId = this.state.newUser.typeId;
                    let obj = roleType.find(ele => ele.typeId === selectedTypeId);
                    this.setState(state => ({ ...state, newUser: { ...state.newUser, roles: obj.roles } }))
                }
            });
    };

    onEditInputFieldChanged = evt => {
        const name = evt.target.name;
        let value = evt.target.value;
        if (name == 'email') {
            value = evt.target.value.toLowerCase();
        }
        const selectionStart = evt.target.selectionStart;
        this.setState(
            state => ({ ...state, editUser: { ...state.editUser, [name]: value } }), () => {
                // to restore the cursor at the point where it was left off
                evt.target.setSelectionRange(selectionStart, selectionStart);
                if (name === 'typeId') {
                    const roleType = this.state.dropDown.roleType;
                    const selectedTypeId = this.state.editUser.typeId;
                    let obj = roleType.find(ele => ele.typeId === selectedTypeId);
                    this.setState(state => ({ ...state, editUser: { ...state.editUser, roles: obj.roles } }))
                }
            });
    };

    updateStateAfterSuccessfulEdit = () => {
        const { editUser, userDetails, dropDown } = this.state;
        const regionDropDown = dropDown.region;
        //const regionObj = regionDropDown.find(ele => ele.regionType === editUser.region[0]);
        const result = regionDropDown.filter(object => editUser.region.includes(object.regionType));
        const updatedUserDetails = userDetails.map(user => {
            if (user.id === editUser.id) {
                return {
                    ...user,
                    firstName: editUser.firstName,
                    lastName: editUser.lastName,
                    typeId: editUser.typeId,
                    roleId: editUser.roleId,
                    region: result,
                    isActive: editUser.active,
                    fullName: editUser.firstName + ' ' + editUser.lastName
                };
            }
            return user;
        });
        this.setState({ userDetails: updatedUserDetails })
    };

    saveEditChanges = () => {
        const { editUser, dropDown } = this.state;
        const adminId = parseInt(sessionStorage.getItem('id'));
        const regionBody = dropDown.region.filter(ele => editUser.region.includes(ele.regionType));
        const bodyParameters = {
            adminId,
            userId: editUser.id,
            email: editUser.email,
            firstName: editUser.firstName,
            lastName: editUser.lastName,
            typeId: editUser.typeId,
            roleId: editUser.roleId,
            region: regionBody,
            isActive: editUser.active
        }
        if (!bodyParameters.region.length > 0) {
            this.props.addNotification({ message: "Region cannot be empty", type: 'error' });
            return
        }
        this.props.editUser(bodyParameters).then((response) => {
            if (response.status == 200) {
                //once the data is saved update the initial state so the changes will be reflected
                this.props.addNotification({ message: response.data.message, type: 'success' });
                this.updateStateAfterSuccessfulEdit();
            }
        }).catch(error => {
            this.props.addNotification({ message: 'Unable to process request, please try again later', type: 'error' });
        })
        this.toggleEditDrawer(false);
    };

    onFilterInputChanged = evt => {
        const name = evt.target.name;
        const value = evt.target.value;
        this.setState(
            state => ({ ...state, filterOptions: { ...state.filterOptions, [name]: value } }), () => {
                if (name === 'typeId') {
                    const roleType = this.state.dropDown.roleType;
                    const selectedTypeId = this.state.filterOptions.typeId;
                    let obj = roleType.find(ele => ele.typeId === selectedTypeId);
                    this.setState(prevState => ({
                        filterOptions: { ...prevState.filterOptions, roleId: 0 },
                        role: obj.roles
                    }));
                }
            });
    };

    onSearchInput = evt => {
        const name = evt.target.name;
        const value = evt.target.value;
        this.setState({ searchText: value });
        this.searchAfterUpdate();
    };

    applyFilters = () => {
        this.setState({ isFilterApplied: true }, () => {
            this.searchAfterUpdate();
            this.toggleFilterDrawer(false);
        })
    };

    searchAfterUpdate = () => {
        const { typingTimeout, filterOptions } = this.state;
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        this.setState({
            isLoading: true,
            typingTimeout: setTimeout(() => {
                const bodyParameters = {
                    searchKey: this.state.searchText,
                    roleId: filterOptions.roleId,
                    regionId: filterOptions.regionId,
                    typeId: filterOptions.typeId,
                    isActive: filterOptions.isActive
                };
                this.props.getAllUsers(bodyParameters).then(response => {
                    this.setState({ userDetails: this.props.allUsers, isLoading: false })
                });
            }, 500)
        });
    };

    onClearText = () => {
        this.setState({ searchText: '' }, () => {
            this.searchAfterUpdate();
        });
    };

    handleRegionChange = (event) => {
        const { target: { value } } = event;
        let duplicate = [];
        value.forEach((item) => {
            if (duplicate.findIndex((e) => e.id === item.id) >= 0) {
                duplicate = duplicate.filter((x) => x.id === item.id);
            } else {
                duplicate.push(item);
            }
        });
        this.setState(prevState => ({
            newUser: { ...prevState.newUser, region: duplicate }
        }));
    };

    handleEditRegionChange = (event) => {
        const { target: { value } } = event;
        this.setState(state => ({
            ...state,
            editUser: {
                ...state.editUser,
                region: typeof value === 'string' ? value.split(',') : value
            }
        }))
    };

    render() {
        const { searchText, isNewAccountCreated, filterOptions, isFilterApplied, toggleDrawer, toggleEditDrawer, toggleFilterDrawer, newUser, editUser, order, role, orderBy, newPassword, dropDown, userDetails, windowHeight, editUserData, passwordDialogOpen, isLoading } = this.state;
        const { classes, navigate, isMobile } = this.props;
        const rowProps = {
            editUserData,
            dropDown
        };

        const multiSelectProps = {
            options: dropDown.region,
            currentValue: newUser.region,
            keyToBind: { key: 'id', value: 'regionType' },
            onChange: this.handleRegionChange,
            label: 'Region',
            variant: 'standard'
        };

        const multiSelectEditProps = {
            keyToBind: { key: 'id', value: 'regionType' },
            label: 'Region',
            name: 'region',
            width: '300px',
            variant: 'standard'
        };

        return (
            <React.Fragment>
                <Dialog
                    open={passwordDialogOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {isNewAccountCreated ? 'Account Created' : ' New Password Generated'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please copy the new password to the clipboard or note it down
                        </DialogContentText>
                        <DialogContentText marginTop="20px">
                            <CustomInput
                                inputProps={{ maxLength: 100 }}
                                name="password"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                size="small"
                                value={newPassword || ''}
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Grid container>
                            <Grid item xs={12} className={classes.submitFilterGrid} gap={3} >
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    sizeValue='small'
                                    type="white"
                                    onClick={this.passwordDialogToggle}
                                    primary='Close'
                                />
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    style={{ borderRadius: '20px' }}
                                    type="primary"
                                    onClick={this.copyToClipBoard}
                                    primary='Copy'
                                />
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                <Drawer anchor='right' open={toggleDrawer} onClose={this.clearAddForm} >
                    <Grid display="flex" width={isMobile ? '100vw' : "380px"} justifyContent="space-between" flexDirection="column" sx={{ height: '100%' }}>
                        <Grid container>
                            <Grid item xs={10} className={classes.drawerTitleGrid} backgroundColor="#E0E0E0">
                                <Typography style={{ size: '18px', fontWeight: '600' }}>Add a New User</Typography>
                            </Grid>
                            <Grid item xs={2} className={classes.centerGrid} backgroundColor="#E0E0E0">
                                <CustomIconButton title="Close" onClick={this.clearAddForm}>
                                    <MdClear size={'18px'} className={classes.closePopupIconAction} />
                                </CustomIconButton>
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids}>
                                <CustomInput
                                    sx={{ width: 300, margin: '15px' }}
                                    inputProps={{ maxLength: 50 }}
                                    name="email"
                                    label="Email"
                                    //placeholder="Enter the user's email address"
                                    //error={inputError.userName}
                                    variant="standard"
                                    autoComplete="off"
                                    value={newUser.email || ''}
                                    onChange={this.onInputFieldChanged}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids} >
                                <CustomInput
                                    sx={{ width: 300, margin: '15px' }}
                                    inputProps={{ maxLength: 20 }}
                                    name="firstName"
                                    label="First Name"
                                    //placeholder="Enter the user's first name"
                                    //error={inputError.userName}
                                    variant="standard"
                                    autoComplete="off"
                                    value={newUser.firstName || ''}
                                    onChange={this.onInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids} >
                                <CustomInput
                                    sx={{ width: 300, margin: '15px' }}
                                    inputProps={{ maxLength: 20 }}
                                    name="lastName"
                                    label="Last Name"
                                    //placeholder="Enter the user's last name"
                                    //error={inputError.userName}
                                    variant="standard"
                                    autoComplete="off"
                                    value={newUser.lastName || ''}
                                    onChange={this.onInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids}>
                                <DropDown
                                    sx={{ margin: '15px' }}
                                    minWidth='300px'
                                    name="typeId"
                                    label="Organization"
                                    variant="standard"
                                    keyToBind={{ key: 'typeId', value: 'userType' }}
                                    options={dropDown.roleType}
                                    value={newUser.typeId}
                                    onChange={this.onInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids}>
                                <DropDown
                                    sx={{ margin: '15px' }}
                                    minWidth='300px'
                                    name="roleId"
                                    label="Role"
                                    variant="standard"
                                    keyToBind={{ key: 'roleId', value: 'roleName' }}
                                    disabled={newUser.typeId == ''}
                                    options={newUser.roles}
                                    value={newUser.roleId}
                                    onChange={this.onInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids}>
                                <MultipleSelect {...multiSelectProps} />
                            </Grid>
                        </Grid>
                        <Grid container display="flex" justifySelf="flex-end">
                            <Divider sx={{ width: 'inherit' }} orientation="horizontal" />
                            <Grid item xs={12} className={isMobile ? classes.submitGridMobile : classes.submitGrid} gap={2} >
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    sizeValue='small'
                                    type="white"
                                    onClick={this.clearAddForm}
                                    primary='Cancel'
                                />
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    sizeValue='small'
                                    style={{ borderRadius: '20px' }}
                                    type="primary"
                                    onClick={this.createUser}
                                    primary='Create User'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Drawer>
                <Drawer anchor='right' open={toggleEditDrawer} onClose={this.clearEditForm} >
                    <Grid display="flex" width="100vw" justifyContent="space-between" flexDirection="column" sx={{ height: '100%' }}>
                        <Grid container>
                            <DrawerHeader className={classes.drawerAlign}>
                                <Typography fontWeight={600}>User Details</Typography>
                                <Tooltip title="Close" TransitionComponent={Zoom}>
                                    <IconButton onClick={this.clearEditForm}>
                                        <MdClear />
                                    </IconButton>
                                </Tooltip>
                            </DrawerHeader>
                            <Grid item xs={12} sx={{ marginTop: '15px' }} className={classes.newUserGrids}>
                                <CustomInput
                                    sx={{ width: 300, margin: '15px' }}
                                    inputProps={{ maxLength: 50 }}
                                    name="email"
                                    label="Email"
                                    //placeholder="Enter the user's first name"
                                    //error={inputError.userName}
                                    variant="standard"
                                    autoComplete="off"
                                    value={editUser.email || ''}
                                    onChange={this.onEditInputFieldChanged}
                                    onKeyDown={this.handleKeyDown}
                                />
                                {/* <Typography style={{ size: '14px', width: 300, margin: '15px' }}>{editUser.email || ''}</Typography> */}
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids} >
                                <CustomInput
                                    sx={{ width: 300, margin: '15px' }}
                                    inputProps={{ maxLength: 20 }}
                                    name="firstName"
                                    label="First Name"
                                    //placeholder="Enter the user's first name"
                                    //error={inputError.userName}
                                    variant="standard"
                                    autoComplete="off"
                                    value={editUser.firstName || ''}
                                    onChange={this.onEditInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids} >
                                <CustomInput
                                    sx={{ width: 300, margin: '15px' }}
                                    inputProps={{ maxLength: 20 }}
                                    name="lastName"
                                    label="Last Name"
                                    //placeholder="Enter the user's last name"
                                    //error={inputError.userName}
                                    variant="standard"
                                    autoComplete="off"
                                    value={editUser.lastName || ''}
                                    onChange={this.onEditInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids}>
                                <DropDown
                                    sx={{ margin: '15px' }}
                                    minWidth='300px'
                                    name="typeId"
                                    label="Organization"
                                    variant="standard"
                                    keyToBind={{ key: 'typeId', value: 'userType' }}
                                    options={dropDown.roleType}
                                    value={editUser.typeId}
                                    onChange={this.onEditInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids}>
                                <DropDown
                                    sx={{ margin: '15px' }}
                                    minWidth='300px'
                                    name="roleId"
                                    label="Role"
                                    variant="standard"
                                    keyToBind={{ key: 'roleId', value: 'roleName' }}
                                    options={editUser.roles || []}
                                    value={editUser.roleId}
                                    onChange={this.onEditInputFieldChanged}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids}>
                                <MultiSelect
                                    options={editUser.regionDropDown}
                                    initalValue={editUser.region}
                                    minWidth='300px'
                                    onChange={this.handleEditRegionChange}
                                    variant='standard'
                                    customClass={{ margin: '15px' }}
                                    textAlignLeft
                                    {...multiSelectEditProps}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.newUserGrids} sx={{ marginTop: '10px' }}>
                                <div style={{ width: '295px' }}>
                                    <Switch
                                        label={editUser.active ? 'Active' : 'Inactive'}
                                        labelColor={editUser.active ? 'green' : 'red'}
                                        onChange={this.toggleSwitch}
                                        checked={editUser.active}
                                    //customClass={{ width: '315px', height: '65px', margin: '0px 0px', padding: '0px 0px' }} 
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container display="flex" justifySelf="flex-end">
                            <Divider sx={{ width: 'inherit' }} orientation="horizontal" />
                            <Grid item xs={12} className={isMobile ? classes.submitGridMobile : classes.submitGrid} gap={3} >
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    sizeValue='small'
                                    type="white"
                                    onClick={this.clearEditForm}
                                    primary='Cancel'
                                />
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    sizeValue='small'
                                    style={{ borderRadius: '20px' }}
                                    type="primary"
                                    onClick={this.saveEditChanges}
                                    primary='Save'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Drawer>
                <Drawer anchor={isMobile ? 'bottom' : 'right'} open={toggleFilterDrawer} onClose={() => this.toggleFilterDrawer(false)} >
                    <Grid display="flex" sx={{ height: windowHeight }} width={isMobile ? '100vw' : "380px"} justifyContent="space-between" flexDirection="column">
                        <Grid container>
                            <DrawerHeader className={classes.drawerAlign}>
                                <Typography fontWeight={600}>Filters</Typography>
                                <Tooltip title="Close" TransitionComponent={Zoom}>
                                    <IconButton onClick={() => this.toggleFilterDrawer(false)}>
                                        <MdClear />
                                    </IconButton>
                                </Tooltip>
                            </DrawerHeader>

                            {/* Below Filters are for desktop screen */}
                            <Grid item xs={12} display={{ xs: 'none', sm: 'flex' }} className={classes.newUserGrids} >
                                <DropDown
                                    sx={{ margin: '25px 15px 15px 15px' }}
                                    minWidth={isMobile ? '330px' : '300px'}
                                    name="typeId"
                                    label="Organization"
                                    variant="standard"
                                    keyToBind={{ key: 'typeId', value: 'userType' }}
                                    options={dropDown.roleType}
                                    value={filterOptions.typeId}
                                    onChange={this.onFilterInputChanged}
                                />
                            </Grid>
                            <Grid item xs={12} display={{ xs: 'none', sm: 'flex' }} className={classes.newUserGrids} >
                                <DropDown
                                    sx={{ margin: '15px' }}
                                    minWidth={isMobile ? '330px' : '300px'}
                                    name="roleId"
                                    label="Role"
                                    variant="standard"
                                    disabled={filterOptions.typeId == 0}
                                    keyToBind={{ key: 'roleId', value: 'roleName' }}
                                    options={role}
                                    value={filterOptions.roleId}
                                    onChange={this.onFilterInputChanged}
                                />
                            </Grid>
                            <Grid item xs={12} display={{ xs: 'none', sm: 'flex' }} className={classes.newUserGrids} >
                                <DropDown
                                    sx={{ margin: '15px' }}
                                    minWidth={isMobile ? '330px' : '300px'}
                                    name="regionId"
                                    label="Region"
                                    variant="standard"
                                    keyToBind={{ key: 'id', value: 'regionType' }}
                                    options={dropDown.region}
                                    value={filterOptions.regionId}
                                    onChange={this.onFilterInputChanged}
                                />
                            </Grid>
                            <Grid item xs={12} display={{ xs: 'none', sm: 'flex' }} className={classes.newUserGrids} sx={{ marginTop: '10px' }}>
                                <div style={{ width: '300px' }} className={classes.editSwitchGrid} >
                                    <Switch
                                        label={filterOptions.isActive ? 'Active' : 'Inactive'}
                                        labelColor={filterOptions.isActive ? 'green' : 'red'}
                                        onChange={this.toggleSwitchFilter}
                                        checked={filterOptions.isActive}
                                    //customClass={{ width: '315px', height: '65px', margin: '0px 0px', padding: '0px 0px' }} 
                                    />
                                </div>
                            </Grid>

                            {/* Below Filters are for mobile screen */}
                            <Grid item container display={{ xs: 'flex', sm: 'none' }} gap={3} style={{ padding: "20px" }}>
                                <Grid item container gap={1}>
                                    <Typography>Organization:</Typography>
                                    <DropDown
                                        //sx={{ margin: '25px 15px 15px 15px' }}
                                        //minWidth={isMobile ? '330px' : '300px'}
                                        name="typeId"
                                        //label="Organization"
                                        variant="standard"
                                        keyToBind={{ key: 'typeId', value: 'userType' }}
                                        options={dropDown.roleType}
                                        value={filterOptions.typeId}
                                        onChange={this.onFilterInputChanged}
                                        formControlStyle={{ marginTop: '1px' }}
                                        formStyle={{ margin: "0px" }}
                                    />
                                </Grid>
                                <Grid item container display={{ xs: 'flex', sm: 'none' }} gap={1}>
                                    <Typography>Role:</Typography>
                                    <DropDown
                                        // sx={{ margin: '15px' }}
                                        // minWidth={isMobile ? '330px' : '300px'}
                                        name="roleId"
                                        // label="Role"
                                        variant="standard"
                                        disabled={filterOptions.typeId == 0}
                                        keyToBind={{ key: 'roleId', value: 'roleName' }}
                                        options={role}
                                        value={filterOptions.roleId}
                                        onChange={this.onFilterInputChanged}
                                        formControlStyle={{ marginTop: '1px' }}
                                        formStyle={{ margin: "0px" }}
                                    />
                                </Grid>
                                <Grid item container display={{ xs: 'flex', sm: 'none' }} gap={1}>
                                    <Typography>Region:</Typography>
                                    <DropDown
                                        // sx={{ margin: '15px' }}
                                        // minWidth={isMobile ? '330px' : '300px'}
                                        name="regionId"
                                        // label="Region"
                                        variant="standard"
                                        keyToBind={{ key: 'id', value: 'regionType' }}
                                        options={dropDown.region}
                                        value={filterOptions.regionId}
                                        onChange={this.onFilterInputChanged}
                                        formControlStyle={{ marginTop: '1px' }}
                                        formStyle={{ margin: "0px" }}
                                    />
                                </Grid>
                                <Grid item xs={12} display={{ xs: 'flex', sm: 'none' }} className={classes.editSwitchGrid} sx={{ marginTop: '10px' }}>
                                    <div style={{ width: '300px' }} className={classes.editSwitchGrid} >
                                        <Switch
                                            label={filterOptions.isActive ? 'Active' : 'Inactive'}
                                            labelColor={filterOptions.isActive ? 'green' : 'red'}
                                            onChange={this.toggleSwitchFilter}
                                            checked={filterOptions.isActive}
                                        //customClass={{ width: '315px', height: '65px', margin: '0px 0px', padding: '0px 0px' }} 
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container display="flex" justifySelf="flex-end">
                            <Divider sx={{ width: 'inherit' }} orientation="horizontal" />
                            <Grid item xs={12} className={isMobile ? classes.submitGridMobile : classes.submitGrid} gap={4} >
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    sizeValue='small'
                                    type="white"
                                    onClick={this.clearFilters}
                                    primary='Clear'
                                />
                                <CustomButton
                                    className={classes.actionButtonsNewUser}
                                    sizeValue='small'
                                    style={{ borderRadius: '20px' }}
                                    type="primary"
                                    onClick={this.applyFilters}
                                    primary='Apply'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Drawer>
                <Grid container sx={{ backgroundColor: '#f6f6f6' }}>
                    {/* Action Tab below */}
                    <Grid item xs={12} className={isMobile ? classes.actionTabMobile : classes.actionTab}>
                        <Grid container className={classes.actionTabGrid}>
                            <Grid item xs={12} height={isMobile ? '50px' : '60px'} sx={{ alignItems: 'center', display: "flex" }}>
                                <Typography style={{ fontSize: '22px', fontWeight: 600, marginLeft: isMobile ? '20px' : '38px' }} className={classes.userAccessText}> User Access </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} display={{ xs: 'none', sm: 'flex' }} className={isMobile ? classes.height50 : classes.height60}>
                                <SearchBar
                                    className={classes.marginLeft38}
                                    width={354}
                                    height={30}
                                    placeholder="Search for a user/email id"
                                    value={searchText}
                                    onChange={this.onSearchInput}
                                    disableSearchButton
                                    onClear={this.onClearText}
                                />
                            </Grid>
                            <Grid item display={{ xs: 'none', sm: 'flex' }} sm={6} className={classes.flexEndGrid} gap={2}>
                                <CustomButton
                                    className={classes.actionButtons}
                                    sizeValue='small'
                                    style={{ borderRadius: '20px' }}
                                    type="primary"
                                    onClick={this.addNewUser}
                                    primary='New User'
                                    startIcon={<AiOutlinePlus />}
                                />
                                <CustomButton
                                    className={classes.actionButtons}
                                    sizeValue='small'
                                    type="white"
                                    onClick={this.handleMenuClick}
                                    primary='Filter'
                                    startIcon={<FiFilter />}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item display={{ xs: 'flex', sm: 'none' }} xs={12} className={isMobile ? classes.searchGrid : classes.flexEndGrid} gap={2}>
                        <SearchBar
                            className={!isMobile ? classes.marginLeft38 : ''}
                            width={!isMobile ? 310 : 600}
                            fullWidth={isMobile ? true : false}
                            height={30}
                            placeholder="Search for a user/email id"
                            value={searchText}
                            onChange={this.onSearchInput}
                            disableSearchButton
                            onClear={this.onClearText}
                        />
                        <IconButton aria-label="delete" variant="contained" size="large" onClick={this.handleMenuClick} disableRipple>
                            <RiFilter2Fill fontSize="inherit" />
                        </IconButton>
                    </Grid>
                    {/* Table below */}
                    <Grid sx={{ display: { xs: 'none', sm: 'flex', minHeight: 'calc(100vh - 170px )' } }} item xs={12} padding="20px 30px" className={classes.flexStartGrid}>
                        <ReactVirtualizedTable
                            id="repoTable"
                            height='calc(100vh - 240px)'
                            header={USERS_HEADER}
                            order={order}
                            zeroPadding
                            customHeight='calc(100vh-170px)'
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}>
                            {isLoading ? <SkeletonComponent columns={USERS_HEADER} /> :
                                userDetails && dropDown &&
                                stableSort(userDetails, getComparator(order, orderBy))
                                    .map((list, i) => (
                                        <Row
                                            key={list.emailId}
                                            row={list}
                                            onClickEdit={this.editUserData}
                                            onResetClick={this.resetClick}
                                            {...rowProps} />
                                    ))}
                        </ReactVirtualizedTable>
                    </Grid>
                    <Grid container ref={this.cardsRef} className={classes.mobileGrid} sx={{
                        display: { xs: 'flex', sm: 'none' }, overflowY: "scroll",
                        scrollSnapType: "y mandatory", height: `${windowHeight - this.cardsRef?.current?.offsetTop}px`
                    }}>
                        {isLoading ? <MobileCardSkeleton rows={6} /> :
                            <>
                                {userDetails.length > 0 ?
                                    userDetails.map((e) => (
                                        <UserCardMobile details={e} onClickReset={this.resetClick} onClickEdit={() => this.editUser(e)} />
                                    )) :
                                    <NoDataFound />
                                }
                                <FloatingButton
                                    bottom='30px'
                                    onClick={this.addNewUser}
                                    right='20px'
                                    color='primary'
                                    icon={<AiOutlinePlus fontSize={25} />}
                                />
                            </>
                        }
                    </Grid>
                </Grid>
            </React.Fragment >
        );
    }
}

UserAccess.propTypes = {
    classes: PropTypes.object
};

const mapStateToProps = state => {
    const { users, dropdownData } = state.customerPortal;
    return {
        allUsers: users,
        dropdownData
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
        name: 'UserAccess'
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
)(React.memo(UserAccess));

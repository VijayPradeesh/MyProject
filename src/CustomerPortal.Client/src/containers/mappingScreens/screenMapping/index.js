import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles, styled } from '@mui/styles';
import { AiOutlinePlus } from "react-icons/ai";
import { BsExclamationCircle } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Grid, InputAdornment, Chip, CircularProgress, Paper, TextField, Skeleton, Checkbox, Divider, AccordionSummary, Zoom, Menu, MenuItem, Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography, Drawer, Tooltip, TableRow, TableCell } from '@mui/material';
import { withRouter } from '../../../components/withRouter';
import * as notifications from '../../../store/notifyActions';
import CustomIconButton from '../../../components/iconButton';
import { withMediaQuery } from '../../../components/withMediaQuery';
import CustomButton from '../../../components/button';
import SearchBar from '../../../components/searchBar';
import { randomNumber, Loader, MobileCardSkeleton } from '../../../services/helpers';
import * as customerPortalActions from '../../../store/actions';
import styles from './styles';
import Footer from '../../../components/footer';
import RadioGroup from '../../../components/radioGroup';
import { borderRadius } from '@mui/system';
import ConfirmDialog from '../../../components/confirmDialog';


const StyledContainer = withStyles({
    containerTitle: {
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#c4c4c4',
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px'
    }
})(props => {
    const { classes, searchText, onClearText, onSearchInput, name, onChangeInput, onClearNewData, newData, onAddNewData } = props;
    const childHeightValue = newData ? 110 : 70;
    return (
        <React.Fragment>
            <Grid container height="100%" direction='column' style={{ padding: "10px" }}>
                <Grid item className={classes.containerTitle}>
                    <Typography fontSize='18px'>{props?.title}</Typography>
                </Grid>
                <Divider sx={{ width: 'inherit', mb: 0.5 }} orientation="horizontal" />
                <Grid container style={{ height: `calc(100% - ${47}px)`, background: "#c4c4c4", borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}>
                    <Grid item xs={12} sx={{ display: 'flex', padding: '10px 10px', maxHeight: '55px' }}>
                        <SearchBar
                            className={classes.marginLeft38}
                            width={'100%'}
                            name={name}
                            height={30}
                            placeholder={`Search ${name}`}
                            value={searchText}
                            onChange={onSearchInput}
                            disableSearchButton
                            onClear={onClearText}
                        />
                    </Grid>
                    <Grid item backgroundColor='#eeeeee' style={{ height: `calc(100% - ${childHeightValue}px)`, width: '100%' }} margin='0px 10px' borderRadius='10px'>
                        {props?.children}
                    </Grid>
                    {newData &&
                        <Grid container xs={12} sx={{ display: 'flex', padding: '10px 0px', maxHeight: '55px' }}>
                            <AddNewField
                                name={name}
                                newInput={newData?.[name]}
                                onChangeInput={onChangeInput}
                                onClearText={onClearNewData}
                                addNewItem={onAddNewData}
                            />
                        </Grid>
                    }
                </Grid>
            </Grid >
        </React.Fragment >
    );
});

const AddNewField = withStyles({
    containerTitle: {
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})(props => {
    const { classes, name, newInput, onChangeInput, onClearText, addNewItem } = props;
    return (
        <React.Fragment>
            <Grid container sx={{ padding: '0px 10px' }} gap={1}>
                <Grid item xs={9.7}>
                    <SearchBar
                        className={classes.marginLeft38}
                        sx={{ borderRadius: '0' }}
                        name={name}
                        height={27}
                        placeholder={`Add ${name}`}
                        value={newInput}
                        onChange={onChangeInput}
                        disableSearchButton
                        hideSearchIcon
                        onClear={onClearText}
                    />
                </Grid>
                <Grid item xs={2}>
                    <CustomButton
                        fullWidth
                        sizeValue='small'
                        name={name}
                        type="primary"
                        style={{ borderRadius: '20px' }}
                        onClick={addNewItem}
                        primary='Add'
                    //startIcon={<AiOutlinePlus />}
                    />
                </Grid>
            </Grid>
        </React.Fragment >
    );
});

const CheckBoxMenu = withStyles({
    root: {
        flex: 1
    },
    closePopupIconAction: {
        cursor: 'pointer',
        color: '#000000',
        borderRadius: '10px',
        transition: '0.15s',
    },
    closePopupIconDisabled: {
        cursor: 'pointer',
        borderRadius: '10px',
        transition: '0.15s',
    },
})(props => {
    const { classes, onChange, onExpand, disabled, rowVal, keyToBind, highlight, errorInfo, errorInfoToolTipTitle } = props;
    return (
        <React.Fragment>
            <Grid container width='100%' justifyContent='space-between' backgroundColor={highlight == rowVal?.[keyToBind.key] ? '#dddccc' : null}>
                <Grid item display='flex' alignItems='center' justifyContent='center'>
                    <Checkbox
                        name={rowVal?.[keyToBind.value]}
                        checked={rowVal?.[keyToBind.checked]}
                        onChange={onChange}
                        disabled={disabled || false}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <label>{rowVal?.[keyToBind.value]}</label>
                </Grid>
                {rowVal?.[keyToBind.checked] && onExpand &&
                    <Grid item display='flex' alignItems='center' justifyContent='center' disabled={!rowVal?.[keyToBind.checked]}>
                        {errorInfo &&
                            <CustomIconButton title={errorInfoToolTipTitle} disabled={!rowVal?.[keyToBind.checked]}>
                                <BsExclamationCircle size={'18px'} color='red' />
                            </CustomIconButton>
                        }
                        <CustomIconButton onClick={onExpand} disabled={!rowVal?.[keyToBind.checked]}>
                            <MdOutlineKeyboardArrowRight size={'18px'} className={rowVal?.[keyToBind.checked] ? classes.closePopupIconAction : classes.closePopupIconDisabled} />
                        </CustomIconButton>
                    </Grid>
                }
            </Grid>
        </React.Fragment>
    )
});



class Mapping extends Component {
    state = {
        searchText: {
            company: '',
            role: '',
            screen: ''
        },
        newData: {
            company: '',
            screen: ''
        },
        companies: [],
        filteredCompany: [],
        selectedCompany: '',
        roles: [],
        filteredRoles: [],
        screens: [],
        filteredScreens: [],
        expanded: false,
        selectedRole: '',
        loader: {
            company: false,
            role: false,
            screen: false
        },
        confirmRoleDialog: false,
        roleConfirmId: '',
    };

    componentDidMount() {
        this.init();
    };

    init() {
        this.fetchDetails();
    };

    //initial fetch API for company data
    fetchDetails = () => {
        this.toggleLoader('company', true);
        // A flag true is passed to company to filter out Mears from the list of companies
        this.props.getOrganizations(true).then((response) => {
            this.setState({
                filteredCompany: this.props.companies
            }, () => {
                this.toggleLoader('company', false);
            });
        });
    };

    //loader state management for individual sections
    toggleLoader = (name, value) => {
        this.setState(prevState => ({ loader: { ...prevState.loader, [name]: value } }));
    };

    //search text for individual sections
    onSearchText = (evt, keyToBind) => {
        const name = evt.target.name;
        const value = evt.target.value;
        this.setState(prevState => ({ searchText: { ...prevState.searchText, [name]: value } }));
        if (keyToBind.value == 'organization') {
            const searchFilterOrg = this.props.companies?.filter((item) =>
                item[keyToBind.value].toLowerCase().includes(value.toLowerCase())
            );
            this.setState({
                filteredCompany: searchFilterOrg
            });
        }
        if (keyToBind.value == 'role') {
            const searchFilterRole = this.state.roles?.filter((item) =>
                item[keyToBind.value].toLowerCase().includes(value.toLowerCase())
            );
            this.setState({
                filteredRoles: searchFilterRole,
            });
        }
        if (keyToBind.value == 'screen') {
            const searchFilterscreen = this.state.screens?.filter((item) =>
                item[keyToBind.value].toLowerCase().includes(value.toLowerCase())
            );
            this.setState({
                filteredScreens: searchFilterscreen,
            });
        }
    };

    //triggered when search text is cleared 
    onClearText = (name) => {
        this.setState(prevState => ({ searchText: { ...prevState.searchText, [name]: '' } }));
        if (name == 'company') {
            this.setState({
                filteredCompany: this.props.companies,
            });
        }
        if (name == 'role') {
            this.setState({
                filteredRoles: this.state.roles
            });
        }
        if (name == 'screen') {
            this.setState({
                filteredScreens: this.state.screens
            });
        }

    };

    removeRole = (props) => {
        const { id, selectedRole, keyToBind } = props;
        const searchRole = this.state.roles?.find((item) =>
            item[keyToBind.key] == id
        );
        if (id == selectedRole) {
            this.setState({
                filteredScreens: [],
                screens: [],
                selectedRole: ''
            });
        };

        const updatedItems = this.state.filteredRoles?.map((item) => {
            if (item[keyToBind.key] === id) {
                return { ...item, [keyToBind.checked]: false };
            } else {
                return item;
            }
        });
        const updatedGlobalItems = this.state.roles?.map((item) => {
            if (item[keyToBind.key] === id) {
                return { ...item, [keyToBind.checked]: false };
            } else {
                return item;
            }
        });
        this.setState({
            filteredRoles: updatedItems,
            roles: updatedGlobalItems
        });
        this.saveRole(id, false);
    };

    saveScreen = (name, checked) => {
        const customerId = parseInt(this.state.selectedCompany);
        const bodyParameters = {
            customerId: customerId,
            roleId: this.state.selectedRole,
            isChecked: checked,
            screenId: name
        };
        console.log("Body params region: ", bodyParameters);
        this.props.saveScreenForRole(bodyParameters).then((res) => {
            this.props.addNotification({ message: res.data.message, type: 'success' });
        });
    };

    //triggered on check and uncheck of role
    onChangeRole = (evt, ele, keyToBind) => {
        const name = evt.target.name;
        const roleId = ele[keyToBind.key];
        this.setState({ roleConfirmId: roleId });
        const selectedRole = this.state.selectedRole;
        const checked = evt.target.checked;
        if (checked === false) {
            //checkbox to validate the uncheck of role
            this.toggleRoleDialog(true);
        } else {
            // condition when checked
            const updatedItems = this.state.filteredRoles?.map((item) => {
                if (item[keyToBind.value] === name) {
                    return {
                        ...item,
                        [keyToBind.checked]: checked,
                        [keyToBind.screenAssigned]: false
                    };
                } else {
                    return item;
                }
            });
            const updatedGlobalItems = this.state.roles?.map((item) => {
                if (item[keyToBind.value] === name) {
                    return {
                        ...item,
                        [keyToBind.checked]: checked,
                        [keyToBind.screenAssigned]: false
                    };
                } else {
                    return item;
                }
            });
            this.setState({
                filteredRoles: updatedItems,
                roles: updatedGlobalItems
            });
            // save API here
            this.saveRole(roleId, checked);
        }
    };

    //saveRole API
    saveRole = (roleId, isChecked) => {
        const customerId = parseInt(this.state.selectedCompany)
        const bodyParameters = {
            customerId,
            roleId,
            isChecked
        };
        this.props.saveRoleForCompany(bodyParameters).then((res) => {
            if (res.status == 200) {
                this.props.addNotification({ message: res.data.message, type: 'success' });
            }
        }).catch(error => {
            this.props.addNotification({ message: error.data.message, type: 'error' });
        });
    };
    //triggered on check and uncheck of screen
    onChangeScreen = (evt, keyToBind, keyToBindRoles) => {
        const name = evt.target.name;
        const checked = evt.target.checked;
        const count = this.state.screens.reduce((acc, obj) => obj[keyToBind.checked] ? acc + 1 : acc, 0);
        if (count < 2 && checked == false) {
            this.props.addNotification({ message: `At least one screen checkbox must be selected`, type: 'error' });
            return;
        }

        //disable screen mapping uncheck option for mears admin
        let selectedCompanyObj = this.props.companies?.find(ele => ele.id == parseInt(this.state.selectedCompany));
        let selectedRoleObj = this.state.roles?.find(ele => ele.id == this.state.selectedRole)
        if (selectedCompanyObj?.organization == 'Mears' && selectedRoleObj?.role == 'Admin' && checked == false && name == 'Screen Mapping') {
            this.props.addNotification({ message: `Screen mapping cannot be disabled for this company and role combination`, type: 'error' });
            return;
        }
        //if count of screen is > 0 remove the error icon from the role 
        const updatedItems = this.state.filteredScreens?.map((item) => {
            if (item[keyToBind.value].toLowerCase() === 'no region') {
                return { ...item, [keyToBind.checked]: false };
            } else if (item[keyToBind.value] === name) {
                return { ...item, [keyToBind.checked]: checked };
            } else {
                return item;
            }
        });
        const updatedGlobalItems = this.state.screens?.map((item) => {
            if (item[keyToBind.value].toLowerCase() === 'no region') {
                return { ...item, [keyToBind.checked]: false };
            } else if (item[keyToBind.value] === name) {
                return { ...item, [keyToBind.checked]: checked };
            } else {
                return item;
            }
        });
        this.setState({
            filteredScreens: updatedItems,
            screens: updatedGlobalItems
        }, () => {
            const count = this.state.screens.reduce((acc, obj) => obj[keyToBind.checked] ? acc + 1 : acc, 0);
            this.updateRolesAfterScreenChange(count, keyToBindRoles);
        })
        //save API condition here
        const id = this.state.screens.find((ele) => ele[keyToBind.value] == name)[keyToBind.key];
        this.saveScreen(id, checked)
    };

    updateRolesAfterScreenChange = (count, keyToBindRoles) => {
        if (count > 0) {
            const roleId = this.state.selectedRole;
            const id = this.state.roles.find((ele) => ele[keyToBindRoles.key] == roleId)[keyToBindRoles.key];
            const updatedItems = this.state.filteredRoles?.map((item) => {
                if (item[keyToBindRoles.key] === id) {
                    return {
                        ...item,
                        [keyToBindRoles.screenAssigned]: true
                    };
                } else {
                    return item;
                }
            });
            const updatedGlobalItems = this.state.roles?.map((item) => {
                if (item[keyToBindRoles.key] === id) {
                    return {
                        ...item,
                        [keyToBindRoles.screenAssigned]: true
                    };
                } else {
                    return item;
                }
            });
            this.setState({
                filteredRoles: updatedItems,
                roles: updatedGlobalItems
            });
        }
    }
    //populate screens fn is called when clicked on the arrow on the roles section
    populateScreens = (ele, keyToBind) => {
        this.toggleLoader('screen', true);
        this.setState({
            selectedRole: ele[keyToBind.key]
        }, () => {
            const bodyParameters = {
                roleId: this.state.selectedRole,
                organizationId: this.state.selectedCompany
            }
            this.props.getAllScreensForContract(bodyParameters).then((res) => {
                if (res) {
                    this.setState({
                        screens: res.data || [],
                        filteredScreens: res.data || []
                    }, () => {
                        this.toggleLoader('screen', false);
                    });
                }
            });
        });
        this.setState(prevState => ({
            searchText: {
                ...prevState.searchText,
                screen: ''
            }
        }));
    };

    //input field state updation for new data
    onChangeNewData = evt => {
        const name = evt.target.name;
        const value = evt.target.value;
        this.setState(prevState => ({ newData: { ...prevState.newData, [name]: value } }));
    };

    //new Data api call
    addNewData = (name) => {
        const newData = this.state.newData[name];
        let tempName = name == 'company' ? 'organization' : name;
        const bodyParameters = {
            value: newData,
            flag: tempName,
            type: "",
            description: ""
        }
        this.props.addNewData(bodyParameters).then(res => {
            if (res.status == 200) {
                this.props.addNotification({ message: res.data.message, type: 'success' });
                this.setState(prevState => ({ newData: { ...prevState.newData, [name]: '' } }));
                const num = randomNumber(1, 9999);
                // This is to set the state for the new added items so refreshing of page is not required to fetch latest data
                if (name == 'company') {
                    const newObj = { id: num, company: newData }
                    this.fetchDetails();
                }
                if (name == 'role') {
                    this.fetchRoles();
                }
            }
        }).catch(error => {
            this.props.addNotification({ message: error?.response?.data?.message, type: 'error' });
        })

    };

    fetchRoles = () => {
        const company = this.state.selectedCompany;
        this.toggleLoader('role', true);
        this.props.getRolesFromId(this.state.selectedCompany).then((res) => {
            this.setState({
                roles: res?.data,
                filteredRoles: res?.data,
                filteredScreens: [],
                screens: [],
                selectedRole: ''
            }, () => {
                this.toggleLoader('role', false);
            });
        });
    };

    //triggered for checkboxes in company section
    changeCompany = evt => {
        this.setState({ selectedCompany: evt.target.value }, () => {
            this.fetchRoles();
        });
        this.setState(prevState => ({
            searchText: {
                ...prevState.searchText,
                role: '',
                screen: ''
            }
        }));
    };

    //triggered when new data in individual section is cleared 
    onClearNewData = (name) => {
        this.setState(prevState => ({ newData: { ...prevState.newData, [name]: '' } }));
    };

    toggleRoleDialog = (value) => {
        this.setState({ confirmRoleDialog: value });
    };

    confirmRoleDialog = (keyToBind) => {
        const id = this.state.roleConfirmId;
        const selectedRole = this.state.selectedRole;
        const removeRoleProps = {
            id,
            selectedRole,
            keyToBind
        };
        this.removeRole(removeRoleProps);
        this.setState({ confirmRoleDialog: false })
    };

    render() {
        const { classes, navigate, isMobile } = this.props;
        const { searchText, newData, selectedCompany, filteredCompany, filteredRoles, roles, screens, filteredScreens, selectedRole, loader, confirmRoleDialog } = this.state;
        const keyToBindRoles = { key: 'id', value: 'role', checked: 'assigned', screenAssigned: 'isScreensAssigned' };
        const keyToBindScreens = { key: 'screenId', value: 'screen', checked: 'assigned' };
        return (
            <React.Fragment>
                <ConfirmDialog
                    open={confirmRoleDialog}
                    onConfirm={() => this.confirmRoleDialog(keyToBindRoles)}
                    onCancel={() => this.toggleRoleDialog(false)}
                    confirmationMessage='Remove role from company?'
                    note='Removing the role will also remove its screen binding and the users mapped to this role will be unable to login' />
                <Grid container sx={{ backgroundColor: '#f6f6f6' }}>
                    {/* Action Tab below */}
                    <Grid item xs={12} className={classes.actionTab}>
                        <Typography style={{ fontSize: '22px', fontWeight: 600, marginLeft: '38px' }} className={classes.actionTabText}>  Screen Mapping  </Typography>
                    </Grid>
                    {/* Desktop UI*/}
                    <Grid container sx={{ display: { height: 'calc(100vh - 110px )' } }} padding="20px ">
                        <Grid item sm={4} xs={12} height='100%' borderRadius="10px">
                            <StyledContainer
                                title="Company"
                                searchText={searchText.company}
                                name='company'
                                onClearText={() => this.onClearText('company')}
                                onSearchInput={e => this.onSearchText(e, { key: 'id', value: 'organization' })}
                                newData={newData}
                                onChangeInput={this.onChangeNewData}
                                onClearNewData={() => this.onClearNewData('company')}
                                onAddNewData={() => this.addNewData('company')}
                            >
                                {
                                    loader.company ?
                                        <MobileCardSkeleton rows={10} borderRadius='10px' /> :
                                        <div width='100%' style={{ height: `100%`, padding: '0px 10px', overflowY: 'scroll' }}>
                                            {filteredCompany?.length > 0 ?
                                                <RadioGroup
                                                    value={selectedCompany}
                                                    options={filteredCompany}
                                                    keyToBind={{ key: 'id', value: 'organization' }}
                                                    handleChange={this.changeCompany}
                                                /> :
                                                <Typography align='flex-start' style={{ padding: '10px' }}> No data found </Typography>}
                                        </div>
                                }
                            </StyledContainer>
                        </Grid>
                        <Grid item sm={4} xs={12} height='100%' borderRadius="10px">
                            <StyledContainer
                                title="Role"
                                searchText={searchText.role}
                                name='role'
                                onClearText={() => this.onClearText('role')}
                                onSearchInput={e => this.onSearchText(e, { key: 'id', value: 'role' })}
                                newData={newData}
                                onChangeInput={this.onChangeNewData}
                                onClearNewData={() => this.onClearNewData('role')}
                                onAddNewData={() => this.addNewData('role')}
                            >
                                {
                                    loader.role ?
                                        <MobileCardSkeleton rows={10} borderRadius='10px' /> :
                                        <div width='100%' style={{ height: `95%`, padding: '0px 0px 5px', overflowY: 'scroll' }}>
                                            {selectedCompany && filteredRoles?.length > 0 ? filteredRoles.map((ele) => (
                                                <CheckBoxMenu
                                                    errorInfo={!ele[keyToBindRoles.screenAssigned]}
                                                    onChange={e => this.onChangeRole(e, ele, keyToBindRoles)}
                                                    highlight={this.state.selectedRole}
                                                    onExpand={() => this.populateScreens(ele, keyToBindRoles)}
                                                    rowVal={ele}
                                                    keyToBind={keyToBindRoles}
                                                    errorInfoToolTipTitle="No screen is assigned to this role"
                                                />
                                            )) : selectedCompany ? <Typography align='flex-start' style={{ padding: '10px' }}> No data found </Typography> : <Typography align='flex-start' style={{ padding: '10px' }}> Select a company </Typography>
                                            }
                                        </div>
                                }
                            </StyledContainer>
                        </Grid>
                        <Grid item sm={4} xs={12} height='100%' borderRadius="10px">
                            <StyledContainer
                                title="Screen"
                                searchText={searchText.screen}
                                name='screen'
                                onClearText={() => this.onClearText('screen')}
                                onSearchInput={e => this.onSearchText(e, { key: 'id', value: 'screen' })}
                            >
                                {
                                    loader.screen ?
                                        <MobileCardSkeleton rows={10} borderRadius='10px' /> :
                                        <div width='100%' style={{ height: `95%`, padding: '0px 10px 5px', overflowY: 'scroll' }}>
                                            {selectedRole && filteredScreens?.length > 0 ? filteredScreens.map((ele) => (
                                                <CheckBoxMenu onChange={e => this.onChangeScreen(e, keyToBindScreens, keyToBindRoles)} rowVal={ele} keyToBind={keyToBindScreens} />
                                            )) :
                                                selectedRole ? <Typography align='flex-start' style={{ padding: '10px' }}> No data found </Typography>
                                                    : <Typography align='flex-start' style={{ padding: '10px' }}> Select a role </Typography>}
                                        </div>
                                }
                            </StyledContainer>
                        </Grid>
                    </Grid>
                    {/* Save button for overall save */}
                    {/* <Grid container>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', margin: '0px 20px' }}>
                            <CustomButton
                                sizeValue='small'
                                type="primary"
                                style={{ borderRadius: '20px' }}
                                onClick={this.saveMappingData}
                                primary='Save'
                            //startIcon={<AiOutlinePlus />}
                            />
                        </Grid>
                    </Grid> */}
                </Grid >
            </React.Fragment >
        );
    }
}

Mapping.propTypes = {

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
        name: 'Reports'
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
)(Mapping);
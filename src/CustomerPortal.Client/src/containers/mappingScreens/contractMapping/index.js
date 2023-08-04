import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles, styled } from '@mui/styles';
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Grid, InputAdornment, CircularProgress, Paper, TextField, Skeleton, Checkbox, Divider, AccordionSummary, Zoom, Menu, MenuItem, Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography, Drawer, Tooltip, TableRow, TableCell } from '@mui/material';
import { withRouter } from '../../../components/withRouter';
import * as notifications from '../../../store/notifyActions';
import CustomIconButton from '../../../components/iconButton';
import { withMediaQuery } from '../../../components/withMediaQuery';
import CustomButton from '../../../components/button';
import SearchBar from '../../../components/searchBar';
import { randomNumber, Loader, MobileCardSkeleton, capitalizeFirstLowercaseRest } from '../../../services/helpers';
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
    const { classes, searchText, onClearText, maxLength, description, onSearchInput, name, onChangeInput, onClearNewData, newData, onAddNewData, onClearNewDescription } = props;
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
                    <Grid item backgroundColor='#eeeeee' style={{ height: `calc(100% - ${childHeightValue}px)`, width: '100%' }} margin='0px 10px' borderRadius='5px'>
                        {props?.children}
                    </Grid>
                    {newData &&
                        <Grid container xs={12} sx={{ display: 'flex', padding: '10px 0px', maxHeight: '55px' }}>
                            <AddNewField
                                name={name}
                                description={description}
                                newInput={newData?.[name]}
                                newInputDescription={newData?.[description]}
                                onChangeInput={onChangeInput}
                                onClearText={onClearNewData}
                                onClearDescription={onClearNewDescription}
                                addNewItem={onAddNewData}
                                maxLength={maxLength}
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
    const { classes, name, newInput, newInputDescription, onChangeInput, onClearText, onClearDescription, addNewItem, description, maxLength } = props;
    const placeHolderText = capitalizeFirstLowercaseRest(name)
    return (
        <React.Fragment>
            <Grid container sx={{ padding: '0px 10px' }} gap={1}>
                <Grid item xs={description ? 3 : 9.7}>
                    <SearchBar
                        className={classes.marginLeft38}
                        sx={{ borderRadius: '0' }}
                        name={name}
                        maxLength={maxLength}
                        height={27}
                        placeholder={`Add ${name}`}
                        value={newInput}
                        onChange={onChangeInput}
                        disableSearchButton
                        hideSearchIcon
                        onClear={onClearText}
                    />
                </Grid>
                {description && <Grid item xs={6.5}>
                    <SearchBar
                        className={classes.marginLeft38}
                        sx={{ borderRadius: '0' }}
                        name={description}
                        maxLength='20'
                        height={27}
                        placeholder={`Add ${description}`}
                        value={newInputDescription}
                        onChange={onChangeInput}
                        disableSearchButton
                        hideSearchIcon
                        onClear={onClearDescription}
                    />
                </Grid>}
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
    const { classes, onChange, onExpand, rowVal, keyToBind, highlight } = props;
    return (
        <React.Fragment>
            <Grid container width='100%' justifyContent='space-between' backgroundColor={highlight == rowVal?.[keyToBind.value] ? '#dddccc' : null}>
                <Grid item display='flex' alignItems='center' justifyContent='center'>
                    <Checkbox
                        name={rowVal?.[keyToBind.value]}
                        checked={rowVal?.[keyToBind.checked]}
                        onChange={onChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <label>{rowVal?.[keyToBind.value]}</label>
                </Grid>
                {rowVal?.[keyToBind.checked] && onExpand &&
                    <Grid item display='flex' alignItems='center' justifyContent='center' disabled={!rowVal?.[keyToBind.checked]}>
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
            contract: '',
            region: ''
        },
        newData: {
            company: '',
            region: '',
            description: ''
        },
        organizations: [],
        filteredOrg: [],
        selectedOrganization: '',
        contracts: [],
        filteredContract: [],
        regions: [],
        filteredRegions: [],
        expanded: false,
        selectedContract: '',
        loader: {
            company: false,
            contract: false,
            region: false
        },
        confirmContractDialog: false,
        contractConfirmEventName: ''
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
        // A flag flase is passed to company to filter out Mears from the list of organizations
        this.props.getOrganizations(false).then((response) => {
            this.setState({
                filteredOrg: this.props.organizations
            }, () => {
                this.setState({ organizations: this.props.organizations })
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
            const searchFilterOrg = this.state.organizations?.filter((item) =>
                item[keyToBind.value].toLowerCase().includes(value.toLowerCase())
            );
            this.setState({
                filteredOrg: searchFilterOrg
            });
        }
        if (keyToBind.value == 'contract') {
            const searchFilterContract = this.state.contracts?.filter((item) =>
                item[keyToBind.value].toLowerCase().includes(value.toLowerCase())
            );
            this.setState({
                filteredContract: searchFilterContract,
            });
        }
        if (keyToBind.value == 'region') {
            const searchFilterRegion = this.state.regions?.filter((item) =>
                item[keyToBind.value].toLowerCase().includes(value.toLowerCase())
            );
            this.setState({
                filteredRegions: searchFilterRegion,
            });
        }
    };

    //triggered when search text is cleared 
    onClearText = (name) => {
        this.setState(prevState => ({ searchText: { ...prevState.searchText, [name]: '' } }));
        if (name == 'company') {
            this.setState({
                filteredOrg: this.state.organizations,
            });
        }
        if (name == 'contract') {
            this.setState({
                filteredContract: this.state.contracts
            });
        }
        if (name == 'region') {
            this.setState({
                filteredRegions: this.state.regions
            });
        }

    };

    removeContract = (props) => {
        const { name, selectedContract, keyToBind } = props;
        if (name === selectedContract) {
            this.setState({
                filteredRegions: [],
                regions: [],
                selectedContract: ''
            })
        };

        const updatedItems = this.state.filteredContract?.map((item) => {
            if (item[keyToBind.value] === name) {
                return { ...item, [keyToBind.checked]: false };
            } else {
                return item;
            }
        });
        const updatedGlobalItems = this.state.contracts?.map((item) => {
            if (item[keyToBind.value] === name) {
                return { ...item, [keyToBind.checked]: false };
            } else {
                return item;
            }
        });
        this.setState({
            filteredContract: updatedItems,
            contracts: updatedGlobalItems
        });

        this.saveContract(name, false);
    };
    //triggered on check and uncheck of contract
    onChangeContract = (evt, keyToBind) => {
        const name = evt.target.name;
        this.setState({ contractConfirmEventName: name });
        const selectedContract = this.state.selectedContract;
        const checked = evt.target.checked;
        if (checked === false) {
            //checkbox to validate the uncheck of contract
            this.toggleContractDialog(true);
        } else {
            // condition when checked
            const updatedItems = this.state.filteredContract?.map((item) => {
                if (item[keyToBind.value] === name) {
                    return { ...item, [keyToBind.checked]: checked };
                } else {
                    return item;
                }
            });
            const updatedGlobalItems = this.state.contracts?.map((item) => {
                if (item[keyToBind.value] === name) {
                    return { ...item, [keyToBind.checked]: checked };
                } else {
                    return item;
                }
            });
            this.setState({
                filteredContract: updatedItems,
                contracts: updatedGlobalItems
            });
            this.saveContract(name, checked);
        }
    };

    //triggered on check and uncheck of region
    onChangeRegion = (evt, keyToBind) => {
        const name = evt.target.name;
        const checked = evt.target.checked;
        const count = this.state.regions.reduce((acc, obj) => obj[keyToBind.checked] ? acc + 1 : acc, 0);
        if (count < 2 && checked == false) {
            this.props.addNotification({ message: `At least one region checkbox must be selected`, type: 'error' });
            return;
        }
        if (name.toLowerCase() == 'no region' && checked == true) {
            // condition when no region is checked
            const updatedItems = this.state.filteredRegions?.map((item) => {
                if (item[keyToBind.value] !== name) {
                    return { ...item, [keyToBind.checked]: false };
                } else {
                    return { ...item, [keyToBind.checked]: checked };
                }
            });
            const updatedGlobalItems = this.state.regions?.map((item) => {
                if (item[keyToBind.value] !== name) {
                    return { ...item, [keyToBind.checked]: false };
                } else {
                    return { ...item, [keyToBind.checked]: checked };
                }
            });
            //updated Items is the viewing state and globalItems are persisted state used when reverting the changes
            this.setState({
                filteredRegions: updatedItems,
                regions: updatedGlobalItems
            })
        } else {
            // condition when no region is unchecked or any other region is checked 
            const updatedItems = this.state.filteredRegions?.map((item) => {
                if (item[keyToBind.value].toLowerCase() === 'no region') {
                    return { ...item, [keyToBind.checked]: false };
                } else if (item[keyToBind.value] === name) {
                    return { ...item, [keyToBind.checked]: checked };
                } else {
                    return item;
                }
            });
            const updatedGlobalItems = this.state.regions?.map((item) => {
                if (item[keyToBind.value].toLowerCase() === 'no region') {
                    return { ...item, [keyToBind.checked]: false };
                } else if (item[keyToBind.value] === name) {
                    return { ...item, [keyToBind.checked]: checked };
                } else {
                    return item;
                }
            });
            this.setState({
                filteredRegions: updatedItems,
                regions: updatedGlobalItems
            })
        }
        const id = this.state.regions.find((ele) => ele[keyToBind.value] == name)?.id;
        this.saveRegion(id, checked);
    };

    //saveContract API
    saveContract = (name, checked) => {
        const bodyParameters = {
            customerId: this.state.selectedOrganization,
            contractNumber: name,
            isChecked: checked
        };
        this.props.saveContractsMapping(bodyParameters).then((res) => {
            this.props.addNotification({ message: res.data.message, type: 'success' });
        });
    };

    //saveRegion API
    saveRegion = (name, checked) => {
        const companyId = parseInt(this.state.selectedOrganization);
        const bodyParameters = {
            customerId: companyId,
            contract: this.state.selectedContract,
            isChecked: checked,
            regionId: name
        };
        console.log("Body params region: ", bodyParameters);
        this.props.saveRegionsMapping(bodyParameters).then((res) => {
            this.props.addNotification({ message: res.data.message, type: 'success' });
        });
    };

    //populate Regions fn is called when clicked on the arrow on the contracts section
    populateRegions = (ele, keyToBind) => {
        this.toggleLoader('region', true);
        this.setState({
            selectedContract: ele[keyToBind.value]
        }, () => {
            const bodyParameters = {
                contract: this.state.selectedContract
            }
            this.props.getAllRegionsforContract(bodyParameters).then((res) => {
                if (res) {
                    this.setState({
                        regions: res.data.regions || [],
                        filteredRegions: res.data.regions || []
                    }, () => {
                        this.toggleLoader('region', false);
                    });
                }
            });
        });
        this.setState(prevState => ({
            searchText: {
                ...prevState.searchText,
                region: ''
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
        const newDataDescription = this.state.newData['description'];
        const tempDesc = name == 'region' && newDataDescription ? newDataDescription : '';
        const errorTitle = capitalizeFirstLowercaseRest(name);
        if (newData == '') {
            this.props.addNotification({ message: `${errorTitle} cannot be empty`, type: 'error' });
            return;
        }
        const bodyParameters = {
            value: newData,
            flag: tempName,
            type: "",
            description: tempDesc
        }
        this.props.addNewData(bodyParameters).then(res => {
            if (res.status == 200) {
                this.props.addNotification({ message: res.data.message, type: 'success' });
                this.setState(prevState => ({
                    newData: {
                        ...prevState.newData,
                        [name]: '',
                        description: ''
                    }
                }
                ));
                const num = randomNumber(1, 9999);
                // This is to set the state for the new added items so refreshing of page is not required to fetch latest data
                if (name == 'company') {
                    const newObj = { id: num, company: newData }
                    this.setState(prevState => ({
                        organizations: [
                            ...prevState.organizations,
                            { id: num, organization: newData }],
                    }));
                    this.setState(prevState => ({
                        filteredOrg: [
                            ...prevState.filteredOrg,
                            { id: num, organization: newData }],
                    }));
                }
                if (name == 'region') {
                    const newObj = { id: num, region: newData, assigned: false };
                    const updatedRegionName = newDataDescription ? newData + ' - ' + newDataDescription : newData;
                    this.setState(prevState => ({
                        regions: [
                            ...prevState.regions,
                            { id: num, region: updatedRegionName, assigned: false }],
                    }));
                    this.setState(prevState => ({
                        filteredRegions: [
                            ...prevState.filteredRegions,
                            { id: num, region: updatedRegionName, assigned: false }],
                    }));
                }
            }
        }).catch(error => {
            console.log("error", error)
            this.props.addNotification({ message: error?.response?.data?.message, type: 'error' });
        })

    };

    //triggered for checkboxes in company section
    changeOrganization = evt => {
        this.setState({ selectedOrganization: evt.target.value }, () => {
            this.toggleLoader('contract', true);
            this.props.getContractsFromId(this.state.selectedOrganization).then((res) => {
                this.setState({
                    contracts: res?.data,
                    filteredContract: res?.data,
                    filteredRegions: [],
                    regions: [],
                    selectedContract: ''
                }, () => {
                    this.toggleLoader('contract', false);
                });
                this.setState(prevState => ({
                    searchText: {
                        ...prevState.searchText,
                        contract: '',
                        region: ''
                    }
                }));
            })
        });
    };

    //triggered when new data in individual section is cleared 
    onClearNewData = (name) => {
        this.setState(prevState => ({ newData: { ...prevState.newData, [name]: '' } }));
    };

    toggleContractDialog = (value) => {
        this.setState({ confirmContractDialog: value });
    };

    confirmContractDialog = (keyToBind) => {
        const name = this.state.contractConfirmEventName;
        const selectedContract = this.state.selectedContract;
        const removeContractProps = {
            name,
            selectedContract,
            keyToBind
        };
        this.removeContract(removeContractProps);
        this.setState({ confirmContractDialog: false })
    };

    render() {
        const { classes, navigate, isMobile } = this.props;
        const { searchText, newData, selectedOrganization, filteredOrg, filteredContract, contracts, regions, filteredRegions, selectedContract, loader, confirmContractDialog } = this.state;
        const keyToBindContracts = { key: 'customer', value: 'contract', checked: 'isChecked' };
        const keyToBindRegions = { key: 'id', value: 'region', checked: 'assigned' };
        return (
            <React.Fragment>
                <ConfirmDialog
                    open={confirmContractDialog}
                    confirmationMessage='Remove contract from company?'
                    onConfirm={() => this.confirmContractDialog(keyToBindContracts)}
                    onCancel={() => this.toggleContractDialog(false)}
                    note='Removing the contract will also remove its region binding, and the contract will no longer be assigned to any region.' />
                <Grid container sx={{ backgroundColor: '#f6f6f6' }}>
                    {/* Action Tab below */}
                    <Grid item xs={12} className={classes.actionTab}>
                        <Typography style={{ fontSize: '22px', fontWeight: 600, marginLeft: '38px' }} className={classes.actionTabText}> Contract Mapping </Typography>
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
                                maxLength='20'
                                onChangeInput={this.onChangeNewData}
                                onClearNewData={() => this.onClearNewData('company')}
                                onAddNewData={() => this.addNewData('company')}
                            >
                                {
                                    loader.company ?
                                        <MobileCardSkeleton rows={10} borderRadius='10px' /> :
                                        <div width='100%' style={{ height: `100%`, padding: '0px 10px', overflowY: 'scroll' }}>
                                            {filteredOrg?.length > 0 ?
                                                <RadioGroup
                                                    value={selectedOrganization}
                                                    options={filteredOrg}
                                                    keyToBind={{ key: 'id', value: 'organization' }}
                                                    handleChange={this.changeOrganization}
                                                /> :
                                                <Typography align='flex-start' style={{ padding: '10px' }}> No data found </Typography>}
                                        </div>
                                }
                            </StyledContainer>
                        </Grid>
                        <Grid item sm={4} xs={12} height='100%' borderRadius="10px">
                            <StyledContainer
                                title="Contract"
                                searchText={searchText.contract}
                                name='contract'
                                onClearText={() => this.onClearText('contract')}
                                onSearchInput={e => this.onSearchText(e, { key: 'id', value: 'contract' })}
                            >
                                {
                                    loader.contract ?
                                        <MobileCardSkeleton rows={10} borderRadius='10px' /> :
                                        <div width='100%' style={{ height: `95%`, padding: '0px 0px 5px', overflowY: 'scroll' }}>
                                            {selectedOrganization && filteredContract?.length > 0 ? filteredContract.map((ele) => (
                                                <CheckBoxMenu onChange={e => this.onChangeContract(e, keyToBindContracts)} highlight={this.state.selectedContract} onExpand={() => this.populateRegions(ele, keyToBindContracts)} rowVal={ele} keyToBind={keyToBindContracts} />
                                            )) : selectedOrganization ? <Typography align='flex-start' style={{ padding: '10px' }}> No data found </Typography> : <Typography align='flex-start' style={{ padding: '10px' }}> Select a company </Typography>
                                            }
                                        </div>
                                }
                            </StyledContainer>
                        </Grid>
                        <Grid item sm={4} xs={12} height='100%' borderRadius="10px">
                            <StyledContainer
                                title="Region"
                                searchText={searchText.region}
                                name='region'
                                maxLength='5'
                                description='description'
                                onClearText={() => this.onClearText('region')}
                                onSearchInput={e => this.onSearchText(e, { key: 'id', value: 'region' })}
                                newData={newData}
                                onChangeInput={this.onChangeNewData}
                                onClearNewData={() => this.onClearNewData('region')}
                                onClearNewDescription={() => this.onClearNewData('description')}
                                onAddNewData={() => this.addNewData('region')}>
                                {
                                    loader.region ?
                                        <MobileCardSkeleton rows={10} borderRadius='10px' /> :
                                        <div width='100%' style={{ height: `95%`, padding: '0px 10px 5px', overflowY: 'scroll' }}>
                                            {selectedContract && filteredRegions?.length > 0 ? filteredRegions.map((ele) => (
                                                <CheckBoxMenu onChange={e => this.onChangeRegion(e, keyToBindRegions)} rowVal={ele} keyToBind={keyToBindRegions} />
                                            )) :
                                                selectedContract ? <Typography align='flex-start' style={{ padding: '10px' }}> No data found </Typography>
                                                    : <Typography align='flex-start' style={{ padding: '10px' }}> Select a contract </Typography>}
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
        organizations: organizations
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
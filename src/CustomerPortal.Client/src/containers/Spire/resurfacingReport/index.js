import React, { Component } from 'react'
import { Grid, InputAdornment, Paper, TextField, Skeleton, Divider, Zoom, Menu, MenuItem, Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography, Drawer, Tooltip, TableRow, TableCell } from '@mui/material';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles, styled } from '@mui/styles';
import PropTypes from 'prop-types';
import { RiFilterOffLine } from 'react-icons/ri';
import { DateRangePicker, DateRange } from 'react-date-range';
import moment from "moment";
import { BsCalendar4 } from 'react-icons/bs';
import { MdOutlineDownload, MdClear } from 'react-icons/md';
import { HiDownload } from 'react-icons/hi';
import { RESURFACING_REPORTS_HEADER } from '../../../constants/tableHeaders';
import { withRouter } from '../../../components/withRouter';
import * as notifications from '../../../store/notifyActions';
import { withMediaQuery } from '../../../components/withMediaQuery';
import DropDown from '../../../components/dropdown'
import CustomButton from '../../../components/button';
import CustomIconButton from '../../../components/iconButton';
import ReactVirtualizedTable from '../../../components/table';
import styles from './styles';
import MultipleSelect from '../../../components/multiselect';
import Footer from '../../../components/footer';
import CustomInput from '../../../components/input';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import * as customerPortalActions from '../../../store/actions';
import { base64ToBlob } from '../../../services/helpers';
import { getComparator, stableSort } from '../../../services/helpers';
import SkeletonComponent from '../../../components/skeleton';
import { file } from '@babel/types';
import 'moment-timezone';

const dateToString = (from, to) => {
    const dateString = `${moment(from).format('MM-DD-YYYY')} to ${moment(to).format('MM-DD-YYYY')}`;
    return dateString;
}

class Reports extends Component {
    state = {
        searchText: '',
        filterOptions: {
            dateRange: [{
                startDate: moment().startOf('week')._d,
                endDate: new Date(),
                key: 'selection'
            }],
            jobStatus: '',
            contract: '',
            wOrder: [],
            foreman: []
        },
        dropDown: {
            foremanList: [],
            contractList: [],
            statusList: [],
            woList: []
        },
        initialData: {
            filterOptions: {
                dateRange: [{
                    startDate: moment().startOf('week')._d,
                    endDate: new Date(),
                    key: 'selection'
                }],
                jobStatus: '',
                contract: '',
                wOrder: [],
                foreman: []
            },
        },
        reports: [],
        dateRangeFilter: false,
        selectAllWO: true,
        isLoading: true,
        selectAllForeman: true,
        order: 'desc',
        orderBy: 'jobDate',
    };

    componentDidMount() {
        this.init();
    };

    init() {
        this.fetchDetails();
    };

    //Table function
    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({ order: (isAsc ? 'desc' : 'asc'), orderBy: property });
    };

    handleForemanChange = (event) => {
        const { target: { value } } = event;
        const name = event.target.name;
        const updatedValue = typeof value === 'string' ? value.split(',') : value;
        if (this.state.dropDown.foremanList.length == updatedValue.length) {
            this.setState({ selectAllForeman: true });
        } else {
            this.setState({ selectAllForeman: false });
        }
        this.setState(prevState => ({
            filterOptions: { ...prevState.filterOptions, foreman: updatedValue }
        }));
        //setRegion(typeof value === 'string' ? value.split(',') : value,);
    };

    clearFilters = () => {
        this.setState({
            selectAllForeman: true,
            selectAllWO: true,
            isLoading: true,
            filterOptions: {
                dateRange: [{
                    startDate: moment().startOf('week')._d,
                    endDate: new Date(),
                    key: 'selection'
                }],
                jobStatus: '',
                contract: '',
                wOrder: [],
                foreman: []
            }
        }, () => {
            this.props.addNotification({ message: 'Filters Cleared', type: 'success' });
            this.fetchDetails();
        })
    };

    fetchDetails = () => {
        this.setState(prevState => ({
            initialData: {
                ...prevState.initialData,
                filterOptions: {
                    dateRange: [{
                        startDate: this.state.filterOptions.dateRange[0].startDate,
                        endDate: this.state.filterOptions.dateRange[0].endDate,
                        key: 'selection'
                    }],
                }
            }
        }));
        this.setState({ isLoading: true });
        const bodyParameters = {
            fromDate: moment(this.state.filterOptions.dateRange[0].startDate).format('YYYY-MM-DD'),
            toDate: moment(this.state.filterOptions.dateRange[0].endDate).format('YYYY-MM-DD'),
            workOrder: [],
            foreman: [],
            contractNumber: this.state.filterOptions.contract || 'all contract',
            dfrstatus: this.state.filterOptions.contract || 'all status',
            download: false,
            isResurfacing: true
        };
        console.log('BP: ', bodyParameters);
        this.props.getReports(bodyParameters).then((response) => {
            if (response) {
                this.setState({ isLoading: false });
            }
            if (response.status == 200) {
                this.setState({
                    dropDown: {
                        foremanList: response.data.foremanList,
                        contractList: response.data.contractList,
                        statusList: response.data.statusList,
                        woList: response.data.woList,
                    },
                    reports: response.data.resurfacingReportData
                }, () => {
                    //this is to set the filter to select All when dropdown is populated
                    this.setState(prevState => ({
                        filterOptions: {
                            ...prevState.filterOptions,
                            foreman: this.state.dropDown.foremanList,
                            wOrder: this.state.dropDown.woList
                        }
                    }));
                });
            }
        });
    }

    applyFilters = (download) => {
        const bodyParameters = {
            fromDate: moment(this.state.filterOptions.dateRange[0].startDate).format('YYYY-MM-DD'),
            toDate: moment(this.state.filterOptions.dateRange[0].endDate).format('YYYY-MM-DD'),
            workOrder: this.state.filterOptions.wOrder,
            foreman: this.state.filterOptions.foreman,
            contractNumber: this.state.filterOptions.contract || 'all contract',
            dfrstatus: this.state.filterOptions.jobStatus || 'all status',
            download: download,
            isResurfacing: true
        };
        console.log('BP: ', bodyParameters);
        if (this.state.dropDown.woList.length == 0) {
            this.props.addNotification({ message: 'No data found on particular date(s), please change the date range and try again ', type: 'info' });
            return;
        };
        if (bodyParameters.workOrder.length == 0) {
            this.props.addNotification({ message: 'Select a work order number', type: 'error' });
            return;
        };
        if (bodyParameters.foreman.length == 0) {
            this.props.addNotification({ message: 'Select a foreman', type: 'error' });
            return;
        }

        this.props.getReports(bodyParameters).then((response) => {
            if (response.status == 200) {
                this.setState({
                    dropDown: {
                        foremanList: response.data.foremanList,
                        contractList: response.data.contractList,
                        statusList: response.data.statusList,
                        woList: response.data.woList,
                    },
                    reports: response.data.resurfacingReportData
                });
                if (download) {
                    if (this.state.reports.length == 0) {
                        this.props.addNotification({ message: 'Unable to download file. No records found for selected filters', type: 'error' });
                        return;
                    }
                    this.props.addNotification({ message: 'Downloading..', type: 'info' });
                    this.downloadSelected(response);
                } else {
                    this.props.addNotification({ message: 'Filters Applied', type: 'success' });
                }
            }
        });
    };

    downloadSelected = (response) => {
        const blobData = base64ToBlob(response.data.file, 'application/vnd.ms-excel');
        const url = window.URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `Customer_Portal_${moment(Date.now()).format('MMDDYYYY_HHMMSS')}.xlsx`
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    };

    toggleForemanSelectAll = () => {
        this.setState(prevState => ({
            selectAllForeman: !prevState.selectAllForeman,
        }), () => {
            if (this.state.selectAllForeman) {
                this.setState(prevState => ({
                    filterOptions: { ...prevState.filterOptions, foreman: this.state.dropDown.foremanList }
                }));
            } else {
                this.setState(prevState => ({
                    filterOptions: { ...prevState.filterOptions, foreman: [] }
                }));
            }
        });
    };

    toggleWOSelectAll = () => {
        this.setState(prevState => ({
            selectAllWO: !prevState.selectAllWO
        }), () => {
            if (this.state.selectAllWO) {
                this.setState(prevState => ({
                    filterOptions: { ...prevState.filterOptions, wOrder: this.state.dropDown.woList }
                }));
            } else {
                this.setState(prevState => ({
                    filterOptions: { ...prevState.filterOptions, wOrder: [] }
                }));
            }
        });
    };

    handleWOChange = (event) => {
        const { target: { value } } = event;
        const name = event.target.name;
        const updatedValue = typeof value === 'string' ? value.split(',') : value;
        if (this.state.dropDown.woList.length == updatedValue.length) {
            this.setState({ selectAllWO: true });
        } else {
            this.setState({ selectAllWO: false });
        }
        this.setState(prevState => ({
            filterOptions: { ...prevState.filterOptions, wOrder: updatedValue }
        }));
        //setRegion(typeof value === 'string' ? value.split(',') : value,);
    };

    openCalendarModal = () => {
        this.setState({ dateRangeFilter: true });
    };

    updateFilterOptions = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;
        this.setState(prevState => ({
            filterOptions: { ...prevState.filterOptions, [name]: value }
        }));
    };

    changeDate = (item) => {
        this.setState(prevState => ({
            filterOptions: { ...prevState.filterOptions, dateRange: item }
        }));
    }

    saveCalendarModal = () => {
        this.fetchDetails();
        this.setState({ dateRangeFilter: false });
    };

    closeCalendarModal = () => {
        this.setState(prevState => ({
            filterOptions: {
                ...prevState.filterOptions,
                dateRange: [{
                    startDate: this.state.initialData.filterOptions.dateRange[0].startDate,
                    endDate: this.state.initialData.filterOptions.dateRange[0].endDate,
                    key: 'selection'
                }],
            }
        }), () => {
            this.setState({ dateRangeFilter: false });
        });
    };

    render() {
        const { classes, navigate, isMobile } = this.props;
        const { filterOptions, dateRangeFilter, isLoading, reports, selectAllWO, order, orderBy, selectAllForeman, dropDown } = this.state;
        return (
            <React.Fragment>
                <Dialog
                    open={dateRangeFilter}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    onClose={this.closeCalendarModal}
                >
                    <DialogTitle id="alert-dialog-title" display='flex' justifyContent='space-between'>
                        Date Range
                        <CustomIconButton title="Close" onClick={this.closeCalendarModal}>
                            <MdClear size={'18px'} className={classes.closePopupIconAction} />
                        </CustomIconButton>
                    </DialogTitle>
                    <DialogContent sx={{ padding: 0 }}>
                        <DateRange
                            onChange={item => this.changeDate([item.selection])}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={1}
                            ranges={filterOptions.dateRange}
                            direction="horizontal"
                            preventSnapRefocus={true}
                            calendarFocus="backwards"
                        />
                    </DialogContent>
                    <DialogActions>
                        <CustomButton
                            className={classes.actionButtonsNewUser}
                            sizeValue='small'
                            type="primary"
                            onClick={this.saveCalendarModal}
                            primary='Save'
                        />
                    </DialogActions>
                </Dialog>
                <Grid container sx={{ backgroundColor: '#f6f6f6' }}>
                    {/* Action Tab below */}
                    <Grid item xs={12} className={classes.actionTab}>
                        <Grid container className={classes.actionTabGrid}>
                            <Grid item xs={12} height={'60px'} sx={{ alignItems: 'center', display: "flex" }}>
                                <Typography style={{ fontSize: '22px', fontWeight: 600, marginLeft: '38px' }} className={classes.userAccessText}> Resurfacing Report </Typography>
                            </Grid>
                            {/* Filters */}
                            <Grid item xs={12} sx={{ padding: '7px 5px 5px 5px' }} height={'80px'}>
                                <Grid container className={classes.filters}>
                                    <Grid item className={classes.filterOptions} sx={{ justifyContent: 'flex-start' }}>
                                        <CustomInput
                                            name="dateRange"
                                            label="Filter Date"
                                            placeholder="Select date range"
                                            variant="outlined"
                                            onClick={this.openCalendarModal}
                                            value={dateToString(filterOptions.dateRange[0].startDate, filterOptions.dateRange[0].endDate)}
                                            endAdornment={< BsCalendar4 />}
                                            onClickEndAdornment={this.openCalendarModal}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.centerGrid}>
                                        <MultipleSelect
                                            initalValue={filterOptions.wOrder || []}
                                            options={dropDown.woList || []}
                                            name="wOrder"
                                            label='WO #'
                                            onChange={this.handleWOChange}
                                            //customClassSelect={classes.multipleMenuItem}
                                            //hideOutline
                                            width='160px'
                                            textAlignLeft
                                            placeholderColor='#000000'
                                            variant='standard'
                                            maxWidth='160px'
                                            height='32px'
                                            selectAll
                                            selectAllValue={selectAllWO}
                                            onToggleSelectAll={this.toggleWOSelectAll}
                                            customClass={classes.multiSelectHeight} />

                                    </Grid>
                                    <Grid item xs={2} className={classes.centerGrid}>
                                        <MultipleSelect
                                            initalValue={filterOptions.foreman || []}
                                            options={dropDown.foremanList || []}
                                            name="foreman"
                                            label='Foremen'
                                            textAlignLeft
                                            placeholderColor='#000000'
                                            variant='standard'
                                            onChange={this.handleForemanChange}
                                            //hideOutline
                                            selectAll
                                            selectAllValue={selectAllForeman}
                                            onToggleSelectAll={this.toggleForemanSelectAll}
                                            width='170px' />
                                    </Grid>
                                    <Grid item xs={2} className={classes.centerGrid}>
                                        <DropDown
                                            name="jobStatus"
                                            label="Status"
                                            placeholderColor='#000000'
                                            minWidth='160px'
                                            options={dropDown.statusList}
                                            value={filterOptions.jobStatus != '' ? filterOptions.jobStatus : 'All Status'}
                                            onChange={this.updateFilterOptions}
                                            inputType='array'
                                            variant="standard"
                                            customClassSelect={classes.spaceAroundGrid}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.centerGrid}>
                                        <DropDown
                                            minWidth='160px'
                                            options={dropDown.contractList}
                                            name="contract"
                                            maxLimit={16}
                                            label="Contract"
                                            placeholderColor='#000000'
                                            inputType='array'
                                            variant="standard"
                                            //keyToBind={{ key: 'typeId', value: 'userType' }}
                                            value={filterOptions.contract != '' ? filterOptions.contract : 'All Contracts'}
                                            onChange={this.updateFilterOptions}
                                            customClassSelect={classes.spaceAroundGrid}
                                        />
                                    </Grid>
                                    <Grid item sx={{ minWidth: '100px' }} className={classes.centerGrid}>
                                        <CustomButton
                                            className={classes.actionButtons}
                                            sizeValue='small'
                                            customStyle={{ height: '30px', marginRight: '10px' }}
                                            type="primary"
                                            onClick={() => this.applyFilters(false)}
                                            primary='Apply'
                                        //startIcon={<MdOutlineDownload />}
                                        />
                                        <CustomIconButton title="Download" onClick={() => this.applyFilters(true)}>
                                            <HiDownload size={'24px'} color="#000000" />
                                        </CustomIconButton>
                                        <CustomIconButton title="Clear Filters" onClick={this.clearFilters}>
                                            <RiFilterOffLine size={'21px'} color="#000000" />
                                        </CustomIconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Table below */}
                    <Grid sx={{ display: { xs: 'none', sm: 'flex', minHeight: 'calc(100vh - 190px )' } }} item xs={12} padding="20px" className={classes.flexStartGrid}>
                        <ReactVirtualizedTable
                            id="repoTable"
                            height='calc(100vh - 240px)'
                            header={RESURFACING_REPORTS_HEADER}
                            order={order}
                            zeroPadding
                            customHeight='calc(100vh-170px)'
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}>
                            {isLoading ? <SkeletonComponent columns={RESURFACING_REPORTS_HEADER} /> :
                                reports && dropDown &&
                                stableSort(reports, getComparator(order, orderBy))
                                    .map((list, i) => (
                                        <TableRow style={{ height: '90px' }}>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '120px' }}>{list?.jobNumber} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '80px' }}>{moment(list?.jobDate).format('MM-DD-YYYY')} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '100px' }}>{list?.contractNumber} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5 }}>{list?.foremanName} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>{list?.workOrder} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '70px' }}>{list?.purchaseOrder} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '150px' }}>{list?.address} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '70px' }}>
                                                <Typography color={list.status == 'Pending' ? '#f0941c' : list.status == 'Approved' ? 'green' : list.status == 'Rejected' ? 'red' : '#636363'}>
                                                    {list?.status}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '100px' }}>{list?.surfaceType} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '100px' }}>{list?.materialType} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>{list?.length} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>{list?.width} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>{list?.diameter} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>{list?.depth} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>{list?.type} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>{list?.total} </TableCell>
                                            <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '80px' }}>{list?.uom} </TableCell>
                                        </TableRow>
                                    ))}
                        </ReactVirtualizedTable>
                    </Grid>
                </Grid>
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    const { reports } = state.customerPortal;
    return {
        reports: reports
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
)(Reports);
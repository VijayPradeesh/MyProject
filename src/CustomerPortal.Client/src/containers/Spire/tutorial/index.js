
import React, { Component } from 'react';
import { Grid, InputAdornment, Paper, TextField, Skeleton, Divider, Zoom, Menu, MenuItem, Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography, Drawer, Tooltip, TableRow, TableCell } from '@mui/material';
import { MdVisibility, MdAdd, MdVisibilityOff, MdOutlineVpnKey, MdNoEncryption, MdWifiTetheringErrorRounded } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { GrAdd } from "react-icons/gr";
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loader from '../../../components/loader';
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
import { MdClear, MdMoreHoriz, MdOndemandVideo, MdRemoveRedEye, MdOutlineFileDownload, MdDownload } from "react-icons/md";
import { GrDocumentPdf } from 'react-icons/gr';
import * as notifications from '../../../store/notifyActions';
import CustomizedMenus from '../../../components/menu';
import * as customerPortalActions from '../../../store/actions';
import * as validator from '../../../components/input/validator';
import { validateBodyParameters } from '../../../services/helpers';
import CustomIconButton from '../../../components/iconButton';
import Header from '../../../components/header';
import moment from "moment";
import SearchBar from '../../../components/searchBar';
import ReactVirtualizedTable from '../../../components/table';
import { TUTORIAL_HEADER } from '../../../constants/tableHeaders';
import styles from './styles';
import Select, { components } from "react-select";
import MultipleSelect from '../../../components/multiselect/test';
import MultiSelect from '../../../components/multiselect';
import SkeletonComponent from '../../../components/skeleton';
import FloatingButton from '../../../components/floatingButton';
import { RiFilter2Fill } from 'react-icons/ri';
import { NoDataFound } from '../../../components/staticComponents';
import Footer from '../../../components/footer';
import config from '../../../config';

function descendingComparator(a, b, orderBy) {
    if (orderBy == 'date') {
        if (new Date(b[orderBy]) < new Date(a[orderBy])) {
            return -1;
        }
        if (new Date(b[orderBy]) > new Date(a[orderBy])) {
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

const CustomMenuItems = (props) => {
    const { classes, item, fetchFile } = props;
    return (
        <React.Fragment>
            <MenuItem style={{ width: '100%', padding: '4px 2px' }} onClick={() => fetchFile(item, 'view')}>
                <Grid item xs={3} className={classes.centerGrid}>
                    <CustomIconButton style={{ width: '40px' }} title="" >
                        <MdRemoveRedEye size='16px' color='#000000' />
                    </CustomIconButton>
                </Grid>
                <Grid item xs={8}>
                    <Typography style={{ width: '100%' }}> Open </Typography>
                </Grid>
            </MenuItem>
            <MenuItem style={{ width: '100%', padding: '4px 2px' }} onClick={() => fetchFile(item, 'download')}>
                <Grid item xs={3} className={classes.centerGrid}>
                    <CustomIconButton style={{ width: '40px' }} title="" >
                        <MdOutlineFileDownload size='16px' color='#000000' />
                    </CustomIconButton>
                </Grid>
                <Grid item xs={8}>
                    <Typography style={{ width: '100%' }}> Download </Typography>
                </Grid>
            </MenuItem>
        </React.Fragment>
    )
}

class Tutorial extends Component {

    state = {
        isLoading: false,
        windowHeight: window.innerHeight,
        order: '',
        orderBy: 'name',
        tutorials: [],
        documents: []
    };

    cardsRef = React.createRef();

    componentDidMount() {
        this.init();
    };

    toggleLoader = (value) => {
        this.setState({ isLoading: value })
    }
    init() {
        //for Video
        const bodyParameters = {
            flag: true,
            userId: 0,
            company: "",
            folder: ""
        }
        this.toggleLoader(true);
        this.props.getFiles(bodyParameters).then(res => {
            if (res) {
                this.setState({ tutorials: res?.data || [] }, () => {
                    this.toggleLoader(false);
                })
            }
        })
        //for documents
        const documentBodyParameters = {
            flag: false,
            userId: 0,
            company: "",
            folder: ""
        }
        this.props.getFiles(documentBodyParameters).then(res => {
            if (res) {
                this.setState({ documents: res?.data || [] }, () => {
                    this.toggleLoader(false);
                })
            }
        })
    };

    fetchTutorialFile = (file, action) => {
        this.toggleLoader(true);
        this.props.getTutorial(file?.filepath, 'video').then(res => {
            if (res) {
                if (action == 'view') {
                    window.open(res, '_blank');
                }
                if (action == 'download') {
                    const link = document.createElement('a');
                    link.href = res;
                    link.download = `${file?.fileName || 'Tutorial'}`; // Provide a default file name for the downloaded video
                    link.click();
                }
            }
        }).catch(error => {
            console.log("Error: ", error)
        }).finally(() => {
            this.toggleLoader(false);
        });
    };

    fetchTutorialDocuments = (file, action) => {
        this.toggleLoader(true);
        this.props.getTutorial(file?.filepath, 'document').then(res => {
            if (res) {
                if (action == 'view') {
                    window.open(res, '_blank');
                }
                if (action == 'download') {
                    const link = document.createElement('a');
                    link.href = res;
                    link.download = `${file?.fileName || 'Tutorial'}`; // Provide a default file name for the downloaded video
                    link.click();
                }
                this.toggleLoader(false);
            }
        })
    };

    //Table function
    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({ order: (isAsc ? 'desc' : 'asc'), orderBy: property });
    };

    render() {
        const { isLoading, order, orderBy, tutorials, documents } = this.state;
        const { classes, navigate, isMobile } = this.props;
        const emailText = `mailto:${config.CONTACT_EMAIL}`
        return (
            <React.Fragment>
                <Loader open={isLoading} loadingText='' />
                <Grid container sx={{ backgroundColor: '#f6f6f6', display: { sm: 'block', minHeight: 'calc(100vh - 50px)' } }}>
                    {/* Action Tab below */}
                    <Grid item xs={12} className={classes.actionTab}>
                        <Grid container className={classes.actionTabGrid}>
                            <Grid item xs={12} height={'50px'} sx={{ alignItems: 'center', display: "flex", justifyContent: 'space-between' }}>
                                <Typography style={{ fontSize: '22px', fontWeight: 600, marginLeft: isMobile ? '20px' : '38px' }} className={classes.userAccessText}> Help Center </Typography>
                                <Grid sx={{ alignItems: 'center', display: "flex", display: { xs: 'none', sm: 'flex' }, justifyContent: 'space-between' }}>
                                    <Typography style={{ fontSize: '14px', color: '#fff', marginRight: '10px' }} > Need more help? </Typography>
                                    {!isMobile &&
                                        <Box style={{ marginRight: isMobile ? '20px' : '38px' }}>
                                            <Link
                                                href={emailText}
                                                underline='none'
                                                sx={{ display: 'flex', justifyContent: 'center' }}
                                            >
                                                <CustomButton
                                                    primary="Contact Us"
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
                                            </Link>
                                        </Box>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Table below */}
                    <Grid container sx={{ marginTop: 2 }}>
                        <Grid xs={12}>
                            <Typography style={{ fontSize: '18px', fontWeight: 600, marginLeft: isMobile ? '20px' : '100px' }}> Video Tutorials </Typography>
                        </Grid>
                        <Grid sx={{ display: { sm: 'flex', maxHeight: 'calc(50vh - 110px)' } }} item xs={12} padding={isMobile ? "10px 30px" : "10px 100px"} className={classes.flexStartGrid}>
                            <ReactVirtualizedTable
                                id="repoTable"
                                height='calc(50vh - 120px)'
                                header={TUTORIAL_HEADER}
                                order={order}
                                zeroPadding
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}>
                                {isLoading ? <SkeletonComponent columns={TUTORIAL_HEADER} /> :
                                    tutorials &&
                                    stableSort(tutorials, getComparator(order, orderBy))
                                        .map((list, i) => (
                                            < TableRow style={{ height: '40px' }}>
                                                <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>
                                                    <Grid display='flex' style={{ align: 'center' }} gap={2} >
                                                        <Typography style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                                            <MdOndemandVideo size={'15px'} style={{ margin: '0px 5px' }} />
                                                        </Typography>
                                                        <Link
                                                            onClick={() => this.fetchTutorialFile(list, 'view')}
                                                            color="#3366CC"
                                                            underline="hover"
                                                            style={{ cursor: 'pointer' }}
                                                            className={classes.forgotPassword}>
                                                            <Typography style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                                                {list?.name}
                                                            </Typography>
                                                        </Link>
                                                    </Grid>
                                                </TableCell>
                                                <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}> {moment(list?.modifiedDate).format('MM-DD-YYYY hh:mm:ss a')}</TableCell>
                                                <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '80px', display: 'flex', justifyContent: 'center' }}>
                                                    <CustomIconButton title="Download" align='center' onClick={() => this.fetchTutorialFile(list, 'download')}>
                                                        <MdDownload size={'18px'} color="#000000" />
                                                    </CustomIconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </ReactVirtualizedTable>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: 2 }}>
                        <Grid xs={12}>
                            <Typography style={{ fontSize: '18px', fontWeight: 600, marginLeft: isMobile ? '20px' : '100px' }}> Documents </Typography>
                        </Grid>
                        <Grid sx={{ display: { sm: 'flex', maxHeight: 'calc(50vh - 110px)' } }} item xs={12} padding={isMobile ? "10px 30px" : "10px 100px"} className={classes.flexStartGrid}>
                            <ReactVirtualizedTable
                                id="repoTable"
                                height='calc(50vh - 120px)'
                                header={TUTORIAL_HEADER}
                                order={order}
                                zeroPadding
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}>
                                {isLoading ? <SkeletonComponent columns={TUTORIAL_HEADER} /> :
                                    documents &&
                                    stableSort(documents, getComparator(order, orderBy))
                                        .map((list, i) => (
                                            <TableRow style={{ height: '40px' }}>
                                                <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}>
                                                    <Grid display='flex' style={{ align: 'center' }} gap={2} >
                                                        <Typography style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                                            <GrDocumentPdf size={'15px'} style={{ margin: '0px 5px' }} />
                                                        </Typography>
                                                        <Link
                                                            onClick={() => this.fetchTutorialDocuments(list, 'view')}
                                                            color="#3366CC"
                                                            underline="hover"
                                                            style={{ cursor: 'pointer' }}
                                                            className={classes.forgotPassword}>
                                                            <Typography style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                                                {list?.name}
                                                            </Typography>
                                                        </Link>
                                                    </Grid>
                                                </TableCell>
                                                <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '50px' }}> {moment(list?.modifiedDate).format('MM-DD-YYYY hh:mm:ss a')}</TableCell>
                                                <TableCell style={{ paddingTop: 5, paddingBottom: 5, minWidth: '80px', display: 'flex', justifyContent: 'center' }}>
                                                    <CustomIconButton title="Download" align='center' onClick={() => this.fetchTutorialDocuments(list, 'download')}>
                                                        <MdDownload size={'18px'} color="#000000" />
                                                    </CustomIconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </ReactVirtualizedTable>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment >
        );
    }
}

Tutorial.propTypes = {
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
        name: 'Tutorial'
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
)(React.memo(Tutorial));

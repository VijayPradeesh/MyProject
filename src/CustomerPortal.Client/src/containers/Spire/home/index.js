import React, { useState, useEffect, useRef, createRef } from 'react'
import { Accordion, Badge, AccordionActions, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Collapse, Divider, Grid, IconButton, Paper, Skeleton, Drawer, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tabs, Typography, Zoom, Chip, ClickAwayListener } from '@mui/material'
import CustomInput from '../../../components/input'
import { FiSearch, FiFilter } from "react-icons/fi"
import { tableCellClasses } from '@mui/material/TableCell';
import { FaFilter } from "react-icons/fa"
import CustomButton from '../../../components/button'
import { MdAdd, MdClose, MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown, MdHistory, MdClear, MdInfoOutline } from "react-icons/md"
import { HiOutlineCheckCircle } from "react-icons/hi"
import { makeStyles, withStyles, styled } from '@mui/styles'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from '@mui/lab'
import Countdown from '../../../components/countdown'
import CustomModal from '../../../components/customModal'
import { dateCalculator, formatTime, getComparator, stableSort, shortString } from '../../../services/helpers'
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as customerPortalActions from '../../../store/actions';
import * as notifications from '../../../store/notifyActions';
import axios from 'axios'
import SkeletonComponent from '../../../components/skeleton'
import { RiFilter2Fill, RiFilterOffFill } from "react-icons/ri"
import { RiFilterOffLine } from "react-icons/ri"
import { AiFillHome, AiOutlineFileDone } from "react-icons/ai";
import { Stack } from '@mui/system'
import Header from '../../../components/header'
import FilterDropDown from '../../../components/filterDropDown'
import DropDown from '../../../components/dropdown'
import { JOBS_HEADER, RESURFACING_HEADER } from '../../../constants/tableHeaders'
import { withMediaQuery } from '../../../components/withMediaQuery';
import { EquipmentComponent, SewerMobileComponent, LaborComponent, ProdTMComponent, SurfacesRestoredTabMobile, AdditionalMaterialsTabMobile, CommentsComponentMobile } from './components/mobile';
import JobAccordion from './components/JobAccordion'
import { CollapeTable } from './CollapseTable'
import CustomIconButton from "../../../components/iconButton"
import Footer from '../../../components/footer'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import jwtDecode from 'jwt-decode'
import { validateBodyParameters, validateAllNull } from '../../../services/helpers';
import { SurfacesRestoredTab, AdditionalMaterialsTab, CommentsComponent, ImageAttachmentComponent } from './components/desktop';

const JobDashboard = (props) => {
    const { isMobile } = props
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        swipeToSlide: true,
    };
    const useStyles = makeStyles((theme) => ({
        screenTopBg: {
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            background: '#201d1d',
            padding: '10px 55px',
            color: 'white',
            [theme.breakpoints.down('sm')]: {
                padding: '20px 25px',
            }
        },
        heading: {
            color: '#f0941c',
            fontWeight: '600',
            display: "flex",
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: {
                display: "flex",
                justifyContent: "flex-start",
                fontWeight: '600',
                fontSize: '2.0rem'

            }
        },
        searchArea: {
            background: 'white',
            borderRadius: '5px',
            padding: "5px 10px",
            justifyContent: "space-between"
        },
        searchMobSection: {
            padding: '10px',
            marginBottom: '5px',
            background: "white"
        },
        searchMobArea: {
            background: 'white',
            height: '40px',
            justifyContent: 'flex-start'
        },
        usersTable: {
            margin: "10px 20px",
            [theme.breakpoints.down("sm")]: {
                margin: '5px 5px 0px 5px'
            }
        },
        drawerAlign: {
            padding: '15px 30px',
            position: 'sticky',
            top: '0px',
            zIndex: '9999',
        },
        drawerBox: {
            [theme.breakpoints.down("sm")]: {
                overflowX: "hidden"
            }
        },
        cardAlign: {
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.down("sm")]: {
                gap: '10px',
            }
        },
        tabCard: {
            padding: '10px',
            '& .MuiTypography-root': {
                color: '#BA752A'
            },
            [theme.breakpoints.down("sm")]: {
                padding: "5px 10px",
                '& .MuiTypography-root': {
                    color: '#F0941C'
                }
            }
        },
        paperGrid: {
            background: "#FAE0BD",
            [theme.breakpoints.down("sm")]: {
                background: "#201D1D"
            }
        },
        timelinePending: {
            color: "#F0941C"
        },
        timelineApproved: {
            color: "green"
        },
        timelineRejected: {
            color: "red"
        },
        cardHeaderTitleRoot: {
            color: '#000',
            textAlign: 'center',
            fontWeight: 600
        },
        reportCardHeader: {
            background: '#F0941C',
            fontWeight: 600
        },
        reportCardContent: {
            background: '#fbe0bd',
            fontWeight: 600,
            '& >': {
                fontWeight: 600
            }
        },
        tabs: {
            "& .MuiTab-textColorPrimary": {
                fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
                backgroundColor: "#BA752A",
            },
            "& .MuiTab-root.Mui-selected": {
                color: '#BA752A',
                fontWeight: "600"
            },
        },
        tabHover: {
            '&.MuiTab-root:not(.Mui-selected):hover': {
                transition: 'background-color 0.3s ease-in, box-shadow 0.3s ease-out;',
                borderRadius: isMobile ? "10px" : "15px 15px 0px 0px",
                backgroundColor: 'rgba(238, 238, 238, 0.3)',
            },
            padding: '0px 1px 0px 0px',
        },
        tabsPage: {
            borderRadius: '15px 10px 0px 0px',
            "& .MuiTab-root.Mui-selected": {
                color: '#000',
                backgroundColor: '#f6f6f6',
                borderRadius: '15px 15px 0px 0px',
                zIndex: 5,
                boxShadow: '1px 1px 1px 1px rgba(255, 255, 255, 0.5)'
            },
            "& .MuiTab-textColorPrimary": {
                color: '#fff',
            },
            // "& .MuiTabs-indicator": {
            //     backgroundColor: theme.palette.primary.main,
            // },
            "& .MuiTabs-flexContainer": {
                padding: '0px 2px 0px 0px',
                borderRadius: "15px 15px 0px 0px",
            },
        },
        tabsPageMobile: {
            borderRadius: '10px',
            border: "1px solid #f6f6f6",
            "& .MuiTab-root.Mui-selected": {
                color: '#000',
                backgroundColor: '#f6f6f6',
                borderRadius: '10px',
                zIndex: 5,
            },
            "& .MuiTab-textColorPrimary": {
                color: '#fff',
            },
            // "& .MuiTabs-indicator": {
            //     backgroundColor: theme.palette.primary.main,
            // },
            "& .MuiTabs-flexContainer": {
                padding: '0px 2px 0px 0px',
                borderRadius: "10px",
            },
        },
        tabPanels: {
            background: "#E0E0E0",
            "& .css-19kzrtu": {
                padding: "24px 0px"
            },
            [theme.breakpoints.down("sm")]: {
                "& .css-19kzrtu": {
                    padding: "0px"
                }
            }
        },
        statusPending: {
            color: "#F0941C",
            fontWeight: 600
        },
        statusApproved: {
            color: "green",
            fontWeight: 600
        },
        statusRejected: {
            color: "red",
            fontWeight: 600
        },
        statusVoided: {
            color: "#636363",
            fontWeight: 600
        },
        tableRow: {
            '&:hover': {
                cursor: 'pointer'
            },
            background: "white",
            boxShadow: "0px 3px 10px #00000017",
        },
        tableRowHighlight: {
            '&:hover': {
                cursor: 'default'
            },
            background: "white",
            boxShadow: "0px 3px 10px #00000017",
            border: '2px solid #ffff00',
            transform: 'translateY(-2px)'
        },
        tableRowHighlightMobile: {
            '&:hover': {
                cursor: 'default'
            },
            background: "white",
            boxShadow: "0px 3px 10px #00000017",
            border: '2px solid #ffff00',
        },
        cardMobWidth: {
            width: "70px",
            height: "70px",
            marginLeft: "10px"
        },
        cardWidth: {
            width: "100px",
        },
        mainTable: {
            // borderCollapse:"separate",
            // borderSpacing:"0px 7px",
            background: "#F6F6F6",
            // width:"100%"
        },
        collapeTable: {
            background: "#E0E0E0",
            position: 'sticky',
            top: 0
        },
        collapseTableRow: {
            background: "white"
        },
        collapseTableRowTotal: {
            background: "#eee"
        },
        tableBodyNoBorder: {
            background: "white"
        },
        mainSection: {
            background: "#F6F6F6",
            [theme.breakpoints.down("sm")]: {
                background: '#e0e0e0'
            }
        },
        // collapseTableSticky: {
        // 	position: 'sticky',
        // 	top: 0
        // }
        cardComment: {
            backgroundColor: "white",
            [theme.breakpoints.down("sm")]: {
                padding: "10px 10px"
            },
            [theme.breakpoints.up("md")]: {
                padding: "0px 10px",
                minHeight: "44px",
                alignItems: "center",
                display: "flex"
            }
        },
        cardContainer: {
            backgroundColor: "#fae0bd"
        },
        tabContent: {
            [theme.breakpoints.down("sm")]: {
                background: "#e0e0e0",
                padding: "0px 0px !important"
            }
        },
        paperPadding: {
            padding: "10px"
        },
        paperContent: {
            display: 'grid',
            gap: '5px'
        },
        accordionHeader: {
            flexDirection: 'row-reverse',
            gap: "15px",
            position: "sticky !important",
            top: "0px",
            background: "white !important",
            zIndex: "999",
            boxShadow: "4px 1px 4px 3px #d2d2d2"
        },
        accordionIcon: {
            transition: "transform 2s"
        },
        accordionIconOpen: {
            transform: "rotate(-135deg)"
        },
        accordionIconClose: {
            transform: "rotate(0)"
        },
        drawerFooterGrid: {
            position: 'fixed',
            bottom: '0px',
            borderTop: "solid 1px #cecece",
            padding: "10px 0px",
            background: "white"
        },
        drawerTitleGrid: {
            padding: '25px',
            height: '77px'
        },
        centerGrid: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        closePopupIconAction: {
            cursor: 'pointer',
            color: '#000000',
            borderRadius: '10px',
            transition: '0.15s'
        },
        newUserGrids: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '65px'
        },
        submitGrid: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '65px'
        },
        tabCardComment: {
            overflowWrap: "anywhere"
        },
        autoCompleteStyle: {
            "& .MuiInputBase-root-MuiInput-root:before": {
                display: "none",
                content: ""
            }
        }
    }))

    const selectAlign = {
        marginTop: "1px",
    }

    function a11yProps(index) {
        return {
            id: `${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const StyledTableCellNew = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.body}`]: {
            fontSize: 13,
            padding: '10px 16px'
        },
    }));

    const StyledMainTable = styled('table')(() => ({
        borderCollapse: "separate",
        borderSpacing: "0px 2px",
        width: "100%"
    }))

    const StyledTableCell = withStyles(() => ({
        root: {
            backgroundColor: '#f0941c',
            color: 'black',
        }
    }))(TableCell)

    const TabActionButton = withStyles(() => ({
        root: {
            paddingTop: "0px"
        }
    }))(CustomButton)

    function TabPanel(props) {
        const { children, value, index, padding, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: padding || 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const DrawerHeader = styled('div')(() => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: "#E0E0E0"
    }))

    const DrawerFooter = styled('div')(() => ({
        display: "flex",
        alignItems: 'center',
        justifyContent: "space-around",
        width: "100%",
        gap: "32px"
    }))

    const CustomTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 150,
            display: "flex",
            flexWrap: 'wrap',
            gap: "7px"
        }
    });

    const MoreInfoTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 225,
            display: "flex",
            flexWrap: 'wrap',
            gap: "7px"
        }
    });

    const classes = useStyles()

    let date = new Date()
    date.setDate(date.getDate() + 5)

    const tokenObject = jwtDecode(sessionStorage.getItem("token"))

    const [jobs, setJobs] = useState({
        foremanNames: [],
        jobDetails: [],
        jobNumbers: [],
        workOrderNumbers: [],
        purchaseOrderNumbers: [],
        contracts: [],
        lockdownDate: '',
        reportCounts: {
            approvedCount: 0,
            pendingCount: 0,
            rejectedCount: 0,
            voidedCount: 0,
            totalCount: 0
        }
    });

    const [signature, setSignature] = useState(null);
    const [jobStatus, setJobStatus] = useState("Pending")
    const [jobWeek, setJobWeek] = useState(true)
    const [jobNos, setJobNos] = useState("All Jobs")
    const [woNos, setWoNos] = useState("All WO #")
    const [poNos, setPoNos] = useState("All PO #")
    const [contracts, setContracts] = useState("All Contracts")
    const [jobForeman, setJobForeman] = useState("")
    const [jobCount, setjobCount] = useState({
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        voidedCount: 0,
        totalCount: 0,
        approvedDACount: 0,
        pendingDACount: 0,
        rejectedDACount: 0,
        voidedDACount: 0,
        totalDACount: 0
    });
    const [bodyParamFilter, setBodyParamFilter] = useState({
        foremanName: "",
        jobNumber: "All Jobs",
        status: "Pending",
        contractNumber: 'All Contracts',
        currentWeek: false,
        wo: "All WO #",
        po: "All PO #",
        isResurfacing: false
    })
    const [mobFilterParam, setMobFilterParam] = useState({
        foremanName: "",
        jobNumber: "All Jobs",
        status: "Pending",
        contractNumber: "All Contracts",
        currentWeek: false,
        wo: "All WO #",
        po: "All PO #",
        isResurfacing: false
    })

    const [isLoading, setIsLoading] = useState(false)

    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

    const [tableContainerHeight, setTableContainerHeight] = useState()

    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [pageTab, setPageTab] = useState(0)
    const tableRef = useRef(null);

    const checkHeight = () => {
        setWindowHeight(window.innerHeight)
    }

    // useEffect(() => {
    //     window.addEventListener('resize', checkHeight)
    //     return () => {
    //         window.removeEventListener("resize", checkHeight)
    //     }
    // }, [])

    useEffect(() => {
        const containerHeightCalc = {
            height: `${((windowHeight - tableRef.current?.offsetTop) - 20)}px`,
        }
        setTableContainerHeight(containerHeightCalc)
    }, [windowHeight])

    const statusOption = [
        {
            id: 1,
            name: 'All Status'
        },
        {
            id: 2,
            name: 'Pending'
        },
        {
            id: 3,
            name: 'Approved'
        },
        {
            id: 4,
            name: 'Rejected'
        },
        {
            id: 5,
            name: 'Voided'
        }
    ]

    const weeksOption = [
        {
            id: 1,
            name: 'This Week'
        },
        {
            id: 2,
            name: 'Two Weeks'
        }
    ]

    const handlePageTabChange = (event, newVal) => {
        setPageTab(newVal);
    }

    useEffect(() => {
        handleFilteronPageSwitch();
        setIsLoading(true)
    }, [pageTab])

    const makeInitialFetch = async () => {
        setIsLoading(true)
        const bodyParameters = {
            foremanName: "",
            jobNumber: "All Jobs",
            status: "Pending",
            currentWeek: false,
            contractNumber: 'All Contracts',
            wo: "All WO #",
            po: "All PO #",
            isResurfacing: !!pageTab
        }
        try {
            const resp = await props.getAllJobs(bodyParameters).then(res => {
                return res
            })

            if (resp.status === 200) {
                setIsLoading(false)
                setJobForeman('')
                setJobNos('All Jobs')
                setWoNos('All WO #')
                setPoNos('All PO #')
                setContracts('All Contracts')
                setJobWeek(2)
                setJobStatus(2)
                setSignature(resp?.data?.signature)
                setJobs(() => ({
                    foremanNames: resp.data.foremanNames,
                    jobDetails: !!pageTab ? resp.data.resurfacingDetails : resp.data.jobDetails,
                    jobNumbers: ['All Jobs', ...resp.data.jobNumbers],
                    workOrderNumbers: ['All WO #', ...resp.data.wo],
                    contracts: ['All Contracts', ...resp.data.contractNumber],
                    purchaseOrderNumbers: ['All PO #', ...resp.data.po],
                    lockdownDate: resp.data.lockdownDate,
                    reportCounts: {
                        approvedCount: resp.data.approvedCount,
                        pendingCount: resp.data.pendingCount,
                        rejectedCount: resp.data.rejectedCount,
                        voidedCount: resp.data.voidedCount,
                        totalCount: resp.data.totalCount
                    }
                }))
                if (resp.status === 200 && bodyParameters.isResurfacing) {
                    setjobCount((prevState) => ({
                        ...prevState,
                        approvedCount: resp.data.approvedCount,
                        pendingCount: resp.data.pendingCount,
                        rejectedCount: resp.data.rejectedCount,
                        voidedCount: resp.data.voidedCount,
                        totalCount: resp.data.totalCount
                    }))
                } else {
                    setjobCount((prevState) => ({
                        ...prevState,
                        approvedDACount: resp.data.approvedCount,
                        pendingDACount: resp.data.pendingCount,
                        rejectedDACount: resp.data.rejectedCount,
                        voidedDACount: resp.data.voidedCount,
                        totalDACount: resp.data.totalCount
                    }))
                }
            }
        } catch (error) {
            if (error?.response?.status == 500) {
                props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
            }
        }
    }

    const makeInitialCountFetchOtherTab = async () => {
        const bodyParameters = {
            foremanName: "",
            jobNumber: "All Jobs",
            status: "Pending",
            currentWeek: false,
            contractNumber: 'All Contracts',
            wo: "All WO #",
            po: "All PO #",
            isResurfacing: !bodyParamFilter?.isResurfacing
        }
        try {
            const resp = await props.getAllJobs(bodyParameters).then(res => {
                return res
            })
            if (resp.status === 200 && bodyParameters.isResurfacing) {
                setjobCount((prevState) => ({
                    ...prevState,
                    approvedCount: resp.data.approvedCount,
                    pendingCount: resp.data.pendingCount,
                    rejectedCount: resp.data.rejectedCount,
                    voidedCount: resp.data.voidedCount,
                    totalCount: resp.data.totalCount
                }))
            } else {
                setjobCount((prevState) => ({
                    ...prevState,
                    approvedDACount: resp.data.approvedCount,
                    pendingDACount: resp.data.pendingCount,
                    rejectedDACount: resp.data.rejectedCount,
                    voidedDACount: resp.data.voidedCount,
                    totalDACount: resp.data.totalCount
                }))
            }
        } catch (error) {
            if (error?.response?.status == 500) {
                props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
            }
        }
    }

    useEffect(() => {
        makeInitialFetch()
        makeInitialCountFetchOtherTab()
    }, [])

    const TimeLineComponent = ({ timelineVal }) => {
        return (
            <>
                <Timeline
                    sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 0,
                        },
                    }}
                >
                    {timelineVal?.map((timeline, index, arr) => {
                        return (
                            <TimelineItem key={timeline?.id} style={{ padding: "0px 15px" }}>
                                <TimelineSeparator>
                                    <TimelineDot variant="outlined" />
                                    {arr && arr.length - 1 !== index ? <TimelineConnector /> : <React.Fragment />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Box spacing={3} style={{ marginBottom: "30px" }}>
                                        <Grid container spacing={1}>
                                            <Grid item container xs={12}>
                                                <Grid item xs={6}>
                                                    <Typography className={`${timeline.status === "Approved" ? classes.timelineApproved : (timeline.status === "Pending" ? classes.timelinePending : classes.timelineRejected)}`} fontWeight={600}>{timeline.status}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography style={{ textAlign: 'end' }}>{dateCalculator(timeline?.statusChangedDate)}</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid item container xs={12}>
                                                <Grid item xs={6}>
                                                    <Typography style={{ wordWrap: "break-word" }}>{timeline?.isCpUser ? timeline?.cpUserName : timeline?.clApproverName}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography style={{ fontStyle: "italic", textAlign: 'end' }}>{formatTime(new Date(timeline?.statusChangedDate))}</Typography>
                                                </Grid>
                                            </Grid>
                                            {timeline?.comments?.length > 0 && (
                                                <Grid item container xs={12}>
                                                    <Grid container xs={12}>
                                                        <Typography fontWeight={600}>Comments:</Typography>
                                                    </Grid>
                                                    <Grid container xs={12}>
                                                        <Typography style={{ wordWrap: "break-word", width: "290px" }}>{timeline?.comments}</Typography>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                </TimelineContent>
                            </TimelineItem>
                        )
                    })}
                </Timeline>
            </>
        )
    }

    const TabActionArea = ({ setIsDrawerOpen, setModalOpen, rowVal, setModalVal, setApprovalVal, setTimelineVal, setRejectVal, setViewVal }) => {
        const handleModal = async (approvalVal, jobId) => {
            setModalOpen(true)
            setModalVal(rowVal)
            setApprovalVal(approvalVal)
            if (approvalVal === "Reject") {
                try {
                    const resp = await props.getRejectionStatus().then(response => {
                        return response
                    })
                    setRejectVal(resp.data)
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }
            } else if (approvalVal === "View") {
                try {
                    const resp = await props.getViewApproval(jobId, !!pageTab).then(response => {
                        return response
                    })
                    setViewVal(resp.data)
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }
            }
        }

        const handleHistory = async (jobId) => {
            setIsDrawerOpen(true)
            try {
                const resp = await props.getJobStatus(jobId, !!pageTab).then(response => {
                    return response
                })
                if (resp.status === 200) {
                    setTimelineVal(resp.data)
                }
            } catch (error) {
                if (error.response.status == 500) {
                    props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                }
            }
        }
        return (
            <>
                {!isMobile ? (
                    <Grid container justifyContent='flex-end' spacing={3} style={{ marginTop: '2px' }}>
                        <Grid item style={{ paddingTop: '0px' }}>
                            <TabActionButton
                                fullHeight
                                sizeValue='small'
                                // fullWidth
                                id="History"
                                onClick={() => handleHistory(rowVal.id)}
                                // type="success"
                                primary='History'
                                variant='outlined'
                                disabled={false}
                                startIcon={<MdHistory />}
                                bgColor="#FFF"
                                btnColor='#000000'
                                hoverBgColor='#000000'
                                hoverBgOutlineColor='#000000'
                                hoverColor='#fff'
                                customStyle={{ width: "125px" }}
                            // fontWeight="600"
                            />
                        </Grid>
                        {rowVal.jobStatus === "Approved" && (
                            <Grid item style={{ paddingTop: '0px' }}>
                                <TabActionButton
                                    fullHeight
                                    sizeValue='small'
                                    // fullWidth
                                    id="View"
                                    onClick={() => handleModal("View", rowVal.id)}
                                    // type="success"
                                    primary='View Approval'
                                    variant='outlined'
                                    disabled={false}
                                    startIcon={<AiOutlineFileDone />}
                                    bgColor="#FFF"
                                    btnColor='#2F9220'
                                    hoverBgColor='#2F9220'
                                    hoverBgOutlineColor='#2F9220'
                                    hoverColor='#fff'
                                // customStyle={{ width: "125px" }}
                                />
                            </Grid>
                        )}
                        {(tokenObject.Organization !== "Mears") && rowVal.jobStatus === "Pending" && (
                            <>
                                <Grid item style={{ paddingTop: '0px' }}>
                                    <TabActionButton
                                        fullHeight
                                        sizeValue='small'
                                        // fullWidth
                                        id="Reject"
                                        onClick={() => handleModal("Reject")}
                                        type="error"
                                        primary='Reject'
                                        variant='outlined'
                                        disabled={false}
                                        startIcon={<MdClose />}
                                        bgColor="#FFF"
                                        btnColor='#EE3A41'
                                        hoverBgColor='#EE3A41'
                                        hoverColor='#fff'
                                        customStyle={{ width: "125px" }}
                                    // fontWeight='600'
                                    />
                                </Grid>
                                <Grid item style={{ paddingTop: '0px' }}>
                                    <TabActionButton
                                        fullHeight
                                        sizeValue='small'
                                        // fullWidth
                                        id="Approve"
                                        onClick={() => handleModal("Approve")}
                                        // type="success"
                                        primary='Approve'
                                        variant='outlined'
                                        disabled={false}
                                        startIcon={<HiOutlineCheckCircle />}
                                        bgColor="#FFF"
                                        btnColor='#2F9220'
                                        hoverBgColor='#2F9220'
                                        hoverBgOutlineColor='#2F9220'
                                        hoverColor='#fff'
                                        customStyle={{ width: "125px" }}
                                    // fontWeight='600'
                                    />
                                </Grid>
                            </>
                        )}

                    </Grid>
                ) : (
                    <Grid
                        container
                        xs={12}
                    >
                        <Grid item xs={3}  >
                            <TabActionButton
                                fullHeight
                                sizeValue="small"
                                // fullWidth
                                id="History"
                                onClick={() => handleHistory(rowVal.id)}
                                // type="success"
                                primary="History"
                                variant="outlined"
                                hoverBgOutlineColor='#000000'
                                disabled={false}
                                startIcon={<MdHistory />}
                                bgColor="#FFF"
                                btnColor="#000000"
                                hoverBgColor="#000000"
                                hoverColor="#fff"
                                customStyle={{ width: '88px', height: '25px', fontSize: '10px' }}
                            // fontWeight="600"
                            />
                        </Grid>
                        <Grid item xs={2.5}>

                        </Grid>
                        {rowVal.jobStatus === "Approved" && (
                            <Grid item xs={6.5} style={{ display: "flex" }} justifyContent="flex-end">
                                <TabActionButton
                                    fullHeight
                                    sizeValue='small'
                                    // fullWidth
                                    id="View"
                                    onClick={() => handleModal("View", rowVal.id)}
                                    // type="success"
                                    primary='View Approval'
                                    variant='outlined'
                                    disabled={false}
                                    startIcon={<AiOutlineFileDone />}
                                    bgColor="#FFF"
                                    btnColor='#2F9220'
                                    hoverBgColor='#2F9220'
                                    hoverBgOutlineColor='#2F9220'
                                    hoverColor='#fff'
                                    customStyle={{ height: '25px', fontSize: '10px' }}
                                />
                            </Grid>
                        )}
                        {(tokenObject.Organization === "Spire") && rowVal.jobStatus === "Pending" && (
                            <>
                                <Grid item xs={3} >
                                    <TabActionButton
                                        fullHeight
                                        sizeValue="small"
                                        // fullWidth
                                        id="Reject"
                                        onClick={() => handleModal("Reject")}
                                        type="error"
                                        primary="Reject"
                                        variant="outlined"
                                        disabled={false}
                                        startIcon={<MdClose />}
                                        bgColor="#FFF"
                                        btnColor="#EE3A41"
                                        hoverBgColor="#EE3A41"
                                        hoverColor="#fff"
                                        customStyle={{ width: '88px', height: '25px', fontSize: '10px' }}
                                    // fontWeight='600'
                                    />
                                </Grid>
                                <Grid item xs={0.5}>

                                </Grid>
                                <Grid item xs={3}  >
                                    <TabActionButton
                                        fullHeight
                                        sizeValue="small"
                                        // fullWidth
                                        id="Approve"
                                        onClick={() => handleModal("Approve")}
                                        // type="success"
                                        primary="Approve"
                                        variant="outlined"
                                        disabled={false}
                                        startIcon={<HiOutlineCheckCircle />}
                                        bgColor="#FFF"
                                        btnColor="#2F9220"
                                        hoverBgColor="#2F9220"
                                        hoverBgOutlineColor='#2F9220'
                                        hoverColor="#fff"
                                        customStyle={{ width: '88px', height: '25px', fontSize: '10px' }}
                                    // fontWeight='600'
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                )}
            </>
        )
    }

    const TableCard = ({ cardProp }) => {
        return (
            <>
                <div className={classes.cardAlign}>
                    <Paper elevation={2} sx={{ my: 1, mx: 0.5 }}>
                        <Grid container xs={12} alignItems="center" justifyContent="center" className={classes.cardContainer}>
                            <Grid item md={2} xs={12} className={`${classes.paperGrid} ${classes.tabCard}`}>
                                <Typography>
                                    Production
                                </Typography>
                            </Grid>
                            <Grid item md={10} xs={12} className={classes.cardComment}>
                                <Typography className={classes.tabCardComment}>
                                    {cardProp.production ? cardProp.production : "No Comments"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            </>
        )
    }

    const CustomTable = ({ tableProp }) => {
        const dynamicRender = (item, value) => {
            return item[value]
        }
        const NoDataComp = () => {
            const filledArr = Array.from({ length: tableProp?.headers.length }, (_, i) => ({ id: i + 1, data: "" }))
            const updatedArr = filledArr.map((item, index) => {
                if (Math.floor(filledArr.length / 2) === index) {
                    return { ...item, data: "No Data Found" }
                } else {
                    return { ...item, data: "" }
                }
            })
            return (
                <>
                    {updatedArr.map((item) => {
                        return (
                            <TableCell key={item.id}>
                                <Typography>{item.data}</Typography>
                            </TableCell>
                        )
                    })}
                </>
            )
        }

        return (
            <>
                <TableContainer component={Paper}>
                    <StyledMainTable className={classes.collapeTable}>
                        <TableHead>
                            <TableRow>
                                {tableProp?.headers.map((header, index) => {
                                    return (
                                        <StyledTableCell style={{ fontWeight: 600, backgroundColor: '#edd4b5' }} sx={{ padding: "5px 16px" }} key={index}>
                                            {header.label.includes('#') ? header.label.split('#').join(' #') : header.label}
                                        </StyledTableCell>)
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableProp?.body.length > 0 ? (
                                <>
                                    {tableProp?.body.map((item) => {
                                        return (
                                            <TableRow key={item.id} className={classes.collapseTableRow}>
                                                {tableProp?.headers.map(({ value }) => {
                                                    return <TableCell key={value} style={{ wordWrap: 'break-word' }}>{dynamicRender(item, value)}</TableCell>
                                                })}
                                            </TableRow>
                                        )
                                    })}
                                    {tableProp?.total &&
                                        <TableRow key='total' className={classes.collapseTableRowTotal}>
                                            <StyledTableCellNew key='total21'>
                                                <Typography fontWeight="fontWeightBold" variant='body2' style={{ wordWrap: 'break-word', textTransform: 'uppercase', fontWeight: 600 }}>Total</Typography>
                                            </StyledTableCellNew>
                                            <StyledTableCellNew key='total11'>
                                                <Typography>{tableProp?.total}</Typography>
                                            </StyledTableCellNew>
                                        </TableRow>
                                    }
                                </>

                            ) : (
                                <TableRow style={{ backgroundColor: "white" }}>
                                    <NoDataComp />
                                </TableRow>
                            )}
                        </TableBody>
                    </StyledMainTable>
                </TableContainer>
            </>
        )
    }

    const SewerCamTabDesktop = ({ props }) => {
        const sewerCameraActivity = props?.sewerCameraActivity;
        const workHeaders = sewerCameraActivity?.header;
        let workBody = [{
            workType: sewerCameraActivity?.activityType,
            county: sewerCameraActivity?.county,
            phase: sewerCameraActivity?.phase,
            inspector: sewerCameraActivity?.inspector,
            truckID: sewerCameraActivity?.truckId
        }]
        const isAllNull = validateAllNull(workBody?.[0]);
        if (isAllNull) {
            workBody = []
        }
        const activityParams = {
            headers: workHeaders,
            body: workBody
        }
        const sewerCamMain = props?.sewerCamDetailsMain;

        const mainLocBodyWithTotal = sewerCamMain?.sewerCamDetail
        const mainLocationBody = {
            headers: sewerCamMain?.header,
            body: sewerCamMain?.sewerCamDetail,
            total: sewerCamMain?.total
        }
        const sewerCamLateral = props?.sewerCamDetailsLateral;
        const lateralLocationBody = {
            headers: sewerCamLateral?.header,
            body: sewerCamLateral?.sewerCamDetail,
            total: sewerCamLateral?.total
        }
        return (
            <React.Fragment>
                <Grid container display='flex'>
                    <Grid item xs={12} sx={{ marginBottom: '15px' }}>
                        <Typography variant='body2' style={{ wordWrap: 'break-word', textTransform: 'uppercase', fontWeight: 600, marginBottom: '5px' }}>
                            Work Details
                        </Typography>
                        <CustomTable tableProp={activityParams && (activityParams || {})} />
                    </Grid>
                    <Grid container display='flex' justifyContent='space-between'>
                        <Grid item xs={5} sx={{ marginBottom: '15px' }}>
                            <Typography variant='body2' style={{ wordWrap: 'break-word', textTransform: 'uppercase', fontWeight: 600, marginBottom: '5px' }}>
                                Main Location
                            </Typography>
                            <CustomTable tableProp={mainLocationBody && (mainLocationBody || {})} />
                        </Grid>
                        <Grid item xs={5} sx={{ marginBottom: '15px' }}>
                            <Typography variant='body2' style={{ wordWrap: 'break-word', textTransform: 'uppercase', fontWeight: 600, marginBottom: '5px' }}>
                                Lateral Location
                            </Typography>
                            <CustomTable tableProp={lateralLocationBody && (lateralLocationBody || {})} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body2' style={{ wordWrap: 'break-word', textTransform: 'uppercase', fontWeight: 600, marginBottom: '5px' }}>
                            Comments
                        </Typography>
                        <Paper elevation={2}>
                            <Grid container xs={12} alignItems="center" justifyContent="center" className={classes.cardContainer}>
                                <Grid item xs={12} className={classes.cardComment}>
                                    <Typography className={classes.tabCardComment}>
                                        {sewerCameraActivity?.comments || "No Comments"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment >
        )
    }

    const Row = ({ row, rowProp, isMobile, setExpanded, expanded, accordionRef, accordNum, rowHeight }) => {
        const [collapseOpen, setCollapseOpen] = useState(false)
        const [value, setValue] = useState(0)
        const [isDrawerOpen, setIsDrawerOpen] = useState(false)
        const [modalOpen, setModalOpen] = useState(false)
        const [tooltipOpen, setTooltipOpen] = useState(false)
        const [woTooltipOpen, setWoTooltipOpen] = useState(false)
        const [poTooltipOpen, setPoTooltipOpen] = useState(false)
        const [nameTooltipOpen, setNameTooltipOpen] = useState(false)
        const [modalVal, setModalVal] = useState({
            jobNumber: "",
            foremanName: "",
            requesterName: ""
        })
        const [approvalVal, setApprovalVal] = useState("")
        const [timelineVal, setTimelineVal] = useState([])
        const [rejectVal, setRejectVal] = useState([
            {
                id: 1,
                rejectionReason: ""
            }
        ])
        const [viewVal, setViewVal] = useState({})

        const [tableVal, setTableVal] = useState({})

        const tabs = [
            { label: 'Production', content: <CustomTable tableProp={tableVal.production && (tableVal.production || {})} /> },
            { label: 'T & M', content: <CustomTable tableProp={tableVal.tandM && (tableVal.tandM || {})} /> },
            { label: 'Labor', content: <CustomTable tableProp={tableVal.labor && (tableVal.labor || {})} /> },
            { label: 'Equipment', content: <CustomTable tableProp={tableVal.equipment && (tableVal.equipment || {})} /> },
            { label: 'Comments', content: <TableCard cardProp={tableVal.comments && (tableVal.comments || {})} /> },
        ];

        const tabsMobile = [
            { label: 'Production', content: <ProdTMComponent paperProp={tableVal.production && (tableVal.production || {})} classes={classes} /> },
            { label: 'T & M', content: <ProdTMComponent paperProp={tableVal.tandM && (tableVal.tandM || {})} classes={classes} /> },
            { label: 'Labor', content: <LaborComponent paperProp={tableVal.labor && (tableVal.labor || {})} classes={classes} /> },
            { label: 'Equipment', content: <EquipmentComponent paperProp={tableVal.equipment && (tableVal.equipment || {})} classes={classes} /> },
            { label: 'Comments', content: <TableCard cardProp={tableVal.comments && (tableVal.comments || {})} /> },
        ];

        const tabsSewer = [
            { label: 'Production', content: <CustomTable tableProp={tableVal.production && (tableVal.production || {})} /> },
            { label: 'T & M', content: <CustomTable tableProp={tableVal.tandM && (tableVal.tandM || {})} /> },
            { label: 'Labor', content: <CustomTable tableProp={tableVal.labor && (tableVal.labor || {})} /> },
            { label: 'Equipment', content: <CustomTable tableProp={tableVal.equipment && (tableVal.equipment || {})} /> },
            { label: 'Sewer Cam', content: <SewerCamTabDesktop props={tableVal.sewerCam && (tableVal.sewerCam || {})} /> },
            { label: 'Comments', content: <TableCard cardProp={tableVal.comments && (tableVal.comments || {})} /> },
        ];

        const tabsMobileSewer = [
            { label: 'Production', content: <ProdTMComponent paperProp={tableVal.production && (tableVal.production || {})} classes={classes} /> },
            { label: 'T & M', content: <ProdTMComponent paperProp={tableVal.tandM && (tableVal.tandM || {})} classes={classes} /> },
            { label: 'Labor', content: <LaborComponent paperProp={tableVal.labor && (tableVal.labor || {})} classes={classes} /> },
            { label: 'Equipment', content: <EquipmentComponent paperProp={tableVal.equipment && (tableVal.equipment || {})} classes={classes} /> },
            { label: 'Sewer Cam', content: <SewerMobileComponent CustomTable={CustomTable} paperProp={tableVal.sewerCam && (tableVal.sewerCam || {})} classes={classes} /> },
            { label: 'Comments', content: <TableCard cardProp={tableVal.comments && (tableVal.comments || {})} /> },
        ];
        const sewerCameraActivity = tableVal?.sewerCam?.sewerCameraActivity;
        const workHeaders = sewerCameraActivity?.header;
        let workBody = [{
            workType: sewerCameraActivity?.activityType,
            county: sewerCameraActivity?.county,
            phase: sewerCameraActivity?.phase,
            inspector: sewerCameraActivity?.inspector,
            truckID: sewerCameraActivity?.truckId
        }]
        const isAllNull = validateAllNull(workBody?.[0]);
        let tabsDesktop = tableVal?.isSewerCam && (!isAllNull) ? tabsSewer : tabs;
        let tabsMb = tableVal?.isSewerCam && (!isAllNull) ? tabsMobileSewer : tabsMobile;

        const handleJobDetails = async (jobId) => {
            setCollapseOpen(!collapseOpen)
            if (!collapseOpen) {
                try {
                    const resp = await props.getJobDetails(jobId, !!pageTab).then(response => {
                        return response
                    })

                    if (resp.status === 200) {
                        setTableVal(resp.data)
                    }
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }
            }
        }

        const handleTabChange = (event, newVal) => {
            setValue(newVal)
        }





        const DrawerLoader = () => {
            const skeletonArray = Array(5).fill('')
            return (
                <Stack spacing={4} width="200px">
                    {skeletonArray.map((item, index) => {
                        return (
                            <Grid container key={index}>
                                <Grid item>
                                    <Skeleton variant='text' />
                                    <Skeleton variant='rectangular' width={250} height={50} />
                                </Grid>
                            </Grid>
                        )
                    })}
                </Stack>
            )
        }

        const handleAccordChange = (panel, jobId) => async (event, isExpanded) => {
            setExpanded(isExpanded ? panel : false)
            if (isExpanded) {
                try {
                    const resp = await props.getJobDetails(jobId, !!pageTab).then(response => {
                        return response
                    })

                    if (resp.status === 200) {
                        setTableVal(resp.data)
                    }
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }
            }
            accordionRef.current?.children[accordNum]?.scrollIntoView()
        }

        const expandMoreStyle = {
            transform: !expanded ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'all 0.5s ease'
        }

        const handleTooltipOpen = (e) => {
            e.stopPropagation()
            setTooltipOpen(!tooltipOpen)
        }

        const handleTooltipClose = () => {
            setTooltipOpen(false)
        }

        const despTruncate = (string, n) => {
            return string?.length > n ? string.substr(0, n - 1) + '...' : string
        }

        const nameTruncate = (string, n) => {
            return string?.length > n ? string.substr(0, n - 1) + '' : string
        }

        return (
            <>
                {!isMobile ? (
                    <>
                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => handleJobDetails(row.id)} className={classes.tableRow}>
                            <TableCell>
                                <IconButton size='small'>
                                    {collapseOpen ? <MdOutlineKeyboardArrowDown /> : <MdOutlineKeyboardArrowRight />}
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                {row.jobNumber}
                            </TableCell>
                            <TableCell>
                                {row.woList.length > 1 ? (
                                    <CustomTooltip title={row.woList.map((wo, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{wo.length > 0 ? wo : 'NA'}{row.woList.length - 1 == index ? "" : ", "}</Typography>)} placement="bottom">
                                        <Typography variant='body2'>
                                            {row.woList[0].length > 0 ? despTruncate(row.woList[0], 7) : "NA"} <Chip label={`+ ${row.woList.length - 1}`} />
                                        </Typography>
                                    </CustomTooltip>
                                ) : row.woList.map((wo, index) => <span key={index}>{wo.length > 0 ? wo : 'NA'}</span>)
                                }
                            </TableCell>
                            <TableCell>
                                {row.poList.length > 1 ? (
                                    <CustomTooltip title={row.poList.map((po, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{po.length > 0 ? po : "NA"}{row.poList.length - 1 == index ? "" : ", "}</Typography>)} placement="bottom">
                                        <Typography variant='body2'>
                                            {row.poList[0].length > 0 ? despTruncate(row.poList[0], 7) : "NA"} <Chip label={`+ ${row.poList.length - 1}`} />
                                        </Typography>
                                    </CustomTooltip>
                                ) : row.poList.map((po, index) => <span style={{ wordWrap: 'break-word' }} key={index}>{po.length > 0 ? po : 'NA'}</span>)
                                }
                            </TableCell>
                            <TableCell>
                                {row.contractNumber}
                            </TableCell>
                            <TableCell>
                                {/* {row.foremanName.length > 15 ? despTruncate(row.foremanName, 15) : row.foremanName} */}
                                {row.foremanName.length > 20 ? (
                                    <CustomTooltip title={<Typography variant='body2' style={{ wordWrap: 'break-word' }}>{row.foremanName}</Typography>} placement="bottom">
                                        <Typography variant='body2'>
                                            {despTruncate(row.foremanName, 20)}
                                        </Typography>
                                    </CustomTooltip>
                                ) : row.foremanName}
                            </TableCell>
                            <TableCell>
                                {dateCalculator(row.jobDate)}
                            </TableCell>
                            <TableCell>
                                <Typography className={`${row.jobStatus === "Approved" ? classes.statusApproved : (row.jobStatus === "Pending" ? classes.statusPending : (row.jobStatus === 'Rejected' ? classes.statusRejected : classes.statusVoided))}`}>{row.jobStatus}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ padding: 0 }} colSpan={12}>
                                <Collapse in={collapseOpen} timeout='auto' unmountOnExit style={{ padding: "10px 20px", background: "#e0e0e0" }}>
                                    <Box sx={{ width: '100%', typography: 'body1', margin: '3' }} style={{ background: '#E0E0E0' }}>
                                        <Grid container justifyContent='center' style={{ borderBottom: "solid 1px #bfbaba" }}>
                                            <Grid item xs={12} md={7}>
                                                <Tabs value={value} onChange={handleTabChange} className={classes.tabs} variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
                                                    {tabsDesktop.length > 0 && tabsDesktop.map(tab => (
                                                        <Tab key={tab.label} label={tab.label} {...a11yProps(tab.label)} />
                                                    ))}
                                                </Tabs>
                                            </Grid>
                                            <Grid item xs={12} md={5}>
                                                <TabActionArea rowVal={row} setModalVal={setModalVal} setIsDrawerOpen={setIsDrawerOpen} setModalOpen={setModalOpen} setApprovalVal={setApprovalVal} setTimelineVal={setTimelineVal} setRejectVal={setRejectVal} setViewVal={setViewVal} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {tabsDesktop?.length > 0 && tabsDesktop.map((tab, index) => (
                                        <TabPanel key={tab.label} value={value} index={index} className={classes.tabPanels}>
                                            {tab.content}
                                        </TabPanel>
                                    ))}
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </>
                ) : (
                    <div id='accordionRow' style={rowHeight && rowHeight}>
                        <Accordion expanded={expanded === `panel${row.id}`} onChange={handleAccordChange(`panel${row.id}`, row.id)} style={{ marginBottom: "10px" }}>
                            <AccordionSummary expandIcon={<MdOutlineKeyboardArrowRight style={expandMoreStyle} />} id={`panel${row.id}bh-header`} aria-controls={`panel${row.id}bh-content`} className={classes.accordionHeader}>
                                <Grid container gap={2}>
                                    <Grid item container justifyContent='space-between' alignItems='center'>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>WO #: {row.woList.length > 1 ? (row.woList[0].length > 0 ? despTruncate(row.woList[0], 7) : 'NA') : (
                                                row.woList[0].length > 0 ? (
                                                    row.woList[0].length > 10 ? (
                                                        <ClickAwayListener onClickAway={() => setWoTooltipOpen(false)}>
                                                            <CustomTooltip
                                                                onClose={() => setWoTooltipOpen(false)}
                                                                open={woTooltipOpen}
                                                                disableHoverListener
                                                                title={row.woList[0]}
                                                            >
                                                                <span>
                                                                    {nameTruncate(row.woList[0], 10)} <Chip onClick={(e) => { e.stopPropagation(); setWoTooltipOpen(!woTooltipOpen) }} label='...' />
                                                                </span>
                                                            </CustomTooltip>
                                                        </ClickAwayListener>
                                                    ) : row.woList[0]
                                                ) : 'NA'
                                            )
                                            } {row.woList.length > 1 && (
                                                <ClickAwayListener onClickAway={() => setWoTooltipOpen(false)}>
                                                    <CustomTooltip
                                                        onClose={() => setWoTooltipOpen(false)}
                                                        open={woTooltipOpen}
                                                        disableHoverListener
                                                        title={row.woList.map((wo, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{wo.length > 0 ? wo : "NA"}{row.woList.length - 1 == index ? "" : ", "}</Typography>)}
                                                    >
                                                        <Chip onClick={(e) => { e.stopPropagation(); setWoTooltipOpen(!woTooltipOpen) }} label={`+ ${row.woList.length - 1}`} />
                                                    </CustomTooltip>
                                                </ClickAwayListener>
                                            )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>PO #: {row.poList.length > 1 ? (row.poList[0].length > 0 ? despTruncate(row.poList[0], 7) : 'NA') : (
                                                row.poList[0].length > 0 ? (
                                                    row.poList[0].length > 10 ? (
                                                        <ClickAwayListener onClickAway={() => setPoTooltipOpen(false)}>
                                                            <CustomTooltip
                                                                onClose={() => setPoTooltipOpen(false)}
                                                                open={poTooltipOpen}
                                                                disableHoverListener
                                                                title={row.poList[0]}
                                                            >
                                                                <span>
                                                                    {nameTruncate(row.poList[0], 10)} <Chip onClick={(e) => { e.stopPropagation(); setPoTooltipOpen(!poTooltipOpen) }} label='...' />
                                                                </span>
                                                            </CustomTooltip>
                                                        </ClickAwayListener>
                                                    ) : row.poList[0]
                                                ) : 'NA'
                                            )
                                            } {row.poList.length > 1 && (
                                                <ClickAwayListener onClickAway={() => setPoTooltipOpen(false)}>
                                                    <CustomTooltip
                                                        onClose={() => setPoTooltipOpen(false)}
                                                        open={poTooltipOpen}
                                                        disableHoverListener
                                                        title={row.poList.map((po, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{po.length > 0 ? po : 'NA'}{row.poList.length - 1 == index ? "" : ", "}</Typography>)}
                                                    >
                                                        <Chip onClick={(e) => { e.stopPropagation(); setPoTooltipOpen(!poTooltipOpen) }} label={`+ ${row.poList.length - 1}`} />
                                                    </CustomTooltip>
                                                </ClickAwayListener>
                                            )}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item container justifyContent='space-between' alignItems='center'>
                                        <Grid item>
                                            {/* <Typography variant='body2'>
                                                {row.foremanName}
                                            </Typography> */}
                                            {row.foremanName.length > 15 ? (
                                                <ClickAwayListener onClickAway={() => setNameTooltipOpen(false)}>
                                                    <CustomTooltip
                                                        onClose={() => setNameTooltipOpen(false)}
                                                        open={nameTooltipOpen}
                                                        disableHoverListener
                                                        title={row.foremanName}
                                                    >
                                                        <Typography variant='body2'>
                                                            {nameTruncate(row.foremanName, 15)} <Chip onClick={(e) => { e.stopPropagation(); setNameTooltipOpen(!nameTooltipOpen) }} label={'...'} />
                                                        </Typography>
                                                    </CustomTooltip>
                                                </ClickAwayListener>
                                            ) : <Typography variant="body2"> {row.foremanName} </Typography>}
                                        </Grid>
                                        {/* <Grid item><Typography variant='body2'>{dateCalculator(row.jobDate).replace(/-/g, "/")}</Typography></Grid> */}
                                        <Grid item><Typography variant='body2' className={`${row.jobStatus === "Approved" ? classes.statusApproved : (row.jobStatus === "Pending" ? classes.statusPending : (row.jobStatus === 'Rejected' ? classes.statusRejected : classes.statusVoided))}`}>{row.jobStatus}</Typography></Grid>
                                        <Grid item>
                                            <ClickAwayListener onClickAway={handleTooltipClose}>
                                                <MoreInfoTooltip
                                                    onClose={handleTooltipClose}
                                                    open={tooltipOpen}
                                                    disableHoverListener
                                                    title={
                                                        <Grid container gap={1}>
                                                            <Grid item container justifyContent='space-between'>
                                                                <Grid item xs={6}><Typography variant='body2'>Job Number:</Typography></Grid>
                                                                <Grid item xs={6}><Typography variant='body2'>{row.jobNumber}</Typography></Grid>
                                                            </Grid>
                                                            <Grid item container justifyContent='space-between'>
                                                                <Grid item xs={6}><Typography variant='body2'>Date:</Typography></Grid>
                                                                <Grid item xs={6}><Typography variant='body2'>{dateCalculator(row.jobDate).replace(/-/g, "/")}</Typography></Grid>
                                                            </Grid>
                                                            <Grid item container justifyContent='space-between'>
                                                                <Grid item xs={6}><Typography variant='body2'>Contract:</Typography></Grid>
                                                                <Grid item xs={6}><Typography variant='body2'>{row.contractNumber}</Typography></Grid>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                    placement="bottom-end"
                                                >
                                                    <Chip onClick={(e) => handleTooltipOpen(e)} icon={<MdInfoOutline style={{ fontSize: "initial" }} />} label="More Info" />
                                                </MoreInfoTooltip>
                                            </ClickAwayListener>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails className={classes.tabContent}>
                                <Grid item xs={12} md={6}>
                                    <Tabs value={value} onChange={handleTabChange} className={classes.tabs} variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example" style={{ borderBottom: "solid 1px #bfbaba" }}>
                                        {tabsMb.map(tab => (
                                            <Tab key={tab.label} label={tab.label} {...a11yProps(tab.label)} />
                                        ))}
                                    </Tabs>
                                    {tabsMb.map((tab, index) => (
                                        <TabPanel key={tab.label} value={value} index={index} className={classes.tabPanels}>
                                            {tab.content}
                                        </TabPanel>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                            <AccordionActions sx={{ borderBottom: '2px solid black' }} style={{ position: "sticky", bottom: "0px", background: "white", padding: "10px 12px" }}>
                                <TabActionArea rowVal={row} setModalVal={setModalVal} setIsDrawerOpen={setIsDrawerOpen} setModalOpen={setModalOpen} setApprovalVal={setApprovalVal} setTimelineVal={setTimelineVal} setRejectVal={setRejectVal} setViewVal={setViewVal} />
                            </AccordionActions>
                        </Accordion>
                    </div>
                )}
                {modalOpen && <CustomModal modalOpen={modalOpen} setContracts={setContracts} defaultSignature={signature} modalVal={modalVal} setModalVal={setModalVal} isResurfacing={!!pageTab} setModalOpen={setModalOpen} approvalVal={approvalVal} rejectVal={rejectVal} viewVal={viewVal} setBodyParamFilter={setBodyParamFilter} bodyParamFilter={bodyParamFilter} setJobForeman={setJobForeman} setJobNos={setJobNos} setWoNos={setWoNos} setPoNos={setPoNos} setJobWeek={setJobWeek} setJobStatus={setJobStatus} statusOption={statusOption} foremanNames={jobs.foremanNames} jobNumbers={jobs.jobNumbers} makeInitialFetch={makeInitialFetch} isRequester={row.isRequester} />}
                <Drawer
                    anchor='right'
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                >
                    <Box width={!isMobile ? 400 : "100vw"} role='presentation' className={classes.drawerBox}>
                        <DrawerHeader className={classes.drawerAlign}>
                            <Typography fontWeight={600}>Audit Tracking Details</Typography>
                            <Tooltip title="Close" TransitionComponent={Zoom}>
                                <IconButton onClick={() => setIsDrawerOpen(false)}>
                                    <MdClose />
                                </IconButton>
                            </Tooltip>
                        </DrawerHeader>
                        {timelineVal.length > 0 ? <TimeLineComponent timelineVal={timelineVal && timelineVal} /> : <DrawerLoader />}
                    </Box>
                </Drawer>
            </>

        )
    }

    const ResurfacingRow = ({ row, rowProp, isMobile, setExpanded, expanded, accordionRef, accordNum, rowHeight }) => {
        const [collapseOpen, setCollapseOpen] = useState(false)
        const [value, setValue] = useState(0)
        const [isDrawerOpen, setIsDrawerOpen] = useState(false)
        const [modalOpen, setModalOpen] = useState(false)
        const [tooltipOpen, setTooltipOpen] = useState(false)
        const [woTooltipOpen, setWoTooltipOpen] = useState(false)
        const [poTooltipOpen, setPoTooltipOpen] = useState(false)
        const [nameTooltipOpen, setNameTooltipOpen] = useState(false)
        const [modalVal, setModalVal] = useState({
            jobNumber: "",
            foremanName: "",
            requesterName: ""
        })
        const [approvalVal, setApprovalVal] = useState("")
        const [timelineVal, setTimelineVal] = useState([])
        const [rejectVal, setRejectVal] = useState([
            {
                id: 1,
                rejectionReason: ""
            }
        ])
        const [viewVal, setViewVal] = useState({})

        const [tableVal, setTableVal] = useState({})
        const [images, setImages] = useState({
            imageData: [],
            loading: true
        });
        const [currentImage, setCurrentImage] = useState(0);
        const [isViewerOpen, setIsViewerOpen] = useState(false);
        const goToPrevious = () => {
            setCurrentImage(prevState => prevState - 1);
        }

        const goToNext = () => {
            setCurrentImage(prevState => prevState + 1);
        }

        const closeViewer = () => {
            setIsViewerOpen(false);
        }

        const openViewer = (index) => {
            setCurrentImage(index);
            setIsViewerOpen(true);
        };

        const tabs = [
            { label: 'Surface(s) Restored', content: <SurfacesRestoredTab surfacesRestoredData={tableVal?.resurfacingDetails} classes={classes} /> },
            { label: 'Additional Material(s)', content: <AdditionalMaterialsTab classes={classes} additionalMaterialData={tableVal?.additionalMaterials} /> },
            {
                label: 'Images',
                content: <ImageAttachmentComponent
                    classes={classes}
                    imgs={images}
                    currentImage={currentImage}
                    isOpen={isViewerOpen}
                    columns={4}
                    onClickPrev={goToPrevious}
                    onClickNext={goToNext}
                    onClose={closeViewer}
                    openViewer={openViewer} />
            },
            { label: 'Comments', content: <CommentsComponent classes={classes} commentsData={tableVal?.comments || []} /> },
        ];

        const tabsMobile = [
            { label: 'Surface(s) Restored', content: <SurfacesRestoredTabMobile classes={classes} surfacesRestoredData={tableVal?.resurfacingDetails} /> },
            { label: 'Additional Material(s)', content: <AdditionalMaterialsTabMobile classes={classes} additionalMaterialData={tableVal?.additionalMaterials} /> },
            {
                label: 'Images', content: <ImageAttachmentComponent
                    classes={classes}
                    imgs={images}
                    currentImage={currentImage}
                    isOpen={isViewerOpen}
                    columns={3}
                    onClickPrev={goToPrevious}
                    onClickNext={goToNext}
                    onClose={closeViewer}
                    openViewer={openViewer} />
            },
            { label: 'Comments', content: <CommentsComponentMobile classes={classes} commentsData={tableVal?.comments || []} /> },
        ];

        const handleJobDetails = async (jobId) => {
            setCollapseOpen(!collapseOpen)
            if (!collapseOpen) {
                try {
                    const resp = await props.getJobDetails(jobId, !!pageTab).then(response => {
                        return response
                    })
                    if (resp.status === 200) {
                        setTableVal(resp.data)
                    }
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }

                try {
                    const imageResp = await props.getResurfacingImages(jobId).then(response => {
                        return response
                    })
                    if (imageResp.status === 200) {
                        setImages((prevState) => ({
                            imageData: imageResp?.data,
                            loading: false
                        }))
                    }
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }
            }
        }

        const handleTabChange = (event, newVal) => {
            setValue(newVal)
        }

        const DrawerLoader = () => {
            const skeletonArray = Array(5).fill('')
            return (
                <Stack spacing={4} width="200px">
                    {skeletonArray.map((item, index) => {
                        return (
                            <Grid container key={index}>
                                <Grid item>
                                    <Skeleton variant='text' />
                                    <Skeleton variant='rectangular' width={250} height={50} />
                                </Grid>
                            </Grid>
                        )
                    })}
                </Stack>
            )
        }

        const handleAccordChange = (panel, jobId) => async (event, isExpanded) => {
            setExpanded(isExpanded ? panel : false)
            if (isExpanded) {
                try {
                    const resp = await props.getJobDetails(jobId, !!pageTab).then(response => {
                        return response
                    })
                    if (resp.status === 200) {
                        setTableVal(resp.data)
                    }
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }

                try {
                    const imageResp = await props.getResurfacingImages(jobId).then(response => {
                        return response
                    })
                    if (imageResp.status === 200) {
                        setImages((prevState) => ({
                            imageData: imageResp?.data,
                            loading: false
                        }))
                    }
                } catch (error) {
                    if (error.response.status == 500) {
                        props.addNotification({ message: 'Internal Server Error - Please try again', type: 'error' });
                    }
                }
            }
            accordionRef.current?.children[accordNum]?.scrollIntoView()
        }

        const expandMoreStyle = {
            transform: !expanded ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'all 0.5s ease'
        }

        const handleTooltipOpen = (e) => {
            e.stopPropagation()
            setTooltipOpen(!tooltipOpen)
        }

        const handleTooltipClose = () => {
            setTooltipOpen(false)
        }

        const despTruncate = (string, n) => {
            return string?.length > n ? string.substr(0, n - 1) + '...' : string
        }

        const nameTruncate = (string, n) => {
            return string?.length > n ? string.substr(0, n - 1) + '' : string
        }

        return (
            <>
                {!isMobile ? (
                    <>
                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => handleJobDetails(row.id)} className={classes.tableRow}>
                            <TableCell>
                                <IconButton size='small'>
                                    {collapseOpen ? <MdOutlineKeyboardArrowDown /> : <MdOutlineKeyboardArrowRight />}
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                {row.jobNumber}
                            </TableCell>
                            <TableCell>
                                {row.woList.length > 1 ? (
                                    <CustomTooltip title={row.woList.map((wo, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{wo.length > 0 ? wo : 'NA'}{row.woList.length - 1 == index ? "" : ", "}</Typography>)} placement="bottom">
                                        <Typography variant='body2'>
                                            {row.woList[0].length > 0 ? despTruncate(row.woList[0], 7) : "NA"} <Chip label={`+ ${row.woList.length - 1}`} />
                                        </Typography>
                                    </CustomTooltip>
                                ) : row.woList.map((wo, index) => <span key={index}>{wo.length > 0 ? wo : 'NA'}</span>)
                                }
                            </TableCell>
                            <TableCell>
                                {row.poList.length > 1 ? (
                                    <CustomTooltip title={row.poList.map((po, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{po.length > 0 ? po : "NA"}{row.poList.length - 1 == index ? "" : ", "}</Typography>)} placement="bottom">
                                        <Typography variant='body2'>
                                            {row.poList[0].length > 0 ? despTruncate(row.poList[0], 7) : "NA"} <Chip label={`+ ${row.poList.length - 1}`} />
                                        </Typography>
                                    </CustomTooltip>
                                ) : row.poList.map((po, index) => <span style={{ wordWrap: 'break-word' }} key={index}>{po.length > 0 ? po : 'NA'}</span>)
                                }
                            </TableCell>
                            <TableCell>
                                <Tooltip title={row?.address}>
                                    <Typography variant='body2'>
                                        {shortString(row?.address || '', 17) || ''}
                                    </Typography>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                {row.contractNumber}
                            </TableCell>
                            <TableCell width={150}>
                                {/* {row.foremanName.length > 15 ? despTruncate(row.foremanName, 15) : row.foremanName} */}
                                {row.foremanName.length > 15 ? (
                                    <CustomTooltip title={<Typography variant='body2' style={{ wordWrap: 'break-word' }}>{row.foremanName}</Typography>} placement="bottom">
                                        <Typography variant='body2'>
                                            {despTruncate(row.foremanName, 15)}
                                        </Typography>
                                    </CustomTooltip>
                                ) : row.foremanName}
                            </TableCell>
                            <TableCell>
                                {dateCalculator(row.jobDate)}
                            </TableCell>
                            <TableCell>
                                <Typography className={`${row.jobStatus === "Approved" ? classes.statusApproved : (row.jobStatus === "Pending" ? classes.statusPending : (row.jobStatus === 'Rejected' ? classes.statusRejected : classes.statusVoided))}`}>{row.jobStatus}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ padding: 0 }} colSpan={12}>
                                <Collapse in={collapseOpen} timeout='auto' unmountOnExit style={{ padding: "10px 20px", background: "#e0e0e0" }}>
                                    <Box sx={{ width: '100%', typography: 'body1', margin: '3' }} style={{ background: '#E0E0E0' }}>
                                        <Grid container justifyContent='center' style={{ borderBottom: "solid 1px #bfbaba" }}>
                                            <Grid item xs={12} md={7.5}>
                                                <Tabs value={value} onChange={handleTabChange} className={classes.tabs} variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
                                                    {tabs.length > 0 && tabs.map(tab => (
                                                        <Tab key={tab.label} label={tab.label} {...a11yProps(tab.label)} />
                                                    ))}
                                                </Tabs>
                                            </Grid>
                                            <Grid item xs={12} md={4.5}>
                                                <TabActionArea rowVal={row} setModalVal={setModalVal} setIsDrawerOpen={setIsDrawerOpen} setModalOpen={setModalOpen} setApprovalVal={setApprovalVal} setTimelineVal={setTimelineVal} setRejectVal={setRejectVal} setViewVal={setViewVal} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {tabs?.length > 0 && tabs.map((tab, index) => (
                                        <TabPanel key={tab.label} value={value} index={index} className={classes.tabPanels}>
                                            {tab.content}
                                        </TabPanel>
                                    ))}
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </>
                ) : (
                    <div id='accordionRow' style={rowHeight && rowHeight} sx={{ border: '1px solid green' }}>
                        <Accordion expanded={expanded === `panel${row.id}`} onChange={handleAccordChange(`panel${row.id}`, row.id)} style={{ marginBottom: "10px" }}>
                            <AccordionSummary expandIcon={<MdOutlineKeyboardArrowRight style={expandMoreStyle} />} id={`panel${row.id}bh-header`} aria-controls={`panel${row.id}bh-content`} className={classes.accordionHeader}>
                                <Grid container gap={2}>
                                    <Grid item container justifyContent='space-between' alignItems='center'>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>WO #: {row.woList.length > 1 ? (row.woList[0].length > 0 ? despTruncate(row.woList[0], 7) : 'NA') : (
                                                row.woList[0].length > 0 ? (
                                                    row.woList[0].length > 10 ? (
                                                        <ClickAwayListener onClickAway={() => setWoTooltipOpen(false)}>
                                                            <CustomTooltip
                                                                onClose={() => setWoTooltipOpen(false)}
                                                                open={woTooltipOpen}
                                                                disableHoverListener
                                                                title={row.woList[0]}
                                                            >
                                                                <span>
                                                                    {nameTruncate(row.woList[0], 10)} <Chip onClick={(e) => { e.stopPropagation(); setWoTooltipOpen(!woTooltipOpen) }} label='...' />
                                                                </span>
                                                            </CustomTooltip>
                                                        </ClickAwayListener>
                                                    ) : row.woList[0]
                                                ) : 'NA'
                                            )
                                            } {row.woList.length > 1 && (
                                                <ClickAwayListener onClickAway={() => setWoTooltipOpen(false)}>
                                                    <CustomTooltip
                                                        onClose={() => setWoTooltipOpen(false)}
                                                        open={woTooltipOpen}
                                                        disableHoverListener
                                                        title={row.woList.map((wo, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{wo.length > 0 ? wo : "NA"}{row.woList.length - 1 == index ? "" : ", "}</Typography>)}
                                                    >
                                                        <Chip onClick={(e) => { e.stopPropagation(); setWoTooltipOpen(!woTooltipOpen) }} label={`+ ${row.woList.length - 1}`} />
                                                    </CustomTooltip>
                                                </ClickAwayListener>
                                            )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>PO #: {row.poList.length > 1 ? (row.poList[0].length > 0 ? despTruncate(row.poList[0], 7) : 'NA') : (
                                                row.poList[0].length > 0 ? (
                                                    row.poList[0].length > 10 ? (
                                                        <ClickAwayListener onClickAway={() => setPoTooltipOpen(false)}>
                                                            <CustomTooltip
                                                                onClose={() => setPoTooltipOpen(false)}
                                                                open={poTooltipOpen}
                                                                disableHoverListener
                                                                title={row.poList[0]}
                                                            >
                                                                <span>
                                                                    {nameTruncate(row.poList[0], 10)} <Chip onClick={(e) => { e.stopPropagation(); setPoTooltipOpen(!poTooltipOpen) }} label='...' />
                                                                </span>
                                                            </CustomTooltip>
                                                        </ClickAwayListener>
                                                    ) : row.poList[0]
                                                ) : 'NA'
                                            )
                                            } {row.poList.length > 1 && (
                                                <ClickAwayListener onClickAway={() => setPoTooltipOpen(false)}>
                                                    <CustomTooltip
                                                        onClose={() => setPoTooltipOpen(false)}
                                                        open={poTooltipOpen}
                                                        disableHoverListener
                                                        title={row.poList.map((po, index) => <Typography variant='body2' style={{ wordWrap: 'break-word' }} key={index}>{po.length > 0 ? po : 'NA'}{row.poList.length - 1 == index ? "" : ", "}</Typography>)}
                                                    >
                                                        <Chip onClick={(e) => { e.stopPropagation(); setPoTooltipOpen(!poTooltipOpen) }} label={`+ ${row.poList.length - 1}`} />
                                                    </CustomTooltip>
                                                </ClickAwayListener>
                                            )}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item container justifyContent='space-between' alignItems='center'>
                                        <Grid item>
                                            {/* <Typography variant='body2'>
                                                {row.foremanName}
                                            </Typography> */}
                                            {row.foremanName.length > 15 ? (
                                                <ClickAwayListener onClickAway={() => setNameTooltipOpen(false)}>
                                                    <CustomTooltip
                                                        onClose={() => setNameTooltipOpen(false)}
                                                        open={nameTooltipOpen}
                                                        disableHoverListener
                                                        title={row.foremanName}
                                                    >
                                                        <Typography variant='body2'>
                                                            {nameTruncate(row.foremanName, 15)} <Chip onClick={(e) => { e.stopPropagation(); setNameTooltipOpen(!nameTooltipOpen) }} label={'...'} />
                                                        </Typography>
                                                    </CustomTooltip>
                                                </ClickAwayListener>
                                            ) : <Typography variant="body2"> {row.foremanName} </Typography>}
                                        </Grid>
                                        {/* <Grid item><Typography variant='body2'>{dateCalculator(row.jobDate).replace(/-/g, "/")}</Typography></Grid> */}
                                        <Grid item><Typography variant='body2' className={`${row.jobStatus === "Approved" ? classes.statusApproved : (row.jobStatus === "Pending" ? classes.statusPending : (row.jobStatus === 'Rejected' ? classes.statusRejected : classes.statusVoided))}`}>{row.jobStatus}</Typography></Grid>
                                        <Grid item>
                                            <ClickAwayListener onClickAway={handleTooltipClose}>
                                                <MoreInfoTooltip
                                                    onClose={handleTooltipClose}
                                                    open={tooltipOpen}
                                                    disableHoverListener
                                                    title={
                                                        <Grid container gap={1}>
                                                            <Grid item container justifyContent='space-between'>
                                                                <Grid item xs={6}><Typography variant='body2'>Job Number:</Typography></Grid>
                                                                <Grid item xs={6}><Typography variant='body2'>{row.jobNumber}</Typography></Grid>
                                                            </Grid>
                                                            <Grid item container justifyContent='space-between'>
                                                                <Grid item xs={6}><Typography variant='body2'>Date:</Typography></Grid>
                                                                <Grid item xs={6}><Typography variant='body2'>{dateCalculator(row.jobDate).replace(/-/g, "/")}</Typography></Grid>
                                                            </Grid>
                                                            <Grid item container justifyContent='space-between'>
                                                                <Grid item xs={6}><Typography variant='body2'>Contract:</Typography></Grid>
                                                                <Grid item xs={6}><Typography variant='body2'>{row.contractNumber}</Typography></Grid>
                                                            </Grid>
                                                            {row.address &&
                                                                <Grid item container justifyContent='space-between'>
                                                                    <Grid item xs={6}><Typography variant='body2'>Address:</Typography></Grid>
                                                                    <Grid item xs={6}><Typography variant='body2'>{row.address}</Typography></Grid>
                                                                </Grid>
                                                            }
                                                        </Grid>
                                                    }
                                                    placement="bottom-end"
                                                >
                                                    <Chip onClick={(e) => handleTooltipOpen(e)} icon={<MdInfoOutline style={{ fontSize: "initial" }} />} label="More Info" />
                                                </MoreInfoTooltip>
                                            </ClickAwayListener>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails className={classes.tabContent}>
                                <Grid item xs={12} md={6}>
                                    <Tabs value={value} onChange={handleTabChange} className={classes.tabs} variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example" style={{ borderBottom: "solid 1px #bfbaba" }}>
                                        {tabsMobile.map(tab => (
                                            <Tab key={tab.label} label={tab.label} {...a11yProps(tab.label)} />
                                        ))}
                                    </Tabs>
                                    {tabsMobile.map((tab, index) => (
                                        <TabPanel key={tab.label} value={value} index={index} className={classes.tabPanels}>
                                            {tab.content}
                                        </TabPanel>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                            <AccordionActions sx={{ borderBottom: '2px solid black' }} style={{ position: "sticky", bottom: "0px", background: "white", padding: "10px 12px" }}>
                                <TabActionArea rowVal={row} setModalVal={setModalVal} setIsDrawerOpen={setIsDrawerOpen} setModalOpen={setModalOpen} setApprovalVal={setApprovalVal} setTimelineVal={setTimelineVal} setRejectVal={setRejectVal} setViewVal={setViewVal} />
                            </AccordionActions>
                        </Accordion>
                    </div>
                )}
                {modalOpen && <CustomModal modalOpen={modalOpen} isResurfacing={!!pageTab} defaultSignature={signature} modalVal={modalVal} setModalVal={setModalVal} setModalOpen={setModalOpen} approvalVal={approvalVal} rejectVal={rejectVal} viewVal={viewVal} setBodyParamFilter={setBodyParamFilter} bodyParamFilter={bodyParamFilter} setJobForeman={setJobForeman} setJobNos={setJobNos} setWoNos={setWoNos} setContracts={setContracts} setPoNos={setPoNos} setJobWeek={setJobWeek} setJobStatus={setJobStatus} statusOption={statusOption} foremanNames={jobs.foremanNames} jobNumbers={jobs.jobNumbers} makeInitialFetch={makeInitialFetch} isRequester={row.isRequester} />}
                <Drawer
                    anchor='right'
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                >
                    <Box width={!isMobile ? 400 : "100vw"} role='presentation' className={classes.drawerBox}>
                        <DrawerHeader className={classes.drawerAlign}>
                            <Typography fontWeight={600}>Audit Tracking Details</Typography>
                            <Tooltip title="Close" TransitionComponent={Zoom}>
                                <IconButton onClick={() => setIsDrawerOpen(false)}>
                                    <MdClose />
                                </IconButton>
                            </Tooltip>
                        </DrawerHeader>
                        {timelineVal.length > 0 ? <TimeLineComponent timelineVal={timelineVal && timelineVal} /> : <DrawerLoader />}
                    </Box>
                </Drawer>
            </>

        )
    }

    const DailyActivityFilters = (props) => {
        return (
            <React.Fragment>
                {!isMobile ?
                    <Grid container className={classes.searchArea} sx={{ marginBottom: '10px' }}>
                        <Grid item xs={10} md={3} style={{ padding: "0px" }}>
                            <Grid container spacing={1}>
                                <Grid item xs={8} md={12}>
                                    <CustomInput
                                        inputProps={{ maxLength: 100 }}
                                        name="search"
                                        label="Search for a foreman"
                                        fieldType="autocomplete"
                                        width={300}
                                        value={jobForeman}
                                        onChange={(e, newJobValue) => handleForemanSearch(e, newJobValue)}
                                        options={jobs.foremanNames}
                                        startAdornment={<FiSearch fontSize='medium' />}
                                        endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={8.5} container style={{ padding: '0px' }}>
                            <Grid container spacing={1} style={{ justifyContent: 'space-between', alignItems: "center" }}>
                                <Grid item xs={2.2}>
                                    <CustomInput
                                        // inputProps={{ maxLength: 100 }}
                                        name="wono"
                                        // label="Jobno"
                                        hideOutline
                                        variant="standard"
                                        fieldType="autocomplete"
                                        value={woNos}
                                        onChange={(e, newWoNum) => handleWoNum(e, newWoNum)}
                                        options={jobs.workOrderNumbers}
                                        startAdornment={<FiSearch fontSize='medium' />}
                                        endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                    />
                                </Grid>
                                <Grid item xs={2.2}>
                                    <CustomInput
                                        // inputProps={{ maxLength: 100 }}
                                        name="pono"
                                        // label="Jobno"
                                        hideOutline
                                        variant="standard"
                                        fieldType="autocomplete"
                                        value={poNos}
                                        onChange={(e, newPoNum) => handlePoNum(e, newPoNum)}
                                        options={jobs.purchaseOrderNumbers}
                                        startAdornment={<FiSearch fontSize='medium' />}
                                        endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                    />
                                </Grid>
                                <Grid item xs={2.2}>
                                    <CustomInput
                                        name="contract"
                                        // label="Jobno"
                                        hideOutline
                                        variant="standard"
                                        fieldType="autocomplete"
                                        value={contracts}
                                        onChange={(e, newContract) => handleContractsChange(e, newContract)}
                                        options={jobs.contracts}
                                        startAdornment={<FiSearch fontSize='medium' />}
                                        endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                    />
                                </Grid>
                                {/* <Grid item xs={2}>
                                    <DropDown
                                        name="status"
                                        // label="Status"
                                        placeholder="Status"
                                        minWidth='130px'
                                        keyToBind={{ key: 'id', value: 'name' }}
                                        options={statusOption}
                                        value={jobStatus}
                                        onChange={handleJobStatus}
                                        // hideOutline
                                        variant="standard"
                                        formControlStyle={selectAlign}
                                    />
                                </Grid> */}
                                <Grid item xs={2.2}>
                                    <CustomInput
                                        // inputProps={{ maxLength: 100 }}
                                        name="jobno"
                                        // label="Jobno"
                                        hideOutline
                                        variant="standard"
                                        fieldType="autocomplete"
                                        value={jobNos}
                                        onChange={(e, newJobNum) => handleJobNum(e, newJobNum)}
                                        options={jobs.jobNumbers}
                                        startAdornment={<FiSearch fontSize='medium' />}
                                        endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                    />
                                </Grid>
                                {/* <Grid item xs={2}>
                                    <DropDown
                                        name="week"
                                        // label="Week"
                                        placeholder="Week"
                                        minWidth='130px'
                                        keyToBind={{ key: 'id', value: 'name' }}
                                        options={weeksOption}
                                        value={jobWeek}
                                        onChange={handleJobWeek}
                                        // hideOutline
                                        variant="standard"
                                        formControlStyle={selectAlign}
                                    />
                                </Grid> */}
                                <Grid item xs={2} style={{ flex: "unset" }}>
                                    <Tooltip title="Clear all filters" arrow TransitionComponent={Zoom}>
                                        <IconButton onClick={handleFilter}>
                                            <RiFilterOffLine />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid> :
                    <div className={classes.searchMobSection}>
                        <Grid container style={{ display: 'flex' }}>
                            <Grid item xs={10} spacing={2}>
                                <CustomInput
                                    inputProps={{ maxLength: 100 }}
                                    name="search"
                                    label="Search for a foreman"
                                    fieldType="autocomplete"
                                    width={300}
                                    value={jobForeman}
                                    onChange={(e, newJobValue) =>
                                        handleForemanSearch(e, newJobValue)
                                    }
                                    options={jobs.foremanNames}
                                    startAdornment={<FiSearch fontSize="medium" />}
                                    endAdornment={<MdOutlineKeyboardArrowDown fontSize="small" />}
                                />
                            </Grid>
                            <Grid item xs={2} md={12} container style={{ padding: "0px", justifyContent: "flex-end" }}>
                                <IconButton
                                    id="demo-customized-button"
                                    variant="contained"
                                    disableElevation
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                >
                                    <RiFilter2Fill />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Drawer
                            anchor='bottom'
                            open={isFilterDrawerOpen}
                            onClose={() => setIsFilterDrawerOpen(false)}
                        >
                            <Box width={"100vw"} height={"100vh"} role='presentation' className={classes.drawerBox}>
                                <DrawerHeader className={classes.drawerAlign}>
                                    <Typography fontWeight={600}>Filters</Typography>
                                    <Tooltip title="Close" TransitionComponent={Zoom}>
                                        <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
                                            <MdClose />
                                        </IconButton>
                                    </Tooltip>
                                </DrawerHeader>
                                <Grid container>
                                    <Grid item container gap={4} style={{ padding: "20px" }}>
                                        {/* <Grid item container gap={1}>
                                            <Typography>Week:</Typography>
                                            <DropDown
                                                name="week"
                                                placeholder="Week"
                                                keyToBind={{ key: 'id', value: 'name' }}
                                                options={weeksOption}
                                                value={jobWeek}
                                                onChange={handleJobWeek}
                                                variant="standard"
                                                formControlStyle={selectAlign}
                                                formStyle={{ margin: "0px" }}
                                            />
                                        </Grid> */}
                                        <Grid item container gap={1}>
                                            <Typography>Job Number:</Typography>
                                            <CustomInput
                                                name="jobno"
                                                variant="standard"
                                                fieldType="autocomplete"
                                                value={jobNos}
                                                width="100%"
                                                onChange={(e, newJobNum) => handleJobNum(e, newJobNum)}
                                                options={jobs.jobNumbers}
                                                startAdornment={<FiSearch fontSize='medium' />}
                                                endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                            />
                                        </Grid>
                                        <Grid item container gap={1}>
                                            <Typography>WO #:</Typography>
                                            <CustomInput
                                                name="wo"
                                                variant="standard"
                                                fieldType="autocomplete"
                                                value={woNos}
                                                width="100%"
                                                onChange={(e, newWoNum) => handleWoNum(e, newWoNum)}
                                                options={jobs.workOrderNumbers}
                                                startAdornment={<FiSearch fontSize='medium' />}
                                                endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                            />
                                        </Grid>
                                        <Grid item container gap={1}>
                                            <Typography>PO #:</Typography>
                                            <CustomInput
                                                name="po"
                                                variant="standard"
                                                fieldType="autocomplete"
                                                value={poNos}
                                                width="100%"
                                                onChange={(e, newPoNum) => handlePoNum(e, newPoNum)}
                                                options={jobs.purchaseOrderNumbers}
                                                startAdornment={<FiSearch fontSize='medium' />}
                                                endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                            />
                                        </Grid>
                                        <Grid item container gap={1}>
                                            <Typography>Contract #: </Typography>
                                            <CustomInput
                                                name="contract"
                                                variant="standard"
                                                fieldType="autocomplete"
                                                value={contracts}
                                                width="100%"
                                                onChange={(e, newContract) => handleContractsChange(e, newContract)}
                                                options={jobs.contracts}
                                                startAdornment={<FiSearch fontSize='medium' />}
                                                endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container className={classes.drawerFooterGrid}>
                                        <DrawerFooter>
                                            <CustomButton
                                                fullHeight
                                                sizeValue='small'
                                                type="white"
                                                id="Clear"
                                                onClick={handleFilter}
                                                primary='Clear'
                                                customStyle={{ width: "125px" }}
                                            />
                                            <CustomButton
                                                fullHeight
                                                sizeValue='small'
                                                type="primary"
                                                id="Apply"
                                                onClick={() => handleApplyFilter()}
                                                primary='Apply'
                                                customStyle={{ width: "125px" }}
                                            />
                                        </DrawerFooter>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Drawer>
                    </div>
                }
            </React.Fragment>
        )
    }

    const ResurfacingFilters = (props) => {
        if (isMobile) {
            return (
                <div className={classes.searchMobSection}>
                    <Grid container style={{ display: 'flex' }}>
                        <Grid item xs={10} spacing={2}>
                            <CustomInput
                                inputProps={{ maxLength: 100 }}
                                name="search"
                                label="Search for a foreman"
                                fieldType="autocomplete"
                                width={300}
                                value={jobForeman}
                                onChange={(e, newJobValue) =>
                                    handleForemanSearch(e, newJobValue)
                                }
                                options={jobs.foremanNames}
                                startAdornment={<FiSearch fontSize="medium" />}
                                endAdornment={<MdOutlineKeyboardArrowDown fontSize="small" />}
                            />
                        </Grid>
                        <Grid item xs={2} md={12} container style={{ padding: "0px", justifyContent: "flex-end" }}>
                            <IconButton
                                id="demo-customized-button"
                                variant="contained"
                                disableElevation
                                onClick={() => setIsFilterDrawerOpen(true)}
                            >
                                <RiFilter2Fill />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Drawer
                        anchor='bottom'
                        open={isFilterDrawerOpen}
                        onClose={() => setIsFilterDrawerOpen(false)}
                    >
                        <Box width={"100vw"} height={"100vh"} role='presentation' className={classes.drawerBox}>
                            <DrawerHeader className={classes.drawerAlign}>
                                <Typography fontWeight={600}>Filters</Typography>
                                <Tooltip title="Close" TransitionComponent={Zoom}>
                                    <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
                                        <MdClose />
                                    </IconButton>
                                </Tooltip>
                            </DrawerHeader>
                            <Grid container>
                                <Grid item container gap={4} style={{ padding: "20px" }}>
                                    {/* <Grid item container gap={1}>
                                        <Typography>Week:</Typography>
                                        <DropDown
                                            name="week"
                                            placeholder="Week"
                                            keyToBind={{ key: 'id', value: 'name' }}
                                            options={weeksOption}
                                            value={jobWeek}
                                            onChange={handleJobWeek}
                                            variant="standard"
                                            formControlStyle={selectAlign}
                                            formStyle={{ margin: "0px" }}
                                        />
                                    </Grid> */}
                                    <Grid item container gap={1}>
                                        <Typography>Job #:</Typography>
                                        <CustomInput
                                            name="jobno"
                                            variant="standard"
                                            fieldType="autocomplete"
                                            value={jobNos}
                                            width="100%"
                                            onChange={(e, newJobNum) => handleJobNum(e, newJobNum)}
                                            options={jobs.jobNumbers}
                                            startAdornment={<FiSearch fontSize='medium' />}
                                            endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                        />
                                    </Grid>
                                    <Grid item container gap={1}>
                                        <Typography>WO #:</Typography>
                                        <CustomInput
                                            name="wo"
                                            variant="standard"
                                            fieldType="autocomplete"
                                            value={woNos}
                                            width="100%"
                                            onChange={(e, newWoNum) => handleWoNum(e, newWoNum)}
                                            options={jobs.workOrderNumbers}
                                            startAdornment={<FiSearch fontSize='medium' />}
                                            endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                        />
                                    </Grid>
                                    <Grid item container gap={1}>
                                        <Typography>PO #:</Typography>
                                        <CustomInput
                                            name="po"
                                            variant="standard"
                                            fieldType="autocomplete"
                                            value={poNos}
                                            width="100%"
                                            onChange={(e, newPoNum) => handlePoNum(e, newPoNum)}
                                            options={jobs.purchaseOrderNumbers}
                                            startAdornment={<FiSearch fontSize='medium' />}
                                            endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                        />
                                    </Grid>
                                    <Grid item container gap={1}>
                                        <Typography>Contract #: </Typography>
                                        <CustomInput
                                            name="contract"
                                            variant="standard"
                                            fieldType="autocomplete"
                                            value={contracts}
                                            width="100%"
                                            onChange={(e, newContract) => handleContractsChange(e, newContract)}
                                            options={jobs.contracts}
                                            startAdornment={<FiSearch fontSize='medium' />}
                                            endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                        />
                                    </Grid>
                                    {/* <Grid item container gap={1}>
                                        <Typography>Status:</Typography>
                                        <DropDown
                                            name="status"
                                            placeholder="Status"
                                            keyToBind={{ key: 'id', value: 'name' }}
                                            options={statusOption}
                                            value={jobStatus}
                                            onChange={handleJobStatus}
                                            variant="standard"
                                            formControlStyle={selectAlign}
                                            formStyle={{ margin: "0px" }}
                                        />
                                    </Grid> */}
                                </Grid>
                                <Grid item container className={classes.drawerFooterGrid}>
                                    <DrawerFooter>
                                        <CustomButton
                                            fullHeight
                                            sizeValue='small'
                                            type="white"
                                            id="Clear"
                                            onClick={handleFilter}
                                            primary='Clear'
                                            customStyle={{ width: "125px" }}
                                        />
                                        <CustomButton
                                            fullHeight
                                            sizeValue='small'
                                            type="primary"
                                            id="Apply"
                                            onClick={() => handleApplyFilter()}
                                            primary='Apply'
                                            customStyle={{ width: "125px" }}
                                        />
                                    </DrawerFooter>
                                </Grid>
                            </Grid>
                        </Box>
                    </Drawer>
                </div>
            )
        }
        return (
            <React.Fragment>
                <Grid container className={classes.searchArea} sx={{ marginBottom: '10px' }}>
                    <Grid item xs={10} md={3} style={{ padding: "0px" }}>
                        <Grid container spacing={1}>
                            <Grid item xs={8} md={12}>
                                <CustomInput
                                    inputProps={{ maxLength: 100 }}
                                    name="search"
                                    label="Search for a foreman"
                                    fieldType="autocomplete"
                                    width={300}
                                    value={jobForeman}
                                    onChange={(e, newJobValue) => handleForemanSearch(e, newJobValue)}
                                    options={jobs.foremanNames}
                                    startAdornment={<FiSearch fontSize='medium' />}
                                    endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={8.5} container style={{ padding: '0px' }}>
                        <Grid container spacing={1} style={{ justifyContent: 'space-between', alignItems: "center" }}>
                            <Grid item xs={2.2}>
                                <CustomInput
                                    // inputProps={{ maxLength: 100 }}
                                    name="wono"
                                    // label="Jobno"
                                    hideOutline
                                    variant="standard"
                                    fieldType="autocomplete"
                                    value={woNos}
                                    onChange={(e, newWoNum) => handleWoNum(e, newWoNum)}
                                    options={jobs.workOrderNumbers}
                                    startAdornment={<FiSearch fontSize='medium' />}
                                    endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                />
                            </Grid>
                            <Grid item xs={2.2}>
                                <CustomInput
                                    // inputProps={{ maxLength: 100 }}
                                    name="pono"
                                    // label="Jobno"
                                    hideOutline
                                    variant="standard"
                                    fieldType="autocomplete"
                                    value={poNos}
                                    onChange={(e, newPoNum) => handlePoNum(e, newPoNum)}
                                    options={jobs.purchaseOrderNumbers}
                                    startAdornment={<FiSearch fontSize='medium' />}
                                    endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                />
                            </Grid>
                            <Grid item xs={2.2}>
                                <CustomInput
                                    name="contract"
                                    // label="Jobno"
                                    hideOutline
                                    variant="standard"
                                    fieldType="autocomplete"
                                    value={contracts}
                                    onChange={(e, newContract) => handleContractsChange(e, newContract)}
                                    options={jobs.contracts}
                                    startAdornment={<FiSearch fontSize='medium' />}
                                    endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                />
                            </Grid>
                            <Grid item xs={2.2}>
                                <CustomInput
                                    // inputProps={{ maxLength: 100 }}
                                    name="jobno"
                                    // label="Jobno"
                                    hideOutline
                                    variant="standard"
                                    fieldType="autocomplete"
                                    value={jobNos}
                                    onChange={(e, newJobNum) => handleJobNum(e, newJobNum)}
                                    options={jobs.jobNumbers}
                                    startAdornment={<FiSearch fontSize='medium' />}
                                    endAdornment={<MdOutlineKeyboardArrowDown fontSize='small' />}
                                />
                            </Grid>
                            {/* <Grid item xs={2}>
                                <DropDown
                                    name="week"
                                    // label="Week"
                                    placeholder="Week"
                                    minWidth='130px'
                                    keyToBind={{ key: 'id', value: 'name' }}
                                    options={weeksOption}
                                    value={jobWeek}
                                    onChange={handleJobWeek}
                                    // hideOutline
                                    variant="standard"
                                    formControlStyle={selectAlign}
                                />
                            </Grid> */}
                            <Grid item xs={2} style={{ flex: "unset" }}>
                                <Tooltip title="Clear all filters" arrow TransitionComponent={Zoom}>
                                    <IconButton onClick={handleFilter}>
                                        <RiFilterOffLine />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    const handleJobStatus = (e) => {
        setJobStatus(e.target.value)
        if (!isMobile) {
            const selectedStatus = statusOption.find((item) => {
                return item.id === e.target.value
            })
            setBodyParamFilter((prevState) => ({
                ...prevState,
                status: selectedStatus.name
            }))
            setIsLoading(true)
        }
    }

    const handleJobWeek = (e) => {
        setJobWeek(e.target.value)
        const selectedWeek = weeksOption.find((item) => {
            return item.id === e.target.value
        })
        if (!isMobile) {
            setBodyParamFilter((prevState) => ({
                ...prevState,
                currentWeek: selectedWeek.id === 1 ? true : false
            }))
            setIsLoading(true)
        } else {
            setJobForeman('')
            setJobNos('All Jobs')
            setWoNos('All WO #')
            setPoNos('All PO #')
            setJobStatus(2)
            setMobFilterParam((prevState) => ({
                ...prevState,
                currentWeek: selectedWeek.id === 1 ? true : false
            }))
            setIsLoading(true)
        }
    }

    const handleForemanSearch = (e, newJobValue) => {
        setJobForeman(newJobValue)
        setBodyParamFilter((prevState) => ({
            ...prevState,
            foremanName: newJobValue
        }))
        setIsLoading(true)
    }

    const handleJobNum = (e, newJobNum) => {
        if (newJobNum) {
            setJobNos(newJobNum)
        } else {
            setJobNos('All Jobs')
        }

        if (!isMobile) {
            setBodyParamFilter((prevState) => ({
                ...prevState,
                jobNumber: newJobNum ? newJobNum : 'All Jobs'
            }))
            setIsLoading(true)
        }
    }

    const handleWoNum = (e, newWoNum) => {
        if (newWoNum) {
            setWoNos(newWoNum)
        } else {
            setWoNos('All WO #')
        }

        if (!isMobile) {
            setBodyParamFilter((prevState) => ({
                ...prevState,
                wo: newWoNum ? newWoNum.replace(/[\(\)']+/g, '') : 'All WO #'
            }))
            setIsLoading(true)
        }
    }

    const handlePoNum = (e, newPoNum) => {
        if (newPoNum) {
            setPoNos(newPoNum)
        } else {
            setPoNos('All PO #')
        }

        if (!isMobile) {
            setBodyParamFilter((prevState) => ({
                ...prevState,
                po: newPoNum ? newPoNum.replace(/[\(\)']+/g, '') : 'All PO #'
            }))
            setIsLoading(true)
        }
    }

    const handleContractsChange = (e, newContract) => {
        if (newContract) {
            setContracts(newContract)
        } else {
            setContracts('All Contracts')
        }

        if (!isMobile) {
            setBodyParamFilter((prevState) => ({
                ...prevState,
                contractNumber: newContract ? newContract : 'All Contracts'
            }))
            setIsLoading(true)
        }
    }

    const handleStatusCard = (status) => {
        const clickedStatus = statusOption.find((item) => {
            return item.name === status
        })
        setIsLoading(true)
        setJobStatus(clickedStatus.id)
        setBodyParamFilter((prevState) => ({
            ...prevState,
            status: status
        }))
    }

    const handleFilter = () => {
        setIsLoading(true)
        setJobForeman('')
        setJobNos('All Jobs')
        setWoNos('All WO #')
        setPoNos('All PO #')
        setContracts('All Contracts')
        setJobWeek(2)
        setBodyParamFilter((prevState) => ({
            ...prevState,
            foremanName: "",
            jobNumber: "All Jobs",
            contractNumber: 'All Contracts',
            currentWeek: false,
            wo: 'All WO #',
            po: 'All PO #',
            isResurfacing: !!pageTab
        }))
    }

    const handleFilteronPageSwitch = () => {
        setIsLoading(true)
        setJobForeman('')
        setJobNos('All Jobs')
        setWoNos('All WO #')
        setPoNos('All PO #')
        setContracts('All Contracts')
        setJobWeek(2)
        setJobStatus(2)
        setBodyParamFilter((prevState) => ({
            ...prevState,
            foremanName: "",
            jobNumber: "All Jobs",
            status: "Pending",
            contractNumber: 'All Contracts',
            currentWeek: false,
            wo: 'All WO #',
            po: 'All PO #',
            isResurfacing: !!pageTab
        }))
    }

    const handleApplyFilter = () => {
        const selectedStatus = statusOption.find((item) => {
            return item.id === jobStatus
        })
        const selectedWeek = weeksOption.find((item) => {
            return item.id === jobWeek
        })

        setBodyParamFilter((prevState) => ({
            ...prevState,
            currentWeek: selectedWeek.id === 1 ? true : false,
            foremanName: jobForeman ? jobForeman : "All",
            jobNumber: jobNos,
            wo: woNos,
            po: poNos,
            contractNumber: contracts,
            isResurfacing: !!pageTab,
            status: selectedStatus.name
        }))
        setIsLoading(true)
        setIsFilterDrawerOpen(false)
        makeInitialCountFetchOtherTab()
    }

    useEffect(() => {
        const oldLockdown = jobs?.lockdownDate || '';
        async function fetchData() {
            const resp = await props.getAllJobs(bodyParamFilter).then(res => {
                return res
            })
            if (resp.status === 200) {
                setIsLoading(false)
                setJobs(() => ({
                    foremanNames: resp.data.foremanNames,
                    jobDetails: !!pageTab ? resp.data.resurfacingDetails : resp.data.jobDetails,
                    jobNumbers: ['All Jobs', ...resp.data.jobNumbers],
                    workOrderNumbers: ['All WO #', ...resp.data.wo],
                    purchaseOrderNumbers: ['All PO #', ...resp.data.po],
                    contracts: ['All Contracts', ...resp.data.contractNumber],
                    lockdownDate: resp.data.lockdownDate || oldLockdown,
                    reportCounts: {
                        approvedCount: resp.data.approvedCount,
                        pendingCount: resp.data.pendingCount,
                        rejectedCount: resp.data.rejectedCount,
                        voidedCount: resp.data.voidedCount,
                        totalCount: resp.data.totalCount
                    }
                }))
            }
            if (resp?.status === 200 && bodyParamFilter.isResurfacing) {
                setjobCount((prevState) => ({
                    ...prevState,
                    approvedCount: resp.data.approvedCount,
                    pendingCount: resp.data.pendingCount,
                    rejectedCount: resp.data.rejectedCount,
                    voidedCount: resp.data.voidedCount,
                    totalCount: resp.data.totalCount
                }))
            } else {
                setjobCount((prevState) => ({
                    ...prevState,
                    approvedDACount: resp.data.approvedCount,
                    pendingDACount: resp.data.pendingCount,
                    rejectedDACount: resp.data.rejectedCount,
                    voidedDACount: resp.data.voidedCount,
                    totalDACount: resp.data.totalCount
                }))
            }
        }

        fetchData()
    }, [bodyParamFilter])

    useEffect(() => {
        async function fetchData() {
            const resp = await props.getAllJobs(mobFilterParam).then(res => {
                return res
            })

            if (resp.status === 200) {
                setIsLoading(false)
                setJobs((prevState) => ({
                    ...prevState,
                    foremanNames: resp.data.foremanNames,
                    jobNumbers: ['All Jobs', ...resp.data.jobNumbers],
                    workOrderNumbers: ['All WO #', ...resp.data.wo],
                    purchaseOrderNumbers: ['All PO #', ...resp.data.po],
                }))
            }
        }

        fetchData()
    }, [mobFilterParam])



    return (
        <>
            <section className={classes.mainSection} style={{ minHeight: 'calc(100vh - 50px )' }}>
                <div id='screenTop' className={classes.screenTopBg}>
                    <Grid container gap={isMobile && 1}>
                        <Grid item xs={12} md={6} direction='row'>
                            <Grid container spacing={isMobile ? 0.5 : 3} style={{ padding: 0, margin: 0 }}>
                                <Grid item xs={4} md={6} style={{ padding: 0 }}>
                                    <Typography sx={{ fontSize: '22px', fontWeight: 600 }} className={classes.heading}> Dashboard</Typography>
                                </Grid>
                                <Grid item xs={8} md={6} style={{ height: 40, padding: 0, display: 'flex', alignItems: 'center' }}>
                                    {jobs.lockdownDate && <Countdown makeInitialFetch={makeInitialFetch} lockdownDateProp={jobs.lockdownDate && jobs.lockdownDate} isLoading={isLoading} handleFilter={handleApplyFilter} />}
                                </Grid>
                                <Grid item xs={12} md={6} style={{ padding: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Tabs value={pageTab} onChange={handlePageTabChange} TabIndicatorProps={{ style: { display: 'none' } }} className={isMobile ? classes.tabsPageMobile : classes.tabsPage} sx={!isMobile ? { padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '14px' } : { padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Tab className={classes.tabHover} label={
                                            jobCount?.pendingDACount > 0 ?
                                                <Badge color="secondary" anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }} badgeContent={jobCount?.pendingDACount}
                                                    style={{ paddingRight: '20px', align: 'center' }}>
                                                    Daily Activity
                                                </Badge> : "Daily Activity"
                                        } {...a11yProps('Daily Activity')} />
                                        <Tab className={classes.tabHover} label={
                                            jobCount?.pendingCount > 0 ?
                                                <Badge color="secondary" anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }} badgeContent={jobCount?.pendingCount}
                                                    style={{ paddingRight: '20px', align: 'center' }}>
                                                    Resurfacing
                                                </Badge> : "Resurfacing"
                                        } {...a11yProps('Resurfacing')} />
                                    </Tabs>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} className={!isMobile && classes.centerGrid}>
                            {!isMobile && (
                                <Grid container spacing={2} justifyContent={isMobile ? "center" : "end"} gap={isMobile ? 0 : 1}>
                                    <Grid item xs={3} sm={3} md={2}>
                                        <Card className={` ${bodyParamFilter.status == 'Pending' ? classes.tableRowHighlight : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Pending")}>
                                            <CardHeader
                                                title='Pending'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center'>{jobs.reportCounts.pendingCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'Approved' ? classes.tableRowHighlight : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Approved")}>
                                            <CardHeader
                                                title='Approved'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center' style={{ color: '#2F9220' }}>{jobs.reportCounts.approvedCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'Rejected' ? classes.tableRowHighlight : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Rejected")} >
                                            <CardHeader
                                                title='Rejected'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center' style={{ color: '#EE3A41' }}>{jobs.reportCounts.rejectedCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'Voided' ? classes.tableRowHighlight : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Voided")}>
                                            <CardHeader
                                                title='Voided'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center' style={{ color: "#636363" }}>{jobs.reportCounts.voidedCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'All Status' ? classes.tableRowHighlight : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("All Status")}>
                                            <CardHeader
                                                title='Total'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center'>{jobs.reportCounts.totalCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                            {isMobile && (
                                <Slider {...settings}>
                                    <Grid item xs={3} sm={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'Pending' ? classes.tableRowHighlightMobile : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Pending")}>
                                            <CardHeader
                                                title='Pending'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center'>{jobs.reportCounts.pendingCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'Approved' ? classes.tableRowHighlightMobile : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Approved")}>
                                            <CardHeader
                                                title='Approved'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center' style={{ color: '#2F9220' }}>{jobs.reportCounts.approvedCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'Rejected' ? classes.tableRowHighlightMobile : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Rejected")} >
                                            <CardHeader
                                                title='Rejected'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center' style={{ color: '#EE3A41' }}>{jobs.reportCounts.rejectedCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'Voided' ? classes.tableRowHighlightMobile : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("Voided")}>
                                            <CardHeader
                                                title='Voided'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center' style={{ color: "#636363" }}>{jobs.reportCounts.voidedCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={3} md={2}>
                                        <Card className={`${bodyParamFilter.status == 'All Status' ? classes.tableRowHighlightMobile : classes.tableRow} ${isMobile ? classes.cardMobWidth : classes.cardWidth}`} onClick={() => handleStatusCard("All Status")}>
                                            <CardHeader
                                                title='Total'
                                                titleTypographyProps={{
                                                    variant: isMobile ? 'caption' : 'body1',
                                                    classes: {
                                                        root: classes.cardHeaderTitleRoot
                                                    },
                                                    fontWeight: 600
                                                }}
                                                className={classes.reportCardHeader}
                                                style={isMobile ? { padding: '7px' } : { padding: '10px' }}
                                            />
                                            <CardContent className={classes.reportCardContent} style={{ padding: '10px' }}>
                                                <Typography align='center'>{jobs.reportCounts.totalCount}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Slider>
                            )}
                        </Grid>
                    </Grid>
                </div>

                {/* Container for the Daily activity in TabPanel */}
                <div id="userTable" className={classes.usersTable} ref={tableRef} style={!isMobile ? tableContainerHeight : {}}>
                    {!isMobile ? (
                        <>
                            <TabPanel value={pageTab} index={0} padding='0'>
                                <DailyActivityFilters />
                                <CollapeTable tableHeader={JOBS_HEADER} jobs={jobs} orderByProp='jobDate' isLoading={isLoading} classes={classes} Row={Row} rowProps={props} />
                            </TabPanel>
                            <TabPanel value={pageTab} index={1} padding='0' >
                                <ResurfacingFilters />
                                <CollapeTable tableHeader={RESURFACING_HEADER} orderByProp='jobDate' jobs={jobs} isLoading={isLoading} classes={classes} Row={ResurfacingRow} rowProps={props} />
                            </TabPanel>
                        </>
                    ) : (
                        <>
                            <TabPanel value={pageTab} index={0} padding='0'>
                                <DailyActivityFilters />
                                <JobAccordion jobs={jobs} Row={Row} isLoading={isLoading} />
                            </TabPanel>
                            <TabPanel value={pageTab} index={1} padding='0'>
                                <ResurfacingFilters />
                                <JobAccordion jobs={jobs} Row={ResurfacingRow} isLoading={isLoading} />
                            </TabPanel>
                        </>
                    )}

                </div>
            </section >
        </>
    )
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        { ...customerPortalActions, ...notifications },
        dispatch
    );

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withMediaQuery([
        ['isMobile', theme => theme.breakpoints.down('sm')],
    ])
)(JobDashboard)
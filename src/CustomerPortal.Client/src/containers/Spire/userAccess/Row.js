import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Collapse, Grid, Select, Divider, Tooltip, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import { withStyles, styled } from '@mui/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { bindActionCreators, compose } from 'redux';
import { MdEdit } from "react-icons/md";
import moment from "moment";
import { connect } from 'react-redux';
import { withRouter } from '../../../components/withRouter';
import { MdOutlineClose } from "react-icons/md";
import { BiReset } from "react-icons/bi";
import DropDown from '../../../components/dropdown';
import CustomSelect from '../../../components/multiselect';
import Switch from '../../../components/switch';
import CustomIconButton from '../../../components/iconButton';
import CustomInput from '../../../components/input';
import IconButton from '../../../components/iconButton';
import CustomButton from '../../../components/button';
import MultipleSelect from '../../../components/multiselect';
import * as notifications from '../../../store/notifyActions';
import * as customerPortalActions from '../../../store/actions';
import { shortString, shortenEmail } from '../../../services/helpers'
import urls from '../../../constants/routes.json';
import MenuItem from '@mui/material/MenuItem';
const StyledTableRow = withStyles((theme) => ({
    root: {
        height: 30
    }
}))(TableRow);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '5px'
    },
}));

const styles = theme => ({
    container: {
        /* The image used */
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    flexEndGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    actionButtons: {
        width: '125px',
        '&:last-child': {
            marginRight: '40px',
            color: 'green',
            border: '1px solid green'
        },
        textTransform: 'none'
    },
});

function Row(props) {
    const { row, editUserData, onClickEdit, dropDown, classes, onResetClick } = props;
    const [inputEvent, setInputEvent] = React.useState();
    const [selectionStart, setSelectionStart] = React.useState();
    //fed in with dummy data as initial value for both type and role before it get's updated with the data from API
    const [userDetails, setUserDetails] = React.useState({
        typeId: '',
        roleId: '',
        fullName: ''
    });
    const [initialState, setInitialState] = React.useState({
        typeId: '',
        roleId: '',
        fullName: ''
    });
    const [open, setOpen] = React.useState(false);
    const [editText, setEditText] = React.useState({
        email: false,
        name: false
    })
    const [role, setRole] = React.useState([]);
    const [region, setRegion] = React.useState([]);
    const [regionDropDown, setRegionDropDown] = React.useState([]);
    const [initialRegion, setInitialRegion] = React.useState([]);
    const multiSelectProps = {
        keyToBind: { key: 'id', value: 'regionType' },
        columnName: 'regionType',
        name: 'region',
        width: '130px'
    };

    const handleChange = (event) => {
        const { target: { value } } = event;
        setRegion(typeof value === 'string' ? value.split(',') : value,);
        setOpen(true);
    };

    const closeCollapse = () => {
        setOpen(false);
        setEditText({
            email: false,
            name: false
        });
    };

    const discardSaveChanges = () => {
        closeCollapse();
        setUserDetails(initialState);
        setRegion(initialRegion);
    };

    const saveChanges = () => {
        const adminId = parseInt(sessionStorage.getItem('id'));
        const regionBody = dropDown.region.filter(ele => region.includes(ele.regionType));
        const bodyParameters = {
            adminId,
            userId: userDetails.id,
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            typeId: userDetails.typeId,
            roleId: userDetails.roleId,
            region: regionBody,
            isActive: userDetails.isActive
        };
        const initialRole = `${initialState.typeId}-${initialState.roleId}`;
        const updatedRole = `${userDetails.typeId}-${userDetails.roleId}`;
        if (!bodyParameters.email) {
            props.addNotification({ message: "Email cannot be empty", type: 'error' });
            return
        }
        if (!bodyParameters.region.length > 0) {
            props.addNotification({ message: "Region cannot be empty", type: 'error' });
            return
        }
        console.log("Body: ", bodyParameters);
        props.editUser(bodyParameters).then((response) => {
            if (response.status == 200) {
                //once the data is saved update the initial state so the changes will be reflected
                setInitialState(userDetails);
                props.getProfileData();
                props.addNotification({ message: response.data.message, type: 'success' });
                if (userDetails.isCurrentUser && (initialRole != updatedRole)) {
                    props.addNotification({ message: "Your user role has been updated. You will be logged out automatically", type: 'info' });
                    setTimeout(() => {
                        props.addNotification({ message: "Please log in again to access this page with your updated permissions", type: 'info' });
                    }, 2000);
                    setTimeout(() => {
                        props.navigate(urls.LOGIN);
                    }, 4000);
                };
            }
        }).catch(error => {
            discardSaveChanges();
            props.addNotification({ message: 'Unable to process request, please try again later', type: 'error' });
        })
        closeCollapse();
    };

    const toggleSwitch = () => {
        setUserDetails((prevState) => ({
            ...prevState,
            isActive: !prevState.isActive,
        }));
        setOpen(true);
    };

    // const timerRef = React.useRef(null);

    // React.useEffect(() => {
    //     console.time('render time');
    //     timerRef.current = setTimeout(() => {
    //         console.timeEnd('render time');
    //     });

    //     return () => {
    //         clearTimeout(timerRef.current);
    //     };
    // });

    React.useMemo(() => {
        row.fullName = row.firstName + ' ' + row.lastName;
        const shortEmail = shortenEmail(row.email, 15, 13);
        // if (row.email.length > 30) {
        //     const newEmail = row.email.split('@')[0];
        //     const address = row.email.split('@')[1]
        //     shortEmail = newEmail.substring(0, 15).concat('...@').concat(address);
        // }
        const shortName = shortString(row.fullName, 22);
        row.shortEmail = shortEmail;
        row.shortName = shortName;
        setUserDetails(row);
        setInitialState(row);
    }, [row]);

    // React.useMemo(() => {
    //     const roleType = dropDown.roleType || [];
    //     const regionDropDown = dropDown.region ? dropDown.region.map(function (item) {
    //         return item['regionType'];
    //     }) : [];
    //     setRegionDropDown(regionDropDown);
    //     const selectedTypeId = userDetails.typeId;
    //     let obj = roleType.find(ele => ele.typeId === selectedTypeId);
    //     if (obj) {
    //         setRole(obj.roles)
    //     };
    //     //in the first render region.length will be 0 only then the initial value will be set
    //     if (region.length == 0) {
    //         const initialRegion = userDetails.region ? userDetails.region.map(function (item) {
    //             return item['regionType'];
    //         }) : [];
    //         setRegion(initialRegion);
    //         setInitialRegion(initialRegion);
    //     }
    // }, [userDetails])

    React.useMemo(() => {
        const roleType = dropDown.roleType || [];
        const regionDropDown = dropDown.region ? dropDown.region.map(function (item) {
            return item['regionType'];
        }) : [];
        setRegionDropDown(regionDropDown);
        const selectedTypeId = userDetails.typeId;
        let obj = roleType.find(ele => ele.typeId === selectedTypeId);
        if (obj) {
            setRole(obj.roles)
        };
        //in the first render region.length will be 0 only then the initial value will be set
        if (region.length == 0) {
            const initialRegion = userDetails.region ? userDetails.region.map(function (item) {
                return item['regionType'];
            }) : [];
            setRegion(initialRegion);
            setInitialRegion(initialRegion);
        }
    }, [userDetails])

    const edit = (name, value) => {
        // onClickEdit(value);
        setEditText((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    React.useMemo(() => {
        inputEvent?.target.setSelectionRange(selectionStart, selectionStart);
    }, [inputEvent]);

    const handleKeyDown = evt => {
        if (evt.keyCode === 32) { // 32 is the key code for space
            evt.preventDefault();
        }
    };

    const onInputFieldChanged = evt => {
        setOpen(true);
        const name = evt.target.name;
        let value = evt.target.value;
        if (name == 'email') {
            value = evt.target.value.toLowerCase();
            const startVal = evt.target.selectionStart;
            setSelectionStart(startVal);
            setInputEvent(evt);
            const shortEmail = shortenEmail(value, 15, 13);
            setUserDetails(prevState => ({
                ...prevState,
                [name]: value,
                shortEmail
            }));
        }
        if (name === 'fullName') {
            const [firstName, ...rest] = value.split(' ');
            const lastName = rest.join(' ');
            const shortName = shortString(value, 22);
            setUserDetails((prevState) => ({
                ...prevState,
                firstName: firstName,
                lastName: lastName,
                fullName: value,
                shortName: shortName
            }));
        } else {
            setUserDetails(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const EditIcon = (props) => {
        const { value } = props;
        return (
            <CustomIconButton title="Edit" onClick={() => edit(value, true)}>
                <MdEdit size={'18px'} />
            </CustomIconButton>
        )
    };

    const CloseIcon = (props) => {
        const { value } = props;
        return (
            <CustomIconButton title="Cancel" onClick={() => edit(value, false)}>
                <MdOutlineClose size={'18px'} />
            </CustomIconButton>
        )
    };

    const ResetIcon = (props) => {
        const { value, forgetPassword } = props;
        return (
            <CustomIconButton title="Reset Password" onClick={() => onResetClick(row)}>
                <BiReset size={'18px'} color={forgetPassword ? '#F0941C' : "#000000"} />
            </CustomIconButton>
        )
    }

    const columnCount = Object.keys(row).length;
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                {/* {
                    Object.keys(row).forEach((key) => {
                        <TableCell align="center">
                            {row[key]}
                        </TableCell>
                    })
                } */}
                <StyledTableCell align="center" >
                    <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 25px' }}>
                        <Grid item>
                            {!editText.email ?
                                <Tooltip title={userDetails.email}>
                                    <Typography>{userDetails.shortEmail}</Typography>
                                </Tooltip>
                                :
                                <CustomInput
                                    sx={{ width: 182 }}
                                    inputProps={{ maxLength: 50 }}
                                    name="email"
                                    placeholder="Enter the user's email address"
                                    //error={inputError.userName}
                                    variant="outlined"
                                    autoComplete="off"
                                    value={userDetails.email || ''}
                                    onChange={onInputFieldChanged}
                                    onKeyDown={handleKeyDown}
                                />}
                        </Grid>
                        <Grid item>
                            {editText.email ? <CloseIcon value="email" /> :
                                <EditIcon value="email" />}
                        </Grid>
                    </Grid>
                </StyledTableCell>
                <StyledTableCell align="center">
                    <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px' }}>
                        <Grid item>
                            {!editText.name ?
                                <Tooltip title={userDetails.firstName + ' ' + userDetails.lastName}>
                                    <Typography> {userDetails.shortName} </Typography>
                                </Tooltip> :
                                <>
                                    <CustomInput
                                        sx={{ width: 150 }}
                                        inputProps={{ maxLength: 41 }}
                                        name="fullName"
                                        //placeholder="Enter the user's last name"
                                        //error={inputError.userName}
                                        variant="outlined"
                                        autoComplete="off"
                                        value={userDetails.fullName || ''}
                                        onChange={onInputFieldChanged}
                                    />
                                </>
                            }
                        </Grid>
                        <Grid item>
                            {editText.name ? <CloseIcon value="name" /> :
                                <EditIcon value="name" />}
                        </Grid>
                    </Grid>
                </StyledTableCell>
                <StyledTableCell align="center">
                    <DropDown
                        minWidth='100px'
                        name="typeId"
                        hideOutline
                        keyToBind={{ key: 'typeId', value: 'userType' }}
                        options={dropDown.roleType || []}
                        value={userDetails.typeId}
                        onChange={onInputFieldChanged}
                    />
                </StyledTableCell>
                <StyledTableCell align="center">
                    <DropDown
                        minWidth='130px'
                        name="roleId"
                        hideOutline
                        keyToBind={{ key: 'roleId', value: 'roleName' }}
                        options={role || []}
                        value={userDetails.roleId}
                        onChange={onInputFieldChanged}
                    />
                </StyledTableCell>
                <StyledTableCell align="center">
                    <MultipleSelect
                        initalValue={region || []}
                        options={regionDropDown || []}
                        onChange={handleChange}
                        hideOutline
                        {...multiSelectProps} />
                </StyledTableCell>
                <StyledTableCell align="center">{row.lastLogin ? moment(row.lastLogin).format('MM/DD/YYYY \xa0\ HH:mm:ss') : 'User not logged'}</StyledTableCell>
                <StyledTableCell align="center">
                    <Switch
                        onChange={() => toggleSwitch()}
                        checked={userDetails.isActive}
                        customStyle={{ paddingLeft: '20px' }}
                    />
                </StyledTableCell>
                <StyledTableCell align="center">
                    <ResetIcon forgetPassword={userDetails.forgetPassword} />
                </StyledTableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columnCount}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {/* <Divider sx={{ width: 'inherit', mt: 0.5, mb: 0.5 }} orientation="horizontal" /> */}
                        <Box sx={{ margin: 1 }}>
                            <Grid container>
                                <Grid item xs={12} className={classes.flexEndGrid} gap={2}>
                                    <CustomButton
                                        className={classes.actionButtons}
                                        sizeValue='small'
                                        type="white"
                                        onClick={() => discardSaveChanges()}
                                        primary='Cancel'
                                    />
                                    <CustomButton
                                        className={classes.actionButtons}
                                        sizeValue='small'
                                        type="white"
                                        onClick={() => saveChanges()}
                                        primary='Save'
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment >
    );
}

Row.propTypes = {

};

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
        name: 'Row'
    }),
    connect(
        null,
        mapDispatchToProps
    ),
    withRouter
)(React.memo(Row));

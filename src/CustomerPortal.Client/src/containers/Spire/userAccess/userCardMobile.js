import React from 'react'
import { Paper, Grid, Typography, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import moment from "moment";
import { bindActionCreators, compose } from 'redux';
import { MdEdit } from 'react-icons/md';
import styles from './styles';
import { shortenEmail, shortString } from '../../../services/helpers';
import CustomButton from '../../../components/button';
import CustomIconButton from '../../../components/iconButton';
import { BiReset } from "react-icons/bi";

function UserCardMobile(props) {

    const { details, classes, onClickEdit, onClickReset } = props;
    let email = details.email;
    email = shortenEmail(email, 15, 16);
    let fullName = details.firstName + ' ' + details.lastName

    const nameOld = details.firstName + ' ' + details.lastName;
    const nameLength = nameOld.length;
    fullName = shortString(fullName, 30);

    const ResetIcon = (props) => {
        const { value } = props;
        return (
            <CustomIconButton title="Reset Password" onClick={() => onClickReset(details)}>
                <BiReset size={'18px'} color="#000000" />
            </CustomIconButton>
        )
    }
    return (
        <React.Fragment>
            <Grid item xs={12} >
                <Paper elevation={2} className={classes.gridItemMobile}>
                    <Grid container>
                        <Grid item xs={8} className={classes.mobileLeftGrid}>
                            <Tooltip title={details.email} offsetX={30} offsetY={100}>
                                <Typography fontSize={14}>{details ? email : ''}</Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={4} sx={{ align: 'center', padding: '5px 10px', display: 'flex', justifyContent: 'center', height: '52px' }}>
                            <Typography fontSize={14} align='center' sx={{ maxWidth: '100px', display: 'flex', justifySelf: 'center', alignSelf: 'center' }} >{details.lastLogin ? moment(details.lastLogin).format('MM/DD/YYYY HH:mm:ss') : 'User not logged'}</Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.mobileLeftGrid}>
                            {nameLength > 30 ?
                                <Tooltip title={details.firstName + ' ' + details.lastName} disableInteractive placement="bottom">
                                    <Typography fontSize={14}>{fullName}</Typography>
                                </Tooltip> :
                                <Typography fontSize={14}>{fullName}</Typography>
                            }
                        </Grid>
                        <Grid item xs={3} className={classes.mobileLeftGrid} >
                            {details.isActive ?
                                <Typography fontSize={14} color="green"> Active </Typography> :
                                <Typography fontSize={14} color="red"> Inactive </Typography>}
                        </Grid>
                        <Grid item xs={5} align='center' sx={{ padding: '7.5px 5px', height: '45px', align: 'center' }} >
                            {details.forgetPassword ?
                                <CustomButton
                                    className={classes.editButtonMobile}
                                    sizeValue='small'
                                    onClick={() => onClickReset(details)}
                                    primary='Password Reset'
                                    fullWidth
                                    bgColor='#f8e0bd'
                                    hoverBgColor='#f8e0bd'
                                    textTransform='none'
                                    type='white'
                                />
                                // <ResetIcon />
                                : null}
                        </Grid>
                        <Grid item xs={4} align='center' sx={{ padding: '7.5px 5px', height: '45px', align: 'center' }}>
                            <CustomButton
                                className={classes.editButtonMobile}
                                sizeValue='small'
                                onClick={() => onClickEdit()}
                                primary='Edit'
                                type="white"
                                variant='outlined'
                                disabled={false}
                                bgColor="#FFF"
                                btnColor="#000000"
                                hoverBgOutlineColor="#000000"
                                hoverColor="#000000"
                                customStyle={{ width: '88px', height: '25px', fontSize: '10px' }}
                                startIcon={<MdEdit />}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid >
        </React.Fragment >
    )
}

export default compose(
    withStyles(styles, {
        name: 'UserCardMobile'
    })
)(UserCardMobile);

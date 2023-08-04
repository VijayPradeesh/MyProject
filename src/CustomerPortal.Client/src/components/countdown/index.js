import React from 'react'
import useTimer from '../../services/useTimer'
import { makeStyles } from '@mui/styles'
import { Grid, IconButton, Skeleton, Tooltip, Typography, Zoom } from '@mui/material'
import { dateCalculator } from '../../services/helpers'
import { TbRefresh } from "react-icons/tb"
import { Stack } from '@mui/system'
import { withMediaQuery } from '../withMediaQuery';

const Countdown = ({ makeInitialFetch, lockdownDateProp, isLoading, handleFilter, isMobile }) => {

    const { lockdownDate, hours, minutes, seconds } = useTimer(lockdownDateProp && lockdownDateProp)
    const updatedHours = String(hours).padStart(2, '0');
    const updatedMin = String(minutes).padStart(2, '0');
    const updatedSeconds = String(seconds).padStart(2, '0');
    const useStyles = makeStyles((theme) => ({
        timerHeading: {
            color: '#F0941C'
        },
        refresh: {
            color: 'white'
        },
        lockdownMobDate: {
            display: 'flex',
            justifyContent: 'center'
        }
    }))

    const CountdownLoader = () => {
        return (
            <Stack spacing={1} width="250px">
                <Skeleton variant='text' sx={{ bgcolor: 'grey.800' }} />
                <Skeleton variant='rectangular' width={250} height={30} sx={{ bgcolor: 'grey.800' }} />
            </Stack>
        )
    }

    if (hours === 0 && minutes === 0 && seconds === 0) {
        makeInitialFetch()
    }

    const classes = useStyles()
    return (
        <React.Fragment>
            <Grid container style={{ display: 'flex', justifyContent: 'flex-end', alignSelf: 'center' }}>
                <Typography style={{ alignSelf: 'center' }}> Lockdown&nbsp;</Typography>
                <Typography style={{ alignSelf: 'center' }}>
                    {lockdownDate ?
                        ` on: ${dateCalculator(new Date(lockdownDate))}` :
                        <React.Fragment>
                            <Typography>
                                {` in: ${updatedHours && updatedHours}`}<span style={{ fontSize: '13px' }}>h</span>
                                {<>:&nbsp;{updatedMin && updatedMin}<span style={{ fontSize: '13px' }}>m</span></>}
                                {!isMobile &&
                                    <>:&nbsp;{updatedSeconds && updatedSeconds}< span style={{ fontSize: '13px' }}>s&nbsp;</span></>
                                }
                            </Typography>
                        </React.Fragment>
                    }
                </Typography>
                <Tooltip title="Refresh" TransitionComponent={Zoom}>
                    <IconButton color='secondary' style={{ fontSize: 22, padding: isMobile && '5px' }} onClick={handleFilter} size={isMobile ? '2' : '10'}>
                        <TbRefresh />
                    </IconButton>
                </Tooltip>
            </Grid>
        </React.Fragment >
    )
}

export default (
    withMediaQuery([
        ['isMobile', theme => theme.breakpoints.down('sm')],
        //['isDesktop', theme => theme.breakpoints.up('650')],
    ])
)(Countdown)
import { Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect, useRef, createRef } from 'react'
import { compose } from 'redux'
import { withMediaQuery } from '../../../../components/withMediaQuery'

// const useOutsideClick = (ref, setExpanded) => {
//     useEffect(() => {
//         function handleOutsideClick(event) {
//             console.log("handle outside triggerd: ", event)
//             if (ref.current && !ref.current.contains(event.target)) {
//                 console.log("if condition triggerd: ")
//                 setExpanded(false)
//             }
//         }
//         document.addEventListener("click", handleOutsideClick)

//         return () => document.removeEventListener("click", handleOutsideClick)
//     }, [ref])
// }

const JobAccordion = ({ jobs, Row, isMobile, isLoading }) => {
    const [expanded, setExpanded] = useState(false);
    const [containerHeight, setContainerHeight] = useState()

    const [windowHeight, setWindowHeight] = useState(window.innerHeight)

    const accordionRef = useRef(null);

    //useOutsideClick(accordionRef, setExpanded)

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
            maxHeight: `${((windowHeight - accordionRef?.current?.offsetTop))}px`,
            overflowY: "scroll",
            scrollSnapType: "y mandatory"
        }

        setContainerHeight(containerHeightCalc)

    }, [])

    const MobileLoader = () => {
        const skeletonArray = Array(5).fill('')
        return (
            <Stack spacing={4} width="100%">
                {skeletonArray.map((item, index) => {
                    return (
                        <Grid container key={index}>
                            <Grid item>
                                <Skeleton variant='rectangular' width={window.innerWidth} height={50} />
                            </Grid>
                        </Grid>
                    )
                })}
            </Stack>
        )
    }

    return (
        <div className='accordionDiv' ref={accordionRef} style={containerHeight && containerHeight}>
            {isLoading ? <MobileLoader /> : (jobs?.jobDetails?.length > 0 ? jobs.jobDetails.map((item, index) => {
                return (
                    <Row key={item.id} row={item} isMobile={isMobile} expanded={expanded} setExpanded={setExpanded} accordionRef={accordionRef} accordNum={index} containerHeight={{ ...containerHeight, scrollSnapAlign: "start" }} />
                )
            }) : (
                <Box
                    sx={{
                        display: 'flex',
                        '& > :not(style)': {
                            my: 1,
                            mx: 0.5,
                            width: "100%",
                        },
                    }}
                >
                    <Paper variant="outlined" style={{ padding: "10px" }}>
                        <Typography variant='body2' align='center'>No Data Found</Typography>
                    </Paper>
                </Box>
            ))}
        </div>
    )
}

export default compose(withMediaQuery([
    ['isMobile', theme => theme.breakpoints.down('sm')]
]))(JobAccordion)
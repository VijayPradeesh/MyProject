import React from "react";
import { Accordion, AccordionActions, GridList, ImageList, ImageListItem, GridListTile, CardMedia, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Collapse, Divider, Grid, IconButton, Paper, Skeleton, Drawer, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tabs, Typography, Zoom, Chip, ClickAwayListener } from '@mui/material'
import { makeStyles, withStyles, styled } from '@mui/styles'
import ImgsViewer from "react-images-viewer";
import { validateAllNull } from '../../../../services/helpers'
import { StyledMainTable, StyledTableCell } from "./desktop";

export const ProdTMComponent = ({ paperProp, classes }) => {
    return (
        <>
            {paperProp?.body?.length > 0 ? (
                paperProp.body.map((paper, index) => {
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                '& > :not(style)': {
                                    my: 1,
                                    mx: 0.5,
                                    width: "100%",
                                },
                            }}
                            key={index}
                        >
                            <Paper variant="outlined">
                                <Grid container>
                                    <Grid item container className={classes.paperPadding}>
                                        <Grid item xs={4} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2'>Pay Item</Typography>
                                            <Typography variant='body2'>{paper.payitem}</Typography>
                                        </Grid>
                                        <Grid item xs={4} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2' align='center'>Qty</Typography>
                                            <Typography variant='body2' align='center'>{paper.quantity}</Typography>
                                        </Grid>
                                        <Grid item xs={4} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2' align='center'>WO#</Typography>
                                            <Typography variant='body2' align='center'>{paper.wo}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item container className={classes.paperPadding}>
                                        <Grid item xs={5} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2'>Description</Typography>
                                            <Typography variant='body2'>{paper.description}</Typography>
                                        </Grid>
                                        <Grid item xs={7} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2'>Location</Typography>
                                            <Typography variant='body2'>{paper.location}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )
                })
            ) : (
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
            )}
        </>
    )
}

export const LaborComponent = ({ paperProp, classes }) => {
    return (
        <>
            {paperProp?.body?.length > 0 ? (
                paperProp.body.map((paper, index) => {
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                '& > :not(style)': {
                                    my: 1,
                                    mx: 0.5,
                                    width: "100%",
                                },
                            }}
                            key={index}
                        >
                            <Paper variant="outlined">
                                <Grid container>
                                    <Grid item container className={classes.paperPadding}>
                                        <Grid item xs={12} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2'>Employee Name</Typography>
                                            <Typography variant='body2'>{paper.employee}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item container className={classes.paperPadding}>
                                        <Grid item xs={4} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2'>ST Hours</Typography>
                                            <Typography variant='body2'>{paper.st}</Typography>
                                        </Grid>
                                        <Grid item xs={4} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2' align='center'>OT Hours</Typography>
                                            <Typography variant='body2' align='center'>{paper.ot}</Typography>
                                        </Grid>
                                        <Grid item xs={4} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2' align='center'>DT Hours</Typography>
                                            <Typography variant='body2' align='center'>{paper.dt}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )
                })
            ) : (
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
            )}
        </>
    )
}

export const EquipmentComponent = ({ paperProp, classes }) => {
    return (
        <>
            {paperProp?.body?.length > 0 ? (
                paperProp.body.map((paper, index) => {
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                '& > :not(style)': {
                                    my: 1,
                                    mx: 0.5,
                                    width: "100%",
                                },
                            }}
                            key={index}
                        >
                            <Paper variant="outlined">
                                <Grid container>
                                    <Grid item container className={classes.paperPadding}>
                                        <Grid item xs={8} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2'>Equipment</Typography>
                                            <Typography variant='body2'>{paper.equipment}</Typography>
                                        </Grid>
                                        <Grid item xs={4} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2' align='center'>Hours</Typography>
                                            <Typography variant='body2' align='center'>{paper.hours}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item container className={classes.paperPadding}>
                                        <Grid item xs={12} className={classes.paperContent}>
                                            <Typography fontWeight="fontWeightBold" variant='body2'>Description</Typography>
                                            <Typography variant='body2'>{paper.description}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )
                })
            ) : (
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
            )}
        </>
    )
}

export const BoxContainer = ({ children }) => {
    return (
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
            <Paper variant="outlined">
                {children}
            </Paper>
        </Box>
    )
}

export const SewerMobileComponent = (props) => {
    const { classes, paperProp, CustomTable } = props;
    const sewerCameraActivity = paperProp?.sewerCameraActivity;
    const workHeaders = sewerCameraActivity?.header;
    let workBody = [{
        workType: sewerCameraActivity?.activityType,
        county: sewerCameraActivity?.county,
        phase: sewerCameraActivity?.phase,
        inspector: sewerCameraActivity?.inspector,
        truckID: sewerCameraActivity?.truckId
    }]
    const isActivityDataNull = validateAllNull(workBody?.[0]);
    const sewerCamMain = paperProp?.sewerCamDetailsMain;

    const mainLocBodyWithTotal = sewerCamMain?.sewerCamDetail
    const mainLocationBody = {
        headers: sewerCamMain?.header,
        body: sewerCamMain?.sewerCamDetail,
        total: sewerCamMain?.total
    }
    const sewerCamLateral = paperProp?.sewerCamDetailsLateral;
    const lateralLocationBody = {
        headers: sewerCamLateral?.header,
        body: sewerCamLateral?.sewerCamDetail,
        total: sewerCamLateral?.total
    }
    return (
        <React.Fragment>
            {!isActivityDataNull && <BoxContainer>
                <Grid container>
                    <Grid item container className={classes.paperPadding}>
                        <Grid item xs={12} className={classes.paperContent}>
                            <Typography fontWeight="fontWeightBold" variant='body2' style={{ wordWrap: 'break-word', fontWeight: 600 }}>Work Details</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container className={classes.paperPadding}>
                        <Grid item xs={4} className={classes.paperContent}>
                            <Typography fontWeight="fontWeightBold" variant='body2' >Work Type</Typography>
                            <Typography variant='body2'>{sewerCameraActivity?.activityType}</Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.paperContent}>
                            <Typography fontWeight="fontWeightBold" variant='body2' >County</Typography>
                            <Typography variant='body2'>{sewerCameraActivity?.county}</Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.paperContent}>
                            <Typography fontWeight="fontWeightBold" variant='body2' >Phase</Typography>
                            <Typography variant='body2'>{sewerCameraActivity?.phase}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container className={classes.paperPadding}>
                        <Grid item xs={4} className={classes.paperContent}>
                            <Typography fontWeight="fontWeightBold" variant='body2' >Inspector</Typography>
                            <Typography variant='body2'>{sewerCameraActivity?.inspector}</Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.paperContent}>
                            <Typography fontWeight="fontWeightBold" variant='body2' >TruckId</Typography>
                            <Typography variant='body2'>{sewerCameraActivity?.truckId}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </BoxContainer>}
            {mainLocationBody?.body?.length > 0 && <BoxContainer>
                <Grid container>
                    <Grid item container className={classes.paperPadding}>
                        <Grid item xs={12} className={classes.paperContent}>
                            <Typography fontWeight="fontWeightBold" variant='body2' style={{ wordWrap: 'break-word', fontWeight: 600 }}>Main Location</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container className={classes.paperPadding}>
                        <CustomTable tableProp={mainLocationBody && (mainLocationBody || {})} />
                    </Grid>
                </Grid>
            </BoxContainer>}
            {lateralLocationBody?.body?.length > 0 &&
                <BoxContainer>
                    <Grid container>
                        <Grid item container className={classes.paperPadding}>
                            <Grid item xs={12} className={classes.paperContent}>
                                <Typography fontWeight="fontWeightBold" variant='body2' style={{ wordWrap: 'break-word', fontWeight: 600 }}>Lateral Location</Typography>
                            </Grid>
                        </Grid>
                        <Grid item container className={classes.paperPadding}>
                            <CustomTable tableProp={lateralLocationBody && (lateralLocationBody || {})} />
                        </Grid>
                    </Grid>
                </BoxContainer>}
            {sewerCameraActivity?.comments &&
                <BoxContainer>
                    <Grid container>
                        <Grid item container className={classes.paperPadding}>
                            <Grid item xs={12} className={classes.paperContent}>
                                <Typography fontWeight="fontWeightBold" variant='body2' style={{ wordWrap: 'break-word', fontWeight: 600 }}>Comments</Typography>
                                <Typography variant='body2'>{sewerCameraActivity?.comments}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </BoxContainer>}
        </React.Fragment >
    )
}

//Resurfacing tabs
export const SurfacesRestoredTabMobile = (props) => {
    const { classes, surfacesRestoredData } = props;
    return (
        <React.Fragment>

            {surfacesRestoredData && surfacesRestoredData?.length > 0 ? surfacesRestoredData?.map((ele, i) => (
                <BoxContainer>
                    <Grid container>
                        <Grid item container style={{ padding: '5px 16px 0px' }}>
                            <Grid item xs={6}>
                                <Typography variant='body2' style={{ display: 'inline-block', fontWeight: 600 }}>Surface Type: </Typography>
                                <Typography variant='body2' style={{ display: 'inline-block' }}> {ele?.surfaceType} </Typography>
                            </Grid>
                            <Grid item xs={6} >
                                <Typography variant='body2' style={{ display: 'inline-block', fontWeight: 600 }}>Material Type: </Typography>
                                <Typography variant='body2' style={{ display: 'inline-block' }}> {ele?.materialType} </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container style={{ padding: ' 0px 5px 5px' }}>
                            <StyledMainTable>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell sx={{ width: '100px', fontWeight: 600, padding: "5px 12px" }} >
                                            Size Change
                                        </StyledTableCell>
                                        {ele?.header?.map((item, i) => (
                                            <StyledTableCell sx={{ fontWeight: 600, padding: "5px 12px", ...(i !== ele.header.length - 1 && { width: "30px" }) }} key={item.value}>
                                                {item.label}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{ width: '100px', backgroundColor: '#fff' }}>
                                    <TableRow >
                                        <TableCell sx={{ padding: "5px 12px" }} >
                                            Original Size
                                        </TableCell>
                                        {ele?.header?.map((item) => (
                                            <TableCell sx={{ padding: "5px 12px" }}>
                                                {ele?.originalSize?.[item.value]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ padding: "5px 12px" }} >
                                            Restored Size
                                        </TableCell>
                                        {ele?.header?.map((item) => (
                                            <TableCell sx={{ padding: "5px 12px" }}>
                                                {ele?.finalRestoredSize?.[item.value]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </StyledMainTable>
                        </Grid>
                    </Grid>
                </BoxContainer>
            )) :
                <BoxContainer>
                    <Typography variant='body2' align='center' style={{ margin: '10px' }}>No Data Found</Typography>
                </BoxContainer>
            }
        </React.Fragment >
    )
}

export const AdditionalMaterialsTabMobile = (props) => {
    const { classes, additionalMaterialData } = props;
    return (
        <React.Fragment>
            <BoxContainer>
                {additionalMaterialData && additionalMaterialData?.length > 0 ?
                    <TableContainer component={Paper}>
                        <StyledMainTable className={classes.collapeTable}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{ fontWeight: 600, padding: "5px 16px" }} >
                                        Material Type
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 600, padding: "5px 16px" }} >
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableBodyNoBorder}>
                                {additionalMaterialData?.map((ele, i) => (
                                    <>
                                        <TableRow sx={{ "& td": { border: 0 } }}>
                                            <TableCell rowSpan={2} sx={{ padding: "5px 16px" }}>
                                                {ele?.material}
                                            </TableCell>
                                            <TableCell sx={{ padding: "5px 16px", fontWeight: 600 }}>
                                                {ele?.header}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "& td": { border: 0 } }}>
                                            <TableCell sx={{ padding: "5px 16px" }}>
                                                {ele?.quantity}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </StyledMainTable>
                    </TableContainer> :
                    <Typography variant='body2' align='center' style={{ margin: '10px' }}>No Data Found</Typography>
                }
            </BoxContainer>
        </React.Fragment >
    )
}

export const CommentsComponentMobile = (props) => {
    const { classes, commentsData } = props;
    return (
        <>
            <BoxContainer>
                <div className={classes.cardAlign}>
                    {commentsData && commentsData?.length > 0 && commentsData?.map((ele, i) => (
                        <Paper elevation={2} sx={{ my: 1, mx: 0.5 }}>
                            <Grid container xs={12} alignItems="center" justifyContent="center" className={classes.cardContainer}>
                                <Grid item md={2} xs={12} className={`${classes.paperGrid} ${classes.tabCard}`}>
                                    <Typography>
                                        {ele?.header || 'Comments'}
                                    </Typography>
                                </Grid>
                                <Grid item md={10} xs={12} className={classes.cardComment}>
                                    <Typography className={classes.tabCardComment}>
                                        {ele?.value || "No Comments"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </div>
            </BoxContainer>
        </>
    )
}

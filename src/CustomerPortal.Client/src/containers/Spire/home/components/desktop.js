import React from "react";
import { Accordion, AccordionActions, GridList, ImageList, ImageListItem, GridListTile, CardMedia, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Collapse, Divider, Grid, IconButton, Paper, Skeleton, Drawer, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tabs, Typography, Zoom, Chip, ClickAwayListener } from '@mui/material'
import { makeStyles, withStyles, styled } from '@mui/styles'
import ImgsViewer from "react-images-viewer";
import placeholder from '../../../../assets/placeholder.png';

export const StyledMainTable = styled('table')(() => ({
    borderCollapse: "separate",
    borderSpacing: "0px 2px",
    width: "100%"
}));

export const StyledTableCell = withStyles(() => ({
    root: {
        backgroundColor: '#edd4b5',
        color: 'black',
    }
}))(TableCell)

export const StyledTableRow = withStyles(() => ({
    root: {
        background: "white",
        '&:nth-of-type(odd)': {
            borderBottom: 'none', // Remove bottom border for odd rows
        },
        '&:nth-of-type(even)': {
            borderBottom: 'none', // Remove bottom border for even rows
        },
    }
}))(TableCell)

export const SurfacesRestoredTab = (props) => {
    const { classes, surfacesRestoredData } = props;
    return (
        <React.Fragment>
            {surfacesRestoredData && surfacesRestoredData?.length > 0 ? surfacesRestoredData?.map((ele, i) => (
                <TableContainer component={Paper} sx={{ marginBottom: '10px' }}>
                    <StyledMainTable className={classes.collapeTable}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ width: '150px', fontWeight: 600, padding: "5px 16px" }} >
                                    Surface Type
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: '150px', fontWeight: 600, padding: "5px 16px" }} >
                                    Material Type
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: '220px', fontWeight: 600, padding: "5px 16px" }}>
                                    Size Change
                                </StyledTableCell>
                                {ele?.header?.map((item, i) => (
                                    <StyledTableCell sx={{ fontWeight: 600, padding: "5px 16px", ...(i !== ele.header.length - 1 && { width: "120px" }) }} key={item.value}>
                                        {item.label}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBodyNoBorder}>
                            <TableRow sx={{ "& td": { border: 0 } }}>
                                <TableCell rowSpan={2} sx={{ width: '150px', padding: "5px 16px" }}>
                                    {ele?.surfaceType}
                                </TableCell>
                                <TableCell rowSpan={2} sx={{ width: '150px', padding: "5px 16px" }}>
                                    {ele?.materialType}
                                </TableCell>
                                <TableCell sx={{ width: '220px', padding: "5px 16px" }}>
                                    Original Size
                                </TableCell>
                                {ele?.header?.map((item) => (
                                    <TableCell sx={{ padding: "5px 16px" }}>
                                        {ele?.originalSize?.[item.value]}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow sx={{ "& td": { border: 0 } }}>
                                <TableCell sx={{ width: '220px', padding: "5px 16px" }}>
                                    Final Restored Size
                                </TableCell>
                                {ele?.header?.map((item) => (
                                    <TableCell sx={{ padding: "5px 16px" }}>
                                        {ele?.finalRestoredSize?.[item.value]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </StyledMainTable>
                </TableContainer>
            )) :
                <BoxContainer>
                    <Typography variant='body2' align='center' style={{ margin: '10px' }}>No Data Found</Typography>
                </BoxContainer>
            }
        </React.Fragment>
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

export const AdditionalMaterialsTab = (props) => {
    const { classes, additionalMaterialData } = props;
    return (
        <React.Fragment>
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
                <BoxContainer>
                    <Typography variant='body2' align='center' style={{ margin: '10px' }}>No Data Found</Typography>
                </BoxContainer>}
        </React.Fragment >
    )
}

export const ImageAttachmentComponent = (props) => {
    const { imgs, classes, currentImage, columns, isOpen, onClickPrev, onClickNext, onClose, openViewer } = props;
    const outputArray = imgs?.imageData;
    const isLoading = imgs?.loading;
    console.log("Original Array: ", imgs);
    return (
        <React.Fragment>
            <BoxContainer>
                {isLoading &&
                    <ImageList sx={{ width: '100%', padding: '3px' }} gap={1} cols={columns} rowHeight={174}>
                        {[...Array(columns)].map((e) => (
                            // <ImageListItem
                            //     sx={{
                            //         padding: '6px',
                            //         '&:hover': {
                            //             cursor: 'pointer',
                            //             transform: 'scale(1.01)',
                            //             transition: 'transform 0.2s'
                            //         },
                            //     }}>
                            //     <img
                            //         src={placeholder}
                            //         style={{ maxHeight: 174, border: '1px solid #000' }}
                            //     />
                            // </ImageListItem>
                            <Skeleton width={310} height={174} variant="rounded" animation="wave" />
                        )
                        )}
                    </ImageList>}
                {!isLoading && outputArray && outputArray?.length > 0 &&
                    <ImageList sx={{ width: '100%', padding: '2px' }} cols={columns} rowHeight={174}>
                        {outputArray?.map((item, i) => (
                            <ImageListItem key={item.src} onClick={() => openViewer(i)}
                                sx={{
                                    padding: '6px',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        transform: 'scale(1.01)',
                                        transition: 'transform 0.2s'
                                    },
                                }}>
                                <img
                                    src={`${item.src}`}
                                    // srcSet={`${item.src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title || 'Resurfacing image'}
                                    loading="lazy"
                                    style={{ maxHeight: 174, border: '1px solid #000' }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>}
                {!isLoading && outputArray && outputArray?.length == 0 &&
                    <Typography variant='body2' align='center' style={{ margin: '10px' }}>No Images Found</Typography>
                }
            </BoxContainer>
            <ImgsViewer
                imgs={outputArray}
                currImg={currentImage}
                isOpen={isOpen}
                onClickPrev={onClickPrev}
                onClickNext={onClickNext}
                onClose={onClose}
                enableKeyboardInput={true}
                showThumbnails={true}
                onClickThumbnail={(i) => openViewer(i)}
            />
        </React.Fragment>
    )
}

export const CommentsComponent = (props) => {
    const { classes, commentsData } = props;
    return (
        <>
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
        </>
    )
}

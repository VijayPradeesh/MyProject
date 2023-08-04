import { Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid, IconButton, TextareaAutosize, Typography } from '@mui/material'
import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import { MdClose } from 'react-icons/md'
import CustomButton from "../button"
import axios from 'axios'
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as notifications from '../../store/notifyActions';
import * as customerPortalActions from '../../store/actions';
import CustomInput from "../input"
import DropDown from '../dropdown'
import { withMediaQuery } from '../../components/withMediaQuery';
import { makeStyles, withStyles, styled } from '@mui/styles'
import SignatureCanvas from "react-signature-canvas"
import jwtDecode from 'jwt-decode'
import moment from 'moment'

const CustomCommentInput = styled(CustomInput)({
    "& label .MuiInputLabel-asterisk": {
        color: "red",
    },
    "& label .MuiInputLabel-asterisk:after": {
        content: "'\\2009'"
    }
});

const CustomModal = (props) => {
    const { modalOpen, profile, setContracts, defaultSignature, setModalOpen, modalVal, setModalVal, approvalVal, rejectVal, viewVal, setBodyParamFilter, addNotification, bodyParamFilter, foremanNames, jobNumbers, statusOption, setJobForeman, setJobNos, setWoNos, setPoNos, setJobWeek, setJobStatus, postJobStatus, isMobile, makeInitialFetch, isRequester, isResurfacing } = props;
    const useStyles = makeStyles((theme) => ({
        dialog: {
            [theme.breakpoints.down('sm')]: {
                "& .MuiDialog-container .MuiDialog-paper": {
                    margin: "0px 5px",
                    width: "100%",
                    maxHeight: "100%",
                    height: '98%'
                },
            }
        },
        signatureCanvas: {
            border: "1px solid rgba(0, 0, 0, 0.42)",
            width: "100%",
            height: "150px",
            background: "#efefef"
        },
        signatureBtnContainer: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px"
        },
        requesterDiv: {
            background: "#efefef",
            paddingBottom: "7px",
            paddingTop: "7px !important",
            marginTop: "8px !important",
            paddingRight: "10px"
        }
    }))
    const formControlLabelStyle = {
        "& .MuiFormControlLabel-label": {
            fontSize: "12px"
        }
    }
    const classes = useStyles()
    const [comments, setComments] = useState('')
    const [rejectReason, setRejectReason] = useState('')
    const [selectedVal, setSelectedVal] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true)
    const signatureRef = useRef(null)
    const [signatureImportValue, setSignatureImport] = useState(defaultSignature);
    const [signature, setSignature] = useState(null)
    const [showStampSign, setShowStampSign] = useState(false)
    const signatureDivRef = useRef(null)
    const [stampBtnDisabled, setStampBtnDisabled] = useState(false)
    const [checked, setChecked] = useState(false)
    const [requesterNameError, setRequesterNameError] = useState({
        errorState: false,
        errorMessage: ""
    })

    const tokenObject = jwtDecode(sessionStorage.getItem("token"))

    const handleRejectReason = (e) => {
        const selectedVal = rejectVal.find(item => item.id === e.target.value)
        setSelectedVal(selectedVal)
        if (selectedVal.rejectionReason !== 'Other') {
            setBtnDisabled(false)
        } else if (selectedVal.rejectionReason === 'Other' && comments.length > 0) {
            setBtnDisabled(false)
        } else {
            setBtnDisabled(true)
        }
        setRejectReason(e.target.value)
    }

    const handleSignatureEnd = () => {
        // Timestamp on signature changes 
        // if (!signature) {
        //     const timestamp = `${moment().format('MM-DD-YYYY, hh:mm:ss a')}`
        //     let signCanvas = signatureRef.current.getCanvas()
        //     // signCanvas.height = 400
        //     let canvasCtx = signCanvas.getContext("2d")
        //     const fontSize = isMobile ? 12 : 12;
        //     canvasCtx.font = `${fontSize}px Arial`;
        //     canvasCtx.fillStyle = "black";
        //     canvasCtx.textAlign = "center";
        //     const width = signatureDivRef?.current?.offsetWidth;
        //     const height = signatureDivRef?.current?.offsetHeight;
        //     console.log("Width:", width, 'height:', height);
        //     const stampStartPos = isMobile ? width * 0.75 : width * 0.80;
        //     canvasCtx.fillText(tokenObject.UserName, stampStartPos, ((height * 0.70) - fontSize * 0.75))
        //     canvasCtx.fillText(timestamp, stampStartPos, ((height * 0.70) + fontSize * 0.75))
        //     console.log(signCanvas.toDataURL(), "signCanvas")
        // }
        setSignature(signatureRef.current.toDataURL().split(',')[1])
    }

    const clearSignature = () => {
        if (!showStampSign) {
            if (signatureRef?.current) {
                signatureRef.current.clear()
            }
            setSignature(null)
            setSignatureImport(null);
        } else {
            setShowStampSign(false)
            setBtnDisabled(true)
            setStampBtnDisabled(false)
            setSignature(null)
        }
    }

    const handleStamp = () => {
        setSignatureImport(null)
        setShowStampSign(true)
        setStampBtnDisabled(true)
    }

    useEffect(() => {
        const signBase64Val = signatureImportValue?.split(',')[1];
        setSignature(signBase64Val);
    }, [signatureImportValue])

    useEffect(() => {
        if (approvalVal == 'Approve') {
            isRequester ? (
                signature && checked && (modalVal?.requesterName && modalVal?.requesterName.length <= 40) ?

                    setBtnDisabled(false)

                    : setBtnDisabled(true)
            ) : (
                signature ? setBtnDisabled(false) : setBtnDisabled(true)
            )
            modalVal?.requesterName?.length >= 40 ? setRequesterNameError({ errorState: true, errorMessage: "Requester Name exceeds the 40 characters limit" }) : setRequesterNameError({ errorState: false, errorMessage: "" })
        }
    }, [signature, checked, modalVal])

    useEffect(() => {
        if (showStampSign) {
            const stamp = document.getElementById('stamp')
            stamp.width = signatureDivRef?.current?.offsetWidth - 16
            const ctx = stamp.getContext("2d")
            const fontSize = 16
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            const timestamp = `${moment().format('MM-DD-YYYY, hh:mm:ss a')}`
            const stampName = props?.profile.firstName + '.' + props?.profile.lastName
            ctx.fillText(stampName, stamp.width / 2, ((stamp.height / 2) - fontSize));
            // ctx.fillText(tokenObject.Organization + tokenObject.Role, stamp.width / 2, stamp.height / 2);
            ctx.fillText(timestamp, stamp.width / 2, ((stamp.height / 2) + fontSize));
            setSignature(stamp.toDataURL().split(',')[1])
        }
    }, [showStampSign])


    const handleModalClose = () => {
        setModalOpen(false);
        setComments("");
        setShowStampSign(false);
        setRejectReason("");
        setBtnDisabled(true);
        setStampBtnDisabled(false)
        setSignature(null)
        setChecked(false)
        if (selectedVal) {
            setSelectedVal("")
        }
        setSignatureImport(defaultSignature);
    }

    const handleComments = (e, approvalVal) => {
        setComments(e.target.value);
        if (approvalVal === "Reject") {
            const selectedVal = rejectVal.find(item => item.id === rejectReason)
            if (selectedVal.rejectionReason != 'Other') {
                setBtnDisabled(false)
            } else {
                setBtnDisabled(!e.target.value)
            }
        }
    }

    const handleRequesterName = (e) => {
        setModalVal((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const handleButton = async (approvalVal) => {
        let commentObj = {
            jobId: modalVal.id,
            userId: 0,
            comments,
            ipAddress: '',
            requester: modalVal.requesterName,
            isResurfacing: isResurfacing
        }
        if (approvalVal === "Approve") {
            commentObj["status"] = "approved"
            commentObj["signature"] = signature
        } else {
            commentObj["status"] = "rejected"
            commentObj["ReasonRejectionId"] = rejectReason
        }
        try {
            const resp = await postJobStatus(commentObj).then(response => {
                return response
            })
            if (resp.status === 200) {
                addNotification({ message: resp.data.message, type: 'success' })
                setModalOpen(false)
                const selectedStatus = statusOption.find((item) => {
                    return item.name === bodyParamFilter.status
                })
                setJobStatus(selectedStatus.id)
                setJobNos(bodyParamFilter.jobNumber)
                setWoNos(bodyParamFilter.wo)
                setContracts(bodyParamFilter.contractNumber)
                setPoNos(bodyParamFilter.po)
                setJobForeman(bodyParamFilter.foremanName)
                setJobWeek(bodyParamFilter.currentWeek ? 1 : 2)
                setBodyParamFilter({
                    foremanName: bodyParamFilter.foremanName,
                    jobNumber: bodyParamFilter.jobNumber,
                    status: bodyParamFilter.status,
                    currentWeek: bodyParamFilter.currentWeek,
                    wo: bodyParamFilter.wo,
                    contractNumber: bodyParamFilter.contractNumber,
                    po: bodyParamFilter.po,
                    isResurfacing: bodyParamFilter.isResurfacing
                })
            }
        } catch (error) {
            addNotification({ message: error.response.data.message, type: 'error' })
            makeInitialFetch();
        }
    }

    return (
        <>
            <Dialog open={modalOpen} fullWidth onClose={() => handleModalClose()} maxWidth='sm' className={classes.dialog} PaperProps={{
                sx: {
                    maxHeight: "calc(100% - 32px)"
                }
            }}>
                <DialogTitle style={{ background: "#f4f4f4", padding: "10px 24px" }}>
                    {approvalVal !== 'View' ? (
                        <Typography style={{ color: `${approvalVal === "Approve" ? '#2F9220' : '#EE3A41'}`, fontWeight: 600 }}>     {approvalVal === "Approve" ? "Approval" : "Rejection"} Confirmation
                        </Typography>
                    ) : (
                        <Typography style={{ color: '#2F9220', fontWeight: 600 }}>     Approval
                        </Typography>
                    )}
                    <IconButton
                        onClick={() => handleModalClose()}
                        sx={{
                            position: 'absolute',
                            right: 2,
                            top: 2
                        }}
                    >
                        <MdClose />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "16px 18px 16px 30px" }}>
                    {/* <DialogContentText>
                        <Typography style={{ color: "black" }}>Are you sure you want to {approvalVal.toLowerCase()} this DFR?</Typography>
                    </DialogContentText> */}
                    <Grid container xs={12} spacing={2} justifyContent={!isMobile && "space-between"} flexDirection={isMobile && 'column'}>
                        {approvalVal !== 'View' && (
                            <Grid item container justifyContent="space-between">
                                <Grid item>
                                    <Grid container xs={12} gap={1} flexDirection={isMobile && 'column'}>
                                        <Grid item>
                                            <Typography>Job Number: </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{modalVal.jobNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container xs={12} gap={1} flexDirection={isMobile && 'column'}>
                                        <Grid item>
                                            <Typography>Foreman: </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{modalVal.foremanName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        {approvalVal === "Reject" ? (
                            <Grid item container>
                                <Grid item xs={12}>
                                    <DropDown
                                        name="rejection"
                                        minWidth="100%"
                                        label="Select Reason for Rejection"
                                        keyToBind={{ key: 'id', value: 'rejectionReason' }}
                                        options={rejectVal}
                                        value={rejectReason}
                                        onChange={handleRejectReason}
                                        formStyle={{ margin: 0 }}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <></>
                        )}
                        {(approvalVal === "Approve" && isRequester) &&
                            <>
                                <Grid item container gap={1} className={classes.requesterDiv}>
                                    <Grid item container alignItems="flex-end" gap={1}>
                                        <Grid item xs={12}><Typography>Requester Name<span style={{ color: "red" }}>*</span>:</Typography></Grid>
                                        <Grid item xs={12}>
                                            <CustomInput
                                                name="requesterName"
                                                placeholder="Enter Requester's Name"
                                                variant="outlined"
                                                autoComplete="off"
                                                fullWidth
                                                value={modalVal.requesterName}
                                                onChange={handleRequesterName}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    {requesterNameError.errorState && (
                                        <Grid item container>
                                            <Typography variant='caption' style={{ color: "red" }}>{requesterNameError.errorMessage}</Typography>
                                        </Grid>
                                    )}
                                    <Grid item container alignItems="center">
                                        <Grid item alignItems="center" style={{ display: "flex" }}>
                                            <Checkbox
                                                size="small"
                                                // inputProps={{ 'aria-label': 'controlled' }}
                                                disableRipple
                                                value={checked}
                                                onChange={(e) => { setChecked(e.target.checked); }}
                                                style={{ paddingLeft: "0px" }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>Hereby I assure that, Requester Name is verified <span style={{ fontSize: '12px', color: "red" }}>*</span></Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        }
                        {approvalVal === "View" &&
                            <>
                                <Grid item container gap={1}>
                                    <Grid item container alignItems="flex-end">
                                        <Grid item xs={5} md={3}><Typography>Job Number:</Typography></Grid>
                                        <Grid item xs={7} md={9}>
                                            <Typography>{modalVal.jobNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item container gap={1}>
                                    <Grid item container alignItems="flex-end">
                                        <Grid item xs={5} md={3}><Typography>Foreman:</Typography></Grid>
                                        <Grid item xs={7} md={9}>
                                            <Typography>{modalVal.foremanName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {isRequester && (
                                    <Grid item container gap={1}>
                                        <Grid item container alignItems="start">
                                            <Grid item xs={5} md={3}><Typography>Requester Name:</Typography></Grid>
                                            <Grid item xs={7} md={9}>
                                                <Typography>{viewVal?.requester}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                        }
                        {approvalVal !== "View" ? (
                            <Grid item container style={{ paddingTop: isMobile ? '16px' : '6px' }}>
                                <Grid item xs={12}>
                                    <CustomCommentInput
                                        // inputProps={{ maxLength: 100 }}
                                        name="comments"
                                        label={'Comments'}
                                        fieldType="textarea"
                                        required={(approvalVal === "Reject" && selectedVal.rejectionReason === 'Other') ? true : false}
                                        rows={2}
                                        maxRows={2}
                                        value={comments}
                                        onChange={(e) => { handleComments(e, approvalVal) }}
                                        variant="standard"
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <>
                                <Grid item container>
                                    <Grid item xs={12} md={3}><Typography>Comments:</Typography></Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography>{viewVal?.comments}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container gap={1}>
                                    <Grid item xs={12}><Typography>Signature:</Typography></Grid>
                                    <Grid item xs={12} style={{ background: "#efefef" }}>
                                        <img src={viewVal?.signature} width="100%" />
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        {approvalVal === 'Approve' &&
                            <>
                                <Grid item container flexDirection="column" spacing={2}>
                                    <Grid item container justifyContent="space-between">
                                        <Grid item xs={6}>
                                            <Typography>Signature<span style={{ color: "red" }}>*</span>:</Typography>
                                        </Grid>
                                        <Grid item xs={6} className={classes.signatureBtnContainer}>
                                            <Grid item>
                                                <CustomButton
                                                    sizeValue='small'
                                                    style={{ borderRadius: '20px' }}
                                                    type="primary"
                                                    onClick={handleStamp}
                                                    primary="Stamp"
                                                    disabled={stampBtnDisabled}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <CustomButton
                                                    type="white"
                                                    sizeValue='small'
                                                    style={{ borderRadius: '20px' }}
                                                    onClick={clearSignature}
                                                    primary='Clear'
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item ref={signatureDivRef}>
                                        {signatureImportValue ?
                                            <img border='1px solid black' src={signatureImportValue} height='150px' width={isMobile ? '100%' : '532px'} /> :
                                            !showStampSign ? (
                                                <SignatureCanvas
                                                    ref={signatureRef}
                                                    velocityFilterWeight={1}
                                                    canvasProps={{ className: classes.signatureCanvas }}
                                                    onEnd={handleSignatureEnd}
                                                />
                                            ) : (
                                                <canvas id="stamp" height="150" style={{ border: "1px solid rgba(0, 0, 0, 0.42)", background: "#efefef" }}></canvas>
                                            )}
                                    </Grid>
                                </Grid>
                                <Grid item container>
                                    <Grid item xs={12}>
                                        <Typography style={{ fontSize: '12px' }}>
                                            <span style={{ fontWeight: "600" }}>Note </span>: By clicking "Approve" you agree to use your name in DFR Export in the place of signature
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </>
                        }
                    </Grid>
                </DialogContent>
                {approvalVal !== "View" && (
                    <DialogActions style={{ padding: "10px 24px", background: "#f4f4f4" }}>
                        <Grid container justifyContent='space-between'>
                            <CustomButton
                                fullHeight
                                sizeValue='small'
                                type="white"
                                // fullWidth
                                id="Cancel"
                                onClick={() => handleModalClose()}
                                // type="success"
                                primary='Cancel'
                                // variant='outlined'
                                // disabled={false}
                                // bgColor="#FFF"
                                // btnColor='#000000'
                                // hoverBgColor='#000000'
                                // hoverColor='#fff'
                                // fontWeight='600'
                                customStyle={{ width: "125px" }}
                            />
                            <CustomButton
                                fullHeight
                                sizeValue='small'
                                // fullWidth
                                id={approvalVal}
                                onClick={() => handleButton(approvalVal)}
                                type={approvalVal === "Approve" ? "success" : "error"}
                                primary={approvalVal}
                                variant='outlined'
                                disabled={btnDisabled}
                                startIcon={approvalVal === "Approve" ? <HiOutlineCheckCircle /> : <MdClose />}
                                bgColor="#FFF"
                                btnColor={approvalVal === "Approve" ? '#2F9220' : '#EE3A41'}
                                hoverBgColor={approvalVal === "Approve" ? '#2F9220' : '#EE3A41'}
                                hoverColor='#fff'
                                // fontWeight='600'
                                customStyle={{ width: "125px" }}
                            />
                        </Grid>
                    </DialogActions>
                )}
            </Dialog>
        </>
    )
}

const mapStateToProps = state => {
    const { profile } = state.customerPortal;
    return {
        profile
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            ...notifications, ...customerPortalActions
        },
        dispatch
    );

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withMediaQuery([
        ['isMobile', theme => theme.breakpoints.down('sm')],
    ])
)(CustomModal)
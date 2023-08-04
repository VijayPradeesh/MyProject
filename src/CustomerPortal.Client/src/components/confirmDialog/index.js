import React from 'react'
import { Dialog, Typography, Grid, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CustomButton from '../button';

export default function ConfirmDialog(props) {
    const {
        open,
        confirmationMessage,
        onCancel,
        onConfirm,
        note
    } = props;
    return (
        <Dialog open={open} onClose={() => onCancel(false)}>
            <DialogTitle>
                <Typography variant='h6' fontWeight={600}> Confirm the action </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography style={{ fontSize: '18px' }}> {confirmationMessage || ''} </Typography>
                {note && <Typography style={{ fontSize: '14px', marginTop: '10px' }}>
                    <span style={{ fontWeight: "600" }}>Note</span>: {note || ''}
                </Typography>}
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent='space-between'>
                    <CustomButton
                        fullHeight
                        sizeValue='small'
                        type="white"
                        // fullWidth
                        id="Cancel"
                        onClick={() => onCancel(false)}
                        primary='Cancel'
                        customStyle={{ width: "125px" }}
                    />
                    <CustomButton
                        fullHeight
                        sizeValue='small'
                        type='primary'
                        onClick={() => onConfirm()}
                        primary="Confirm"
                        customStyle={{ width: "125px" }}
                    />
                </Grid>
            </DialogActions>
        </Dialog>
    )
}
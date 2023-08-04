import React from 'react'
import { Grid, Typography } from '@mui/material'
import { BsXCircle, BsCheckCircle } from 'react-icons/bs';

const checkUpperChar = value => {
    const regex = '^(?=.*[A-Z]).+$'
    return value.match(regex);
}

const checkLowerChar = value => {
    const regex = '^(?=.*[a-z]).+$'
    return value.match(regex);
}

const checkNumericChar = value => {
    const regex = '^(?=.*[0-9]).+$'
    return value.match(regex);
}

const checkSpecialChar = value => {
    const regex = '^(?=.*[_!@#$%^&*?]).+$'
    return value.match(regex);
}

const checkMinLength = value => {
    const regex = '^.{12,}$'
    return value.match(regex);
}

const PasswordCriterion = (props) => {

    const hasLowerCase = checkLowerChar(props.password);
    const hasUpperCase = checkUpperChar(props.password);
    const hasNumber = checkNumericChar(props.password);
    const hasSpecialChar = checkSpecialChar(props.password);
    const hasMinLength = checkMinLength(props.password);
    return (
        <React.Fragment>
            <Grid container display='flex' sx={{ backgroundColor: 'white' }}>
                <Grid item xs={12} sx={{ display: { justifyContent: 'center', fontSize: '12px' } }}>
                    {hasLowerCase ? <BsCheckCircle color='green' size='10px' /> : <BsXCircle color='red' size='10px' />} Lower-case character(s)
                </Grid>
                <Grid item xs={12} sx={{ display: { justifyContent: 'center', fontSize: '12px' } }}>
                    {hasUpperCase ? <BsCheckCircle color='green' size='10px' /> : <BsXCircle color='red' size='10px' />} Upper-case character(s)
                </Grid>
                <Grid item xs={12} sx={{ display: { justifyContent: 'center', fontSize: '12px' } }}>
                    {hasNumber ? <BsCheckCircle color='green' size='10px' /> : <BsXCircle color='red' size='10px' />} Numeric character(s)
                </Grid>
                <Grid item xs={12} sx={{ display: { justifyContent: 'center', fontSize: '12px' } }}>
                    {hasSpecialChar ? <BsCheckCircle color='green' size='10px' /> : <BsXCircle color='red' size='10px' />} Special character(s)
                </Grid>
                <Grid item xs={12} sx={{ display: { justifyContent: 'center', fontSize: '12px' } }}>
                    {hasMinLength ? <BsCheckCircle color='green' size='10px' /> : <BsXCircle color='red' size='10px' />} Minimum 12 character(s)
                </Grid>
            </Grid>
        </React.Fragment>
    )
};

export default PasswordCriterion;
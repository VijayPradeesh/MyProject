import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles, styled } from '@mui/styles';
import { Grid, InputAdornment, Paper, TextField, Box, IconButton, Autocomplete } from '@mui/material';
import classnames from 'classnames';
import { bindActionCreators, compose } from 'redux';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { numberOnly } from './validator';
import styles from './style';
import PasswordCriterion from './passwordCriterion';
import { withMediaQuery } from '../withMediaQuery';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#EEEEEE',
        color: 'black',
        maxWidth: '150px',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

function GetTextInput(props) {
    const {
        classes,
        type,
        name,
        label,
        value,
        disabled,
        onChange,
        customClass,
        required,
        endAdornment,
        startAdornment,
        margin,
        variant,
        validator,
        autoComplete,
        size,
        placeholderColor,
        onClickEndAdornment,
        onClickStartAdornment,
        error,
        width,
        fitContent,
        hideOutline,
        readOnly,
        passwordCriterion,
        isMobile,
        disableSpace,
        ...rest
    } = props;

    let isFocused;
    const classNames = classnames(classes.root, ...customClass);

    const handleChange = event => {
        const evt = event;
        if (validator === 'number') evt.target.value = numberOnly(evt.target.value);
        onChange(evt);
    };

    const handleKeyDown = evt => {
        if (evt.keyCode === 32) { // 32 is the key code for space
            evt.preventDefault();
        }
    };

    const onFocus = () => {
        isFocused = true;
    };

    return (
        <React.Fragment>
            <LightTooltip open={passwordCriterion && isFocused} disableHoverListener disableInteractive title={passwordCriterion && <PasswordCriterion password={value} />}
                placement={isMobile ? 'bottom' : 'right-start'} >
                <TextField
                    label={label}
                    variant={variant}
                    autoComplete={autoComplete}
                    type={type}
                    name={name}
                    onFocus={onFocus}
                    disabled={disabled}
                    onChange={handleChange}
                    onKeyDown={disableSpace && handleKeyDown}
                    value={value || ''}
                    className={classNames}
                    required={required}
                    size={size}
                    InputLabelProps={{
                        style: { color: placeholderColor },
                    }}
                    sx={hideOutline ? { fontSize: 15, width: width, boxShadow: 'none', textAlign: "center", '.MuiOutlinedInput-notchedOutline': { border: 0 } } : { width: width }}
                    InputProps={{
                        disableUnderline: hideOutline,
                        style: {
                            padding: fitContent ? '5px' : null
                        },
                        readOnly: readOnly,
                        classes: {
                            //focused: classes.cssFocused,
                            input: classes.autoCompleteInput,
                            notchedOutline: error ? classes.notchedOutline : null
                        },
                        startAdornment: (
                            startAdornment ? <InputAdornment position="start">
                                {startAdornment}
                            </InputAdornment> : null
                        ),
                        endAdornment: (
                            endAdornment ? <InputAdornment position="end" style={{ cursor: 'pointer' }} onClick={onClickEndAdornment}>
                                {endAdornment}
                            </InputAdornment> : null
                        ),
                    }}
                    {...rest}
                />
            </LightTooltip>
        </React.Fragment >
    );
}

GetTextInput.defaultProps = {
    placeholderColor: '#424242'
};

GetTextInput.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    variant: PropTypes.string,
    customClass: PropTypes.array,
    endAdornment: PropTypes.any,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    margin: PropTypes.string,
    validator: PropTypes.string,
    size: PropTypes.string
};

function GetMultilineTextInput(props) {
    const {
        classes,
        type,
        name,
        value,
        label,
        disabled,
        onChange,
        rowsMax,
        required,
        autoFocus,
        customClass,
        variant,
        size,
        hideOutline,
        readOnly,
        ...rest
    } = props;
    const classNames = classnames(classes.textArea, ...customClass);
    return (
        <TextField
            id="outlined-multiline-flexible"
            label={label}
            fullWidth
            name={name}
            type={type}
            value={value || ''}
            required={required}
            onChange={onChange}
            disabled={disabled}
            // size={size}
            autoFocus={autoFocus}
            multiline
            maxRows={rowsMax}
            // className={classNames}
            InputProps={{
                classes: {
                    // root: classes.textArea
                },
                disableUnderline: hideOutline,
                readOnly: readOnly,
            }}
            variant={variant}
            {...rest}
        />
    );
}

GetMultilineTextInput.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    variant: PropTypes.string,
    customClass: PropTypes.array,
    rowsMax: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    size: PropTypes.string
};

function GetAutoCompleteInput(props) {
    const {
        classes,
        label,
        customClass,
        name,
        onChange,
        value,
        disabled,
        autoFocus,
        required,
        options,
        endAdornment,
        startAdornment,
        width,
        hideOutline,
        variant,
        ...rest
    } = props;
    return (
        <Autocomplete
            id="controllable-states-demo"
            name={name}
            value={value}
            onChange={onChange}
            options={options}
            sx={hideOutline ? { fontSize: 15, width: width, boxShadow: 'none', textAlign: "center", '.MuiOutlinedInput-notchedOutline': { border: 0 } } : { width: width }}
            componentsProps={{
                paper: {
                    sx: {
                        width: "max-content",
                        minWidth: "100%"
                    }
                }
            }}
            required={required}
            renderInput={(params) => <TextField {...params} label={label} variant={variant} />}
            InputProps={{
                classes: {
                    focused: classes.cssFocused,
                    input: classes.autoCompleteInput
                },
                startAdornment: (
                    <InputAdornment position="start">
                        {startAdornment}
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                        {endAdornment}
                    </InputAdornment>
                ),
            }}
            {...rest}
        />
    )
}

GetAutoCompleteInput.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string,
    customClass: PropTypes.array,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any.isRequired,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    options: PropTypes.array,
    endAdornment: PropTypes.any,
    startAdornment: PropTypes.any,
    required: PropTypes.bool,
    width: PropTypes.number,
    hideOutline: PropTypes.any,
    variant: PropTypes.string
}

class CustomInput extends React.Component {
    render() {
        const { fieldType, ...rest } = this.props;
        return (
            <React.Fragment>
                {fieldType === 'input' && <GetTextInput {...rest} />}
                {fieldType === 'textarea' && <GetMultilineTextInput {...rest} />}
                {fieldType === 'autocomplete' && <GetAutoCompleteInput {...rest} />}
            </React.Fragment>
        );
    }
}

CustomInput.defaultProps = {
    variant: 'outlined',
    fieldType: 'input',
    type: 'text',
    autoComplete: 'off',
    customClass: [],
    rowsmax: 5,
    size: 'small',
    placeholderColor: '#424242'
};
CustomInput.propTypes = {
    fieldType: PropTypes.string,
    type: PropTypes.string,
    variant: PropTypes.string,
    customClass: PropTypes.array,
    rowsMax: PropTypes.number
};

export default compose(
    withStyles(styles, {
        name: 'input'
    }),
    withMediaQuery([
        ['isMobile', theme => theme.breakpoints.down('sm')],
        //['isDesktop', theme => theme.breakpoints.up('650')],
    ]),
)(CustomInput);
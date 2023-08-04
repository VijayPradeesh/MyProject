import React, { Component } from 'react';
import { withStyles } from '@mui/styles';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import classnames from 'classnames';
import style from './styles';

const TYPE = {
    OUTLINED: 'outlined',
    STANDARD: 'standard'
};

const materialTheme = createTheme({
    overrides: {
        MuiOutlinedInput: {
            input: {
                padding: '0px'
            }
        },
        MuiInputLabel: {
            outlined: {
                transform: 'translate(14px, 13px) scale(1)'
            }
        }
    },
    typography: {
        useNextVariants: true
    }
});

// menu items
/* const Options = forwardRef((props, ref) => {
    const { options, keyToBind } = props;
    return options.map(e => (
        <MenuItem ref={ref} key={e[keyToBind.key]} value={e[keyToBind.key]}>
            {e[keyToBind.value]}
        </MenuItem>
    ));
});*/

class FilterDropDown extends Component {
  
    outlinedSelect = () => {
        const {
            classes,
            label,
            autoWidth,
            value,
            keyToBind,
            options,
            onChange,
            required,
            name,
            classStyle,
            formControlStyle,
            inputLabelStyle,
            hideOutline
        } = this.props;
        const input = classnames(classes.outlineInput, ...classStyle);
        return (
            <FormControl
                required={required}
                variant="standard"
                className={classes.root}
                size="small">
                <InputLabel>
                    {label}
                </InputLabel>
                <Select
                    name={name}
                    value={value}
                    label={label}
                    style={formControlStyle}
                    sx={hideOutline ? { fontSize: 15, boxShadow: 'none', textAlign:"center", '.MuiOutlinedInput-notchedOutline': { border: 0 }, '&:before':{borderBottom:"none"} } : {}}
                    onChange={e => onChange(e)}
                    // MenuProps={{
                    //     anchorOrigin: {
                    //         vertical: 'bottom',
                    //         horizontal: 'left'
                    //     },
                    //     transformOrigin: {
                    //         vertical: 'top',
                    //         horizontal: 'left'
                    //     },
                    //     getContentAnchorEl: null,
                    //     className: classes.popoverHeight
                    // }}
                    >
                    <MenuItem disabled value="">
                        <em>Select</em>
                    </MenuItem>
                    {options.length &&
                        options.map(e => (
                            <MenuItem key={e[keyToBind.key]} value={e[keyToBind.key]} disabled={e.disabled}>
                                {e[keyToBind.value]}
                            </MenuItem>
                        ))}
                    {!options.length && <MenuItem disabled> No Data</MenuItem>}
                </Select>
            </FormControl>
        );
    };

    standardSelect = () => {
        const {
            classes,
            classStyle,
            keyToBind,
            options,
            onChange,
            autoWidth,
            value,
            formControlStyle,
            hideOutline
        } = this.props;
        const classesFormControl = classnames(classes.root, ...classStyle);
        const input = classnames(classes.formControlInput);
        console.log(hideOutline, "hideOutline")
        return (
            <FormControl className={classesFormControl} style={formControlStyle}>
                <Select
                    autoWidth={autoWidth}
                    onChange={e => onChange(e)}
                    value={value}
                    sx={hideOutline ? { fontSize: 15, boxShadow: 'none',textAlign:"center", '.MuiOutlinedInput-notchedOutline': { border: 0 } } : {}}
                InputLabelProps={{ style: { fontSize: 9, color: 'grey', fontFamily: "monospace" } }}
                    input={<Input disableUnderline className={input} />}>
                    <MenuItem disabled value="">
                        <em>Select</em>
                    </MenuItem>
                    {options.length &&
                        options.map(e => (
                            <MenuItem key={e[keyToBind.key]} value={e[keyToBind.key]}>
                                {e[keyToBind.value]}
                            </MenuItem>
                        ))}
                    {!options.length && <MenuItem disabled> No Data</MenuItem>}
                </Select>
            </FormControl>
        );
    };

    render() {
        const { type } = this.props;
        return (
            <React.Fragment>
                <ThemeProvider theme={materialTheme}>
                    {type === TYPE.OUTLINED && this.outlinedSelect()}
                    {type === TYPE.STANDARD && this.standardSelect()}
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

FilterDropDown.defaultProps = {
    type: 'outlined',
    inputLabelStyle: null,
    formControlStyle: null,
    classStyle: [],
    autoWidth: false
};

FilterDropDown.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    options: PropTypes.array.isRequired,
    keyToBind: PropTypes.object.isRequired,
    type: PropTypes.string,
    autoWidth: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
    formControlStyle: PropTypes.any,
    inputLabelStyle: PropTypes.any,
    classStyle: PropTypes.any,
    required: PropTypes.bool
};

export default withStyles(style)(FilterDropDown);

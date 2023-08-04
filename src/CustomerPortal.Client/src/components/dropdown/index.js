import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import { shortString } from '../../services/helpers';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        margin: '0px 10px 0px 4px',
    },
    select: {
        '& > *': {
            padding: '1px !important',
            display: 'flex',
            justifyContent: 'center'
        },
    },
    menuItem: {
        '& > *': {
            padding: '2px !important',
            display: 'flex',
            justifyContent: 'space-between'
        },
    },
    centerGrid: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        '& > *': {
            padding: '2px !important'
        },
    }
}));

function DropDown(props) {
    const {
        options,
        value,
        keyToBind,
        onChange,
        label,
        minWidth,
        name,
        size,
        hideOutline,
        sx,
        variant,
        formControlStyle,
        formStyle,
        placeholderColor,
        disabled,
        customClassSelect,
        inputType,
        maxLimit
    } = props;

    const obj = options && options.find(item => keyToBind && item[keyToBind.key] === value);
    const classes = useStyles();
    return (
        <FormControl variant={variant} sx={{ m: 1, minWidth: minWidth, ...sx }} size={size} style={formStyle} disabled={disabled}>
            <InputLabel id="demo-simple-select-standard-label" style={{ color: placeholderColor, padding: '0px', margin: '0px' }}>{label}</InputLabel>
            <Select
                name={name}
                value={value}
                renderValue={() =>
                    maxLimit ?
                        inputType == 'array' ?
                            shortString(value, maxLimit) :
                            obj && shortString(obj[keyToBind.value]) :
                        inputType == 'array' ? value :
                            obj && obj[keyToBind.value]
                }
                label={label}
                style={formControlStyle}
                onChange={e => onChange(e)}
                className={customClassSelect}
                sx={hideOutline ? { fontSize: 15, boxShadow: 'none', marginTop: 0, '.MuiOutlinedInput-notchedOutline': { border: 0 }, '&:before': { borderBottom: "none" } } : {}}
                InputLabelProps={{ style: { fontSize: 9, color: placeholderColor, fontFamily: "monospace" } }}
            >
                {/* <MenuItem disabled value="">
                    <em>Select</em>
                </MenuItem> */}
                {options && (inputType == 'object') &&
                    options.map(e => (
                        <MenuItem key={e[keyToBind.key]} value={e[keyToBind.key]}>
                            {e[keyToBind.value]}
                        </MenuItem>
                    ))}
                {options && (inputType == 'array') &&
                    options.map(e => (
                        <MenuItem value={e}>
                            {e}
                        </MenuItem>
                    ))}
                {(!options || options.length == 0) && <MenuItem disabled> No Data</MenuItem>}
            </Select>
        </FormControl >
    );
};

DropDown.defaultProps = {
    size: 'small',
    minWidth: '100%',
    formControlStyle: null,
    formStyle: null,
    classStyle: [],
    inputType: 'object',
    autoWidth: false,
    placeholderColor: '#424242'
};

export default DropDown;
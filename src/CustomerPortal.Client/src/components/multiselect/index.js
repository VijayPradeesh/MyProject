import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@mui/styles';
import { Chip } from '@mui/material';
import { height } from '@mui/system';
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
    chipsLeftAlign: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        margin: '0px 10px 0px 4px',
        '& .MuiChip-label': {
            paddingLeft: '6px',
            paddingRight: '6px'
        }
    },
    select: {
        '& > *': {
            padding: '1px !important',
            display: 'flex',
            justifyContent: 'space-between'
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
        justifyContent: 'center',
        alignItems: 'center'
    },
}));

function MultipleSelectCheckmarks(props) {
    const
        {
            options,
            hideOutline,
            initalValue,
            onChange,
            width,
            maxWidth,
            label,
            placeholderColor,
            variant,
            minWidth,
            customClass,
            customClassSelect,
            selectAll,
            selectAllValue,
            onToggleSelectAll,
            textAlignLeft
        } = props;
    const classes = useStyles();
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: width,
                maxWidth: maxWidth,
                minWidth: 'max-content'
            },
        },
        variant: 'menu'
    };
    return (
        <div>
            <FormControl variant={variant} sx={{ m: 1, width: width, minWidth: minWidth, maxWidth: maxWidth, ...customClass }} size="small">
                <InputLabel id="demo-multiple-checkbox-label" style={{ color: placeholderColor, padding: '0px', margin: '0px' }}>{label || ''}</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={initalValue}
                    onChange={onChange}
                    className={customClassSelect || classes.select}
                    input={variant == "outlined" && <OutlinedInput label={label || ''} />}
                    renderValue={(selected) => (
                        <div className={textAlignLeft ? classes.chipsLeftAlign : classes.chips}>
                            {selectAllValue ? `All ${label}` :
                                initalValue.length > 1 ?
                                    <div>
                                        {shortString(selected[0], 10)}
                                        <Chip label={`+ ${initalValue.length - 1}`} className={classes.chip} />
                                    </div> : `${shortString(selected[0], 14)}`
                            }
                        </div>
                    )}
                    MenuProps={MenuProps}
                    sx={hideOutline ? { fontSize: 15, boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } } : { padding: 0 }}
                    InputLabelProps={{ style: { fontSize: 9, color: placeholderColor, fontFamily: "monospace" } }}
                >
                    {options && options.length > 0 && selectAll ?
                        <MenuItem className={classes.menuItem} onClick={onToggleSelectAll}>
                            <Checkbox checked={selectAllValue} />
                            <ListItemText primary={'Select All'} />
                        </MenuItem> : null}
                    {options.map((name) => (
                        <MenuItem key={name} value={name} className={classes.menuItem}>
                            <Checkbox checked={selectAllValue ? selectAllValue : initalValue.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                    {(!options || options.length == 0) && <MenuItem disabled> No Data</MenuItem>}
                </Select>
            </FormControl>
        </div>
    );
}

MultipleSelectCheckmarks.defaultProps = {
    size: 'small',
    minWidth: '100px',
    formControlStyle: null,
    classStyle: [],
    autoWidth: false,
    textAlignLeft: false,
    placeholderColor: '#424242'
};

export default MultipleSelectCheckmarks;
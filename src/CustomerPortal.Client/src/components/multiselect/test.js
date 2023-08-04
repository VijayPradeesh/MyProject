import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;


function MultipleSelect(props) {
    const { currentValue, options, onChange, hideOutline, variant, keyToBind, placeholderColor, label, width } = props;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: width,
            },
        },
    };
    return (
        <div>
            <FormControl variant={variant} sx={{ m: 1, width: width }} size="small">
                <InputLabel id="demo-multiple-checkbox-label" style={{ color: placeholderColor, padding: '0px', margin: '0px' }}>{label || ''}</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={currentValue}
                    onChange={onChange}
                    input={variant == "outlined" && <OutlinedInput label={label || ''} />}
                    renderValue={(selected) => selected.map((x) => x[keyToBind.value]).join(', ')}
                    MenuProps={MenuProps}
                    sx={hideOutline ? { boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } } : {}}
                >
                    {options && options.map((variant) => (
                        <MenuItem key={variant.id} value={variant}>
                            <Checkbox
                                checked={
                                    currentValue && currentValue.findIndex((item) => item.id === variant.id) >= 0
                                }
                            />
                            <ListItemText primary={variant[keyToBind.value]} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div >
    );
}

MultipleSelect.defaultProps = {
    width: '300px',
    placeholderColor: '#424242'
};

export default React.memo(MultipleSelect);
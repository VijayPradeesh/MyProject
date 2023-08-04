import React from 'react';
import { FormControl, Radio, FormLabel, RadioGroup, FormControlLabel } from '@mui/material';

function MultipleRadio(props) {
    const {
        value,
        options,
        handleChange,
        label,
        keyToBind
    } = props;
    return (
        <React.Fragment>
            <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">{label || ''}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                >
                    {
                        options && options.map((e) => (
                            <FormControlLabel value={e[keyToBind.key]} control={<Radio />} label={e[keyToBind.value]} />
                        ))
                    }
                </RadioGroup>
            </FormControl>
        </React.Fragment>
    )
}

export default MultipleRadio
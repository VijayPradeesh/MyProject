import * as React from 'react';
import { Paper, InputBase, Divider, IconButton, Tooltip } from '@mui/material';
import { FiSearch } from "react-icons/fi";
import { withStyles } from '@mui/styles';
import { MdClear } from "react-icons/md";

const styles = () => ({
    customTextField: {
        "& input::placeholder": {
            fontSize: "15px"
        }
    }
});

function SearchBar(props) {

    const {
        classes,
        name,
        placeholder,
        onChange,
        onSearch,
        width,
        height,
        className,
        placeholderStyle,
        onClear,
        value,
        disableSearchButton,
        fullWidth,
        hideSearchIcon,
        spellCheck,
        maxLength
    } = props;
    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: width, height: height, fullWidth: fullWidth }}
            className={className}
        >
            {!hideSearchIcon &&
                <>
                    <Tooltip title="Search">
                        <IconButton type="button" sx={{ p: '6px' }} aria-label="search" disabled={disableSearchButton} onClick={() => onSearch()}>
                            <FiSearch />
                        </IconButton>
                    </Tooltip>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </>
            }
            <InputBase
                value={value}
                name={name}
                autocomplete={false}
                spellCheck={spellCheck}
                sx={{ ml: 1, flex: 1 }}
                onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                className={classes.customTextField}
                placeholder={placeholder}
                inputProps={{
                    name: name,
                    autoComplete: 'off',
                    maxLength: `${maxLength}`
                }}
                //InputLabelProps={{ style: { fontSize: 20 } }}
                onChange={e => onChange(e)}
            />
            {value ? <>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Tooltip title="Clear">
                    <IconButton type="button" sx={{ p: '5px' }} aria-label="search" onClick={() => onClear()}>
                        <MdClear />
                    </IconButton>
                </Tooltip>
            </> : null}
        </Paper>
    );
}

SearchBar.defaultProps = {
    placeholder: 'Search',
    hideSearchIcon: false,
    spellCheck: false
};

export default withStyles(styles)(SearchBar);
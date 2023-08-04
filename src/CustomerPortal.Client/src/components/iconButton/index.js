import { Tooltip, IconButton } from "@mui/material";
import React from "react";
import classnames from 'classnames';
import { withStyles } from '@mui/styles';

const styles = () => ({
    iconRoot: {
        padding: '5px'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    input: {
        display: 'none'
    },
    noRadius: {
        borderRadius: 0
    }
});

function CustomIconButton(props) {
    const {
        title,
        onClick,
        style,
        className,
        disabled,
        classes,
        variant,
        maxWidth,
        ...rest
    } = props;

    const customClass = classnames(classes.button, className)
    return (
        <React.Fragment>
            <Tooltip title={title}>
                <IconButton
                    onClick={onClick}
                    style={style}
                    disabled={disabled}
                    className={customClass}
                    variant={variant}
                    sx={{
                        maxWidth: maxWidth
                    }}
                    {...rest}
                >
                    {props.children}
                </IconButton>
            </Tooltip>
        </React.Fragment >
    )
}

CustomIconButton.defaultProps = {
    title: '',
    disabled: false
};

export default withStyles(styles)(CustomIconButton);
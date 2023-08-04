import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import classnames from 'classnames';
import { Button, Fab } from '@mui/material';


const styles = theme => ({
    container: {
        position: 'absolute',
        bottom: 90,
        right: 16,
    }
});

function FloatingButton(props) {
    const { classes, icon, label, color, onClick, top, bottom, right, left } = props;

    return (
        <Fab
            color={color}
            label={label}
            variant={label ? 'extended' : 'circular'}
            style={{ position: 'fixed', bottom, right, mr: 1 }}
            onClick={onClick} >
            {icon ? icon : null} {label}
        </Fab>
    )
}
FloatingButton.defaultProps = {
    color: 'primary',
};

export default withStyles(styles)(FloatingButton);
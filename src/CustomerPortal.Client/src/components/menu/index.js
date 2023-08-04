import React from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Button, Menu, Tooltip } from '@mui/material';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        width: 'fit-content'
    }
})(props => {
    const { dots, paddingZero } = props;
    const horizonatalValue = dots === true ? '10' : 'center';
    return (
        <Menu
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: 50,
                horizontal: horizonatalValue
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            sx={{ padding: 0 }}
            {...props}
        />
    );
});

// const StyledMenuItem = withStyles((theme) => ({
//   root: {
//     '&:focus': {
//       backgroundColor: theme.palette.primary.main,
//       '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//         color: theme.palette.common.white,
//       },
//     },
//   },
// }))(MenuItem);

function CustomizedMenus(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { menuName, verticalDots, paddingZero } = props;

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
                style={{ padding: paddingZero && 0 }}>
                {menuName}
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                paddingZero
                open={Boolean(anchorEl)}
                onClose={handleClose}
                dots={verticalDots}>
                {props.children}
            </StyledMenu>
        </div>
    );
}

CustomizedMenus.propTypes = {
    menuName: PropTypes.string.isRequired,
    verticalDots: PropTypes.bool,
    children: PropTypes.object.isRequired
};

export default CustomizedMenus;

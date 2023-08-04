
const styles = theme => ({
    label: {
        fontSize: '12px'
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column'
    },
    colorSwitchBase: {
        color: 'purple',
        '&$colorChecked': {
            color: 'purple',
            '& + $colorBar': {
                backgroundColor: 'purple'
            }
        }
    },
    colorBar: {},
    colorChecked: {},
    iOSSwitchBase: {
        '&$iOSChecked': {
            color: theme.palette.common.white,
            '& + $iOSBar': {
                backgroundColor: '#52d869'
            }
        },
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp
        })
    },
    iOSChecked: {
        transform: 'translateX(15px)',
        '& + $iOSBar': {
            opacity: 1,
            border: 'none'
        }
    },
    iOSBar: {
        borderRadius: 13,
        width: 42,
        height: 26,
        marginTop: -13,
        marginLeft: -21,
        border: 'solid 1px',
        borderColor: 'grey',
        backgroundColor: 'grey',
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border'])
    },
    iOSIcon: {
        width: 120,
        height: 24
    },
    iOSIconChecked: {
        boxShadow: theme.shadows[1]
    }
});

export default styles;

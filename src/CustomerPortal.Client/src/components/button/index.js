import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import classnames from 'classnames';
import { Button, IconButton } from '@mui/material';
import styles from './styles';

export const TYPES = {
	PRIMARY: 'primary',
	WARNING: 'warning',
	DANGER: 'danger',
	SUCCESS: 'success'
};

export const VARIANT = {
	OUTLINED: 'outlined',
	RAISED: 'contained'
};

export const size = {
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large'
};

function CustomButton(props) {
	const {
		classes,
		type,
		variant,
		id,
		fullWidth,
		sizeValue,
		disabled,
		disableRipple,
		borderRadius,
		className,
		customStyle,
		link,
		fullHeight,
		onClick,
		children,
		primary,
		startIcon,
		bgColor,
		btnColor,
		hoverColor,
		hoverBgColor,
		fontWeight,
		fontSize,
		textTransform,
		endIcon,
		hoverBgOutlineColor
	} = props;

	const classNames = classnames(classes.button, classes[type], className, classes[variant], {
		[classes.edge]: borderRadius,
		[classes.fullHeight]: fullHeight
	});

	return (
		<Button
			fullWidth={fullWidth}
			disableRipple={disableRipple}
			disabled={disabled}
			size={sizeValue}
			href={link}
			style={customStyle}
			className={classNames}
			onClick={onClick}
			children={primary}
			color={type}
			variant={variant}
			sx={{
				'&:hover': {
					backgroundColor: hoverBgColor,
					color: hoverColor,
					border: variant == 'outlined' && `solid 1px ${hoverBgOutlineColor}`
				},
				backgroundColor: bgColor,
				color: btnColor,
				border: variant == 'outlined' && `solid 1px ${btnColor}`,
				fontWeight: fontWeight,
				fontSize: fontSize,
				textTransform: textTransform
			}}
			startIcon={startIcon}
			endIcon={endIcon} />
	);
}

CustomButton.defaultProps = {
	fullWidth: false,
	fullHeight: false,
	sizeValue: size.SMALL,
	disabled: false,
	disableRipple: false,
	borderRadius: false,
	link: null,
	customStyle: {},
	variant: VARIANT.RAISED
};

CustomButton.propTypes = {
	classes: PropTypes.object.isRequired,
	id: PropTypes.string,
	type: PropTypes.string,
	variant: PropTypes.string,
	fullWidth: PropTypes.bool,
	fullHeight: PropTypes.bool,
	sizeValue: PropTypes.string,
	disabled: PropTypes.bool,
	disableRipple: PropTypes.bool,
	borderRadius: PropTypes.bool,
	className: PropTypes.any,
	customStyle: PropTypes.any,
	link: PropTypes.string,
	onClick: PropTypes.func,
	startIcon: PropTypes.element,
	bgColor: PropTypes.string,
	btnColor: PropTypes.string,
	hoverColor: PropTypes.string,
	hoverBgColor: PropTypes.string,
	fontWeight: PropTypes.string
};

export default withStyles(styles)(CustomButton);

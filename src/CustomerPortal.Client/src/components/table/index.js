import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import {
	Paper, Table,
	TableBody, TableCell,
	TableSortLabel, TableHead,
	TableRow
} from '@mui/material';
import classnames from 'classnames';
import styles from './styles';


function ZeroRow(props) {
	const { rowHeight, header, noDataLabel } = props;
	return (
		<TableRow
			style={{
				height: rowHeight
			}}
			key={1}>
			<TableCell colSpan={header.length} align="center">
				<p>No Data</p>
			</TableCell>
		</TableRow>
	);
}
ZeroRow.propTypes = {
	header: PropTypes.array.isRequired,
	rowHeight: PropTypes.string.isRequired,
	noDataLabel: PropTypes.string.isRequired
};

function ReactVirtualizedTable(props) {
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};
	const {
		id,
		height,
		width,
		header,
		noShadow,
		rowHeight,
		children,
		classes,
		customClass,
		noFixedHeader,
		order,
		orderBy,
		onRequestSort,
		customHeight,
		zeroPadding,
		fontWeight
	} = props;
	return (
		<Paper
			id={id}
			className={classnames(classes.paper, noShadow ? classes.noTableShadow : null)}
			style={{ width, maxHeight: height, height: customHeight }}>
			<Table className={customClass}>
				{!!header.length && (
					<TableHead>
						<TableRow
							style={{
								height: rowHeight
							}}>
							{header.map(h => (
								<TableCell
									component="th"
									scope="row"
									width={h.width}
									key={h.label}
									colSpan={h.colSpan || 1}
									align={h.align || 'left'}
									sortDirection={orderBy === h.id ? order : false}
									className={classnames(
										classes.tableHeader,
										!noFixedHeader ? classes.stickyHeader : null
									)}
									style={{
										flexGrow: h.width ? 1 : 2,
										padding: zeroPadding ? "5px 16px" : null,
										fontWeight
									}}>

									{h.id != 'noSort' ? <TableSortLabel
										active={orderBy === h.id}
										direction={orderBy === h.id ? order : 'asc'}
										onClick={createSortHandler(h.id)}
									>
										{h.label}
										{orderBy === h.id ? (
											<span className={classes.visuallyHidden}>
												{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
											</span>
										) : null}
									</TableSortLabel> : <span>{h.label}</span>}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
				)}
				<TableBody>
					{children ? (
						<React.Fragment>
							{children.length !== 0 && children}
							{children.length === 0 && <ZeroRow {...props} />}
						</React.Fragment>
					) : (
						<ZeroRow {...props} />
					)}
				</TableBody>
			</Table>
		</Paper>
	);
}

ReactVirtualizedTable.defaultProps = {
	height: '150px',
	width: '100%',
	rowHeight: '25px',
	noDataLabel: 'common.nodata',
	customClass: null,
	noShadow: false,
	noFixedHeader: false,
	fontWeight: '600'
};

ReactVirtualizedTable.propTypes = {
	id: PropTypes.string,
	header: PropTypes.array.isRequired,
	rowHeight: PropTypes.string,
	noDataLabel: PropTypes.string,
	height: PropTypes.string,
	width: PropTypes.string,
	classes: PropTypes.object.isRequired,
	customClass: PropTypes.any,
	children: PropTypes.any,
	noShadow: PropTypes.bool,
	noFixedHeader: PropTypes.bool
};

export default withStyles(styles)(ReactVirtualizedTable);

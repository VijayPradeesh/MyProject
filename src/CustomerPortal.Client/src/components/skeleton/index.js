import React from 'react'
import { withStyles } from '@mui/styles'
import { Skeleton, TableCell, TableRow } from '@mui/material'
import PropTypes from 'prop-types';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const SkeletonComponent = (props) => {
  const { rows, columns } = props;
  const skeletonArray = Array(rows).fill('')
  return (
    skeletonArray.map((item, index) => {
      return (
        <StyledTableRow key={index}>
          <Columns columns={columns} />
        </StyledTableRow>
      )
    })
  )
}


const Columns = (props) => {
  const { columns } = props;
  return (
    <React.Fragment>
      {
        columns.map(element => {
          return (
            < StyledTableCell align="right" >
              <Skeleton />
            </StyledTableCell >
          )
        })
      }
    </React.Fragment >
  )
};

SkeletonComponent.defaultProps = {
  rows: 5,
};

SkeletonComponent.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number.isRequired,
};

export default SkeletonComponent;
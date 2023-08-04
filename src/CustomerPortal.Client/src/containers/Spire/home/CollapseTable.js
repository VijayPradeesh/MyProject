import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import SkeletonComponent from '../../../components/skeleton'
import { JOBS_HEADER } from '../../../constants/tableHeaders'
import { withStyles, styled } from '@mui/styles'
import { getComparator, stableSort } from '../../../services/helpers'
import ReactVirtualizedTable from '../../../components/table';

export const CollapeTable = ({ jobs, isLoading, orderByProp, classes, Row, rowProps, tableHeader }) => {
    const StyledMainTable = styled('table')(() => ({
        borderCollapse: "separate",
        borderSpacing: "0px 2px",
        width: "100%"
    }))

    const StyledTableCell = withStyles(() => ({
        root: {
            backgroundColor: '#f0941c',
            color: 'black',
        }
    }))(TableCell)

    const [containerHeight, setContainerHeight] = useState()
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(orderByProp || '');
    const elementRef = useRef(null);

    // const checkHeight = () => {
    //     setWindowHeight(window.innerHeight)
    // }

    // // useEffect(() => {
    // //     window.addEventListener('resize', checkHeight)
    // //     return () => {
    // //         window.removeEventListener("resize", checkHeight)
    // //     }
    // // }, [])

    // // useEffect(() => {
    // //     const containerHeightCalc = {
    // //         maxHeight: `${((windowHeight - elementRef.current?.offsetTop) - 20)}px`,
    // //     }
    // //     setContainerHeight(containerHeightCalc)
    // // }, [windowHeight])

    //Table function
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        if (isAsc) {
            setOrder('desc')
            return;
        }
        setOrder('asc');
        setOrderBy(property);
    };

    return (
        <>
            <div ref={elementRef} style={containerHeight}>
                <ReactVirtualizedTable
                    id="repoTable"
                    height='calc(100vh - 260px)'
                    header={tableHeader}
                    order={order}
                    zeroPadding
                    // ref={elementRef}
                    customHeight='calc(100vh-170px)'
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}>
                    {isLoading ? <SkeletonComponent columns={tableHeader} /> :
                        (jobs.jobDetails && jobs.jobDetails.length > 0 && stableSort(jobs.jobDetails, getComparator(order, orderBy))
                            .map((list, i) => (
                                <Row key={list.id} row={list} rowProp={rowProps} />
                            )))}
                </ReactVirtualizedTable>
            </div>
        </>
    )
}

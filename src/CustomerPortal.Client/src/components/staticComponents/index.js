import { TableRow, TableCell, Typography } from "@mui/material"

export const NoDataFound = () => {
    return (
        <TableRow style={{ background: "white", width: '100%', margin: '5px' }}>
            <TableCell style={{ display: 'block' }}>
                <Typography align='center'> No Data Found </Typography>
            </TableCell>
        </TableRow>
    )
}
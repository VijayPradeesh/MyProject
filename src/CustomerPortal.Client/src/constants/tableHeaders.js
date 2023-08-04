import { MdLockOpen } from 'react-icons/md'
import CustomIconButton from '../components/iconButton';
import { BiReset } from "react-icons/bi";

const ResetIcon = () => {
    return (
        <CustomIconButton title="Reset Password">
            <BiReset size={'18px'} color="#000000" />
        </CustomIconButton>
    )
}

export const USERS_HEADER = [
    { label: 'Email', align: 'center', id: 'email', width: 200 },
    { label: 'Name', align: 'center', id: 'fullName', width: 180 },
    { label: 'Company', align: 'center', id: 'typeId', width: 100 },
    { label: 'Role', align: 'center', id: 'roleId', width: 100 },
    { label: 'Region', align: 'center', id: 'noSort', width: 130 },
    { label: 'Last Login', align: 'center', id: 'lastLogin', width: 100 },
    { label: 'Active', align: 'center', id: 'noSort', width: 100 },
    { label: 'Reset Password', align: 'center', id: 'forgetPassword', width: 10 },
];

export const JOBS_HEADER = [
    {
        id: 'noSort',
        label: "",
        orderBy: "",
        width: 50
    },
    {
        id: 'jobNumber',
        label: "Job Number",
        width: 120
    },
    {
        id: 'woList',
        label: "WO #",
        orderBy: "workOrderNumber",
        width: 100
    },
    {
        id: 'poList',
        label: "PO #",
        orderBy: "purchaseOrderNumber",
        width: 100
    },
    {
        id: 'contractNumber',
        label: "Contract",
        orderBy: "contractNumber",
        width: 120
    },
    {
        id: 'foremanName',
        label: "Foreman",
        orderBy: "foremanName",
        width: 200
    },
    {
        id: 'jobDate',
        label: "Date",
        orderBy: "jobDate",
        width: 110
    },
    {
        id: 'jobStatus',
        label: "DFR Status",
        orderBy: "jobStatus",
        width: 110
    }
]

export const RESURFACING_HEADER = [
    {
        id: 'noSort',
        label: "",
        orderBy: "",
        width: 50
    },
    {
        id: 'jobNumber',
        label: "Job Number",
        width: 110
    },
    {
        id: 'woList',
        label: "WO #",
        orderBy: "workOrderNumber",
        width: 100
    },
    {
        id: 'poList',
        label: "PO #",
        orderBy: "purchaseOrderNumber",
        width: 100
    },
    {
        id: 'address',
        label: "Address",
        orderBy: "address",
        width: 150
    },
    {
        id: 'contractNumber',
        label: "Contract",
        orderBy: "contractNumber",
        width: 120
    },
    {
        id: 'foremanName',
        label: "Foreman",
        orderBy: "foremanName",
        width: 110
    },
    {
        id: 'jobDate',
        label: "Date",
        orderBy: "jobDate",
        width: 80
    },
    {
        id: 'jobStatus',
        label: "DFR Status",
        orderBy: "jobStatus",
        width: 110
    }
]

export const REPORTS_HEADER = [
    { label: 'Job Number', id: 'jobNumber', width: 200 },
    { label: 'Date', id: 'jobDate', width: 200 },
    { label: 'Contract', id: 'contractNumber', width: 200 },
    { label: 'Foreman', id: 'foremanName', width: 200 },
    { label: 'Address', id: 'address', width: 200 },
    { label: 'WO #', id: 'workOrder', width: 200 },
    { label: 'Pay Item', id: 'payItemName', width: 200 },
    { label: 'Pay Item Description', id: 'noSort', width: 200 },
    { label: 'PO #', id: 'purchaseOrder', width: 200 },
    { label: 'Quantity', id: 'noSort', width: 200 },
    { label: 'Status', id: 'status', width: 200 },
    { label: 'UOM', id: 'noSort', width: 200 },
    { label: 'WBS Description', id: 'noSort', width: 200 },
    { label: 'Foreman Comments', id: 'noSort', width: 200 }
]

export const RESURFACING_REPORTS_HEADER = [
    { label: 'Job Number', id: 'jobNumber', width: 310 },
    { label: 'Date', id: 'jobDate', width: 200 },
    { label: 'Contract', id: 'contractNumber', width: 200 },
    { label: 'Foreman', id: 'foremanName', width: 200 },
    { label: 'WO #', id: 'workOrder', width: 200 },
    { label: 'PO #', id: 'purchaseOrder', width: 200 },
    { label: 'Address', id: 'address', width: 200 },
    { label: 'Status', id: 'status', width: 180 },
    { label: 'Surface Type', id: 'surfaceType', width: 310 },
    { label: 'Material Type', id: 'materialType', width: 310 },
    { label: 'Length', id: 'noSort', width: 120 },
    { label: 'Width', id: 'noSort', width: 200 },
    { label: 'Diameter', id: 'noSort', width: 200 },
    { label: 'Depth', id: 'noSort', width: 200 },
    { label: 'Type', id: 'noSort', width: 200 },
    { label: 'Total', id: 'noSort', width: 200 },
    { label: 'UOM', id: 'noSort', width: 200 }
]

export const TUTORIAL_HEADER = [
    { label: 'Name', id: 'name' },
    { label: 'Last Modified', id: 'modifiedDate', width: 350 },
    { label: 'Download', id: 'noSort', width: 40 },
]
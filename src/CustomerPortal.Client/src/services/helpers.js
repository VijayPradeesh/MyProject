import { Skeleton, CircularProgress, Backdrop } from "@mui/material";

export const validateBodyParameters = (bodyParameter) => {
    const checkObj = Object.values(bodyParameter).every(value => {
        if (value === null || value === undefined || value === '') {
            return false;
        }
        return bodyParameter;
    });
    return checkObj;
}

export const validateAllNull = (obj) => {
    const isNull = (value) => {
        return value === null || value === undefined || value === '';
    };
    return Object.values(obj).every(isNull);
}

export const dateCalculator = (passedDate) => {

    var Dates = passedDate ? new Date(passedDate) : new Date();

    var formattedDate =
        `${Dates.getMonth() + 1 < 10 ? `0${Dates.getMonth() + 1}` : Dates.getMonth() + 1}` +
        '-' +
        `${Dates.getDate() < 10 ? `0${Dates.getDate()}` : Dates.getDate()}` +
        '-' +
        Dates.getFullYear();

    return formattedDate;
};

export const formatTime = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    return strTime;
}

export function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export function capitalizeFirstLowercaseRest(str) {
    return (
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    );
};

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export function shortString(string, length) {
    let shortName = string;
    if (string.length > length) {
        shortName = string.substring(0, length - 3).concat('...')
    }
    return shortName;
}

export function shortenEmail(string, emailLength, addressLength) {
    let shortEmail = string;
    let newEmail = shortEmail.split('@')[0];
    let address = shortEmail.split('@')[1];
    let finalEmail = shortEmail.split('@')[0];
    let finalAddress = shortEmail.split('@')[1];
    if (newEmail.length > emailLength) {
        finalEmail = newEmail.substring(0, emailLength - 3).concat('...');
    }
    if (address.length > addressLength - 3) {
        finalAddress = address.substring(0, addressLength - 3).concat('...');
    }
    shortEmail = finalEmail?.concat('@').concat(finalAddress);
    return shortEmail;
}

export const base64ToBlob = (base64, type) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: type });
}

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function MobileCardSkeleton(props) {
    const { rows, columns, borderRadius } = props;
    const skeletonArray = Array(rows).fill('')
    return (
        <div width='100%' style={{ height: `100%`, overflowY: 'hidden', borderRadius: borderRadius }}>
            {
                skeletonArray.map((item, index) => {
                    return (
                        <>
                            <Skeleton
                                animation="wave"
                                variant="rectangular"
                                width='100%'
                                height='50px'
                                sx={{ margin: '2px 0px' }}
                            />
                        </>
                    )
                })
            }
        </div>
    )
};

export const Loader = (props) => {
    const { open } = props;
    return (
        <div style={{
            height: `100%`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#CCCCCC'
        }}>
            <CircularProgress
                thickness={5}
                sx={{ borderRadius: 50 }}
                value={100} color="primary" size={25} />
        </div>
    )
};

export function areObjectsEqual(obj1, obj2) {
    if (typeof obj1 !== typeof obj2) {
        return false;
    }

    if (typeof obj1 === "object" && obj1 !== null && obj2 !== null) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    return obj1 === obj2;
}
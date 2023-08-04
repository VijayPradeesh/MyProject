import Client from '../services/Client';
import axios from 'axios';
import * as TYPES from './constants';
import config from '../config';

export const getTutorial = (fileName, type) => async () => {
    try {
        const token = sessionStorage.getItem('token'); // Replace with your token
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(`${config.REACT_APP_ENDPOINT_URL}StaticFiles/${fileName}`, { headers });
        if (type == 'video') {
            const videoData = await response.arrayBuffer();
            const videoBlob = new Blob([videoData], { type: 'video/mp4' });
            const url = URL.createObjectURL(videoBlob);
            return url
        }
        if (type == 'document') {
            const pdfData = await response.arrayBuffer();
            const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
            const url = URL.createObjectURL(pdfBlob);
            return url
        }
    } catch (error) {
        console.error('Error fetching video:', error);
    }
};

export const videoLoad = (filepath) => {
    const Url = config.REACT_APP_ENDPOINT_URL + filepath
    return Url
};

export const login = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Auth/login', bodyParameters)
        .then(response => {
            return response;
        });
};


export const registerNewUser = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Auth/register', bodyParameters).then(response => {
            return response;
        });
};

export const changePassword = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Auth/changePassword', bodyParameters).then(response => {
            return response;
        });
};


export const forgotPassword = (bodyParameters) => () => {
    return Client
        .post('customerPortal/User/ForgotPassword', bodyParameters).then(response => {
            return response;
        });
};

export const getAllJobs = (bodyParameters) => () => {
    return Client.post('customerPortal/JobActivity/GetAllJobs', bodyParameters).then(response => {
        return response;
    })
};

export const getJobDetails = (jobId, flag) => () => {
    return Client.get(`customerPortal/JobActivity/GetJobDetails/${jobId}/${flag}`).then(response => {
        return response;
    })
};

export const getResurfacingImages = (jobId) => () => {
    return Client.get(`customerPortal/JobActivity/GetResurfacingImages?Id=${jobId}`).then(response => {
        return response;
    })
};

export const getRejectionStatus = () => () => {
    return Client.get('customerPortal/JobActivity/GetRejectionStatus').then(response => {
        return response;
    })
};

//flag is used to distinguish between resurfacing and daily activity jobs
export const getViewApproval = (jobId, flag) => () => {
    return Client.get(`customerPortal/JobActivity/GetViewApproval?Id=${jobId}&flag=${flag}`).then(response => {
        return response;
    })
};

export const getJobStatus = (jobId, flag) => () => {
    return Client.get(`customerPortal/JobActivity/GetJobStatus/${jobId}/${flag}`).then(response => {
        return response;
    })
};

export const postJobStatus = (commentObj) => () => {
    return Client.post('customerPortal/JobActivity/PostJobStatus', commentObj).then(response => {
        return response;
    })
};

export const getAllUsers = (bodyParameters) => (dispatch) => {
    return Client
        .post('customerPortal/LookUp/GetUsers', bodyParameters)
        .then((payload) => {
            dispatch({
                type: TYPES.USERS,
                payload,
            });
            return payload;
        });
};

export const getAdminDropDownData = () => (dispatch) => {
    return Client
        .get('customerPortal/LookUp/GetDropDownData')
        .then((payload) => {
            dispatch({
                type: TYPES.DROPDOWN,
                payload,
            });
            return payload;
        });
};

export const resetPassword = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Auth/ResetPassword', bodyParameters).then(response => {
            return response;
        });
};

export const editUser = (bodyParameters) => () => {
    return Client
        .post('customerPortal/User/EditUser', bodyParameters).then(response => {
            return response;
        })
};

export const getReports = (bodyParameters) => (dispatch) => {
    return Client
        .post('CustomerPortal/Reports/GenerateReport', bodyParameters)
        .then((payload) => {
            dispatch({
                type: TYPES.REPORTS,
                payload,
            });
            return payload;
        });
};

//contract-region configuration page APIs
export const getOrganizations = (flag) => (dispatch) => {
    return Client
        .get(`customerPortal/Configurations/GetAllOrganisations?flag=${flag}`)
        .then((payload) => {
            dispatch({
                type: TYPES.ORGANIZATIONS,
                payload,
            });
            return payload;
        });
};

export const weatherForecast = (bodyParameters) => () => {
    return Client
        .get('StaticFiles/Asp.net.mp4').then(response => {
            return response;
        })
};

export const getContractsFromId = (organizationId) => () => {
    return Client.get(`customerPortal/Configurations/GetAllContracts/${organizationId}`).then(response => {
        return response;
    })
};

export const getAllRegionsforContract = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Configurations/GetAllRegions', bodyParameters).then(response => {
            return response;
        })
};

export const addNewData = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Configurations/AddNew', bodyParameters).then(response => {
            return response;
        })
};

export const saveContractsMapping = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Configurations/PostContract', bodyParameters).then(response => {
            return response;
        })
};

export const saveRegionsMapping = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Configurations/PostRegion', bodyParameters).then(response => {
            return response;
        })
};

//role-screen configuration page APIs

export const getRolesFromId = (organizationId) => () => {
    return Client.get(`customerPortal/Configurations/GetRoles/${organizationId}`).then(response => {
        return response;
    })
};

export const getAllScreensForContract = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Configurations/GetAllScreens', bodyParameters).then(response => {
            return response;
        })
};

export const saveScreenForRole = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Configurations/PostScreen', bodyParameters).then(response => {
            return response;
        })
};

export const saveRoleForCompany = (bodyParameters) => () => {
    return Client
        .post('customerPortal/Configurations/PostRole', bodyParameters).then(response => {
            return response;
        })
};

export const getProfileData = () => (dispatch) => {
    return Client.get('customerPortal/LookUp/GetUser').then((payload) => {
        dispatch({
            type: TYPES.USER_PROFILE,
            payload,
        });
        return payload;
    });
};

export const saveProfileData = (bodyParameters) => () => {
    return Client
        .post('customerPortal/User/EditProfile', bodyParameters).then(response => {
            return response;
        })
};

export const getFiles = (bodyParameters) => () => {
    return Client.post(`CustomerPortal/Tutorials/GetFiles`, bodyParameters).then(response => {
        return response;
    })
};

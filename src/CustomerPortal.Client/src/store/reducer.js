
import * as TYPES from './constants';

const initialState = {
    login: {},
    users: [],
    dropdownData: {},
    reports: {},
    organizations: [],
    profile: {},
    resurfacingJobs: {}
};

export default function CustomerPortalReducer(state = initialState, action = {}) {
    switch (action.type) {
        case TYPES.USERS:
            if (state.users !== action.payload.data) {
                return {
                    ...state, users: action.payload.data
                };
            } else {
                return state;
            }
        case TYPES.DROPDOWN:
            return {
                ...state, dropdownData: action.payload.data
            };
        case TYPES.RESURFACING:
            if (state.resurfacingJobs !== action.payload.data) {
                return {
                    ...state, resurfacingJobs: action.payload.data
                };
            } else {
                return state;
            }
        case TYPES.REPORTS:
            return {
                ...state, reports: action.payload.data
            };
        case TYPES.ORGANIZATIONS:
            return {
                ...state, organizations: action.payload.data
            };
        case TYPES.USER_PROFILE:
            return {
                ...state, profile: action.payload.data
            };
        default:
            return state;
    }
}
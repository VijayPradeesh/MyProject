let defaultState = {
    nextNotification: -1, // used for notifications keys
    notifications: [] // contains the list of notifications
};

export default function notifyReducers(state = defaultState, action){
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            let key = state.nextNotification + 1; // increment notification key

            return {
                ...state,
                nextNotification: key, // save new notification key in state
                notifications: [{...action.notification, key: key}, ...state.notifications] // add notification with incremented key at the start of the list
            };

        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.key !== action.key) // remove notification from the list for given key
            };

       default: return state;
}
}


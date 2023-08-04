export const addNotification = (notification) => ({
    type: 'ADD_NOTIFICATION',
    notification: {
		key: new Date().getTime() + Math.random(),
		...notification
	}
});

export const removeNotification = () => ({
    type: 'REMOVE_NOTIFICATION',
    key: new Date().getTime() + Math.random()
});
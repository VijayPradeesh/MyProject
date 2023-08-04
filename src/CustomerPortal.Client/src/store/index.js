// @flow
import { combineReducers } from 'redux';
import CustomerPortalReducer from './reducer';
import notifyReducers from './notifyReducer'

export default function createRootReducer(history) {
	return combineReducers({
		customerPortal: CustomerPortalReducer,
		notifier: notifyReducers
	});
}

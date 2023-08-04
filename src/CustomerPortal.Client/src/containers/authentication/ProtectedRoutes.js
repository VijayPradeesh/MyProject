import React from "react";
import { Navigate, Route, useLocation } from "react-router-dom";
import urls from '../../constants/routes.json';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as notifications from '../../store/notifyActions';
import jwtDecode from "jwt-decode";

const ProtectedRoute = (props) => {
    const location = useLocation();
    const authLocation = location.pathname.replace(/[/]/g, '')
    const token = sessionStorage.getItem("token");
    const screensAllowed = JSON.parse(sessionStorage.getItem('screens'))
    const isAllowed = screensAllowed?.find((item) => item.screen.replace(/\s/g, "") === authLocation)
    if (!token) {
        //props.addNotification({ message: 'Please login to continue', type: 'info' });
        return <Navigate to={urls.LOGIN} state={{ from: location }} replace />
    }
    if (!isAllowed?.isAssigned) {
        // console.log("You are not Authenticated")
        // props.addNotification({ message: 'You are not Authenticated', type: 'error' });
        return <Navigate to={urls.LOGIN} state={{ from: location }} replace />
    }

    return props.children
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        { ...notifications },
        dispatch
    );

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProtectedRoute)
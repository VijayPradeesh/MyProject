import React from "react";
import { Route, Routes } from "react-router-dom";
import { withRouter } from "./components/withRouter";
import urls from './constants/routes.json';
import Login from "./containers/authentication/login";
import SignUp from "./containers/authentication/signup";
import ResetPassword from "./containers/authentication/resetPassword";
import NotFound from "./containers/otherPages/pageNotFound.js";
import UserAccess from "./containers/Spire/userAccess";
import JobDashboard from "./containers/Spire/home";
import ForgotPassword from "./containers/authentication/forgotPassword";
import ProtectedRoute from "./containers/authentication/ProtectedRoutes";
import { WithHeader } from "./components/hoc";
import Report from "./containers/Spire/report";
import Tutorial from "./containers/Spire/tutorial";
import ResurfacingReport from "./containers/Spire/resurfacingReport";
import ContractRegionMapping from "./containers/mappingScreens/contractMapping";
import RoleScreenMapping from "./containers/mappingScreens/screenMapping";
import Profile from "./containers/profile";

const AppRouter = (props) => {
    // let _role = localStorage.getItem("role");
    let _role = "all";
    return (
        <Routes>
            {
                // (props.location.pathname=='/CustomerTickets' && _role=="customer") || (props.location.pathname=='/Reviewer' && _role=="reviewer") || (props.location.pathname=='/ServiceExec' && _role=="serviceexec") || props.location.pathname=='/Contact' || props.location.pathname=='/About' || props.location.pathname=='/Chat'?<Navbar/>:null
            }
            {/* <Route exact component={LoginContainer}/>  */}
            <Route exact path={urls.LOGIN} element={<Login />} />
            <Route exact path={urls.SIGNUP} element={<SignUp />} />
            <Route exact path={urls.RESET_PASSWORD} element={<ResetPassword />} />
            <Route exact path={urls.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route exact path={urls.USER_ACCESS} element={
                <ProtectedRoute>
                    <WithHeader screen={<UserAccess />} />
                </ProtectedRoute>
            } />
            <Route exact path={urls.PROFILE} element={
                <ProtectedRoute>
                    <WithHeader screen={<Profile />} />
                </ProtectedRoute>
            } />
            <Route exact path={urls.JOB_DASHBOARD} element={
                <ProtectedRoute>
                    <WithHeader screen={<JobDashboard />} />
                </ProtectedRoute>
            } />
            <Route exact path={urls.REPORTS} element={
                <ProtectedRoute>
                    <WithHeader screen={<Report />} />
                </ProtectedRoute>
            } />
            <Route exact path={urls.RESURFACING_REPORTS} element={
                <ProtectedRoute>
                    <WithHeader screen={<ResurfacingReport />} />
                </ProtectedRoute>
            } />
            <Route exact path={urls.TUTORIAL} element={
                <ProtectedRoute>
                    <WithHeader screen={<Tutorial />} />
                </ProtectedRoute>
            } />
            <Route exact path={urls.CONTRACT_MAPPING} element={
                <ProtectedRoute>
                    <WithHeader screen={<ContractRegionMapping />} />
                </ProtectedRoute>
            } />
            <Route exact path={urls.SCREEN_MAPPING} element={
                <ProtectedRoute>
                    <WithHeader screen={<RoleScreenMapping />} />
                </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default withRouter(AppRouter);

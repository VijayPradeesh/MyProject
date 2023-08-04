import React from "react";
import { Grid } from "@mui/material";
import Header from "../header";

export function WithHeader(props) {
    return (
        <React.Fragment>
            <Header />
            {props.screen && props.screen}
        </React.Fragment>
    )
};

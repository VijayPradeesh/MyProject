import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import thunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createHashHistory } from "history";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import { SnackbarProvider, useSnackbar } from 'notistack';
import createRootReducer from "./store";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import theme from './constants/theme';
import CustomIconButton from './components/iconButton';
import { MdClear } from "react-icons/md";
import './App.css';
const history = createHashHistory();

const rootReducer = createRootReducer(history);

const DismissAction = ({ id }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <React.Fragment>
      <CustomIconButton title="Close" onClick={() => closeSnackbar(id)}>
        <MdClear size={'18px'} color="#ffffff" />
      </CustomIconButton>
    </React.Fragment>
  )
}


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log("[Middleware] Dispatching", action);
      const result = next(action);
      console.log("[Middleware] next state", store.getState());
      return result;
    };
  };
};

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger, thunk))
);


const app = (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        action={key => <DismissAction id={key} />}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration="1000"
      >
        <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.StrictMode>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

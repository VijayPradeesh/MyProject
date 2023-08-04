import React, { Component } from "react";
import AppRouter from './Routes';
import Notifier from './components/notifier';
import { withStyles } from '@mui/styles';
import Image from './assets/loginBgUpdated.png';

const styles = {
  bgImage: {
    /* The image used */
    backgroundImage: `url(${Image})`,
    height: '100vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  centerGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
class App extends Component {
  render() {
    return (
      <div>
          <Notifier />
          <AppRouter />
        </div>
    );
  }
}

export default App;

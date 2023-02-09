// import logo from './logo.svg';
import HomePge from './AllPages/HomePage/HomePge';
import './App.css';

import { SnackbarProvider } from 'notistack';
import Slide from '@material-ui/core/Slide';

function App() {
  return (
    <SnackbarProvider
    anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
    }}
    maxSnack={1}
    TransitionComponent={Slide}
    >
      <div className="App">
        <HomePge></HomePge>
      </div>
    </SnackbarProvider>
  );
}

export default App;

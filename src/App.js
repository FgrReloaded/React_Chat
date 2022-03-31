import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Join from './components/Join';
import Rooms from './components/Rooms';
import CreateRoom from './components/CreateRoom';
import ChatRoom from './components/ChatRoom';
import SecureRoute from './SecureRoute';

function App() {
  return (
    <Router>
      <>
        <Redirect to="/rooms" />
        <Switch>
          <Route exact path="/join">
            <Join />
          </Route>
          <SecureRoute path="/rooms">
            <Rooms />
          </SecureRoute>
          <SecureRoute path="/createroom">
            <CreateRoom />
          </SecureRoute>
          <SecureRoute path="/chatroom/:room">
            <ChatRoom />
          </SecureRoute>
        </Switch>
      </>
    </Router>
  );
}

export default App;
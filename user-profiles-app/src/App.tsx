import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreateDriver from './pages/CreateDriver';
import EditDriver from './pages/EditDriver';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/driver/new" component={CreateDriver} />
        <Route path="/driver/edit/:id" component={EditDriver} />
        <Route path="/profile/:id" component={Profile} />
      </Switch>
    </Router>
  );
};

export default App;
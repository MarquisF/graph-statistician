import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Home from 'Pages/Home';
import Edit from 'Pages/Edit';
import MapList from 'Pages/MapList';

const theHistory = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

export default class PrimaryLayout extends Component {
  render() {
    return (
      <Router history={theHistory}>
        <div>
          <Route path='/' component={Home} exact />
          <Route path='/edit/:graphId' component={Edit} />
          <Route path='/list' component={MapList} />
        </div>
      </Router>
    )
  }
}
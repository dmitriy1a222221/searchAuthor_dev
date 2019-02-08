import React, { Component } from 'react';

import SearchBoard from './component/SearchBoard';

import './style/mainStyle.sass';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchBoard />
      </div>
    );
  }
}

export default App;

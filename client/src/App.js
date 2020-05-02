import React from 'react';

import './App.css';
import Autocomplete from './components/Autocomplete/Autocomplete';

function App() {
  return (
    <div className="wrapper">
      <Autocomplete 
        noSuggestionsText="No suggestions, please try to type something else"
        labelText="Simple autocomplete"/>
    </div>
  );
}

export default App;

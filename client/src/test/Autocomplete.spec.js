import React from 'react';
import renderer from 'react-test-renderer';
import Autocomplete from '../components/Autocomplete/Autocomplete';

test('Autocomplete component', () => {
  const tree = renderer.create(<Autocomplete 
    noSuggestionsText="No suggestions, please try to type something else"
    labelText="Simple autocomplete"/>).toJSON()
  expect(tree).toMatchSnapshot()
})
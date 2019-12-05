import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './client/App.jsx';
import Pins from './client/Pins.jsx';
Enzyme.configure({ adapter: new Adapter() });

test('Scoring', () => {
  var a = shallow(<App />);
  // var p = shallow(<Pins />);
  // p.find('#b5').simulate('click');
  console.log(a.state)
  expect(a.find('#s1').text()).toBe('')
});
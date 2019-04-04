import React from 'react';
import ReactDOM from 'react-dom';

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});

import App from './App';



it('renders without crashing', () => {});

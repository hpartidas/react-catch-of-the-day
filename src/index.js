/**
 * Base Library API Components
 */
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss}  from 'react-router';

/**
 * CSS import
 */
import './css/style.css';


/**
 * Application Components
 */
import StorePicker from './components/StorePicker';
import App from './components/App';
import NotFound from './components/NotFound';

/**
 * Define Router
 */
const Router = () => {
  return (
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={StorePicker}/>
        <Match pattern="/store/:storeId" component={App}/>
        <Miss component={NotFound}/>
      </div>
    </BrowserRouter>
  );
};
render(<Router/>, document.querySelector('#main'));
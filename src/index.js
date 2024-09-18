import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom"
// import { ChakraProvider } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';
import employeeReducer, { loademployee } from './features/employeeSlice';



// Set the favicon based on the environment variable
const favicon = process.env.REACT_APP_NAME==='TAPDESK'? 'favicon.ico'  : process.env.REACT_APP_NAME==='SWIPEDESK' ? 'favicon_swipe.ico' : '';
const link = document.createElement('link');
link.rel = 'icon';
link.href = `${process.env.PUBLIC_URL}/${favicon}`;
document.head.appendChild(link);

// Set the title based on the environment variable
const title = process.env.REACT_APP_NAME==='TAPDESK'? 'TaskAssigner'  : process.env.REACT_APP_NAME==='SWIPEDESK' ? 'SwipeDesk' : '';
document.title = title;

export const store = configureStore({
    reducer: {
        employee: employeeReducer,
    }
});
store.dispatch(loademployee(null));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Provider store={store}>
            <BrowserRouter>
              
                <App />
            </BrowserRouter>

    </Provider>
    </>
);
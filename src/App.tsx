import React from 'react';
import { Router, Outlet, ReactLocation } from "@tanstack/react-location";
import routes from './components/Routes';
// for notification
import { Toaster } from 'react-hot-toast';
// Set up a ReactLocation instance
const location = new ReactLocation();
const App = () => {

   return (
      <>
         <Toaster
            position="top-center"
            reverseOrder={false}
         />
         <Router
            location={location}
            routes={routes}
         >
            <Outlet />
         </Router>
      </>

   )
}

export default App;
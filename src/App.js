import "./App.css";
import React from "react";
import { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";
import Dashboard from '../src/Admin/pages/Dashboard.jsx';
import Login from '../src/Admin/pages/Login.jsx';

import Setting from '../src/pages/setting.jsx';

import Task from '../src/pages/task.jsx';
import TaskTimeline from '../src/pages/task-timeline.jsx';



import ResetPassword  from '../src/Admin/pages/ResetPassword.jsx'
import { Toaster } from "react-hot-toast";


function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  const ProtectedRoute = ({ children }) => {
    const employee = useSelector((state) => state.employee);
    let location = useLocation();

    if (!employee._id) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
  };

  

//const location = useLocation();
  return (
    <> 
    <Toaster position="top-right" reverseOrder={false} />
  
      <Routes>
        <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={ <ProtectedRoute><Setting /></ProtectedRoute>} />
        <Route path="/tasks" element={ <ProtectedRoute><Task /></ProtectedRoute>} />
        <Route path="/task-threads" element={ <ProtectedRoute><TaskTimeline /></ProtectedRoute>} />

        ?
        

        
      <Route path="/" element={<Login/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      </Routes>

   </>
  );
}

export default App;

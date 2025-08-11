import React,{ useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import MoodCheckIn from './pages/MoodCheckIn';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import MoodAnalytics from './pages/MoodAnalytics';
import ReminderSettings from './pages/ReminderSettings';
import ReminderAndSchedule from "./pages/ReminderAndSchedule";
import DailyScheduleMood from './pages/DailyScheduleMood';



import ProtectedRoute from './routes/ProtectedRoute';

function App() {

  const [scheduledBreaks, setScheduledBreaks] = useState([]);
    useEffect(() => {
    // Fetch scheduled breaks on startup if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.REACT_APP_PUBLIC_BACKEND_URL}/schedule`, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then((data) => setScheduledBreaks(data.break_time || []))
        .catch(() => setScheduledBreaks([]));
    }
  }, []);
   // Handler to update breaks after save in ReminderAndSchedule
  const handleBreaksUpdate = (newBreaks) => setScheduledBreaks(newBreaks);


  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Navbar scheduledBreaks={scheduledBreaks}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } 
            /> */}
            <Route
              path="/mood-check"
              element={
                 <ProtectedRoute>
                    <MoodCheckIn />
                 </ProtectedRoute>
              }
           />
            <Route 
              path="/stats" 
              element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <MoodAnalytics />
               </ProtectedRoute>
              }
           />
           <Route
              path="/settings/reminder-schedule"
              element={
                 <ProtectedRoute>
                      <ReminderAndSchedule
                      scheduledBreaks={scheduledBreaks}
                      onBreaksUpdate={handleBreaksUpdate}
                      />
                </ProtectedRoute>
              }
           />
           <Route path="/daily-schedule" element={<DailyScheduleMood />} />

            <Route path="/reset-password" element={<ResetPassword />} />
            {/* <Route path="/settings/reminders" element={<ProtectedRoute><ReminderSettings /></ProtectedRoute>} /> */}

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
        <ToastContainer position="bottom-right" autoClose={4000} />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

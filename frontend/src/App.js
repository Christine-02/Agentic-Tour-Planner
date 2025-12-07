import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import HomePage from './pages/HomePage';
import TripPlannerPage from './pages/TripPlannerPage';
import ItineraryViewPage from './pages/ItineraryViewPage';
import GroupPlanningPage from './pages/GroupPlanningPage';
import SavedTripsPage from './pages/SavedTripsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ChakraProvider } from '@chakra-ui/react';

// Import layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes with layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/planner"
                      element={
                        <ProtectedRoute>
                          <TripPlannerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/itinerary/:tripId"
                      element={
                        <ProtectedRoute>
                          <ItineraryViewPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/group/:tripId"
                      element={
                        <ProtectedRoute>
                          <GroupPlanningPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/saved"
                      element={
                        <ProtectedRoute>
                          <SavedTripsPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;

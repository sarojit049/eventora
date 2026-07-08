import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Pages
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminEventForm from './pages/AdminEventForm';
import AdminBookingsPage from './pages/AdminBookingsPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected User Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/events"
          element={
            <AdminRoute>
              <AdminEventsPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/events/new"
          element={
            <AdminRoute>
              <AdminEventForm />
            </AdminRoute>
          }
        />
        <Route
          path="admin/events/:id/edit"
          element={
            <AdminRoute>
              <AdminEventForm />
            </AdminRoute>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <AdminRoute>
              <AdminBookingsPage />
            </AdminRoute>
          }
        />
        
        {/* Catch all / 404 */}
        <Route path="*" element={<div className="flex justify-center items-center h-[60vh]"><h2>Page Not Found</h2></div>} />
      </Route>
      </Routes>
    </ErrorBoundary>
  );
}

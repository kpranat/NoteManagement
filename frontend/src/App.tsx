import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './pages/Dashboard';
import CreateNote from './pages/CreateNote';
import NoteEditor from './pages/NoteEditor';
import MyNotes from './pages/MyNotes';
import Insights from './pages/Insights';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AdminNotes from './pages/AdminNotes';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        
        {/* Protected App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes/create" element={<CreateNote />} />
          <Route path="/notes/new" element={<NoteEditor />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
          <Route path="/notes" element={<MyNotes />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/notes" element={<AdminNotes />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import Login from './Login';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Skills from './Skills';
import Experiences from './Experiences';
import Educations from './Educations';
import ProjectsList from './ProjectsList';
import ProjectForm from './ProjectForm';
import Messages from './Messages';
import MessageDetail from './MessageDetail';
import Settings from './Settings';

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="skills" element={<Skills />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="educations" element={<Educations />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/create" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:id" element={<MessageDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

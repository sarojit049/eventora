import { useAuth } from '../context/AuthContext';
import { Calendar, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-display font-bold text-navy-900 mb-8">My Profile</h1>

      <div className="card p-6 md:p-8" id="profile-card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-navy-100">
          <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center text-2xl font-bold font-display">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-navy-900">{user?.name}</h2>
            <span className={`badge ${user?.role === 'admin' ? 'badge-accent' : 'badge-primary'} capitalize mt-1`}>
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-navy-500" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Email</p>
              <p className="text-sm font-medium text-navy-800">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-navy-500" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Role</p>
              <p className="text-sm font-medium text-navy-800 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-navy-500" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Member Since</p>
              <p className="text-sm font-medium text-navy-800">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

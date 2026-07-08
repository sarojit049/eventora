import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api/services';
import { TableSkeleton } from '../components/ui/Skeletons';
import { ErrorState } from '../components/ui/States';
import { BarChart3, Calendar, Users, Ticket, IndianRupee, Plus, TrendingUp, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboardStats(),
    select: (res) => res.data.data,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  if (isError) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><ErrorState message={error?.response?.data?.message} onRetry={refetch} /></div>;
  }

  const { stats, recentBookings } = data;
  const statCards = [
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Ticket, color: 'bg-purple-50 text-purple-600' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: BarChart3, color: 'bg-teal-50 text-teal-600' },
    { label: 'Cancelled', value: stats.cancelledBookings, icon: XCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy-900">Admin Dashboard</h1>
          <p className="text-navy-500 mt-1">Platform overview and management</p>
        </div>
        <Link to="/admin/events/new" className="btn-primary" id="admin-create-event">
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8" id="admin-stats">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-navy-900">{value}</p>
            <p className="text-xs text-navy-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue */}
      <div className="card p-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <IndianRupee className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-navy-500">Total Revenue (Confirmed)</p>
            <p className="text-2xl font-display font-bold text-navy-900">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/admin/events" className="btn-secondary">
          <Calendar className="w-4 h-4" /> Manage Events
        </Link>
        <Link to="/admin/bookings" className="btn-secondary">
          <Ticket className="w-4 h-4" /> All Bookings
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="card overflow-hidden" id="recent-bookings">
        <div className="px-5 py-4 border-b border-navy-100">
          <h2 className="font-display font-semibold text-navy-900">Recent Bookings</h2>
        </div>
        {recentBookings?.length === 0 ? (
          <div className="p-8 text-center text-navy-500 text-sm">No bookings yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 text-navy-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-medium">Reference</th>
                  <th className="px-5 py-3 text-left font-medium">User</th>
                  <th className="px-5 py-3 text-left font-medium">Event</th>
                  <th className="px-5 py-3 text-left font-medium">Qty</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {recentBookings?.map((b) => (
                  <tr key={b._id} className="hover:bg-navy-50/50">
                    <td className="px-5 py-3 font-mono text-xs text-navy-600">{b.bookingReference}</td>
                    <td className="px-5 py-3 text-navy-800">{b.user?.name || 'N/A'}</td>
                    <td className="px-5 py-3 text-navy-800 max-w-[200px] truncate">{b.event?.title || 'N/A'}</td>
                    <td className="px-5 py-3 text-navy-600">{b.quantity}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-success' : 'badge-danger'}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-navy-900">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../api/services';
import { TableSkeleton } from '../components/ui/Skeletons';
import { ErrorState, EmptyState } from '../components/ui/States';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Calendar, Eye } from 'lucide-react';

export default function AdminEventsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => eventsAPI.getAll({ limit: 50, status: '' }),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => eventsAPI.delete(id),
    onSuccess: () => {
      toast.success('Event deleted');
      queryClient.invalidateQueries(['admin-events']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy-900">Manage Events</h1>
          <p className="text-navy-500 mt-1">{data?.pagination?.totalItems || 0} events total</p>
        </div>
        <Link to="/admin/events/new" className="btn-primary" id="admin-new-event">
          <Plus className="w-4 h-4" /> New Event
        </Link>
      </div>

      {isLoading ? (
        <div className="card p-6"><TableSkeleton rows={8} cols={6} /></div>
      ) : isError ? (
        <ErrorState message={error?.response?.data?.message} onRetry={refetch} />
      ) : !data?.events?.length ? (
        <EmptyState icon={Calendar} title="No events" message="Create your first event to get started" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 text-navy-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-medium">Event</th>
                  <th className="px-5 py-3 text-left font-medium">Category</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">City</th>
                  <th className="px-5 py-3 text-left font-medium">Price</th>
                  <th className="px-5 py-3 text-left font-medium">Seats</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {data.events.map((event) => (
                  <tr key={event._id} className="hover:bg-navy-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=40'} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=40'; }} />
                        <span className="font-medium text-navy-900 max-w-[200px] truncate">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize text-navy-600">{event.category}</td>
                    <td className="px-5 py-3 text-navy-600">{new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-5 py-3 text-navy-600">{event.city}</td>
                    <td className="px-5 py-3 text-navy-900 font-medium">₹{event.price}</td>
                    <td className="px-5 py-3 text-navy-600">{event.availableSeats}/{event.capacity}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${event.status === 'published' ? 'badge-success' : event.status === 'draft' ? 'badge-primary' : 'badge-danger'} capitalize`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/events/${event._id}`} className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/events/${event._id}/edit`} className="p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(event._id, event.title)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { bookingsAPI } from '../api/services';
import { TableSkeleton } from '../components/ui/Skeletons';
import { ErrorState, EmptyState } from '../components/ui/States';
import { Ticket } from 'lucide-react';

export default function AdminBookingsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => bookingsAPI.getAll({ limit: 100 }), // In a real app, use pagination here
    select: (res) => res.data.data,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy-900">All Bookings</h1>
        <p className="text-navy-500 mt-1">{data?.pagination?.totalItems || 0} bookings total</p>
      </div>

      {isLoading ? (
        <div className="card p-6"><TableSkeleton rows={10} cols={5} /></div>
      ) : isError ? (
        <ErrorState message={error?.response?.data?.message} onRetry={refetch} />
      ) : !data?.bookings?.length ? (
        <EmptyState icon={Ticket} title="No bookings" message="No one has booked any events yet" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 text-navy-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-medium">Reference</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">User</th>
                  <th className="px-5 py-3 text-left font-medium">Event</th>
                  <th className="px-5 py-3 text-left font-medium">Qty</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {data.bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-navy-50/50">
                    <td className="px-5 py-3 font-mono text-xs text-navy-600">{b.bookingReference}</td>
                    <td className="px-5 py-3 text-navy-600">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-5 py-3">
                      <div className="text-navy-900 font-medium">{b.user?.name || 'Deleted User'}</div>
                      <div className="text-xs text-navy-500">{b.user?.email}</div>
                    </td>
                    <td className="px-5 py-3 text-navy-900 max-w-[200px] truncate" title={b.event?.title}>{b.event?.title || 'Deleted Event'}</td>
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
        </div>
      )}
    </div>
  );
}

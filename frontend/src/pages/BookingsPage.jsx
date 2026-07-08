import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsAPI } from '../api/services';
import { TableSkeleton } from '../components/ui/Skeletons';
import { EmptyState, ErrorState } from '../components/ui/States';
import toast from 'react-hot-toast';
import { Ticket, Calendar, MapPin, IndianRupee, Hash, XCircle } from 'lucide-react';

export default function BookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsAPI.getMyBookings(),
    select: (res) => res.data.data.bookings,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => bookingsAPI.cancel(id),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries(['my-bookings']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    },
  });

  const handleCancel = (id, ref) => {
    if (window.confirm(`Cancel booking ${ref}? This action cannot be undone.`)) {
      cancelMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy-900">My Bookings</h1>
        <p className="text-navy-500 mt-1">Track and manage your event bookings</p>
      </div>

      {isLoading ? (
        <div className="card p-6"><TableSkeleton rows={4} cols={5} /></div>
      ) : isError ? (
        <ErrorState message={error?.response?.data?.message || 'Failed to load bookings'} onRetry={refetch} />
      ) : !bookings?.length ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          message="Your bookings will appear here once you book an event"
          action={<a href="/events" className="btn-primary btn-sm">Browse Events</a>}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const event = booking.event;
            const isConfirmed = booking.bookingStatus === 'confirmed';
            const eventDate = event?.startDate ? new Date(event.startDate) : null;
            const isPast = eventDate && eventDate < new Date();

            return (
              <div key={booking._id} className="card p-4 sm:p-5" id={`booking-${booking._id}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Event image */}
                  {event?.imageUrl && (
                    <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={event.imageUrl} alt={event?.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=60'; }} />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-semibold text-navy-900 text-base">{event?.title || 'Event Deleted'}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-navy-500">
                          <span className="flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" />
                            {booking.bookingReference}
                          </span>
                          {eventDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                          {event?.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.venue}, {event.city}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`badge flex-shrink-0 ${isConfirmed ? 'badge-success' : 'badge-danger'}`}>
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-navy-50 gap-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-navy-500">
                          <Ticket className="w-3.5 h-3.5 inline mr-1" />
                          {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                        </span>
                        <span className="font-semibold text-navy-900 flex items-center">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {booking.totalAmount?.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {isConfirmed && !isPast && (
                        <button
                          onClick={() => handleCancel(booking._id, booking.bookingReference)}
                          disabled={cancelMutation.isPending}
                          className="btn-danger"
                          id={`cancel-booking-${booking._id}`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

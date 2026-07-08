import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI, bookingsAPI, paymentsAPI } from '../api/services';
import { useRazorpay } from 'react-razorpay';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/ui/Skeletons';
import { ErrorState } from '../components/ui/States';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Clock, User, IndianRupee, Users, Tag, ArrowLeft, Minus, Plus, Ticket, CheckCircle } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [booked, setBooked] = useState(false);

  const { data: event, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsAPI.getById(id),
    select: (res) => res.data.data.event,
  });

  const { Razorpay } = useRazorpay();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const bookMutation = useMutation({
    mutationFn: (data) => bookingsAPI.create(data),
    onSuccess: () => {
      setBooked(true);
      toast.success('Booking confirmed! 🎉');
      queryClient.invalidateQueries(['event', id]);
      queryClient.invalidateQueries(['events']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Booking failed');
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (data) => paymentsAPI.verify(data),
    onSuccess: () => {
      setBooked(true);
      toast.success('Payment successful! Booking confirmed! 🎉');
      queryClient.invalidateQueries(['event', id]);
      queryClient.invalidateQueries(['events']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Payment verification failed');
    },
    onSettled: () => {
      setIsProcessingPayment(false);
    }
  });

  const handleBook = async () => {
    if (isProcessingPayment || bookMutation.isPending || verifyPaymentMutation.isPending) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    if (event.price === 0) {
      // Free Event direct booking
      bookMutation.mutate({ eventId: id, quantity });
      return;
    }

    // Paid Event Razorpay flow
    setIsProcessingPayment(true);
    try {
      const orderRes = await paymentsAPI.createOrder({ eventId: id, quantity });
      const { orderId, amount, currency, bookingId } = orderRes.data.data;

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error('Payment configuration is missing (VITE_RAZORPAY_KEY_ID)');
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Eventora',
        description: `Booking for ${event.title}`,
        order_id: orderId,
        handler: function (response) {
          verifyPaymentMutation.mutate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId
          });
        },
        prefill: {
          name: '', // Ideally from auth context
          email: '', 
        },
        theme: {
          color: '#0ea5e9', // primary-500
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setIsProcessingPayment(false);
        toast.error(response.error.description || 'Payment failed');
      });

      rzp.open();

    } catch (err) {
      setIsProcessingPayment(false);
      toast.error(err.response?.data?.message || 'Failed to initialize payment');
    }
  };

  if (isLoading || !event) {
    return <div className="max-w-5xl mx-auto px-4 py-8"><DetailSkeleton /></div>;
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ErrorState message={error?.response?.status === 404 ? 'Event not found' : 'Failed to load event'} onRetry={refetch} />
      </div>
    );
  }

  const isPast = new Date(event.startDate) < new Date();
  const isSoldOut = event.availableSeats === 0;
  const canBook = !isPast && !isSoldOut && event.status === 'published' && !booked;
  const maxQty = Math.min(10, event.availableSeats);

  const dateStr = new Date(event.startDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const endDateStr = event.endDate ? new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/events" className="btn-ghost btn-sm mb-6 inline-flex" id="back-to-events">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="rounded-xl overflow-hidden aspect-[16/9]">
            <img
              src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80';
              }}
            />
          </div>

          {/* Title & Meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-primary capitalize">{event.category}</span>
              {event.featured && <span className="badge-accent">⭐ Featured</span>}
              {isPast && <span className="badge-danger">Past Event</span>}
              {isSoldOut && !isPast && <span className="badge bg-red-100 text-red-700">Sold Out</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-4">{event.title}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 text-navy-600">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-900">{dateStr}</p>
                  {endDateStr && <p className="text-xs text-navy-500">to {endDateStr}</p>}
                </div>
              </div>
              {event.startTime && (
                <div className="flex items-center gap-3 text-navy-600">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{event.startTime}</p>
                    <p className="text-xs text-navy-500">Start Time</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-navy-600">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-900">{event.venue}</p>
                  <p className="text-xs text-navy-500">{event.city}{event.address ? `, ${event.address}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-navy-600">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-900">{event.organizer}</p>
                  <p className="text-xs text-navy-500">Organizer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-display font-semibold text-navy-900 mb-3">About This Event</h2>
            <div className="prose prose-navy text-navy-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-navy-50 text-navy-600 rounded-full text-xs">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-5" id="booking-card">
            {/* Price */}
            <div className="text-center pb-4 border-b border-navy-100">
              <div className="flex items-center justify-center gap-1 text-3xl font-display font-bold text-navy-900">
                <IndianRupee className="w-7 h-7" />
                {event.price === 0 ? 'Free' : event.price.toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-navy-500 mt-1">per ticket</p>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy-600">Available Seats</span>
              <span className={`font-semibold ${event.availableSeats <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                <Users className="w-4 h-4 inline mr-1" />
                {event.availableSeats} / {event.capacity}
              </span>
            </div>

            {booked ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center animate-scale-in" id="booking-success">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-emerald-800">Booking Confirmed!</p>
                <p className="text-sm text-emerald-600 mt-1">Check My Bookings for details</p>
                <Link to="/bookings" className="btn-primary btn-sm mt-3 w-full justify-center">
                  View My Bookings
                </Link>
              </div>
            ) : canBook ? (
              <>
                {/* Quantity */}
                <div>
                  <label className="label">Tickets</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-navy-200 flex items-center justify-center hover:bg-navy-50 transition-colors"
                      disabled={quantity <= 1}
                      id="qty-minus"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold text-navy-900 w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-navy-200 flex items-center justify-center hover:bg-navy-50 transition-colors"
                      disabled={quantity >= maxQty}
                      id="qty-plus"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-3 border-t border-navy-100">
                  <span className="text-sm text-navy-600">Total</span>
                  <div className="flex items-center gap-1 text-xl font-bold text-navy-900">
                    <IndianRupee className="w-5 h-5" />
                    {(event.price * quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBook}
                  disabled={bookMutation.isPending || verifyPaymentMutation.isPending || isProcessingPayment}
                  className="btn-primary w-full btn-lg justify-center"
                  id="book-now-btn"
                >
                  {bookMutation.isPending || verifyPaymentMutation.isPending || isProcessingPayment ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      {event.price === 0 ? 'Book Free' : `Pay ₹${(event.price * quantity).toLocaleString('en-IN')} & Book`}
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm font-medium text-navy-500">
                  {isPast ? 'This event has already passed' : isSoldOut ? 'All tickets are sold out' : 'Booking unavailable'}
                </p>
              </div>
            )}

            {!isAuthenticated && canBook && (
              <p className="text-xs text-navy-400 text-center">
                You'll need to <Link to="/login" className="text-primary-600 hover:underline">sign in</Link> to book
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

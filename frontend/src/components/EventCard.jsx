import { Link } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee, Users } from 'lucide-react';

const CATEGORY_COLORS = {
  technology: 'bg-blue-50 text-blue-700',
  music: 'bg-purple-50 text-purple-700',
  business: 'bg-amber-50 text-amber-700',
  workshop: 'bg-teal-50 text-teal-700',
  sports: 'bg-green-50 text-green-700',
  community: 'bg-pink-50 text-pink-700',
  arts: 'bg-indigo-50 text-indigo-700',
  food: 'bg-orange-50 text-orange-700',
  health: 'bg-emerald-50 text-emerald-700',
  education: 'bg-cyan-50 text-cyan-700',
};

export default function EventCard({ event }) {
  const dateStr = new Date(event.startDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isSoldOut = event.availableSeats === 0;
  const isLowSeats = event.availableSeats > 0 && event.availableSeats <= 10;
  const categoryColor = CATEGORY_COLORS[event.category] || 'bg-navy-50 text-navy-700';

  return (
    <Link to={`/events/${event._id}`} className="card card-hover group block" id={`event-card-${event._id}`}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=60'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=60';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`badge ${categoryColor} capitalize`}>{event.category}</span>
        </div>
        {isSoldOut && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-red-500 text-white">Sold Out</span>
          </div>
        )}
        {isLowSeats && !isSoldOut && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-amber-500 text-white">{event.availableSeats} left</span>
          </div>
        )}
        {event.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="badge bg-accent-500 text-white">⭐ Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-navy-900 text-base leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-navy-500 text-sm">
            <Calendar className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span>{dateStr}{event.startTime ? ` · ${event.startTime}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-navy-500 text-sm">
            <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-navy-50">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-navy-700" />
            <span className="font-semibold text-navy-900">
              {event.price === 0 ? 'Free' : event.price.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-navy-400">
            <Users className="w-3.5 h-3.5" />
            <span>{event.availableSeats} seats</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

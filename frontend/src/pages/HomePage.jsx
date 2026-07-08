import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '../api/services';
import EventCard from '../components/EventCard';
import { EventGridSkeleton } from '../components/ui/Skeletons';
import { Search, ArrowRight, Sparkles, Ticket, Shield, Zap, Monitor, Music, Briefcase, Wrench, Trophy, Users, Palette, UtensilsCrossed, Heart, GraduationCap } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { key: 'technology', label: 'Technology', icon: Monitor, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { key: 'music', label: 'Music', icon: Music, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { key: 'business', label: 'Business', icon: Briefcase, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
  { key: 'workshop', label: 'Workshops', icon: Wrench, color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
  { key: 'sports', label: 'Sports', icon: Trophy, color: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { key: 'community', label: 'Community', icon: Users, color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
  { key: 'arts', label: 'Arts', icon: Palette, color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
  { key: 'food', label: 'Food', icon: UtensilsCrossed, color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  { key: 'health', label: 'Health', icon: Heart, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
  { key: 'education', label: 'Education', icon: GraduationCap, color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: () => eventsAPI.getAll({ featured: 'true', limit: 3 }),
    select: (res) => res.data.data.events,
  });

  const { data: upcomingData, isLoading: upcomingLoading } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => eventsAPI.getAll({ sort: 'date', limit: 6 }),
    select: (res) => res.data.data.events,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-primary-200 mb-6">
              <Sparkles className="w-4 h-4" />
              Your next great experience starts here
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
              Discover Events
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-400">
                That Inspire You
              </span>
            </h1>
            <p className="text-lg md:text-xl text-navy-300 mb-8 max-w-xl leading-relaxed">
              Explore tech conferences, music festivals, workshops, and more. Book your tickets in seconds and create memories that last.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg" id="hero-search-form">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                <input
                  type="text"
                  placeholder="Search events, venues, cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl text-navy-900 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-lg"
                  id="hero-search-input"
                />
              </div>
              <button type="submit" className="btn-accent btn-lg shadow-lg" id="hero-search-btn">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="categories-section">
        <div className="text-center mb-10">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle mx-auto">Find events that match your interests</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map(({ key, label, icon: Icon, color }) => (
            <Link
              key={key}
              to={`/events?category=${key}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 ${color}`}
              id={`category-${key}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-white py-16" id="featured-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Events</h2>
              <p className="section-subtitle">Hand-picked experiences you won't want to miss</p>
            </div>
            <Link to="/events?featured=true" className="btn-ghost hidden sm:inline-flex" id="view-all-featured">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {featuredLoading ? (
            <EventGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData?.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="upcoming-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Don't miss out on these experiences</p>
          </div>
          <Link to="/events?sort=date" className="btn-ghost hidden sm:inline-flex" id="view-all-upcoming">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {upcomingLoading ? (
          <EventGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingData?.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="bg-navy-950 text-white py-16" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold">How It Works</h2>
            <p className="text-navy-400 mt-2">Three simple steps to your next experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Discover', desc: 'Browse hundreds of events across categories and cities. Use filters to find exactly what you want.' },
              { icon: Ticket, title: 'Book', desc: 'Select your tickets, confirm your booking, and receive an instant confirmation with your unique reference.' },
              { icon: Zap, title: 'Experience', desc: 'Show up and enjoy! Track all your bookings and manage them from your personal dashboard.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary-400" />
                </div>
                <div className="text-xs font-bold text-primary-400 mb-2">STEP {i + 1}</div>
                <h3 className="text-lg font-display font-semibold mb-2">{title}</h3>
                <p className="text-sm text-navy-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="cta-section">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Ready to Explore?</h2>
          <p className="text-primary-100 mb-6 max-w-lg mx-auto">
            Join thousands of event enthusiasts. Discover, book, and experience the best events in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/events" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg" id="cta-browse">
              Browse Events
            </Link>
            <Link to="/register" className="btn bg-primary-800/50 text-white hover:bg-primary-800 btn-lg border border-primary-400/30" id="cta-register">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

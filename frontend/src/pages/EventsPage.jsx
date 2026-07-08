import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '../api/services';
import EventCard from '../components/EventCard';
import { EventGridSkeleton } from '../components/ui/Skeletons';
import { EmptyState, ErrorState } from '../components/ui/States';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, CalendarX } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'technology', label: 'Technology' },
  { value: 'music', label: 'Music' },
  { value: 'business', label: 'Business' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'sports', label: 'Sports' },
  { value: 'community', label: 'Community' },
  { value: 'arts', label: 'Arts' },
  { value: 'food', label: 'Food' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
];

const SORT_OPTIONS = [
  { value: '-date', label: 'Newest First' },
  { value: 'date', label: 'Soonest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'title', label: 'Alphabetical' },
];

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const params = {
    page: searchParams.get('page') || 1,
    limit: 9,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-date',
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsAPI.getAll(params),
    select: (res) => res.data.data,
    keepPreviousData: true,
  });

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => eventsAPI.getCities(),
    select: (res) => res.data.data.cities,
    staleTime: 10 * 60 * 1000,
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchInput.trim()) {
        newParams.set('search', searchInput.trim());
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1');
      setSearchParams(newParams, { replace: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateParam = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const goToPage = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = params.search || (params.category && params.category !== 'all') || params.city || params.minPrice || params.maxPrice;

  const events = data?.events || [];
  const pagination = data?.pagination || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy-900">Explore Events</h1>
        <p className="text-navy-500 mt-1">
          {pagination.totalItems !== undefined
            ? `${pagination.totalItems} event${pagination.totalItems !== 1 ? 's' : ''} found`
            : 'Discover your next experience'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input pl-11"
            id="events-search"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary ${showFilters ? 'bg-navy-50 border-navy-300' : ''}`}
          id="toggle-filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
        </button>
        <select
          value={params.sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="input w-auto min-w-[160px]"
          id="sort-select"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-4 mb-6 animate-slide-down" id="filter-panel">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                value={params.category}
                onChange={(e) => updateParam('category', e.target.value)}
                className="input"
                id="filter-category"
              >
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <select
                value={params.city}
                onChange={(e) => updateParam('city', e.target.value)}
                className="input"
                id="filter-city"
              >
                <option value="">All Cities</option>
                {citiesData?.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Min Price (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={params.minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="input"
                min="0"
                id="filter-min-price"
              />
            </div>
            <div>
              <label className="label">Max Price (₹)</label>
              <input
                type="number"
                placeholder="Any"
                value={params.maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="input"
                min="0"
                id="filter-max-price"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-navy-100 flex justify-end">
              <button onClick={clearFilters} className="btn-ghost btn-sm text-red-500 hover:text-red-600 hover:bg-red-50" id="clear-filters">
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <EventGridSkeleton count={9} />
      ) : isError ? (
        <ErrorState message={error?.response?.data?.message || 'Failed to load events'} onRetry={refetch} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No events found"
          message={hasActiveFilters ? 'Try adjusting your filters or search term' : 'No events are currently available. Check back soon!'}
          action={hasActiveFilters && (
            <button onClick={clearFilters} className="btn-primary btn-sm" id="clear-filters-empty">
              Clear Filters
            </button>
          )}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10" id="pagination">
              <button
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="btn-secondary btn-sm"
                id="prev-page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const current = pagination.currentPage;
                  return page === 1 || page === pagination.totalPages || Math.abs(page - current) <= 1;
                })
                .map((page, idx, arr) => (
                  <span key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-1 text-navy-400">…</span>
                    )}
                    <button
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-primary-600 text-white'
                          : 'text-navy-600 hover:bg-navy-100'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="btn-secondary btn-sm"
                id="next-page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

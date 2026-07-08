import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI } from '../api/services';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'technology', 'music', 'business', 'workshop',
  'sports', 'community', 'arts', 'food', 'health', 'education'
];

export default function AdminEventForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technology',
    startDate: '',
    endDate: '',
    startTime: '',
    venue: '',
    city: '',
    address: '',
    price: 0,
    capacity: 100,
    organizer: '',
    imageUrl: '',
    status: 'draft',
    featured: false,
    tags: ''
  });

  // Fetch event details if editing
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsAPI.getById(id),
    enabled: isEditing,
    select: (res) => res.data.data.event,
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'technology',
        startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
        startTime: event.startTime || '',
        venue: event.venue || '',
        city: event.city || '',
        address: event.address || '',
        price: event.price || 0,
        capacity: event.capacity || 100,
        organizer: event.organizer || '',
        imageUrl: event.imageUrl || '',
        status: event.status || 'draft',
        featured: event.featured || false,
        tags: event.tags ? event.tags.join(', ') : ''
      });
    }
  }, [event]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? eventsAPI.update(id, data) : eventsAPI.create(data),
    onSuccess: () => {
      toast.success(`Event successfully ${isEditing ? 'updated' : 'created'}!`);
      queryClient.invalidateQueries(['admin-events']);
      navigate('/admin/events');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...form };
    submitData.tags = submitData.tags.split(',').map(t => t.trim()).filter(Boolean);
    submitData.price = Number(submitData.price);
    submitData.capacity = Number(submitData.capacity);
    mutation.mutate(submitData);
  };

  if (isEditing && isLoadingEvent) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/events" className="btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-navy-900">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Title *</label>
              <input required name="title" value={form.title} onChange={handleChange} className="input" placeholder="Event Title" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description *</label>
              <textarea required name="description" value={form.description} onChange={handleChange} className="input min-h-[100px]" placeholder="Detailed description..."></textarea>
            </div>
            <div>
              <label className="label">Category *</label>
              <select required name="category" value={form.category} onChange={handleChange} className="input capitalize">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="input" placeholder="e.g. startup, networking" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Date & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Start Date *</label>
              <input required type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Venue Name *</label>
              <input required name="venue" value={form.venue} onChange={handleChange} className="input" placeholder="Convention Center" />
            </div>
            <div>
              <label className="label">City *</label>
              <input required name="city" value={form.city} onChange={handleChange} className="input" placeholder="Mumbai" />
            </div>
            <div>
              <label className="label">Full Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="input" placeholder="123 Main St" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Ticketing & Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹) *</label>
              <input required type="number" min="0" name="price" value={form.price} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Total Capacity *</label>
              <input required type="number" min="1" name="capacity" value={form.capacity} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Organizer Name *</label>
              <input required name="organizer" value={form.organizer} onChange={handleChange} className="input" placeholder="Event Co." />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
              <label htmlFor="featured" className="text-sm font-medium text-navy-700">Feature this event on homepage</label>
            </div>
            <div className="mt-4">
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/admin/events" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

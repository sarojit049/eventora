import { Link } from 'react-router-dom';
import { Calendar, Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-white">
                Evento<span className="text-primary-400">ra</span>
              </span>
            </Link>
            <p className="text-sm text-navy-400 leading-relaxed">
              Discover. Book. Experience. Your gateway to unforgettable events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li><Link to="/events" className="text-sm hover:text-white transition-colors">All Events</Link></li>
              <li><Link to="/events?category=technology" className="text-sm hover:text-white transition-colors">Technology</Link></li>
              <li><Link to="/events?category=music" className="text-sm hover:text-white transition-colors">Music</Link></li>
              <li><Link to="/events?category=business" className="text-sm hover:text-white transition-colors">Business</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-sm hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/bookings" className="text-sm hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /> hello@eventora.com</li>
              <li className="flex items-center gap-2 text-sm"><Github className="w-4 h-4" /> GitHub</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500">© {new Date().getFullYear()} Eventora. All rights reserved.</p>
          <p className="text-xs text-navy-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
}

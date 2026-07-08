import { SearchX, CalendarX, AlertTriangle, RefreshCw } from 'lucide-react';

export function EmptyState({ icon: Icon = SearchX, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in" id="empty-state">
      <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-navy-400" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800 mb-1">{title}</h3>
      <p className="text-sm text-navy-500 max-w-sm mb-4">{message}</p>
      {action && action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in" id="error-state">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800 mb-1">Oops!</h3>
      <p className="text-sm text-navy-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary btn-sm" id="retry-btn">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Calendar } from 'lucide-react';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const result = await register(form.name, form.email, form.password, form.confirmPassword);
    if (result.success) {
      toast.success('Account created! Welcome to Eventora 🎉');
      navigate('/events');
    } else {
      toast.error(result.message, { id: 'register-error' });
      if (result.errors) {
        const fieldErrors = {};
        result.errors.forEach((e) => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      }
    }
  };

  const renderField = (id, label, Icon, type, placeholder, field) => (
    <div key={id}>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          id={id}
          placeholder={placeholder}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className={`input pl-10 ${type === 'password' ? 'pr-10' : ''} ${errors[field] ? 'border-red-400' : ''}`}
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-navy-900">Evento<span className="text-primary-600">ra</span></span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-navy-900">Create your account</h1>
          <p className="text-navy-500 mt-1 text-sm">Join Eventora and start exploring events</p>
        </div>

        <div className="card p-6 md:p-8" id="register-form-card">
          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            {renderField("register-name", "Full Name", User, "text", "Your name", "name")}
            {renderField("register-email", "Email", Mail, "email", "you@example.com", "email")}
            {renderField("register-password", "Password", Lock, "password", "Min 6 characters", "password")}
            {renderField("register-confirm", "Confirm Password", Lock, "password", "Repeat password", "confirmPassword")}

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg justify-center mt-2" id="register-submit">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-navy-100 text-center text-sm text-navy-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline" id="go-to-login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

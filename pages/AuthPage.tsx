import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { HeaderIcon, ArrowLeftIcon } from '../components/icons';

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
        if (!formData.email || !formData.password) {
            throw new Error('Please fill in all fields.');
        }
        const result = await login(formData.email, formData.password);
        if (result.success) {
            onAuthSuccess();
        } else {
            throw new Error(result.message);
        }
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
                <HeaderIcon />
                <h1 className="text-2xl font-bold text-slate-200">Caption Generator AI</h1>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700/80">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-200 text-center">Welcome Back!</h2>
                    <p className="text-slate-400 text-center mt-1">Log in to continue generating captions.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100" required/>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-600 text-sm text-center">{message}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 disabled:bg-slate-600 transition-colors">
                        {loading ? 'Processing...' : 'Log In'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Don't have an account? Please contact the administrator to get access.
                </p>
            </div>

            <button onClick={onBack} className="mt-6 flex items-center justify-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors font-medium group w-full">
                <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
            </button>
        </div>
         <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default AuthPage;
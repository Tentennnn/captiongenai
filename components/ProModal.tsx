import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

interface ProModalProps {
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ onClose }) => {
    const [licenseKey, setLicenseKey] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const { activatePro } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!licenseKey) {
            setMessage({ type: 'error', text: 'Please enter a license key.' });
            return;
        }
        const result = await activatePro(licenseKey);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-slate-200 text-center mb-2">Activate Pro Plan</h2>
                <p className="text-center text-slate-400 mb-6">Enter your license key to unlock more daily generations.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="licenseKey" className="sr-only">License Key</label>
                        <input
                            type="text"
                            id="licenseKey"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            placeholder="PRO-XXXX-XXXX-XXXX"
                            className="w-full text-center px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100"
                        />
                    </div>
                    {message && (
                        <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        Activate
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full text-center text-slate-400 font-medium py-2 hover:text-slate-200"
                    >
                        Cancel
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
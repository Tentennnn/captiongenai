import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface License {
    id: number;
    created_at: string;
    key: string;
    expires_at: string;
    status: 'active' | 'revoked' | 'used';
}

interface ManagedUser {
    id: string;
    username: string;
    plan: 'free' | 'pro';
    generations_today: number;
    pro_expires_at: string | null;
}

interface ActivityLog {
    id: number;
    created_at: string;
    username: string;
    activity_type: string;
    details: string | null;
}

type AdminTab = 'users' | 'licenses' | 'activity';

const AdminPage = ({ onSwitchToPersonal }: { onSwitchToPersonal: () => void }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    const [licenses, setLicenses] = useState<License[]>([]);
    const [duration, setDuration] = useState<number>(30);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [isLoadingLicenses, setIsLoadingLicenses] = useState(true);
    const [licensesError, setLicensesError] = useState<string | null>(null);

    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState<string | null>(null);

    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [createUserMessage, setCreateUserMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [logsError, setLogsError] = useState<string | null>(null);

    const fetchLicenses = async () => {
        setIsLoadingLicenses(true);
        setLicensesError(null);
        const { data, error: dbError } = await supabase
            .from('licenses')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (dbError) {
            console.error("Error fetching licenses:", dbError.message);
            setLicensesError(`Failed to fetch licenses: ${dbError.message}. This is likely due to a Row Level Security (RLS) policy. Please ensure the 'anon' role has SELECT permissions on the 'licenses' table.`);
        } else if (data) {
            setLicenses(data);
        }
        setIsLoadingLicenses(false);
    };
    
    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        setUsersError(null);
        const { data, error: dbError } = await supabase
            .from('profiles')
            .select('id, username, plan, generations_today, pro_expires_at')
            .order('username', { ascending: true });
        
        if (dbError) {
            console.error("Error fetching users:", dbError.message);
            setUsersError(`Failed to fetch users: ${dbError.message}. Ensure RLS policy allows admins to SELECT from 'profiles'.`);
        } else if (data) {
            setUsers(data as ManagedUser[]);
        }
        setIsLoadingUsers(false);
    };

    const fetchActivityLogs = async () => {
        setIsLoadingLogs(true);
        setLogsError(null);
        const { data, error: dbError } = await supabase
            .from('activity_log')
            .select('id, created_at, username, activity_type, details')
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (dbError) {
            console.error("Error fetching activity logs:", dbError.message);
            let detailedError = `Failed to fetch activity logs.`;
            if (dbError.code === '42P01') {
                detailedError = `The 'activity_log' table is missing from your database.\n\nPlease create it using the SQL Editor in your Supabase dashboard with the following command:\n\nCREATE TABLE public.activity_log (\n  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,\n  username TEXT,\n  activity_type TEXT,\n  details TEXT\n);\n\nAfter creating the table, enable Row Level Security (RLS) and create policies to allow users to insert and admins to read logs.`;
            } else {
                detailedError += ` Error: ${dbError.message}. Please check your table's RLS policies.`;
            }
            setLogsError(detailedError);
        } else if (data) {
            setActivityLogs(data as ActivityLog[]);
        }
        setIsLoadingLogs(false);
    };

    useEffect(() => {
        fetchUsers();
        fetchLicenses();
        fetchActivityLogs();
    }, []);

    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateUserMessage(null);

        if (!newUser.username || !newUser.email || !newUser.password) {
            setCreateUserMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }

        let adminSession;
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                throw new Error('Could not verify admin session. Please log in again.');
            }
            adminSession = data.session;

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: newUser.email,
                password: newUser.password,
                options: {
                    data: {
                        username: newUser.username,
                    },
                },
            });

            if (signUpError) throw signUpError;
            if (!signUpData.user) throw new Error("User creation did not return a user object.");

            const { error: restoreError } = await supabase.auth.setSession({
                access_token: adminSession.access_token,
                refresh_token: adminSession.refresh_token,
            });
            if (restoreError) {
                throw new Error(`User created, but failed to restore your admin session. Please log out and log back in. Error: ${restoreError.message}`);
            }

            const isAutoConfirmed = !!signUpData.user.email_confirmed_at;
            if (isAutoConfirmed) {
                setCreateUserMessage({ type: 'success', text: `User "${newUser.username}" created successfully and can log in immediately.` });
            } else {
                setCreateUserMessage({
                    type: 'success',
                    text: `User "${newUser.username}" created, but requires email verification. To allow instant login, you must disable "Confirm email" in your Supabase project's Authentication settings.`
                });
            }

            setNewUser({ username: '', email: '', password: '' });
            fetchUsers();

        } catch (error: any) {
            console.error("User creation failed:", error);
            setCreateUserMessage({ type: 'error', text: error.message || 'An unexpected error occurred during user creation.' });
        }
    };
    
    const generateKey = async () => {
        const newKey = `PRO-${crypto.randomUUID().toUpperCase()}`;
        const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();
        
        const { error } = await supabase
            .from('licenses')
            .insert([{ key: newKey, expires_at: expiresAt, status: 'active' }]);
        
        if (error) {
            console.error("Error generating key:", error.message);
            setLicensesError(`Error generating key: ${error.message}. Ensure your RLS policy allows inserts for authenticated users.`);
        } else {
            await fetchLicenses();
        }
    };

    const toggleStatus = async (key: string, currentStatus: License['status']) => {
        const newStatus = currentStatus === 'active' ? 'revoked' : 'active';
        const { error } = await supabase
            .from('licenses')
            .update({ status: newStatus })
            .eq('key', key);
        
        if (error) console.error("Error updating status:", error.message);
        else await fetchLicenses();
    };
    
    const deleteKey = async (id: number) => {
        const { error } = await supabase
            .from('licenses')
            .delete()
            .eq('id', id);

        if (error) console.error("Error deleting key:", error.message);
        else await fetchLicenses();
    }

    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const togglePro = async (user: ManagedUser) => {
        const isCurrentlyPro = user.plan === 'pro';
        const newPlan = isCurrentlyPro ? 'free' : 'pro';
        const newExpiry = isCurrentlyPro ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
        const { error } = await supabase
            .from('profiles')
            .update({ plan: newPlan, pro_expires_at: newExpiry, license_key: null })
            .eq('id', user.id);
        
        if (error) {
            setUsersError(`Failed to update user ${user.username}: ${error.message}`);
        } else {
            const { data: { session } } = await supabase.auth.getSession();
            const adminUser = session?.user;

            if (adminUser) {
                const { error: logError } = await supabase.from('activity_log').insert({
                    user_id: user.id,
                    username: user.username,
                    activity_type: isCurrentlyPro ? 'pro_plan_revoked_admin' : 'pro_plan_granted_admin',
                    details: `By Admin: ${adminUser.email}`
                });
                if (logError) console.error("Error logging admin pro toggle:", logError.message);
            }
            fetchUsers();
            fetchActivityLogs();
        }
    };

    const resetGenerations = async (userId: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ generations_today: 0 })
            .eq('id', userId);

        if (error) {
             setUsersError(`Failed to reset generations: ${error.message}`);
        } else {
            fetchUsers();
        }
    };

    const formatActivityType = (type: string): string => {
        switch (type) {
            case 'user_login': return 'Logged In';
            case 'caption_generation': return 'Generated a Caption';
            case 'pro_plan_activated_key': return 'Activated Pro Plan';
            case 'pro_plan_granted_admin': return 'Pro Plan Granted';
            case 'pro_plan_revoked_admin': return 'Pro Plan Revoked';
            default: return type.replace(/_/g, ' ');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div className="space-y-8 animate-fade-in-fast">
                        <section className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/80">
                            <h2 className="text-xl font-semibold text-slate-200 mb-4">Create New User</h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="username">Username</label>
                                        <input type="text" name="username" id="username" value={newUser.username} onChange={handleNewUserChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">Email Address</label>
                                        <input type="email" name="email" id="email" value={newUser.email} onChange={handleNewUserChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">Password</label>
                                    <input type="password" name="password" id="password" value={newUser.password} onChange={handleNewUserChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100"/>
                                </div>
                                {createUserMessage && <p className={`text-sm text-center ${createUserMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{createUserMessage.text}</p>}
                                <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-500 transition-colors">Create User</button>
                            </form>
                            <p className="text-xs text-slate-400 mt-4 text-center">
                                Note: To allow new users to log in immediately, disable "Confirm email" in your Supabase project's Authentication settings.
                            </p>
                        </section>
                        <section className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/80">
                            <h2 className="text-xl font-semibold text-slate-200 mb-4">Manage Users</h2>
                            {usersError && <p className="text-red-500 text-center py-2 text-sm">{usersError}</p>}
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {isLoadingUsers ? (
                                    <p className="text-slate-400 text-center py-4">Loading users...</p>
                                ) : users.length === 0 ? (
                                    <p className="text-slate-400 text-center py-4">No users found.</p>
                                ) : (
                                    users.map((user) => (
                                        <div key={user.id} className="p-3 bg-slate-700/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div className="flex-grow text-sm text-slate-300">
                                                <p className="font-semibold">{user.username}</p>
                                                <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3">
                                                    <span>Plan: <span className={`font-medium ${user.plan === 'pro' ? 'text-blue-400' : 'text-slate-300'}`}>{user.plan}</span></span>
                                                    <span>Generations: {user.generations_today}</span>
                                                    {user.plan === 'pro' && user.pro_expires_at && (<span>Pro Expires: {new Date(user.pro_expires_at).toLocaleDateString()}</span>)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 self-end sm:self-center">
                                                <button onClick={() => togglePro(user)} className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${user.plan === 'pro' ? 'bg-red-900/50 text-red-300 hover:bg-red-900/80' : 'bg-blue-900/50 text-blue-300 hover:bg-blue-900/80'}`}>
                                                    {user.plan === 'pro' ? 'Revoke Pro' : 'Grant Pro'}
                                                </button>
                                                <button onClick={() => resetGenerations(user.id)} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-600 text-slate-200 hover:bg-slate-500 transition-colors">
                                                    Reset Count
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                );
            case 'licenses':
                return (
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/80 animate-fade-in-fast">
                        <h2 className="text-xl font-semibold text-slate-200 mb-4">License Key Management</h2>
                         {licensesError && (<div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-sm whitespace-pre-wrap">{licensesError}</div>)}
                         <div className="flex items-center gap-4 mb-4">
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                                className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                                aria-label="License duration in days"
                            />
                            <button onClick={generateKey} className="flex-1 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-500 transition-colors">
                                Generate {duration}-Day Key
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                            {isLoadingLicenses ? (
                                <p className="text-slate-400 text-center py-4">Loading licenses...</p>
                            ) : licenses.map(license => (
                                <div key={license.id} className="p-3 bg-slate-700/50 rounded-lg flex flex-wrap items-center justify-between gap-3 text-sm">
                                    <div>
                                        <p className="font-mono text-xs text-slate-300 break-all">{license.key}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Expires: {new Date(license.expires_at).toLocaleDateString()} | Status: 
                                            <span className={`font-medium ml-1 ${license.status === 'active' ? 'text-green-400' : license.status === 'used' ? 'text-purple-400' : 'text-red-400'}`}>{license.status}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleCopy(license.key)} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-600 text-slate-200 hover:bg-slate-500">
                                            {copiedKey === license.key ? 'Copied!' : 'Copy'}
                                        </button>
                                        <button onClick={() => toggleStatus(license.key, license.status)} className={`text-xs font-medium px-3 py-1 rounded-full ${license.status === 'active' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                                            {license.status === 'active' ? 'Revoke' : 'Activate'}
                                        </button>
                                        <button onClick={() => deleteKey(license.id)} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-600 text-slate-200 hover:bg-slate-500">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'activity':
                 return (
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/80 animate-fade-in-fast">
                        <h2 className="text-xl font-semibold text-slate-200 mb-4">Recent Activity Log</h2>
                         {logsError && <p className="text-red-500 text-center py-2 text-sm whitespace-pre-wrap">{logsError}</p>}
                        <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-2">
                            {isLoadingLogs ? (
                                <p className="text-slate-400 text-center py-4">Loading activity...</p>
                            ) : activityLogs.length === 0 ? (
                                <p className="text-slate-400 text-center py-4">No activity recorded yet.</p>
                            ) : (
                                activityLogs.map((log) => (
                                    <div key={log.id} className="p-3 bg-slate-700/50 rounded-lg flex flex-wrap items-center justify-between gap-4">
                                        <div className="text-sm">
                                            <span className="font-semibold text-slate-200">{log.username}</span>
                                            <span className="text-slate-300"> {formatActivityType(log.activity_type)}</span>
                                            {log.details && <span className="text-xs text-slate-400 ml-2">({log.details})</span>}
                                        </div>
                                        <div className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                 );
            default:
                return null;
        }
    }

    const TabButton = ({ tab, label }: { tab: AdminTab; label: string }) => (
        <button
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-200">Admin Dashboard</h1>
                <button
                    onClick={onSwitchToPersonal}
                    className="flex items-center gap-2 bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                >
                    <span>Switch to Personal</span>
                </button>
            </header>
            <main className="w-full max-w-5xl mx-auto">
                <div role="tablist" className="flex border-b border-slate-700 mb-6">
                    <TabButton tab="users" label="User Management" />
                    <TabButton tab="licenses" label="License Management" />
                    <TabButton tab="activity" label="Activity Log" />
                </div>
                <div role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
                    {renderTabContent()}
                </div>
            </main>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in-fast { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AdminPage;
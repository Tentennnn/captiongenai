import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import type { UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';
// FIX: Changed import to @supabase/gotrue-js because the types may not be re-exported from @supabase/supabase-js in older versions.
import type { AuthChangeEvent, Session, User } from '@supabase/gotrue-js';

const FREE_LIMIT = 3;
const PRO_LIMIT = 10;

interface UserContextType {
    currentUser: UserProfile | null;
    remainingGenerations: number;
    canGenerate: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    recordGeneration: () => Promise<void>;
    activatePro: (key: string) => Promise<{ success: boolean; message: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const activityLogEnabled = useRef(true);

    const logActivity = async (activity: {
        user_id: string;
        username: string;
        activity_type: string;
        details?: string;
    }) => {
        if (!activityLogEnabled.current) return;

        const { error } = await supabase.from('activity_log').insert(activity);

        if (error) {
            console.error(`Error logging activity (${activity.activity_type}):`, error.message);
            // Supabase returns error code '42P01' for missing tables.
            if (error.code === '42P01') {
                console.warn("Disabling activity logging for this session because the 'activity_log' table is missing.");
                activityLogEnabled.current = false;
            }
        }
    };

    const handleUserProfile = async (user: User, isLoginEvent: boolean = false) => {
        // Fetch user profile from the 'profiles' table
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
            // This can happen if the db trigger for profile creation is slow or fails.
            // We'll log the user out to avoid an inconsistent state.
            logout();
            return;
        }

        // Log login activity
        if (isLoginEvent) {
            await logActivity({
                user_id: user.id,
                username: profile.username,
                activity_type: 'user_login',
            });
        }

        const today = getTodayDateString();
        let needsUpdate = false;
        let updatedProfile = { ...profile };

        // Reset daily generation count if it's a new day
        if (profile.last_generation_date !== today) {
            updatedProfile.generations_today = 0;
            updatedProfile.last_generation_date = today;
            needsUpdate = true;
        }

        // Revert to free plan if pro has expired
        if (profile.plan === 'pro' && profile.pro_expires_at && Date.now() > new Date(profile.pro_expires_at).getTime()) {
            updatedProfile.plan = 'free';
            updatedProfile.license_key = null;
            updatedProfile.pro_expires_at = null;
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            const { data: finalProfile, error: updateError } = await supabase
                .from('profiles')
                .update(updatedProfile)
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) {
                console.error("Error updating user profile on load:", updateError.message);
            } else {
                updatedProfile = finalProfile;
            }
        }
        
        setCurrentUser({
            id: updatedProfile.id,
            username: updatedProfile.username,
            email: user.email!,
            plan: updatedProfile.plan,
            generationsToday: updatedProfile.generations_today,
            lastGenerationDate: updatedProfile.last_generation_date,
            licenseKey: updatedProfile.license_key,
            proExpiresAt: updatedProfile.pro_expires_at ? new Date(updatedProfile.pro_expires_at).getTime() : null
        });
    };

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    await handleUserProfile(session.user, true);
                } else if (event === 'SIGNED_OUT') {
                    setCurrentUser(null);
                }
            }
        );

        // Check for existing session on initial load
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await handleUserProfile(session.user, false);
            }
        };
        checkSession();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (signInError) {
            console.error("Error signing in:", signInError.message);
            
            // Provide more specific feedback for common, non-security-sensitive errors.
            if (signInError.message.includes('Email not confirmed')) {
                return { success: false, message: "Please check your inbox and confirm your email address before logging in." };
            }

            // For all other errors, use a generic message to prevent user enumeration.
            return { success: false, message: "Invalid email or password." };
        }

        // The onAuthStateChange listener will handle setting the user profile after successful login.
        return { success: true, message: 'Login successful!' };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const recordGeneration = async () => {
        if (!currentUser) return;
        
        const newCount = currentUser.generationsToday + 1;
        const { data, error } = await supabase
            .from('profiles')
            .update({ 
                generations_today: newCount,
                last_generation_date: getTodayDateString()
            })
            .eq('id', currentUser.id)
            .select()
            .single();

        if (error) {
            console.error('Error recording generation:', error.message);
        } else if (data) {
             setCurrentUser(prev => prev ? { ...prev, generationsToday: data.generations_today, lastGenerationDate: data.last_generation_date } : null);
             await logActivity({
                user_id: currentUser.id,
                username: currentUser.username,
                activity_type: 'caption_generation',
             });
        }
    };
    
    const activatePro = async (key: string) => {
        if (!currentUser) return { success: false, message: 'You must be logged in to activate a key.' };

        // Check license key validity from the 'licenses' table
        const { data: license, error: licenseError } = await supabase
            .from('licenses')
            .select('*')
            .eq('key', key)
            .single();

        if (licenseError) {
            console.error("Error fetching license key:", licenseError.message);
            return { success: false, message: 'Could not validate the license key. Please try again.' };
        }
        
        if (!license) return { success: false, message: 'License key not found.' };
        if (license.status === 'revoked') return { success: false, message: 'This license key has been revoked.' };
        if (Date.now() > new Date(license.expires_at).getTime()) return { success: false, message: 'This license key has expired.' };
        if (license.status === 'used') return { success: false, message: 'This license key has already been used.' };
        
        const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({
                plan: 'pro',
                license_key: key,
                pro_expires_at: new Date(license.expires_at).toISOString(),
            })
            .eq('id', currentUser.id);

        if (updateProfileError) {
             console.error("Error updating profile to Pro:", updateProfileError.message);
             return { success: false, message: 'Failed to activate Pro plan. Please try again.' };
        }
        
        // Mark the key as used
        await supabase.from('licenses').update({ status: 'used' }).eq('key', key);

        await logActivity({
            user_id: currentUser.id,
            username: currentUser.username,
            activity_type: 'pro_plan_activated_key',
            details: `Key: ${key.substring(0, 8)}...`
        });

        // Refresh user profile
        const { data: { user } } = await supabase.auth.getUser();
        if(user) await handleUserProfile(user);

        return { success: true, message: 'Pro plan activated successfully!' };
    };

    const limit = currentUser?.plan === 'pro' ? PRO_LIMIT : FREE_LIMIT;
    const canGenerate = currentUser ? currentUser.generationsToday < limit : false;
    const remainingGenerations = currentUser ? limit - currentUser.generationsToday : 0;

    return (
        <UserContext.Provider value={{ currentUser, remainingGenerations, canGenerate, recordGeneration, activatePro, login, logout: () => logout() }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
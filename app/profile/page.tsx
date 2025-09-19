"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { useUser } from '@/contexts/userContext';
import Loading from '@/components/loading/loading';
import { useProfile, Profile } from '@/lib/profile';
import './profile.css';

import { supabase } from '@/lib/supabase';
import EditProfileModal from '@/components/profile/editProfile';
import { createProfile, updateProfile } from '@/api/profile/api_profile.client';

export default function ProfilePage() {
    const { user, loading } = useUser();
    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        if (!user) {
            setToken(null);
            return;
        }
        supabase.auth.getSession().then(({ data }) => {
            setToken(data.session?.access_token || null);
        });
    }, [user]);

    const { profile, loading: profileLoading, error } = useProfile(token);

    const [form, setForm] = useState<Partial<Profile>>({ name: '', phone: '' });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name || '',
                phone: profile.phone || '',
             });
        } else {
            setForm({ name: '', phone: '', });
        }
    }, [profile]);

    if (loading || profileLoading) {
        return <Loading />;
    }
    if (!user) {
        router.push('/');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);
        setSuccess(null);
        try {
            if (!token) throw new Error('No auth token');
            if(profile?.name == null || profile?.phone == null){
                await createProfile(token, form);
                return;
            }else{
                await updateProfile(token, form);
            }

            setSuccess('Profile updated successfully!');
                setShowEditForm(false);

        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="background"></div>
            <div className="background-2"></div>
            <Navbar />
            <div className="profile-hero">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">{user?.email?.[0]?.toUpperCase() || 'U'}</div>
                    <div className="profile-info">
                        <div className="profile-name">{form.name || 'Your Name'}</div>
                        <div className="profile-email">{user?.email}</div>
                        <div className="profile-status">Status: {form.status || 'Active'}</div>
                    </div>
                </div>
            </div>
            <div className="profile-content">
                <div className="profile-dashboard">
                    <div className="profile-section">
                        <h3 className="section-title">Quick Actions</h3>
                        <div className="profile-cards-grid">
                            <div className="profile-action-card">
                                <div className="card-icon">🛒</div>
                                <div className="card-content">
                                    <h4>My Cart</h4>
                                    <p>View and manage items</p>
                                </div>
                                <div className="card-badge">3</div>
                            </div>
                            <div className="profile-action-card">
                                <div className="card-icon">📦</div>
                                <div className="card-content">
                                    <h4>Orders</h4>
                                    <p>Track your orders</p>
                                </div>
                                <div className="card-badge">12</div>
                            </div>
                            <div className="profile-action-card">
                                <div className="card-icon">💛</div>
                                <div className="card-content">
                                    <h4>Wishlist</h4>
                                    <p>Saved for later</p>
                                </div>
                                <div className="card-badge">8</div>
                            </div>
                            <div className="profile-action-card">
                                <div className="card-icon">⭐</div>
                                <div className="card-content">
                                    <h4>Reviews</h4>
                                    <p>Your product reviews</p>
                                </div>
                                <div className="card-badge">5</div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3 className="section-title">Account Settings</h3>
                        <div className="profile-settings-grid">
                            <div className="setting-item">
                                <div className="setting-icon">👤</div>
                                <div className="setting-content">
                                    <h4>Personal Information</h4>
                                    <p>Update your details</p>
                                </div>
                                <button className="setting-btn" onClick={() => setShowEditForm(true)}>
                                    Edit
                                </button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-icon">📍</div>
                                <div className="setting-content">
                                    <h4>Addresses</h4>
                                    <p>Manage shipping addresses</p>
                                </div>
                                <button className="setting-btn" onClick={() => router.push('/addresses')}>
                                    Manage
                                </button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-icon">💳</div>
                                <div className="setting-content">
                                    <h4>Payment Methods</h4>
                                    <p>Saved payment options</p>
                                </div>
                                <button className="setting-btn">Manage</button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-icon">🔔</div>
                                <div className="setting-content">
                                    <h4>Notifications</h4>
                                    <p>Email & SMS preferences</p>
                                </div>
                                <button className="setting-btn">Settings</button>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3 className="section-title">Recent Activity</h3>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">📦</div>
                                <div className="activity-content">
                                    <h4>Order #HB-001234 shipped</h4>
                                    <p>Your order is on the way</p>
                                    <span className="activity-time">2 hours ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">💛</div>
                                <div className="activity-content">
                                    <h4>Added to wishlist</h4>
                                    <p>Premium Wildflower Honey</p>
                                    <span className="activity-time">1 day ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">⭐</div>
                                <div className="activity-content">
                                    <h4>Review submitted</h4>
                                    <p>Organic Clover Honey - 5 stars</p>
                                    <span className="activity-time">3 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditProfileModal
                open={showEditForm}
                onClose={() => setShowEditForm(false)}
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                saving={saving}
                formError={formError}
                success={success}
            />
        </div>
    );
}
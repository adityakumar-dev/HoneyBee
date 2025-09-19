"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { useUser } from '@/contexts/userContext';
import Loading from '@/components/loading/loading';
import { useAddresses } from '@/lib/address';
import { supabase } from '@/lib/supabase';
import AddressCard from '@/components/profile/AddressCard';
import AddressForm from '@/components/profile/AddressForm';
import './addresses.css';

export default function AddressesPage() {
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

    const { addresses, loading: addressesLoading, error, refetch } = useAddresses(token);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);

    if (loading || addressesLoading) {
        return <Loading />;
    }

    if (!user) {
        router.push('/');
        return null;
    }

    const handleEdit = (address: any) => {
        setEditingAddress(address);
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        // Delete logic will be handled in AddressCard component
    };

    const handleFormClose = () => {
        setShowAddForm(false);
        setEditingAddress(null);
        refetch(); // Refresh addresses after add/edit
    };

    return (
        <div className="addresses-page">
            <div className="background"></div>
            <div className="background-2"></div>
            <Navbar />
            
            <div className="addresses-header">
                <div className="addresses-header-content">
                    <div className="addresses-title-section">
                        <button className="back-btn" onClick={() => router.push('/profile')}>
                            ← Back to Profile
                        </button>
                        <h1 className="addresses-title">Manage Addresses</h1>
                        <p className="addresses-subtitle">Add, edit, and organize your shipping addresses</p>
                    </div>
                    <button className="add-address-btn" onClick={() => setShowAddForm(true)}>
                        <span className="btn-icon">+</span>
                        Add New Address
                    </button>
                </div>
            </div>

            <div className="addresses-content">
                <div className="addresses-container">
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {addresses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📍</div>
                            <h3>No addresses found</h3>
                            <p>Add your first address to get started with faster checkout</p>
                            <button className="empty-add-btn" onClick={() => setShowAddForm(true)}>
                                Add Address
                            </button>
                        </div>
                    ) : (
                        <div className="addresses-grid">
                            {addresses.map((address) => (
                                <AddressCard
                                    key={address.id}
                                    address={address}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    token={token}
                                    onRefresh={refetch}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddressForm
                open={showAddForm}
                onClose={handleFormClose}
                address={editingAddress}
                token={token}
            />
        </div>
    );
}

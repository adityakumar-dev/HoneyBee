import React, { useState } from 'react';
import { Address, formatAddress } from '@/lib/address';
import { deleteAddress } from '@/api/address/api_address.client';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  token: string | null;
  onRefresh: () => void;
}

export default function AddressCard({ address, onEdit, onDelete, token, onRefresh }: AddressCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    if (!token) return;

    setDeleting(true);
    try {
      await deleteAddress(token, address.id);
      onRefresh(); // Refresh the addresses list
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('Failed to delete address. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getAddressTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'home': return '🏠';
      case 'work': return '🏢';
      default: return '📍';
    }
  };

  const getAddressTypeBadge = (type?: string) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="address-card">
      <div className="address-card-header">
        <div className="address-type">
          <span className="address-type-icon">{getAddressTypeIcon(address.type)}</span>
          <span className="address-type-label">{getAddressTypeBadge(address.type) || 'Address'}</span>
        </div>
        <div className="address-actions">
          <button 
            className="edit-btn" 
            onClick={() => onEdit(address)}
            title="Edit address"
          >
            ✏️
          </button>
          <button 
            className="delete-btn" 
            onClick={handleDelete}
            disabled={deleting}
            title="Delete address"
          >
            {deleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
      
      <div className="address-content">
        <div className="address-text">{formatAddress(address)}</div>
        {!formatAddress(address) && (
          <div className="address-empty">No address details</div>
        )}
      </div>
      
      <div className="address-card-footer">
        <span className="address-date">
          Added {address.created_at ? new Date(address.created_at).toLocaleDateString() : 'Unknown'}
        </span>
      </div>
    </div>
  );
}

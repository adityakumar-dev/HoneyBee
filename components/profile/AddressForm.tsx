import React, { useState, useEffect } from 'react';
import { Address, ADDRESS_TYPES } from '@/lib/address';
import { createAddress, updateAddress } from '@/api/address/api_address.client';

interface AddressFormProps {
  open: boolean;
  onClose: () => void;
  address?: Address | null;
  token: string | null;
}

export default function AddressForm({ open, onClose, address, token }: AddressFormProps) {
  const [formData, setFormData] = useState({
    type: 'home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setFormData({
        type: address.type || 'home',
        line1: address.line1 || '',
        line2: address.line2 || '',
        city: address.city || '',
        state: address.state || '',
        country: address.country || '',
        postal_code: address.postal_code || ''
      });
    } else {
      setFormData({
        type: 'home',
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
      });
    }
  }, [address, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError(null);

    try {
      if (address) {
        // Update existing address
        await updateAddress(token, address.id, formData);
      } else {
        // Create new address
        await createAddress(token, formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-header">
          <h2>{address ? 'Edit Address' : 'Add New Address'}</h2>
          <button className="address-modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          {error && (
            <div className="address-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="type">Address Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {ADDRESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="line1">Address Line 1 *</label>
            <input
              type="text"
              id="line1"
              name="line1"
              value={formData.line1}
              onChange={handleChange}
              placeholder="Street address, building number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="line2">Address Line 2</label>
            <input
              type="text"
              id="line2"
              name="line2"
              value={formData.line2}
              onChange={handleChange}
              placeholder="Apartment, suite, unit, floor (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State/Province *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State or Province"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postal_code">Postal Code *</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="ZIP or Postal Code"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                required
              />
            </div>
          </div>

          <div className="address-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : (address ? 'Update Address' : 'Add Address')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

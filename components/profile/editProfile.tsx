
export default function EditProfileModal({ open, onClose, form, onChange, onSubmit, saving, formError, success }: any) {
    if (!open) return null;
    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Edit Profile</h3>
                <form className="modal-form" onSubmit={onSubmit}>
                    <div className="modal-field-group">
                        <label className="profile-label" htmlFor="modal-name">Full Name</label>
                        <input
                            className="profile-input"
                            id="modal-name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="modal-field-group">
                        <label className="profile-label" htmlFor="modal-phone">Phone Number</label>
                        <input
                            className="profile-input"
                            id="modal-phone"
                            name="phone"
                            type="text"
                            value={form.phone}
                            onChange={onChange}
                            placeholder="Enter your phone number"
                        />
                    </div>
                    {formError && <div className="profile-error">{formError}</div>}
                    {success && <div className="profile-success">{success}</div>}
                    <div className="modal-actions">
                        <button className="profile-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                        <button className="profile-btn profile-btn-cancel" type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

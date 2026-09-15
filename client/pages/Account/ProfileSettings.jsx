// pages/Account/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useAccount } from '../../src/context/AccountContext';
import { AvatarUploader } from '../../src/components/ui/AvatarUploader';
import { FormField } from '../../src/components/ui/FormField';

export default function ProfileSettings() {
  const { profile, updateProfile, uploadAvatar, loading } = useAccount();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setSuccessMsg('PROFILE UPDATED SUCCESSFULLY!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 font-sans font-bold">LOADING PROFILE...</div>;

  return (
    <div className="bg-white border border-ink shadow-card rounded-card p-6 sm:p-8">
      <h2 className="font-sans font-extrabold text-2xl tracking-tight text-ink uppercase mb-6">
        PROFILE SETTINGS
      </h2>

      {successMsg && (
        <div className="bg-highlight text-ink font-sans font-extrabold text-xs tracking-wider p-3 mb-6 border border-ink rounded-btn">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <AvatarUploader
          currentAvatar={profile?.profilePicture}
          onUpload={uploadAvatar}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="FIRST NAME"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="KORNKANOK"
          />
          <FormField
            label="LAST NAME"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="THAIHERITAGE"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="EMAIL ADDRESS"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.co.th"
          />
          <FormField
            label="PHONE NUMBER"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="08X-XXX-XXXX"
          />
        </div>

        <FormField
          label="DEFAULT SHIPPING ADDRESS"
          name="address"
          isTextarea={true}
          rows={3}
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter full shipping address..."
        />

        <button
          type="submit"
          disabled={saving}
          className="self-start bg-ink text-cream-text font-sans font-extrabold text-xs tracking-wider px-7 py-3 rounded-btn hover:bg-primary hover:text-white transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
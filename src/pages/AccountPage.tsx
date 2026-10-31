import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  Bell,
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useAuth, DEMO_ORGANIZATIONS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DeliveryAddress } from '../types';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
}

export const AccountPage: React.FC = () => {
  const { user, updateOrganizationType, updateProfile, addDeliveryAddress } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'org' | 'team' | 'addresses' | 'notifications'>('org');

  // Team members list state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'tm-1',
      name: user?.name || 'Eleanor Vance',
      email: user?.email || 'e.vance@stjude-health.org',
      role: 'Procurement Director',
      status: 'Active',
    },
    {
      id: 'tm-2',
      name: 'Dr. Alistair Ross',
      email: 'a.ross@stjude-health.org',
      role: 'Chief Medical Officer',
      status: 'Active',
    },
    {
      id: 'tm-3',
      name: 'Rachel Evans, RN',
      email: 'r.evans@stjude-health.org',
      role: 'Theatre Nurse Lead',
      status: 'Active',
    },
    {
      id: 'tm-4',
      name: 'James Henderson',
      email: 'j.henderson@stjude-health.org',
      role: 'Finance & Accounts Payable',
      status: 'Active',
    },
  ]);

  // Invite modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff Nurse / Requisitioner');

  // New Address modal
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newAttention, setNewAttention] = useState('');
  const [newAddress1, setNewAddress1] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostcode, setNewPostcode] = useState('');

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setTeamMembers((prev) => [
      ...prev,
      {
        id: `tm-${Date.now()}`,
        name: inviteName.trim() || inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: inviteRole,
        status: 'Invited',
      },
    ]);

    showToast('Invitation Dispatched', `Invited ${inviteEmail} with role "${inviteRole}".`, 'success');
    setInviteName('');
    setInviteEmail('');
    setInviteModalOpen(false);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName.trim() || !newAddress1.trim()) return;

    const newAddr: DeliveryAddress = {
      facilityName: newFacilityName.trim(),
      attention: newAttention.trim() || 'Receiving Dock',
      addressLine1: newAddress1.trim(),
      city: newCity.trim() || 'London',
      stateOrRegion: 'Greater London',
      postalCode: newPostcode.trim() || 'EC1A 1BB',
      country: 'United Kingdom',
      phone: '+44 20 7946 0000',
    };

    addDeliveryAddress(newAddr);
    showToast('Dock Address Saved', `${newFacilityName} added to receiving directory.`, 'success');
    setNewFacilityName('');
    setNewAttention('');
    setNewAddress1('');
    setAddressModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12304A]">Organization & Facility Governance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage institutional credentials, procurement authorization, delivery bays, and team permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> NHS Tier 1 Provider Verified
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'org', label: 'Organization Profile', icon: Building2 },
          { id: 'team', label: `Team Members (${teamMembers.length})`, icon: Users },
          { id: 'addresses', label: `Receiving Docks (${user?.savedAddresses.length || 0})`, icon: MapPin },
          { id: 'notifications', label: 'Alert Preferences', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors ${
                isActive
                  ? 'border-[#0E9AA7] text-[#0E9AA7]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORGANIZATION PROFILE */}
      {activeTab === 'org' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-[#12304A]">Institutional Profile Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-500 block mb-1">Organization Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.organization.name}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-[#12304A]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-500 block mb-1">Facility Category</label>
                <div className="flex gap-2">
                  {(['Hospital', 'Pharmacy', 'Clinic'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateOrganizationType(type)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                        user?.organization.type === type
                          ? 'border-[#0E9AA7] bg-[#E6F4FA] text-[#0E9AA7]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 block mb-1">
                  Health Authority Registration
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.organization.registrationNumber}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-500 block mb-1">VAT / Tax Identification</label>
                <input
                  type="text"
                  readOnly
                  value={user?.organization.taxId}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-[#12304A] block">Procurement Tax Exemption Status</span>
              <p>
                Zero-rated medical supplies certificate active on file. Supplies for clinical treatments and diagnostic use exempt from 20% standard VAT pursuant to Schedule 8 UK VAT Act 1994.
              </p>
            </div>
          </div>

          {/* Account Manager Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#12304A]">Assigned Distributor Lead</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F4FA] text-[#0E9AA7] flex items-center justify-center font-bold text-base">
                MH
              </div>
              <div>
                <p className="text-sm font-bold text-[#12304A]">
                  {user?.organization.accountManager.name}
                </p>
                <span className="text-xs text-slate-400">Senior Healthcare Key Account Specialist</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0E9AA7]" />
                <span>{user?.organization.accountManager.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0E9AA7]" />
                <span>{user?.organization.accountManager.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#12304A]">Authorized Procurement Personnel</h3>
              <p className="text-xs text-slate-500">
                Staff authorized to generate purchase requisitions and access Net-30 statements
              </p>
            </div>

            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Team Member
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-bold text-[#12304A] block">{member.name}</span>
                    <span className="text-slate-500">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#E6F4FA] text-[#0E9AA7]">
                    {member.role}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      member.status === 'Active' ? 'text-emerald-700' : 'text-amber-600'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RECEIVING DOCKS & ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#12304A]">Receiving Docks & Delivery Addresses</h3>
              <p className="text-xs text-slate-500">
                Designated delivery docks and receiving staff contact numbers
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAddressModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Receiving Facility
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.savedAddresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-sm text-[#12304A]">{addr.facilityName}</span>
                  <span className="text-[10px] font-mono text-slate-400">Bay #{idx + 1}</span>
                </div>
                <p className="text-slate-700 font-medium">{addr.attention}</p>
                <p className="text-slate-500">{addr.addressLine1}</p>
                <p className="text-slate-500">
                  {addr.city}, {addr.postalCode}
                </p>
                <p className="text-slate-500">Phone: {addr.phone}</p>
                <div className="pt-2 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
                  Hours: {addr.operatingHours || 'Mon-Fri: 07:00 - 18:00'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALERT PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Automated Logistics & Invoice Alerts</h3>
          <p className="text-xs text-slate-500">
            Select automated email and SMS notification channels for your procurement team
          </p>

          <div className="space-y-3 pt-2 text-xs">
            {[
              {
                title: 'Outbound Cold-Chain Dispatch Alerts',
                desc: 'Receive immediate notice when pallets are loaded with real-time temperature logger links.',
                checked: true,
              },
              {
                title: 'Delivery Confirmation & POD Signature',
                desc: 'Instant delivery receipt notification with recipient signature capture.',
                checked: true,
              },
              {
                title: 'Weekly Net-30 Statement Reminders',
                desc: 'Consolidated summary of open invoices 7 days prior to Net-30 payment due dates.',
                checked: true,
              },
              {
                title: 'Critical Stock Shortage & Backorder Warnings',
                desc: 'Alerts when frequent items drop below 200 units in distributor warehouse.',
                checked: true,
              },
            ].map((n, i) => (
              <label
                key={i}
                className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-bold text-[#12304A] block">{n.title}</span>
                  <span className="text-slate-500 text-[11px]">{n.desc}</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={n.checked}
                  className="mt-1 rounded text-[#0E9AA7]"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#12304A]">Invite Healthcare Procurement Member</h3>
            <form onSubmit={handleInviteMember} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Jennifer Cole"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="j.cole@stjude-health.org"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Procurement Officer">Procurement Officer</option>
                  <option value="Head of Pharmacy">Head of Pharmacy</option>
                  <option value="Clinical Lead / Nurse">Clinical Lead / Nurse</option>
                  <option value="Billing & Accounts Coordinator">Billing & Accounts Coordinator</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#12304A]">Add Receiving Facility Dock</h3>
            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  value={newFacilityName}
                  onChange={(e) => setNewFacilityName(e.target.value)}
                  placeholder="e.g. St. Jude East Oncology Pavilion"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attention / Receiving Contact</label>
                <input
                  type="text"
                  value={newAttention}
                  onChange={(e) => setNewAttention(e.target.value)}
                  placeholder="e.g. Loading Bay 2, att: Pharmacy Logistics"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={newAddress1}
                  onChange={(e) => setNewAddress1(e.target.value)}
                  placeholder="e.g. 120 Commercial Way"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#0E9AA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="London"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={newPostcode}
                    onChange={(e) => setNewPostcode(e.target.value)}
                    placeholder="SE1 9RT"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

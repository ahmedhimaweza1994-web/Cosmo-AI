
import React, { useState, useEffect } from 'react';
import { AppSettings, PlanConfig, User, ViewState } from '../types';
import { db } from '../services/dbService';
import {
  LayoutDashboard, Palette, Type, CreditCard, Settings,
  Save, RefreshCw, Users, DollarSign, Plus, Trash2, LogOut, Home
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cms' | 'theme' | 'plans' | 'gateway'>('dashboard');
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [users, setUsers] = useState<User[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await db.getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // Save Changes
  const handleSave = () => {
    db.saveSettings(settings);
    setHasChanges(false);
    alert("Settings Saved & Published!");
  };

  const updateSetting = (section: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  // Theme Live Preview
  useEffect(() => {
    db.applyTheme(settings);
  }, [settings.theme]);

  const TabButton = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full mb-2 ${activeTab === id ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-cosmic-950 flex text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/20 p-6 flex flex-col">
        <div className="mb-8 px-2 cursor-pointer" onClick={() => onNavigate(ViewState.LANDING)}>
          <h1 className="text-xl font-bold font-display flex items-center gap-2"><Settings className="text-primary-500" /> Admin</h1>
          <p className="text-xs text-slate-500">Super Admin Console</p>
        </div>

        <div className="flex-1">
          <TabButton id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <TabButton id="cms" icon={Type} label="Site Content" />
          <TabButton id="theme" icon={Palette} label="Appearance" />
          <TabButton id="plans" icon={CreditCard} label="Plans & Pricing" />
          <TabButton id="gateway" icon={Settings} label="Payment Gateway" />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => onNavigate(ViewState.LANDING)}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
          >
            <Home size={18} />
            <span className="font-medium">Main Site</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl hover:bg-white/5"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            className="mt-4 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse shadow-lg"
          >
            <Save size={18} /> Publish Changes
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Overview</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><Users size={24} /></div>
                  <div>
                    <div className="text-3xl font-bold">{users.length}</div>
                    <div className="text-slate-500 text-sm">Total Users</div>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400"><DollarSign size={24} /></div>
                  <div>
                    <div className="text-3xl font-bold">$12.4k</div>
                    <div className="text-slate-500 text-sm">Est. Revenue</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 mt-8">
              <h3 className="font-bold mb-4">Recent Registrations</h3>
              <table className="w-full text-left text-sm text-slate-400">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map(u => (
                    <tr key={u.id} className="border-b border-white/5">
                      <td className="py-3 text-white">{u.name}</td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3 uppercase text-xs font-bold">{u.plan}</td>
                      <td className="py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CMS */}
        {activeTab === 'cms' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Landing Page Content</h2>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-primary-500 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Hero Title</label>
                  <input
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"
                    value={settings.content.heroTitle}
                    onChange={(e) => updateSetting('content', 'heroTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Hero Subtitle</label>
                  <textarea
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white h-24"
                    value={settings.content.heroSubtitle}
                    onChange={(e) => updateSetting('content', 'heroSubtitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CTA Button Text</label>
                  <input
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"
                    value={settings.content.heroButtonText}
                    onChange={(e) => updateSetting('content', 'heroButtonText', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-primary-500 mb-4">Features Grid Title</h3>
              <div className="space-y-4">
                <input
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"
                  value={settings.content.featuresTitle}
                  onChange={(e) => updateSetting('content', 'featuresTitle', e.target.value)}
                />
                <input
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"
                  value={settings.content.featuresSubtitle}
                  onChange={(e) => updateSetting('content', 'featuresSubtitle', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* THEME */}
        {activeTab === 'theme' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Global Theme & Branding</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl">
                <label className="block text-sm font-bold mb-4">Primary Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings.theme.primaryColor}
                    onChange={(e) => updateSetting('theme', 'primaryColor', e.target.value)}
                    className="w-16 h-16 rounded-xl border-0 cursor-pointer"
                  />
                  <div>
                    <div className="text-white font-mono">{settings.theme.primaryColor}</div>
                    <div className="text-slate-500 text-sm">Used for buttons, highlights, and branding.</div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl">
                <label className="block text-sm font-bold mb-4">Secondary Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings.theme.secondaryColor}
                    onChange={(e) => updateSetting('theme', 'secondaryColor', e.target.value)}
                    className="w-16 h-16 rounded-xl border-0 cursor-pointer"
                  />
                  <div>
                    <div className="text-white font-mono">{settings.theme.secondaryColor}</div>
                    <div className="text-slate-500 text-sm">Used for gradients and accents.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Subscription Plans</h2>
              <button
                onClick={() => {
                  const newPlan = { id: `plan_${Date.now()}`, name: 'New Plan', price: 99, currency: '$', features: ['New Feature'] };
                  setSettings(prev => ({ ...prev, plans: [...prev.plans, newPlan] }));
                  setHasChanges(true);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings.plans.map((plan, index) => (
                <div key={plan.id} className="glass-panel p-6 rounded-2xl relative group">
                  <button
                    onClick={() => {
                      const newPlans = settings.plans.filter(p => p.id !== plan.id);
                      setSettings(prev => ({ ...prev, plans: newPlans }));
                      setHasChanges(true);
                    }}
                    className="absolute top-4 right-4 text-slate-500 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="space-y-4 mt-2">
                    <input
                      className="w-full bg-transparent border-b border-white/10 pb-2 text-xl font-bold text-white focus:border-primary-500 outline-none"
                      value={plan.name}
                      onChange={(e) => {
                        const updated = [...settings.plans];
                        updated[index].name = e.target.value;
                        setSettings(prev => ({ ...prev, plans: updated }));
                        setHasChanges(true);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        className="w-24 bg-black/20 rounded px-2 py-1 text-white"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...settings.plans];
                          updated[index].price = Number(e.target.value);
                          setSettings(prev => ({ ...prev, plans: updated }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 uppercase">Features (comma separated)</label>
                      <textarea
                        className="w-full bg-black/20 rounded-lg p-2 text-sm text-slate-300 mt-1 h-32"
                        value={plan.features.join(', ')}
                        onChange={(e) => {
                          const updated = [...settings.plans];
                          updated[index].features = e.target.value.split(',').map(s => s.trim());
                          setSettings(prev => ({ ...prev, plans: updated }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GATEWAY */}
        {activeTab === 'gateway' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Payment Settings</h2>

            <div className="glass-panel p-6 rounded-2xl max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <label className="text-lg font-medium">Mode</label>
                <div className="flex bg-black/20 p-1 rounded-lg">
                  {['SANDBOX', 'LIVE'].map(m => (
                    <button
                      key={m}
                      onClick={() => updateSetting('payment', 'mode', m)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${settings.payment.mode === m ? 'bg-primary-600 text-white' : 'text-slate-400'
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Active Gateway</label>
                  <select
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"
                    value={settings.payment.gateway}
                    onChange={(e) => updateSetting('payment', 'gateway', e.target.value)}
                  >
                    <option value="PAYPAL">PayPal</option>
                    <option value="STRIPE">Stripe</option>
                  </select>
                </div>

                {settings.payment.gateway === 'PAYPAL' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">PayPal Client ID ({settings.payment.mode})</label>
                    <input
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm"
                      value={settings.payment.paypalClientId}
                      onChange={(e) => updateSetting('payment', 'paypalClientId', e.target.value)}
                    />
                  </div>
                )}

                {settings.payment.gateway === 'STRIPE' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Stripe Public Key ({settings.payment.mode})</label>
                    <input
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm"
                      value={settings.payment.stripePublicKey || ''}
                      onChange={(e) => updateSetting('payment', 'stripePublicKey', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

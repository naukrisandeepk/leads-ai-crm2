import React, { useState } from 'react';
import { AppSettings, PlatformConfig } from '../types';
import { Check, Shield, Server, RefreshCw, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';

interface SettingsPanelProps {
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
  initialSettings?: AppSettings;
}

const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  enabled: false,
  appId: '',
  appSecret: '',
  accessToken: '',
  webhookToken: '',
  pageId: '',
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSave, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<keyof AppSettings>('instagram');
  const [settings, setSettings] = useState<AppSettings>({
    instagram: { ...DEFAULT_PLATFORM_CONFIG, enabled: true },
    facebook: { ...DEFAULT_PLATFORM_CONFIG },
    linkedin: { ...DEFAULT_PLATFORM_CONFIG },
    youtube: { ...DEFAULT_PLATFORM_CONFIG },
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [activePlatform]: {
        ...settings[activePlatform],
        [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
      }
    });
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      // Simulate validation
      if (settings[activePlatform].accessToken.length > 5) {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  const tabs = [
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={18} /> },
    { id: 'facebook', label: 'Facebook', icon: <Facebook size={18} /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={18} /> },
    { id: 'youtube', label: 'YouTube', icon: <Youtube size={18} /> },
  ];

  const currentConfig = settings[activePlatform];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col md:flex-row overflow-hidden max-w-5xl mx-auto h-[600px]">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-slate-800 mb-6 px-2 flex items-center gap-2">
          <Server size={20} className="text-indigo-600"/>
          Integrations
        </h2>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePlatform(tab.id as keyof AppSettings);
                setTestStatus('idle');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activePlatform === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
              {settings[tab.id as keyof AppSettings].enabled && (
                <span className="ml-auto w-2 h-2 rounded-full bg-green-500"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-2xl">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 capitalize">{activePlatform} Configuration</h3>
              <p className="text-sm text-slate-500">Manage API credentials and webhook settings.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="enabled" 
                checked={currentConfig.enabled} 
                onChange={handleConfigChange}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
              />
              <span className="text-sm font-medium text-slate-700">Enable Integration</span>
            </label>
          </div>

          <div className={`space-y-6 ${!currentConfig.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">App / Client ID</label>
                <input 
                  type="text" 
                  name="appId" 
                  value={currentConfig.appId} 
                  onChange={handleConfigChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">App Secret</label>
                <input 
                  type="password" 
                  name="appSecret" 
                  value={currentConfig.appSecret} 
                  onChange={handleConfigChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Access Token</label>
              <input 
                type="text" 
                name="accessToken" 
                value={currentConfig.accessToken} 
                onChange={handleConfigChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                placeholder="EAAB..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Webhook Verify Token</label>
                <input 
                  type="text" 
                  name="webhookToken" 
                  value={currentConfig.webhookToken} 
                  onChange={handleConfigChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="custom_token_123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {activePlatform === 'youtube' ? 'Channel ID' : 'Page / Account ID'}
                </label>
                <input 
                  type="text" 
                  name="pageId" 
                  value={currentConfig.pageId} 
                  onChange={handleConfigChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder={activePlatform === 'youtube' ? 'UC_...' : '10052...'}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield size={18} className="text-slate-500"/>
                    <span className="text-sm text-slate-600 font-medium">Connection:</span>
                    <span className={`text-sm font-bold ${
                        testStatus === 'success' ? 'text-green-600' : 
                        testStatus === 'failed' ? 'text-red-600' : 'text-slate-400'
                    }`}>
                        {testStatus === 'idle' ? 'Not Tested' : testStatus.toUpperCase()}
                    </span>
                </div>
                <button 
                    type="button" 
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing' || !currentConfig.enabled}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 disabled:opacity-50"
                >
                    {testStatus === 'testing' && <RefreshCw className="animate-spin" size={14} />}
                    Test API
                </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Check size={18} />
              Save All Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
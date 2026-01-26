// src/pages/SecurityPage.jsx
import React from 'react';
import { ShieldCheck, Lock, Fingerprint, Key, ShieldClose } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const SecurityPage = () => {
  const { user } = useAuth();

  const securityFeatures = [
    { title: 'End-to-End Encryption', icon: <Lock className="text-blue-600" />, desc: 'All sensitive data and communications are encrypted using industry-standard protocols.' },
    { title: 'Fraud Detection', icon: <ShieldCheck className="text-green-600" />, desc: 'Real-time AI monitoring to detect and prevent suspicious transactions and activities.' },
    { title: 'Secure Authentication', icon: <Fingerprint className="text-purple-600" />, desc: 'Multi-factor authentication (MFA) and secure session management for all accounts.' },
    { title: 'Data Privacy', icon: <ShieldClose className="text-red-500" />, desc: 'We never sell your data. Your personal information stays private and protected.' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 border-b py-20 text-white relative text-center">
        <ShieldCheck size={48} className="mx-auto mb-4" />
        <h1 className="text-4xl font-black mb-2">Security Center</h1>
        <p className="text-gray-300 mb-4">Your security is our top priority.</p>

        {user && (
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-200">{user.email}</p>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityFeatures.map((f, i) => (
            <div key={i} className="p-10 rounded-3xl bg-gray-50 border hover:bg-white hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 text-white rounded-3xl p-12 mt-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h3 className="text-3xl font-black mb-4">Found a potential security issue?</h3>
            <p className="opacity-90 mb-4">Report vulnerabilities to our bug bounty program. Rewards available for verified findings.</p>
            <button
              onClick={() => window.open('https://yourcompany.com/security/report', '_blank')}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold"
            >
              Report a Vulnerability
            </button>
          </div>
          <Key size={120} className="text-white/20" />
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;

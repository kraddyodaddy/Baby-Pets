
import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../services/galleryService';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAdminStats();
      setStats(res);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading stats...</div>;

  const storagePercentage = (stats.totalItems / stats.limit) * 100;
  const dailyPercentage = (stats.dailyCount / stats.dailyLimit) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Monitor</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Storage Cap */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Total Capacity (FIFO)</h3>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-4xl font-black text-brand-500">{stats.totalItems}</span>
            <span className="text-gray-400">/ {stats.limit} images</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${storagePercentage > 80 ? 'bg-red-400' : 'bg-brand-500'}`}
              style={{ width: `${Math.min(100, storagePercentage)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            {stats.remaining} spots left before auto-delete triggers (oldest 500 will be removed).
            <br/>Est. Storage: <strong>{stats.estimatedStorageMB}MB</strong> / 5,000MB free tier.
          </p>
        </div>

        {/* Daily Quota */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Community Daily Quota</h3>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-4xl font-black text-pastel-purple">{stats.dailyCount}</span>
            <span className="text-gray-400">/ {stats.dailyLimit} uploads</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className="bg-pastel-purple h-full transition-all duration-500"
              style={{ width: `${Math.min(100, dailyPercentage)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Resets daily at 12:00 AM server time. Prevents accidental Firebase Storage costs.
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-brand-50 rounded-3xl border border-brand-100">
        <h4 className="font-bold text-brand-700 mb-2">Optimization Active</h4>
        <ul className="text-sm text-brand-600 list-disc pl-5 space-y-1">
          <li>All uploads compressed to &lt; 500KB JPEG using Client-Canvas.</li>
          <li>Database cleanup performs FIFO removal of Documents + Blobs.</li>
          <li>Daily quotas tracked globally via atomic increments.</li>
        </ul>
      </div>
    </div>
  );
};

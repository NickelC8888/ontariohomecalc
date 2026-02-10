import React from 'react';

export default function AdSenseBanner({ slot, format = 'auto', responsive = true, className = '' }) {
  return (
    <div className={`flex items-center justify-center bg-slate-100 border border-slate-200 rounded-lg ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      <div className="text-slate-400 text-sm py-8">Advertisement</div>
    </div>
  );
}
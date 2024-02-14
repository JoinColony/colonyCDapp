import React from 'react';

const AgreementCardSkeleton = () => (
  <div>
    <div className="skeleton w-[4.125rem] h-[1.625rem] rounded-3xl overflow-hidden mb-4" />
    <div className="skeleton w-1/2 h-[1.6875rem] rounded overflow-hidden mb-2" />
    <div className="skeleton w-full h-[0.6875rem] rounded overflow-hidden mb-2" />
    <div className="skeleton w-full h-[0.6875rem] rounded overflow-hidden mb-2" />
    <div className="skeleton w-2/3 h-[0.6875rem] rounded mb-8 overflow-hidden" />
    <div className="h-px w-full bg-gray-200 mb-4" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="skeleton w-[1.875rem] h-[1.875rem] rounded-full overflow-hidden" />
        <div className="skeleton hidden sm:block w-[7.5rem] h-5 rounded overflow-hidden" />
      </div>
      <div className="flex items-center gap-2">
        <div className="skeleton w-[4.125rem] h-[1.625rem] rounded-3xl overflow-hidden" />
        <div className="skeleton w-[4.375rem] h-4 rounded overflow-hidden" />
      </div>
    </div>
  </div>
);

export default AgreementCardSkeleton;

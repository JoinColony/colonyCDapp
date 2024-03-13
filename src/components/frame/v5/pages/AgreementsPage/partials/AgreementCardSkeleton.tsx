import React from 'react';

const AgreementCardSkeleton = () => (
  <div>
    <div className="mb-4 h-[1.625rem] w-[4.125rem] overflow-hidden rounded-3xl skeleton" />
    <div className="mb-2 h-[1.6875rem] w-1/2 overflow-hidden rounded skeleton" />
    <div className="mb-2 h-[0.6875rem] w-full overflow-hidden rounded skeleton" />
    <div className="mb-2 h-[0.6875rem] w-full overflow-hidden rounded skeleton" />
    <div className="mb-8 h-[0.6875rem] w-2/3 overflow-hidden rounded skeleton" />
    <div className="mb-4 h-px w-full bg-gray-200" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-[1.875rem] w-[1.875rem] overflow-hidden rounded-full skeleton" />
        <div className="hidden h-5 w-[7.5rem] overflow-hidden rounded skeleton sm:block" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-[1.625rem] w-[4.125rem] overflow-hidden rounded-3xl skeleton" />
        <div className="h-4 w-[4.375rem] overflow-hidden rounded skeleton" />
      </div>
    </div>
  </div>
);

export default AgreementCardSkeleton;

import React, { type FC } from 'react';

interface Props {
  count?: number;
  maximum?: number;
}

const displayName = 'common.Extensions.UserHub.partials.CountBadge';

const CountBadge: FC<Props> = ({ count, maximum }) => {
  if (!count || count < 1) {
    return null;
  }

  let cappedCount: string | number = count;

  if (maximum && count > maximum) {
    cappedCount = `${maximum}+`;
  }

  return (
    <div className="absolute -right-1.5 -top-1 flex min-h-[11px] min-w-[11px] items-center justify-center rounded-full border border-base-white bg-blue-400">
      <p className="mx-[3px] my-[2.5px] h-1.5 min-w-[5px] text-[8px] font-medium leading-[0.8] text-base-white">
        {cappedCount}
      </p>
    </div>
  );
};

CountBadge.displayName = displayName;

export default CountBadge;

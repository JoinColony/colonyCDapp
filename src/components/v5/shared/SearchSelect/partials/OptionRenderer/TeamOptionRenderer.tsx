import clsx from 'clsx';
import React from 'react';

import { DomainColor } from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import { type TeamOptionRendererProps } from '~v5/shared/SearchSelect/types.ts';

export const renderTeamOption: TeamOptionRendererProps = (
  option,
  isLabelVisible,
  isMobile,
) => {
  const { color, label } = option;
  const labelText = formatText(label || '');
  const teamColor = getTeamColor(
    color ? getEnumValueFromKey(DomainColor, color) : undefined,
  );

  return (
    <>
      {color && !isLabelVisible && (
        <div
          className={clsx(teamColor, 'mx-auto rounded sm:mx-0', {
            'h-[1.125rem] w-[1.125rem]': !isMobile,
            'aspect-square h-auto w-7': isMobile,
          })}
        />
      )}
      {color && isLabelVisible && (
        <span className={clsx(teamColor, 'mr-2 h-3.5 w-3.5 rounded')} />
      )}
      {isLabelVisible && labelText}
    </>
  );
};

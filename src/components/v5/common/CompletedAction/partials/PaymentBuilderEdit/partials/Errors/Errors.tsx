import { WarningCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { type FieldErrors } from 'react-hook-form';

import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';
import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

interface ErrorsProps {
  errors: FieldErrors;
}

const Errors: FC<ErrorsProps> = ({ errors }) => {
  const allFlatFormErrors = useFlatFormErrors(errors);

  return (
    <div className="mt-7">
      <NotificationBanner
        status="error"
        icon={WarningCircle}
        description={
          <ul className="list-inside list-disc text-negative-400">
            {allFlatFormErrors.map(({ key, message }) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        }
      >
        {formatText({ id: 'actionSidebar.fields.error' })}
      </NotificationBanner>
    </div>
  );
};

export default Errors;

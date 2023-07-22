import React from 'react';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';

const ExpendituresPage = () => {
  const { colony } = useColonyContext();
  return (
    <div>
      Expenditures
      <div>
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_CREATE}
          values={{
            colonyAddress: colony?.colonyAddress ?? '',
          }}
        >
          Create expenditure
        </ActionButton>
      </div>
    </div>
  );
};

export default ExpendituresPage;

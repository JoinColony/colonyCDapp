import React from 'react';
import { useParams } from 'react-router-dom';

import { ExpenditureStatus, useGetExpenditureQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import NotFoundRoute from '~routes/NotFoundRoute';
import { ActionButton } from '~shared/Button';
import { Heading3 } from '~shared/Heading';
import { getExpenditureDatabaseId } from '~utils/databaseId';

const ExpenditureDetailsPage = () => {
  const { expenditureId } = useParams();

  const { colony } = useColonyContext();

  const { data } = useGetExpenditureQuery({
    variables: {
      expenditureId: getExpenditureDatabaseId(
        colony?.colonyAddress ?? '',
        Number(expenditureId),
      ),
    },
    skip: !expenditureId,
  });

  if (!colony || !data) {
    return null;
  }

  const expenditure = data.getExpenditure;
  if (!expenditure) {
    return <NotFoundRoute />;
  }

  return (
    <div>
      <Heading3>Expenditure {data.getExpenditure?.id}</Heading3>
      <div>Status: {data.getExpenditure?.status}</div>

      {expenditure.status === ExpenditureStatus.Draft && (
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_LOCK}
          values={{
            colonyAddress: colony.colonyAddress,
            nativeExpenditureId: expenditure.nativeId,
          }}
        >
          Lock expenditure
        </ActionButton>
      )}
    </div>
  );
};

export default ExpenditureDetailsPage;

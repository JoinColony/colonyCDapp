import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetExpenditureQuery } from '~gql';
import { useColonyContext } from '~hooks';
import NotFoundRoute from '~routes/NotFoundRoute';
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

  if (!data) {
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
    </div>
  );
};

export default ExpenditureDetailsPage;

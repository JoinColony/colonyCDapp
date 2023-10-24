import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ExpendituresPage from './ExpendituresPage';
import ExpenditureDetailsPage from './ExpenditureDetailsPage';
import StreamingPaymentDetailsPage from './StreamingPaymentDetailsPage';

const Expenditures = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpendituresPage />} />
      <Route path="/:expenditureId" element={<ExpenditureDetailsPage />} />
      <Route
        path="/streaming/:streamingPaymentId"
        element={<StreamingPaymentDetailsPage />}
      />
    </Routes>
  );
};

export default Expenditures;

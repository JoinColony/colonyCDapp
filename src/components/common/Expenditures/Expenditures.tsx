import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ExpenditureDetailsPage from './ExpenditureDetailsPage';
import ExpendituresPage from './ExpendituresPage';

const Expenditures = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpendituresPage />} />
      <Route path="/:expenditureId" element={<ExpenditureDetailsPage />} />
    </Routes>
  );
};

export default Expenditures;

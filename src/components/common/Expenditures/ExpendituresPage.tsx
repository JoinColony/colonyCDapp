import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ExpendituresPage from './ExpendituresPage';
import ExpenditureDetailsPage from './ExpenditureDetailsPage';

const Expenditures = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpendituresPage />} />
      <Route path="/:extensionId" element={<ExpenditureDetailsPage />} />
    </Routes>
  );
};

export default Expenditures;

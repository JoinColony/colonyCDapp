import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ExpendituresList from './ExpendituresList';

const ExpendituresPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpendituresList />} />
      <Route path="/:extensionId" element={<>Expenditure details page</>} />
    </Routes>
  );
};

export default ExpendituresPage;

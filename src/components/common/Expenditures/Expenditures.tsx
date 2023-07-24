import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ExpendituresPage from './ExpendituresPage/ExpendituresPage';

const Expenditures = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpendituresPage />} />
      <Route path="/:extensionId" element={<>Expenditure details page</>} />
    </Routes>
  );
};

export default Expenditures;

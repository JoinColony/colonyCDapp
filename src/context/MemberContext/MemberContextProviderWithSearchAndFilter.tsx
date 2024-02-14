import React, { type FC, type PropsWithChildren } from 'react';

import FilterContextProvider from '../FilterContext/FilterContextProvider.tsx';
import SearchContextProvider from '../SearchContext/SearchContextProvider.tsx';

import MemberContextProvider from './MemberContextProvider.tsx';

const MemberContextProviderWithSearchAndFilter: FC<PropsWithChildren> = ({
  children,
}) => (
  <SearchContextProvider>
    <FilterContextProvider>
      <MemberContextProvider>{children}</MemberContextProvider>
    </FilterContextProvider>
  </SearchContextProvider>
);

export default MemberContextProviderWithSearchAndFilter;

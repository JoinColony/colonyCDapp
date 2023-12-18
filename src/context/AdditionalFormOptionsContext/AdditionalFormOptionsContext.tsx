import { createContext, useContext } from 'react';

import { AdditionalFormOptionsContextValue } from './types';

const AdditionalFormOptionsContext =
  createContext<AdditionalFormOptionsContextValue>({
    setFormState: () => {
      throw new Error('This can be used only inside Form component');
    },
  });

export const useAdditionalFormOptionsContext = () =>
  useContext(AdditionalFormOptionsContext);

const AdditionalFormOptionsContextProvider =
  AdditionalFormOptionsContext.Provider;

export default AdditionalFormOptionsContextProvider;

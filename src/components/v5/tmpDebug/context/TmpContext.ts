import { createContext, useContext } from 'react';

interface TmpContextValues {
  annotation: string;
  setAnnotation: React.Dispatch<React.SetStateAction<string>>;
}

export const TmpContext = createContext<TmpContextValues>({
  annotation: '',
  setAnnotation: () => {},
});

export const useTmpContext = () => {
  const context = useContext(TmpContext);

  if (context) return context;

  throw new Error(
    'This context is only used for debug purposes and is only used on the Colony Home Page',
  );
};

import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
  useRef,
} from 'react';

import { type ActionTypes } from '~redux/actionTypes.ts';

import { ExtensionSaveSettingsContext } from './ExtensionSaveSettingsContext.ts';

export const ExtensionSaveSettingsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actionType, setActionType] = useState<ActionTypes | null>(null);
  const callbackRef = useRef<any>(null);

  const handleIsVisible = (newValue: boolean) => setIsVisible(newValue);

  const handleGetValues = async () => {
    return callbackRef.current?.getValues();
  };

  const handleSetActionType = (newActionType: ActionTypes) =>
    setActionType(newActionType);

  const resetAll = () => {
    setIsVisible(false);
    setActionType(null);
  };

  const value = useMemo(
    () => ({
      callback: callbackRef,
      isVisible,
      actionType,
      handleGetValues,
      handleIsVisible,
      handleSetActionType,
      resetAll,
    }),
    [isVisible, actionType],
  );

  return (
    <ExtensionSaveSettingsContext.Provider value={value}>
      {children}
    </ExtensionSaveSettingsContext.Provider>
  );
};

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
  const [isDisabled, setIsDisabled] = useState(false);
  const values = useRef({});
  const [actionType, setActionType] = useState<ActionTypes | null>(null);

  const handleIsVisible = (newValue: boolean) => setIsVisible(newValue);

  const handleIsDisabled = (newValue: boolean) => setIsDisabled(newValue);

  const handleSetValues = (newValues) => {
    values.current = newValues;
  };

  const handleGetValues = () => {
    return values.current;
  };

  const handleSetActionType = (newActionType: ActionTypes) =>
    setActionType(newActionType);

  const resetAll = () => {
    setIsVisible(false);
    setIsDisabled(false);
    setActionType(null);
    values.current = {};
  };

  const value = useMemo(
    () => ({
      isVisible,
      isDisabled,
      actionType,
      handleGetValues,
      handleIsVisible,
      handleIsDisabled,
      handleSetValues,
      handleSetActionType,
      resetAll,
    }),
    [isVisible, isDisabled, actionType],
  );

  return (
    <ExtensionSaveSettingsContext.Provider value={value}>
      {children}
    </ExtensionSaveSettingsContext.Provider>
  );
};

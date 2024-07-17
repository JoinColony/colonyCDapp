import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
} from 'react';

import { type ActionTypes } from '~redux/actionTypes.ts';

import { ExtensionSaveSettingsContext } from './ExtensionSaveSettingsContext.ts';

export const ExtensionSaveSettingsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [values, setValues] = useState({});
  const [actionType, setActionType] = useState<ActionTypes | null>(null);

  const handleIsVisible = (newValue: boolean) => setIsVisible(newValue);

  const handleIsDisabled = (newValue: boolean) => setIsDisabled(newValue);

  const handleSetValues = (newValues) => setValues(newValues);

  const handleSetActionType = (newActionType: ActionTypes) =>
    setActionType(newActionType);

  const resetAll = () => {
    setIsVisible(false);
    setIsDisabled(false);
    setValues({});
    setActionType(null);
  };

  const value = useMemo(
    () => ({
      isVisible,
      isDisabled,
      values,
      actionType,
      handleIsVisible,
      handleIsDisabled,
      handleSetValues,
      handleSetActionType,
      resetAll,
    }),
    [isVisible, isDisabled, values, actionType],
  );

  return (
    <ExtensionSaveSettingsContext.Provider value={value}>
      {children}
    </ExtensionSaveSettingsContext.Provider>
  );
};

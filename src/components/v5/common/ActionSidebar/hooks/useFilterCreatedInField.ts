import { Id } from '@colony/colony-js';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { DecisionMethod } from '~gql';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '../consts.ts';

/**
 * Hook to filter the created in field in the action form, based on the current value of the team field passed in
 */
const useFilterCreatedInField = (
  nameOfFieldToFilterOn: string,
  onlyAllowRoot = false,
) => {
  const { setValue, watch } = useFormContext();
  const selectedTeam = watch(nameOfFieldToFilterOn);
  const createdIn = watch(CREATED_IN_FIELD_NAME);
  const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);

  useEffect(() => {
    if (onlyAllowRoot || decisionMethod === DecisionMethod.Permissions) return;

    if (!selectedTeam && !!createdIn && createdIn !== Id.RootDomain) {
      setValue(nameOfFieldToFilterOn, createdIn);
    }
  }, [
    onlyAllowRoot,
    createdIn,
    decisionMethod,
    nameOfFieldToFilterOn,
    selectedTeam,
    setValue,
  ]);

  useEffect(() => {
    if (onlyAllowRoot || decisionMethod === DecisionMethod.Permissions) return;

    if (selectedTeam) {
      setValue(CREATED_IN_FIELD_NAME, selectedTeam);
    }
  }, [onlyAllowRoot, decisionMethod, selectedTeam, setValue]);

  const createdInFilterFn = (team: SearchSelectOption): boolean => {
    if (onlyAllowRoot) return !!team.isRoot;
    if (!selectedTeam) return true;

    return team.value === selectedTeam || !!team.isRoot;
  };

  return createdInFilterFn;
};

export default useFilterCreatedInField;

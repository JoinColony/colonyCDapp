import { Id } from '@colony/colony-js';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { DecisionMethod } from '~types/actions.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '../consts.ts';

/**
 * Hook to filter the created in field in the action form, based on the current value of the team field passed in
 */
const useFilterCreatedInField = (nameOfFieldToFilterOn: string) => {
  const { setValue, watch } = useFormContext();
  const selectedTeam = watch(nameOfFieldToFilterOn);
  const createdIn = watch(CREATED_IN_FIELD_NAME);
  const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);

  useEffect(() => {
    if (decisionMethod !== DecisionMethod.Reputation) return;

    if (!selectedTeam && !!createdIn && createdIn !== Id.RootDomain) {
      setValue(nameOfFieldToFilterOn, createdIn);
    }
  }, [
    createdIn,
    decisionMethod,
    nameOfFieldToFilterOn,
    selectedTeam,
    setValue,
  ]);

  useEffect(() => {
    if (decisionMethod !== DecisionMethod.Reputation) return;

    if (selectedTeam) {
      setValue(CREATED_IN_FIELD_NAME, selectedTeam);
    }
  }, [decisionMethod, selectedTeam, setValue]);

  const createdInFilterFn = (team: SearchSelectOption): boolean => {
    if (!selectedTeam) return true;

    return team.value === selectedTeam || !!team.isRoot;
  };

  return createdInFilterFn;
};

export default useFilterCreatedInField;

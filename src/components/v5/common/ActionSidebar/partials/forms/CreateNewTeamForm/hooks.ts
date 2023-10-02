import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import {
  MAX_ANNOTATION_LENGTH,
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants';
import { getCreateDomainDialogPayload } from '~common/Dialogs/CreateDomainDialog/helpers';
import { DomainColor } from '~gql';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const validationSchema = yup
  .object()
  .shape({
    teamName: yup
      .string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => 'Team name required'),
    domainPurpose: yup
      .string()
      .trim()
      .max(MAX_DOMAIN_PURPOSE_LENGTH)
      .notRequired(),
    domainColor: yup.string().notRequired(),
    createdIn: yup.number().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).notRequired(),
  })
  .defined();

export const useCrateNewTeam = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  useActionFormBaseHook({
    actionType: ActionTypes.ACTION_DOMAIN_CREATE,
    defaultValues: useMemo(
      () => ({
        teamName: '',
        domainPurpose: '',
        domainColor: DomainColor.LightPink,
        createdIn: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        description: '',
      }),
      [],
    ),
    getFormOptions,
    validationSchema,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload) => {
          const values = {
            domainName: payload.teamName,
            domainPurpose: payload.domainPurpose,
            domainColor: payload.domainColor,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.description,
          };

          if (colony) {
            return getCreateDomainDialogPayload(colony, values);
          }

          return null;
        }),
        withMeta({ navigate }),
      ),
      [colony, navigate],
    ),
  });
};

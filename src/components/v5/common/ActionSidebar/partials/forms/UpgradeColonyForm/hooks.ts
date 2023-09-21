import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { getUnlockTokenDialogPayload } from '~common/Dialogs/UnlockTokenDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const validationSchema = yup
  .object()
  .shape({
    createdIn: yup.number().defined(),
    decisionMethod: yup.string().defined(),
    annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export const useUpgradeColony = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  useActionFormBaseHook({
    actionType: ActionTypes.ACTION_VERSION_UPGRADE,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload) => {
          const values = {
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotationMessage: payload.annotation,
          };

          if (colony) {
            return getUnlockTokenDialogPayload(colony, values);
          }

          return null;
        }),
        withMeta({ navigate }),
      ),
      [colony, navigate],
    ),
    defaultValues: useMemo(
      () => ({
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        annotation: '',
        createdIn: Id.RootDomain.toString(),
      }),
      [],
    ),
    validationSchema,
  });
};

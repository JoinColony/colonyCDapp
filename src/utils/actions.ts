import pipe from 'lodash/fp/pipe';

import { type ActionTypes, type UniqueActionType } from '~redux/index.ts';
import { type OptionalValue } from '~types';
import { type ColonyAction } from '~types/graphql.ts';

export type ActionTransformFnType = (
  arg0: UniqueActionType<any, any, any>,
) => UniqueActionType<any, any, object>;

export { pipe };

export const mergePayload =
  (payload: object) => (action: UniqueActionType<any, any, any>) => ({
    ...action,
    payload: { ...action.payload, ...payload },
  });

export const mapPayload =
  (mapFn: (arg0: any) => any) => (action: UniqueActionType<any, any, any>) => ({
    ...action,
    payload: mapFn(action.payload),
  });

export const withKey =
  (key: string) => (action: UniqueActionType<any, any, any>) => ({
    ...action,
    meta: { ...action.meta, key },
  });

export const withId = (id: string) => (action: any) => ({
  ...action,
  meta: { ...action.meta, id },
});

export const withMeta = (meta: object) => (action: any) => ({
  ...action,
  meta: { ...action.meta, ...meta },
});

export const filterUniqueAction =
  (id: string, type?: string) =>
  (action: any): boolean =>
    action.meta &&
    action.meta.id === id &&
    (type ? action.type === type : true);

export const getFormAction = (
  action: ActionTypes,
  actionType: 'ERROR' | 'SUCCESS',
) => `${action}_${actionType}`;

export const getMotionAssociatedActionId = (
  action: OptionalValue<ColonyAction>,
) => {
  if (!action) return '';

  return (
    action.expenditure?.creatingActions?.items[0]?.transactionHash ??
    action.transactionHash
  );
};

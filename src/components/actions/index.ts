import { type ApolloClient, useApolloClient } from '@apollo/client';
import { type Colony as ColonyContract } from '@colony/sdk';
import { type Schema, type InferType } from 'yup';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type Colony } from '~types/graphql.ts';
// import { type User } from '~types/graphql.ts';

type SchemaFn = (context: BaseContext) => Schema<object>;

interface BaseContext {
  apollo: ApolloClient<object>;
  colonyContract: ColonyContract;
  colony: Colony;
  // user: User;
}

interface Context<E> extends BaseContext {
  addParams: <P extends keyof E>(
    key: P,
    value: InferType<E[P]>,
  ) => Promise<void>;
}

interface Action<S extends SchemaFn, E, P extends keyof E> {
  order: number;
  run: (
    values: InferType<ReturnType<S>>,
    params: InferType<E[P]>,
  ) => Promise<string | null>;
}

type Actions<S extends SchemaFn, K extends string, E extends Record<K, any>> = {
  [P in K]: Action<S, E, P>;
};

// FIXME: START HERE
// First create a good abstraction for the ColonyManager, maybe use the existing colony context to hook into that, then maybe we can extend the useColonyContext hook to also return the colony SDK colony as well. Something like colonyContract?

// FIXME: create a useAction hook that is then passed the action definition
// In this we easily have access to the BaseContext
//

interface ActionDefinition<
  S extends SchemaFn,
  K extends string,
  E extends Record<K, Schema<object>>,
> {
  // FIXME: better naming
  schema: S;
  txs: (context: Context<E>) => Actions<S, K, E>;
  // FIXME: better naming
  extra: E;
}

interface DefinedAction<S extends SchemaFn> {
  schema: SchemaFn;
  txs: (context: Context<object>) => Actions<S, string, Record<string, any>>;
  extra: Record<string, Schema<object>>;
}

export const createAction = <
  S extends SchemaFn,
  K extends string,
  E extends Record<K, Schema<object>>,
>(
  actionDef: ActionDefinition<S, K, E>,
) => actionDef as DefinedAction<S>;

const addParams = async () => {};

export const useAction = <S extends SchemaFn>({
  schema,
  txs,
  extra,
}: DefinedAction<S>) => {
  // FIXME: This should be the colony SDK colony
  const { colony, colonyContract } = useColonyContext();
  // FIXME: Do not give people access to the apollo client
  const apollo = useApolloClient();

  const transactions = Object.entries(
    txs({ apollo, colony, addParams, colonyContract }),
  )
    .map(([key, value]) => {
      return {
        key,
        ...value,
      };
    })
    .sort((a, b) => a.order - b.order);

  return {
    async run(values: InferType<ReturnType<S>>) {
      return 'txHash';
    },
  };
};

import { useState } from 'react';
import { string, bool, object } from 'yup';

import {
  isValidURL,
  validateCustomGnosisRPC,
} from '~common/UserProfileEdit/validation';
import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import { yupDebounce } from '~utils/yup/tests';

export const useRpcForm = () => {
  const rpcValidationSchema = object({
    decentralizedModeEnabled: bool<boolean>(),
    customRpc: string()
      .defined()
      .when('decentralizedModeEnabled', {
        is: true,
        then: string()
          .required(() => 'advancedSettings.rpc.errorEmpty')
          .url(() => 'advancedSettings.rpc.error')
          .test(
            'gnosisRpc',
            () => 'advancedSettings.rpc.errorUnable',
            yupDebounce(validateCustomGnosisRPC, 200, {
              isOptional: false,
              circuitBreaker: isValidURL,
            }),
          ),
      }),
  }).defined();

  const { user } = useAppContext();
  const { metatransactionsEnabled, customRpc, decentralizedModeEnabled } =
    user?.profile?.meta ?? {};

  const [isInputVisible, setIsInputVisible] = useState(
    !!decentralizedModeEnabled,
  );

  const [editUser] = useUpdateUserProfileMutation();

  const handleSubmit = async (values: {
    decentralizedModeEnabled: boolean;
    customRpc?: string;
  }) => {
    await editUser({
      variables: {
        input: {
          id: user?.walletAddress ?? '',
          meta: {
            metatransactionsEnabled,
            customRpc,
            ...values,
          },
        },
      },
    });
  };

  const handleDecentarlizedOnChange = (value: boolean) => {
    setIsInputVisible(value);
    handleSubmit(
      value
        ? { decentralizedModeEnabled: value }
        : {
            decentralizedModeEnabled: value,
            customRpc: '',
          },
    );
  };

  return {
    rpcValidationSchema,
    isInputVisible,
    setIsInputVisible,
    customRpc,
    handleSubmit,
    decentralizedModeEnabled,
    handleDecentarlizedOnChange,
  };
};

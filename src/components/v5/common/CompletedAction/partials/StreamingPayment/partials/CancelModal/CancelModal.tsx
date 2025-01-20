import { Prohibit } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ButtonWithLoader } from '~frame/Extensions/pages/ExtensionDetailsPage/partials/ExtensionDetailsHeader/ButtonWithLoader.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { type CancelStreamingPaymentPayload } from '~redux/types/actions/expenditures.ts';
import { Form } from '~shared/Fields/index.ts';
import { getHighestTierRoleForUser } from '~transformers';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { formatText } from '~utils/intl.ts';
import DecisionMethodSelect from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/DecisionMethodSelect/DecisionMethodSelect.tsx';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { cancelDecisionMethodItems, validationSchema } from './consts.ts';
import { type CancelModalProps } from './types.ts';
import { getCancelDecisionMethodDescriptions } from './utils.ts';

const CancelModal: FC<CancelModalProps> = ({
  isOpen,
  onClose,
  streamingPayment,
  onSuccess,
  ...rest
}) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const cancel = useAsyncFunction({
    submit: ActionTypes.STREAMING_PAYMENT_CANCEL,
    error: ActionTypes.STREAMING_PAYMENT_CANCEL_ERROR,
    success: ActionTypes.STREAMING_PAYMENT_CANCEL_SUCCESS,
  });

  const handleCancelStreamingPayment = async ({
    shouldWaive,
  }: Pick<CancelStreamingPaymentPayload, 'shouldWaive'>) => {
    try {
      if (!streamingPayment) {
        return;
      }

      const payload: CancelStreamingPaymentPayload = {
        colonyAddress: colony.colonyAddress,
        streamingPayment,
        userAddress: user?.walletAddress ?? '',
        shouldWaive,
      };

      await cancel(payload);
      onSuccess();
      onClose();
    } catch (err) {
      onClose();
    }
  };

  const colonyRoles = extractColonyRoles(colony.roles);

  return (
    <Modal isOpen={isOpen} onClose={onClose} icon={Prohibit} {...rest}>
      <h5 className="mb-2 heading-5">
        {formatText({
          id: 'cancelModal.locked.title',
        })}
      </h5>
      <p className="mb-6 text-md text-gray-600">
        {formatText(
          {
            id: 'cancelModal.locked.description',
          },
          {
            role: formatText({ id: 'role.mod' }),
          },
        )}
      </p>
      <Form
        className="flex flex-grow flex-col"
        onSubmit={() => handleCancelStreamingPayment({ shouldWaive: false })}
        validationSchema={validationSchema}
        defaultValues={{ decisionMethod: {} }}
      >
        {({ watch, formState: { isSubmitting } }) => {
          const method = watch('decisionMethod');
          const highestTierRole = getHighestTierRoleForUser(
            colonyRoles,
            user?.walletAddress || '',
          );

          const highestTierRoleMeta = highestTierRole
            ? getRole(highestTierRole)
            : undefined;

          const cancelDecisionMethodDescriptions =
            getCancelDecisionMethodDescriptions(
              highestTierRoleMeta?.name || formatText({ id: 'role.mod' }),
            );

          return (
            <>
              <div className="mb-8">
                <DecisionMethodSelect
                  options={cancelDecisionMethodItems}
                  name="decisionMethod"
                />
                {method && method.value && (
                  <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {formatText({ id: 'cancelModal.note' })}
                      </span>
                      {cancelDecisionMethodDescriptions[method.value]}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
                <Button mode="primaryOutline" isFullSize onClick={onClose}>
                  {formatText({ id: 'button.cancel' })}
                </Button>
                <ButtonWithLoader
                  mode="primarySolid"
                  isFullSize
                  type="submit"
                  loading={isSubmitting}
                >
                  {formatText({ id: 'cancelModal.confirmCancellation' })}
                </ButtonWithLoader>
              </div>
            </>
          );
        }}
      </Form>
    </Modal>
  );
};

export default CancelModal;

import { LockKey, SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { getRole } from '~constants/permissions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { ActionTypes } from '~redux';
import { type EditExpenditurePayload } from '~redux/sagas/expenditures/editExpenditure.ts';
import { type EditExpenditureMotionPayload } from '~redux/sagas/motions/expenditures/editLockedExpenditureMotion.ts';
import { Form } from '~shared/Fields/index.ts';
import { getAllUserRoles } from '~transformers';
import { DecisionMethod } from '~types/actions.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

import DecisionMethodSelect from '../PaymentBuilder/partials/DecisionMethodSelect/DecisionMethodSelect.tsx';

import {
  getEditDecisionMethodDescriptions,
  validationSchema,
} from './consts.ts';
import { useEditDecisionMethods } from './hooks.ts';

const displayName = 'v5.common.CompletedAction.partials.EditModeModal';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Change payment',
  },
  descriptionCollapsed: {
    id: `${displayName}.description`,
    defaultMessage:
      'To make changes, you will need to have Payer level or above permissions or use an available decision method.',
  },
  description1: {
    id: `${displayName}.description1`,
    defaultMessage:
      'To make changes, you will need to have Payer level or above permissions or use an available decision method.',
  },
  description2: {
    id: `${displayName}.description2`,
    defaultMessage:
      'Note: if any variable has previously been voted on, subsequent votes will require more Reputation to be in favour in order for changes to be valid.',
  },
  confirmMessage: {
    id: `${displayName}.confirmMessage`,
    defaultMessage: 'Confirm changes',
  },
  cancelMessage: {
    id: `${displayName}.cancelMessage`,
    defaultMessage: 'Cancel',
  },
});

interface EditModeModalProps extends ModalProps {
  expenditure: Expenditure;
}

interface EditModeModalContentProps {
  onClose: () => void;
}

const EditModeModalContent: FC<EditModeModalContentProps> = ({ onClose }) => {
  const [showMore, { toggle: toggleShowMore }] = useToggle();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const method = watch('decisionMethod');

  const userPermissions = getAllUserRoles(colony, user?.walletAddress);
  const userRole = getRole(userPermissions);
  const editDecisionMethodDescriptions = getEditDecisionMethodDescriptions(
    userRole.name,
  );

  const editDecisionMethodOptions = useEditDecisionMethods();

  const noDecisionMethodAvailable = editDecisionMethodOptions.every(
    ({ isDisabled }) => isDisabled,
  );

  return (
    <>
      <h4 className="mb-1.5 heading-5">{formatText(MSG.title)}</h4>
      <div className="mt-1 text-sm text-gray-600">
        {showMore ? (
          <>
            <p>{formatText(MSG.description1)}</p>
            <p className="mt-4">{formatText(MSG.description2)}</p>
          </>
        ) : (
          formatText(MSG.descriptionCollapsed)
        )}{' '}
        <button
          type="button"
          className="inline cursor-pointer text-sm text-gray-900 underline transition-colors sm:hover:text-blue-400"
          onClick={toggleShowMore}
        >
          {showMore
            ? formatText({
                id: 'actionSidebar.managePermissions.permissionsModal.description.collapse',
              })
            : formatText({
                id: 'actionSidebar.managePermissions.permissionsModal.description.expand',
              })}
        </button>
      </div>
      <div className="mb-8 mt-4">
        <DecisionMethodSelect
          options={editDecisionMethodOptions}
          name="decisionMethod"
        />
        {method && method.value && (
          <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
            <p className="text-sm text-gray-600">
              <span className="font-medium">
                {formatText({ id: 'fundingModal.note' })}
              </span>
              {editDecisionMethodDescriptions[method.value]}
            </p>
          </div>
        )}
        {noDecisionMethodAvailable && (
          <div className="mt-4 rounded-[.25rem] border border-negative-300 bg-negative-100 p-[1.125rem] text-sm font-medium text-negative-400">
            {formatText({
              id: 'fundingModal.noDecisionMethodAvailable',
            })}
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
        <Button mode="primaryOutline" isFullSize onClick={onClose}>
          {formatText(MSG.cancelMessage)}
        </Button>
        <div className="flex w-full justify-center">
          {isSubmitting ? (
            <IconButton
              className="w-full !text-md"
              rounded="s"
              text={{ id: 'button.pending' }}
              icon={
                <span className="ml-1.5 flex shrink-0">
                  <SpinnerGap className="animate-spin" size={18} />
                </span>
              }
            />
          ) : (
            <Button mode="primarySolid" isFullSize type="submit">
              {formatText(MSG.confirmMessage)}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

const EditModeModal: FC<EditModeModalProps> = ({
  isOpen,
  onClose,
  expenditure,
  ...rest
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { networkInverseFee = '0' } = useNetworkInverseFee();
  const { editValues, setIsEditMode } = useActionSidebarContext();

  const editLockedExpenditureMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE,
    error: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_ERROR,
    success: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_SUCCESS,
  });
  const editExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_EDIT,
    error: ActionTypes.EXPENDITURE_EDIT_ERROR,
    success: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
  });

  const handleEditExpenditureViaMotion = async ({ decisionMethod }) => {
    try {
      if (!expenditure) {
        return;
      }

      const motionPayload: EditExpenditureMotionPayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        networkInverseFee,
        motionDomainId: expenditure.nativeDomainId,
        payouts: editValues as ExpenditurePayoutFieldValue[],
      };
      const payload: EditExpenditurePayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        networkInverseFee,
        payouts: editValues as ExpenditurePayoutFieldValue[],
        userAddress: user?.walletAddress || '',
      };

      if (
        decisionMethod &&
        decisionMethod.value === DecisionMethod.Reputation
      ) {
        await editLockedExpenditureMotion(motionPayload);
      } else {
        await editExpenditure(payload);
      }

      onClose();
      setIsEditMode(false);
    } catch (err) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldShowHeader
      icon={LockKey}
      {...rest}
    >
      <Form
        className="flex h-full flex-col"
        onSubmit={handleEditExpenditureViaMotion}
        validationSchema={validationSchema}
        defaultValues={{ decisionMethod: {} }}
      >
        <EditModeModalContent onClose={onClose} />
      </Form>
    </Modal>
  );
};

EditModeModal.displayName = displayName;

export default EditModeModal;

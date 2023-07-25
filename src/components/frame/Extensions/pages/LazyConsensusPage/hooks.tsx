import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Extension } from '@colony/colony-js';

import { useAsyncFunction, useColonyContext, useExtensionData } from '~hooks';
import { useExtensionsBadge } from '~hooks/useExtensionsBadgeStatus';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText';
import { AccordionContent } from '~shared/Extensions/Accordion/types';
import { ActionTypes } from '~redux';
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import { mapExtensionActionPayload } from '~common/Extensions/ExtensionSetup/utils';
import {
  extensionContentSpeedOverSecurity,
  extensionContentSecurityOverSpeed,
  extensionContentTestingGovernance,
} from './consts';
import Toast from '~shared/Extensions/Toast';
import { ExtensionInitParam } from '~types';
import {
  CUSTOM,
  SECURITY_OVER_SPEED,
  SPEED_OVER_SECURITY,
  TESTING_GOVERNANCE,
} from '~redux/constants';

export const useLazyConsensusPage = (
  onOpenIndexChange: (index: number) => void,
  manualOpen: boolean,
) => {
  const { formatMessage } = useIntl();
  const { extensionId } = useParams();
  const navigate = useNavigate();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId ?? '');
  const { status, badgeMessage } = useExtensionsBadge(extensionData);
  const [extensionContentParameters, setExtensionContentParameters] =
    useState<AccordionContent[]>();
  const [openedByLastRadio, setOpenedByLastRadio] = useState(false);

  const getMaxInputValues = useMemo(
    () => extensionContentParameters?.[0].content,
    [extensionContentParameters],
  );

  const validationSchema = yup.object().shape({
    governance: yup
      .string()
      .required(formatMessage({ id: 'radio.error.governance' }))
      .typeError(formatMessage({ id: 'radio.error.governance' })),
    totalStakeFraction: yup
      .number()
      .positive('')
      .integer('')
      .required('')
      .typeError(
        formatMessage({ id: 'special.percentage.input.error.min.value' }),
      )
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(
        getMaxInputValues?.[0]?.maxValue,
        formatMessage(
          { id: 'special.percentage.input.error.max.value' },
          { maxValue: getMaxInputValues?.[0]?.maxValue },
        ),
      ),
    voterRewardFraction: yup
      .number()
      .positive('')
      .integer('')
      .required('')
      .typeError(
        formatMessage({ id: 'special.percentage.input.error.min.value' }),
      )
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(
        getMaxInputValues?.[1]?.maxValue,
        formatMessage(
          { id: 'special.percentage.input.error.max.value' },
          { maxValue: getMaxInputValues?.[1]?.maxValue },
        ),
      ),
    userMinStakeFraction: yup
      .number()
      .positive('')
      .integer('')
      .required('')
      .typeError(
        formatMessage({ id: 'special.percentage.input.error.min.value' }),
      )
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(
        getMaxInputValues?.[2]?.maxValue,
        formatMessage(
          {
            id: 'special.percentage.input.error.max.value',
          },
          { maxValue: getMaxInputValues?.[2]?.maxValue },
        ),
      ),
    maxVoteFraction: yup
      .number()
      .positive('')
      .integer('')
      .required('')
      .typeError(
        formatMessage({ id: 'special.percentage.input.error.min.value' }),
      )
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(
        getMaxInputValues?.[3]?.maxValue,
        formatMessage(
          { id: 'special.percentage.input.error.max.value' },
          { maxValue: getMaxInputValues?.[3]?.maxValue },
        ),
      ),
    stakePeriod: yup
      .number()
      .positive('')
      .required('')
      .typeError(formatMessage({ id: 'special.hour.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(
        getMaxInputValues?.[4]?.maxValue,
        formatMessage(
          { id: 'special.hour.input.error.max.value' },
          { maxValue: getMaxInputValues?.[4]?.maxValue },
        ),
      ),
    submitPeriod: yup
      .number()
      .positive('')
      .required('')
      .typeError(formatMessage({ id: 'special.hour.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(
        getMaxInputValues?.[5]?.maxValue,
        formatMessage(
          { id: 'special.hour.input.error.max.value' },
          { maxValue: getMaxInputValues?.[5]?.maxValue },
        ),
      ),
    revealPeriod: yup
      .number()
      .positive('')
      .required('')
      .typeError(formatMessage({ id: 'special.hour.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(
        getMaxInputValues?.[6]?.maxValue,
        formatMessage(
          { id: 'special.hour.input.error.max.value' },
          { maxValue: getMaxInputValues?.[6]?.maxValue },
        ),
      ),
    escalationPeriod: yup
      .number()
      .positive('')
      .required('')
      .typeError(formatMessage({ id: 'special.hour.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(
        getMaxInputValues?.[7]?.maxValue,
        formatMessage(
          { id: 'special.hour.input.error.max.value' },
          { maxValue: getMaxInputValues?.[7]?.maxValue },
        ),
      ),
  });

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const isCustomExtensionErrorExist = [
    'totalStakeFraction',
    'voterRewardFraction',
    'userMinStakeFraction',
    'maxVoteFraction',
    'stakePeriod',
    'submitPeriod',
    'revealPeriod',
    'escalationPeriod',
  ].some((item) => Object.keys(methods.formState.errors).includes(item));

  const shouldBeRadioButtonChangeToCustom = useMemo(
    () => methods.formState.isDirty && isCustomExtensionErrorExist,
    [methods.formState, isCustomExtensionErrorExist],
  );

  const extensionContent = useCallback(
    (data) => [
      {
        id: 'step-0',
        title: formatMessage({ id: 'custom.extension.parameters' }),
        content: data?.map(
          ({
            paramName,
            title,
            description,
            complementaryLabel,
            maxValue,
            validation,
            accordionItemDescription,
          }) => {
            const subTitleText = description.defaultMessage
              ? description.defaultMessage.split('\n')[0]
              : description;

            let descriptionText;

            if (description.defaultMessage) {
              descriptionText = description.defaultMessage
                .split('\n')[2]
                .replace('e.g. ', '');
            }

            return {
              id: paramName,
              textItem: (
                <ContentTypeText
                  title={title?.defaultMessage || title}
                  subTitle={subTitleText}
                />
              ),
              inputData: {
                inputType:
                  complementaryLabel === 'percent' ? 'percent' : 'hours',
                // @ts-ignore
                maxValue: validation?.tests[2].OPTIONS.params.max,
                // @ts-ignore
                minValue: validation?.tests[0].OPTIONS.params.more,
                register: methods.register,
                unregister: methods.unregister,
                watch: methods.watch,
                name: paramName,
              },
              accordionItem: [
                {
                  id: 'step-0-1',
                  header: 'Example scenario',
                  content: description?.defaultMessage
                    ? descriptionText
                    : accordionItemDescription,
                },
              ],
              maxValue: maxValue || validation?.tests[2].OPTIONS.params.max,
            };
          },
        ),
      },
    ],
    [methods.register, methods.unregister, methods.watch, formatMessage],
  );

  const updateGovernanceFormFields = useCallback(
    (data) =>
      extensionData?.initializationParams?.forEach((param) => {
        return methods.setValue(
          param.paramName,
          data.find(({ paramName }) => paramName === param.paramName)
            ?.defaultValue,
        );
      }),
    [extensionData?.initializationParams, methods],
  );

  const initialExtensionContent = useMemo(
    () => [
      {
        id: 'step-0',
        title: { id: 'custom.extension.parameters' },
        content: [
          {
            id: 'totalStakeFraction',
            textItem: (
              <ContentTypeText
                title="Required Stake"
                subTitle={`What percentage of the team’s reputation, in token terms, 
                should need to stake on each side of a motion?`}
              />
            ),
            inputData: {
              inputType: 'percent',
              name: 'totalStakeFraction',
            },
            accordionItem: [
              {
                id: 'step-0-1',
                header: 'Example scenario',
                content: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
              },
            ],
          },
          {
            id: 'voterRewardFraction',
            textItem: (
              <ContentTypeText
                title="Voter Reward"
                subTitle="In a dispute, what percentage of the losing side’s stake should be awarded to the voters?"
              />
            ),
            inputData: {
              inputType: 'percent',
              name: 'voterRewardFraction',
            },
            accordionItem: [
              {
                id: 'step-0-2',
                header: 'Example scenario',
                content: `If both the colony members who create a motion, and the colony members who raise an objection stake 50 tokens, and the Voter Reward is 20%, then the voters will share 20 tokens between them, proportional to their reputations (i.e. 20% of the combined stake of both side of the dispute). The remainder will be shared between the stakers proportional to the outcome of the vote.`,
              },
            ],
          },
          {
            id: 'userMinStakeFraction',
            textItem: (
              <ContentTypeText
                title="Minimum Stake"
                subTitle="What is the minimum percentage of the total stake that each staker should have to provide?"
              />
            ),
            inputData: {
              inputType: 'percent',
              register: methods.register,
              unregister: methods.unregister,
              watch: methods.watch,
              name: 'userMinStakeFraction',
            },
            accordionItem: [
              {
                id: 'step-0-3',
                header: 'Example scenario',
                content:
                  '10% means anybody who wishes to stake must provide at least 10% of the Required Stake.',
              },
            ],
          },
          {
            id: 'maxVoteFraction',
            textItem: (
              <ContentTypeText
                title="End Vote Threshold"
                subTitle="At what threshold of reputation having voted should the voting period to end?"
              />
            ),
            inputData: {
              inputType: 'percent',
              register: methods.register,
              unregister: methods.unregister,
              watch: methods.watch,
              name: 'maxVoteFraction',
            },
            accordionItem: [
              {
                id: 'step-0-4',
                header: 'Example scenario',
                content: `If the End Vote Threshold is 70%, then the voting period will end as soon as 70% of the reputation in a team has cast their vote. This helps votes get settled faster. If you want to ensure everyone gets to vote if they want to, set the value to 100%.`,
              },
            ],
          },
          {
            id: 'stakePeriod',
            textItem: (
              <ContentTypeText
                title="Staking Phase Duration"
                subTitle="How long do you want to allow each side of a motion to get staked?"
              />
            ),
            inputData: {
              inputType: 'percent',
              register: methods.register,
              unregister: methods.unregister,
              watch: methods.watch,
              name: 'stakePeriod',
            },
            accordionItem: [
              {
                id: 'step-0-5',
                header: 'Example scenario',
                content: `If the staking phase is 72 hours, then once a motion is created members will have 72 hours to provide the full stake required to back the motion. If the motion does not receive the full stake in 72 hours, it will fail. Once the motion has been fully staked, the staking period will reset and members will have a further 72 hours in which to “Object” by staking against the motion if they wish to take the decision to a vote. If the full stake for the objection is not staked, then the motion will automatically pass.`,
              },
            ],
          },
          {
            id: 'submitPeriod',
            textItem: (
              <ContentTypeText
                title="Voting Phase Duration"
                subTitle="How long do you want to give members to cast their votes?"
              />
            ),
            inputData: {
              inputType: 'percent',
              register: methods.register,
              unregister: methods.unregister,
              watch: methods.watch,
              name: 'submitPeriod',
            },
            accordionItem: [
              {
                id: 'step-0-6',
                header: 'Example scenario',
                content: `If the vote duration is 72 hours, then after both sides of the motion are fully staked, members with reputation in the team will have 72 hours in which to vote, unless the “End Vote Threshold” is reached, in which case the vote will end early.`,
              },
            ],
          },
          {
            id: 'revealPeriod',
            textItem: (
              <ContentTypeText
                title="Reveal Phase Duration"
                subTitle="How long do you want to give members to reveal their votes?"
              />
            ),
            inputData: {
              inputType: 'percent',
              register: methods.register,
              unregister: methods.unregister,
              watch: methods.watch,
              name: 'revealPeriod',
            },
            accordionItem: [
              {
                id: 'step-0-7',
                header: 'Example scenario',
                content: `Votes in colony are secret while the vote is ongoing, and so must be revealed once votes have been cast. If the reveal phase is 72 hours long, then members will have 72 hours to reveal their votes, otherwise their votes will not be counted and they will not receive a share of the voter reward. If all votes are revealed before the end of the reveal phase, then the reveal phase will end.`,
              },
            ],
          },
          {
            id: 'escalationPeriod',
            textItem: (
              <ContentTypeText
                title="Escalation Phase Duration"
                subTitle="How long do you wish to allow for members to escalate a dispute to a higher team?"
              />
            ),
            inputData: {
              inputType: 'percent',
              register: methods.register,
              unregister: methods.unregister,
              watch: methods.watch,
              name: 'escalationPeriod',
            },
            accordionItem: [
              {
                id: 'step-0-8',
                header: 'Example scenario',
                content: `If the escalation phase is 72 hours, once the outcome of a vote is known, if the loser feels the outcome was for any reason incorrect, then they will have 72 hours in which to escalate the dispute to a higher team in the colony by increasing the stake to meet the required stake of that higher team.`,
              },
            ],
          },
        ],
      },
    ],
    [methods.register, methods.unregister, methods.watch],
  );

  const setSelectedContentAndFormFields = useCallback(
    (governanceValue: string) => {
      let selectedContent;
      let selectedFormFields;

      if (governanceValue === SPEED_OVER_SECURITY) {
        selectedContent = extensionContentSpeedOverSecurity;
        selectedFormFields = extensionContentSpeedOverSecurity;
      } else if (governanceValue === SECURITY_OVER_SPEED) {
        selectedContent = extensionContentSecurityOverSpeed;
        selectedFormFields = extensionContentSecurityOverSpeed;
      } else if (governanceValue === TESTING_GOVERNANCE) {
        selectedContent = extensionContentTestingGovernance;
        selectedFormFields = extensionContentTestingGovernance;
      } else {
        selectedContent = extensionData?.initializationParams;
        selectedFormFields = extensionData?.initializationParams;
      }

      return [selectedContent, selectedFormFields];
    },
    [extensionData?.initializationParams],
  );

  const updateAccordionState = useCallback(
    (governanceValue: string) => {
      if (governanceValue === CUSTOM) {
        onOpenIndexChange(0); // open the accordion
        setOpenedByLastRadio(true);
      } else {
        if (openedByLastRadio && !manualOpen) {
          onOpenIndexChange(-1); // close the accordion only if it wasn't manually opened
        }
        setOpenedByLastRadio(false);
      }
    },
    [manualOpen, onOpenIndexChange, openedByLastRadio],
  );

  const onChangeGovernance = useCallback(
    (selectedOption: string) => {
      methods.setValue('governance', selectedOption);
      methods.clearErrors('governance');

      const governanceValue = methods.getValues('governance');

      const [selectedContent, selectedFormFields] =
        setSelectedContentAndFormFields(governanceValue);

      setExtensionContentParameters(
        extensionContent(selectedContent) as AccordionContent[],
      );

      updateGovernanceFormFields(selectedFormFields);
      updateAccordionState(governanceValue);
    },

    [
      extensionContent,
      methods,
      setSelectedContentAndFormFields,
      updateAccordionState,
      updateGovernanceFormFields,
    ],
  );

  useLayoutEffect(() => {
    if (shouldBeRadioButtonChangeToCustom) {
      methods.resetField('governance');
      methods.setValue('governance', 'radio-button-4');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBeRadioButtonChangeToCustom]);

  const handleFormSuccess = useCallback(() => {
    navigate(`/colony/${colony?.name}/extensions/${extensionId}`);
  }, [colony?.name, navigate, extensionId]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { governance, ...rest } = methods.watch();
  const prepareInitializationParams = Object.entries(rest).map((item) => ({
    paramName: item[0],
    defaultValue: item[1],
  }));

  const transform = pipe(
    mapPayload((payload) =>
      mapExtensionActionPayload(
        extensionId as Extension,
        payload,
        prepareInitializationParams as ExtensionInitParam[],
      ),
    ),
    mergePayload({ colonyAddress: colony?.colonyAddress, extensionData }),
  );

  const enableAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: ActionTypes.EXTENSION_ENABLE_ERROR,
    success: ActionTypes.EXTENSION_ENABLE_SUCCESS,
    transform,
  });

  const onSubmit = async (values: unknown) => {
    onOpenIndexChange?.(-1);
    try {
      methods.clearErrors();
      handleFormSuccess();
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionReEnable.toast.title.success' }}
          description={{
            id: 'extensionReEnable.toast.description.success',
          }}
        />,
      );
      await enableAsyncFunction(values);
    } catch (err) {
      toast.error(
        <Toast
          type="error"
          title="Error"
          description="Extension can't be changed"
        />,
      );
      console.error(err);
    }
  };

  return {
    extensionData,
    status,
    badgeMessage,
    initialExtensionContent,
    extensionContent: extensionContentParameters,
    onSubmit,
    handleSubmit: methods.handleSubmit,
    onChangeGovernance,
    validationSchema,
    methods,
  };
};

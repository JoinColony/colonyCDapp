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

  const isCustemExtentionErrorExist = [
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
    () => methods.formState.isDirty && isCustemExtentionErrorExist,
    [methods.formState, isCustemExtentionErrorExist],
  );

  const extensionContent = useCallback(
    (data) => [
      {
        id: 'step-0',
        title: formatMessage({ id: 'custom.extension.parameters' }),
        content: data?.map((item) => {
          return {
            id: item?.paramName,
            textItem: (
              <ContentTypeText
                title={item?.title?.defaultMessage || item?.title}
                subTitle={
                  item?.description?.defaultMessage || item?.description
                }
              />
            ),
            inputData: {
              inputType:
                item.complementaryLabel === 'percent' ? 'percent' : 'hours',
              // @ts-ignore
              maxValue: item?.validation?.tests[2].OPTIONS.params.max,
              // @ts-ignore
              minValue: item?.validation?.tests[0].OPTIONS.params.more,
              register: methods.register,
              unregister: methods.unregister,
              watch: methods.watch,
              name: item.paramName,
            },
            maxValue:
              item.maxValue || item?.validation?.tests[2].OPTIONS.params.max,
          };
        }),
      },
    ],
    [methods.register, methods.unregister, methods.watch, formatMessage],
  );

  const updateGovernanceFormFields = (data) =>
    extensionData?.initializationParams?.forEach((param) => {
      return methods.setValue(
        param.paramName,
        data.find((item) => item.paramName === param.paramName)?.defaultValue,
      );
    });

  const setSelectedContentAndFormFields = (governanceValue) => {
    let selectedContent;
    let selectedFormFields;

    if (governanceValue === 'radio-button-1') {
      selectedContent = extensionContentSpeedOverSecurity;
      selectedFormFields = extensionContentSpeedOverSecurity;
    } else if (governanceValue === 'radio-button-2') {
      selectedContent = extensionContentSecurityOverSpeed;
      selectedFormFields = extensionContentSecurityOverSpeed;
    } else if (governanceValue === 'radio-button-3') {
      selectedContent = extensionContentTestingGovernance;
      selectedFormFields = extensionContentTestingGovernance;
    } else {
      selectedContent = extensionData?.initializationParams;
      selectedFormFields = extensionData?.initializationParams;
    }

    return [selectedContent, selectedFormFields];
  };

  const updateAccordionState = (governanceValue) => {
    if (governanceValue === 'radio-button-4') {
      onOpenIndexChange(0); // open the accordion
      setOpenedByLastRadio(true);
    } else {
      if (openedByLastRadio && !manualOpen) {
        onOpenIndexChange(-1); // close the accordion only if it wasn't manually opened
      }
      setOpenedByLastRadio(false);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extensionContent, extensionData],
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

  const onSubmit = async (values) => {
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
    extensionContent: extensionContentParameters,
    onSubmit,
    handleSubmit: methods.handleSubmit,
    onChangeGovernance,
    validationSchema,
    methods,
  };
};

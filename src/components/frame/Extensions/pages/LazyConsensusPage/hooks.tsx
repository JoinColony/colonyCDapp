import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { Extension } from '@colony/colony-js/*';
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
import Toast from '~shared/Extensions/Toast/Toast';
import { ExtensionInitParam } from '~types';

export const useLazyConsensusPage = (onOpenIndexChange?: (index: number) => void, openIndex?: number) => {
  const { formatMessage } = useIntl();
  const { extensionId } = useParams();
  const navigate = useNavigate();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId ?? '');
  const { status, badgeMessage } = useExtensionsBadge(extensionData);
  const [extensionContentParameters, setExtensionContentParameters] = useState<AccordionContent[]>();

  // @TODO: fix validation
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
      .typeError(formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.percentage.input.error.max.value' })),
    voterRewardFraction: yup
      .number()
      .positive('')
      .integer('')
      .required('')
      .typeError(formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.percentage.input.error.max.value' })),
    userMinStakeFraction: yup
      .number()
      .positive('')
      .integer('')
      .required('')
      .typeError(formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.percentage.input.error.max.value' })),
    maxVoteFraction: yup
      .number()
      .positive('')
      .integer('')
      .required('')
      .typeError(formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.percentage.input.error.max.value' })),
    stakePeriod: yup
      .number()
      .positive('')
      .required('')
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.hour.input.error.max.value' }, { maxValue: 50 })),
    submitPeriod: yup
      .number()
      .positive('')
      .required('')
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.hour.input.error.max.value' }, { maxValue: 50 })),
    revealPeriod: yup
      .number()
      .positive('')
      .required('')
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.hour.input.error.max.value' }, { maxValue: 50 })),
    escalationPeriod: yup
      .number()
      .positive('')
      .required('')
      .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
      .max(50, formatMessage({ id: 'special.hour.input.error.max.value' }, { maxValue: 50 })),
    // ...Object.fromEntries(Object.keys(extensionContentSpeedOverSecurity || {}).map(key => [key, yup.number().positive('').required('required').min(1, formatMessage({ id: `special.hour.input.error.min.value` })).max(50, formatMessage({ id: 'special.hour.input.error.max.value' }, { maxValue: 50 }))])),
  });

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    getValues,
    setValue,
    resetField,
    clearErrors,
    watch,
  } = useForm({
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
  ].some((item) => Object.keys(errors).includes(item));

  const shouldBeRadioButtonChangeToCustom = useMemo(
    () => isDirty && isCustemExtentionErrorExist,
    [isDirty, isCustemExtentionErrorExist],
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
                subTitle={item?.description?.defaultMessage || item?.description}
              />
            ),
            inputData: {
              inputType: item.complementaryLabel === 'percent' ? 'percent' : 'hours',
              // @ts-ignore
              maxValue: item?.validation?.tests[0].OPTIONS.params.max,
              // @ts-ignore
              minValue: item?.validation?.tests[2].OPTIONS.params.more,
              register,
              name: item.paramName,
              errors,
            },
          };
        }),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extensionData?.initializationParams, errors],
  );

  const updateGovernanceFormFields = (data) =>
    extensionData?.initializationParams?.forEach((param) => {
      return setValue(param.paramName, data.find((item) => item.paramName === param.paramName)?.defaultValue);
    });

  const onChangeGovernance = useCallback(
    (selectedOption: string) => {
      onOpenIndexChange?.(-1);
      setValue('governance', selectedOption);

      clearErrors('governance');
      switch (getValues('governance')) {
        case 'radio-button-1':
          setExtensionContentParameters(extensionContent(extensionContentSpeedOverSecurity) as AccordionContent[]);
          updateGovernanceFormFields(extensionContentSpeedOverSecurity);
          break;
        case 'radio-button-2':
          setExtensionContentParameters(extensionContent(extensionContentSecurityOverSpeed) as AccordionContent[]);
          updateGovernanceFormFields(extensionContentSecurityOverSpeed);
          break;
        case 'radio-button-3':
          setExtensionContentParameters(extensionContent(extensionContentTestingGovernance) as AccordionContent[]);
          updateGovernanceFormFields(extensionContentTestingGovernance);
          break;
        default:
          setExtensionContentParameters(extensionContent(extensionData?.initializationParams) as AccordionContent[]);
          updateGovernanceFormFields(extensionData?.initializationParams);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extensionContent, openIndex],
  );

  useLayoutEffect(() => {
    if (shouldBeRadioButtonChangeToCustom) {
      resetField('governance');
      setValue('governance', 'radio-button-4');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBeRadioButtonChangeToCustom]);

  const handleFormSuccess = useCallback(() => {
    navigate(`/colony/${colony?.name}/extensions`);
  }, [colony?.name, navigate]);

  const { ...rest } = watch();
  const prepareInitializationParams = Object.entries(rest).map((item) => ({
    paramName: item[0],
    defaultValue: item[1],
  }));

  const transform = pipe(
    mapPayload((payload) =>
      mapExtensionActionPayload(extensionId as Extension, payload, prepareInitializationParams as ExtensionInitParam[]),
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
    handleFormSuccess();
    try {
      await enableAsyncFunction(values).then(() => {
        // return toast.success(
        //   <Toast
        //     type="success"
        //     title={{ id: 'extensionReEnable.toast.title.success' }}
        //     description={{ id: 'extensionReEnable.toast.description.success' }}
        //   />,
        // ),
      });
    } catch (err) {
      toast.error(<Toast type="error" title="Error" description="Extension can't be changed" />);
      console.error(err);
    }
  };

  return {
    extensionData,
    status,
    badgeMessage,
    extensionContent: extensionContentParameters,
    register,
    errors,
    onSubmit,
    handleSubmit,
    onChangeGovernance,
  };
};

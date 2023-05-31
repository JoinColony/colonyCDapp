import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Extension } from '@colony/colony-js/*';
import { useAsyncFunction, useColonyContext, useExtensionData } from '~hooks';
import { useExtensionsBadge } from '~hooks/useExtensionsBadgeStatus';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText';
import SpecialHourInput from '~shared/Extensions/Accordion/partials/SpecialHourInput';
import SpecialPercentageInput from '~shared/Extensions/Accordion/partials/SpecialPercentageInput';
import { AccordionContent } from '~shared/Extensions/Accordion/types';
import { ActionTypes } from '~redux';
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import { mapExtensionActionPayload } from '~common/Extensions/ExtensionSetup/utils';
import { FormRadioButton } from '~shared/Extensions/Fields/RadioList/types';
// import Toast from '~shared/Extensions/Toast/Toast';
// import { toast } from 'react-toastify';

export const useLazyConsensusPage = (onOpenIndexChange) => {
  const { formatMessage } = useIntl();
  const { extensionId } = useParams();
  const navigate = useNavigate();
  const { colony } = useColonyContext();
  const { extensionData, loading } = useExtensionData(extensionId ?? '');
  const { status, badgeMessage } = useExtensionsBadge(extensionData);

  const initializationParamsMapped = extensionData?.initializationParams?.reduce(
    (obj, item) => Object.assign(obj, { [item.paramName]: item.defaultValue }),
    {},
  );
  const customExtensions = initializationParamsMapped && { ...initializationParamsMapped };

  const validationSchema = yup.object().shape({
    radio: yup
      .string()
      .required(formatMessage({ id: 'radio.error.governance' }))
      .typeError(formatMessage({ id: 'radio.error.governance' })),
    // values: yup.object().shape({
    //   key: yup.string().required(),
    //   value: yup.number().required(),
    // })
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormRadioButton>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      radio: '',
      // extension: initializationParamsMapped && Object.assign({}, initializationParamsMapped )
    },
  });

  // const aaa = getValues("extension");

  const transform = pipe(
    mapPayload((payload) =>
      mapExtensionActionPayload(extensionId as Extension, payload, extensionData?.initializationParams),
    ),
    mergePayload({ colonyAddress: colony?.colonyAddress, extensionData }),
  );

  // const initialValues = useMemo(() => {
  //   if (!extensionData?.initializationParams) {
  //     return {};
  //   }
  //   return createExtensionSetupInitialValues(extensionData?.initializationParams);
  // }, [extensionData?.initializationParams]);

  const submit = ActionTypes.EXTENSION_ENABLE;
  const error = ActionTypes.EXTENSION_ENABLE_ERROR;
  const success = ActionTypes.EXTENSION_ENABLE_SUCCESS;

  const asyncFunction = useAsyncFunction({
    submit,
    error,
    success,
    transform,
  });

  const handleFormSuccess = useCallback(() => {
    navigate(`/colony/${colony?.name}/extensions/${extensionId}`);
    // @TODO: show toast notification
  }, [colony?.name, extensionId, navigate]);

  // const extensionValues = useMemo(() => {
  //   return {
  //     colonyAddress: colony?.colonyAddress,
  //     extensionData,
  //   };
  // }, [colony?.colonyAddress, extensionData]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        if (data.radio !== 'radio-button-4') return;
        onOpenIndexChange(0);
        await asyncFunction(customExtensions);
        handleFormSuccess();
      } catch (err) {
        console.error(err);
      }
    },
    [onOpenIndexChange, customExtensions, asyncFunction, handleFormSuccess],
  );

  const extensionContent: AccordionContent[] = [
    {
      id: 'step-0',
      title: formatMessage({ id: 'custom.extension.parameters' }),
      content: extensionData?.initializationParams?.map((item) => {
        return {
          id: item.paramName,
          textItem: <ContentTypeText title={item.title.defaultMessage} subTitle={item.description?.defaultMessage} />,
          inputItem:
            item.complementaryLabel === 'percent' ? (
              <SpecialPercentageInput
                defaultValue={item.defaultValue}
                // @ts-ignore
                maxValue={item.validation.tests[2].OPTIONS.params.max}
              />
            ) : (
              <SpecialHourInput
                defaultValue={item.defaultValue}
                // @ts-ignore
                maxValue={item.validation.tests[2].OPTIONS.params.max}
              />
            ),
        };
      }),
    },
  ];

  return {
    loading,
    extensionData,
    status,
    badgeMessage,
    extensionContent,
    register,
    errors,
    onSubmit,
    handleSubmit,
  };
};

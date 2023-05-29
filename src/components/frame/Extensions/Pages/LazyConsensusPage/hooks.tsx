import { useParams } from 'react-router-dom';
import React from 'react';
import { useIntl } from 'react-intl';
import { useExtensionData } from '~hooks';
// import { isInstalledExtensionData } from '~utils/extensions';
// import { Crumb } from '~shared/BreadCrumb';
import { useExtensionsBadge } from '~hooks/useExtensionsBadgeStatus';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText';
import SpecialHourInput from '~shared/Extensions/Accordion/partials/SpecialHourInput';
import SpecialPercentageInput from '~shared/Extensions/Accordion/partials/SpecialPercentageInput';
import { AccordionContent } from '~shared/Extensions/Accordion/types';

export const useLazyConsensusPage = () => {
  const { formatMessage } = useIntl();
  const { extensionId } = useParams();
  // const { colony } = useColonyContext();
  // const { user } = useAppContext();
  const { extensionData, loading } = useExtensionData(extensionId ?? '');
  // const { pathname } = useLocation();

  const { status, badgeMessage } = useExtensionsBadge(extensionData);

  //   const extensionUrl = `/colony/${colony.name}/extensions/${extensionId}`;
  //   const breadCrumbs: Crumb[] = [
  //     [MSG.title, `/colony/${colony.name}/extensions`],
  //     [extensionData.name, isSetupRoute ? extensionUrl : ''],
  //   ];
  //   if (isSetupRoute) {
  //     breadCrumbs.push(MSG.setup);
  //   }

  const accordionContent: AccordionContent[] = [
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
    accordionContent,
  };
};

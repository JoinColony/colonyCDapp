import React, { FC } from 'react';

import { AccordionItemProps } from '../types';
import AccordionNestedItem from './AccordionNested/AccordionNestedItem';
import SpecialPercentageInput from '~shared/Extensions/ConnectForm/partials/SpecialPercentageInput';
import SpecialHourInput from '~shared/Extensions/ConnectForm/partials/SpecialHourInput';

const displayName = 'Extensions.Accordion.partials.AccordionContent';

const AccordionContent: FC<AccordionItemProps> = ({
  content,
  onInputChange,
}) => (
  <div className="mt-6">
    {content?.map(
      ({
        id,
        textItem,
        inputData: { name, inputType, step },
        accordionItem,
      }) => {
        return (
          <div
            key={id}
            className="border-b border-gray-200 mt-6 pb-6 last:border-none last:pb-0"
          >
            <div className="flex justify-between">
              {textItem}
              <div className="ml-6 shrink-0">
                <div className="mr-[0.1875rem]">
                  {inputType === 'percent' ? (
                    <SpecialPercentageInput
                      name={name}
                      step={step}
                      onInputChange={onInputChange}
                    />
                  ) : (
                    <SpecialHourInput
                      name={name}
                      step={step}
                      onInputChange={onInputChange}
                    />
                  )}
                </div>
              </div>
            </div>
            {accordionItem && (
              <div className="mt-6">
                {accordionItem.map((item) => (
                  <AccordionNestedItem key={item.id} accordionItem={item} />
                ))}
              </div>
            )}
          </div>
        );
      },
    )}
  </div>
);

AccordionContent.displayName = displayName;

export default AccordionContent;

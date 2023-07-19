import React, { FC } from 'react';

import { AccordionItemProps } from '../types';
import AccordionNestedItem from './AccordionNested/AccordionNestedItem';
import SpecialPercentageInput from '~shared/Extensions/ConnectForm/partials/SpecialPercentageInput';
import SpecialHourInput from '~shared/Extensions/ConnectForm/partials/SpecialHourInput';

const displayName = 'Extensions.Accordion.partials.AccordionContent';

const AccordionContent: FC<AccordionItemProps> = ({ content, errors }) => (
  <div className="mt-6">
    {content?.map(({ id, textItem, inputData, accordionItem }) => (
      <div
        key={id}
        className="border-b border-gray-200 mt-6 pb-6 last:border-none last:pb-0"
      >
        <div className="flex justify-between items-center">
          {textItem}
          {inputData?.inputType && (
            <div className="ml-6">
              {inputData.inputType === 'percent' ? (
                <SpecialPercentageInput
                  name={inputData.name}
                  minValue={inputData.minValue}
                  maxValue={inputData.maxValue}
                  register={inputData.register}
                  errors={errors}
                />
              ) : (
                <SpecialHourInput
                  name={inputData.name}
                  minValue={inputData.minValue}
                  maxValue={inputData.maxValue}
                  register={inputData.register}
                  errors={errors}
                />
              )}
            </div>
          )}
        </div>
        {accordionItem && (
          <div className="mt-6">
            {accordionItem.map((item) => (
              <AccordionNestedItem key={item.id} accordionItem={item} />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

AccordionContent.displayName = displayName;

export default AccordionContent;

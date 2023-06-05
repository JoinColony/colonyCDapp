import React, { FC } from 'react';
import { AccordionItemProps } from '../types';
import AccordionContentItem from './AccordionContentItem';
import SpecialPercentageInput from './SpecialPercentageInput';
import SpecialHourInput from './SpecialHourInput';

const displayName = 'Extensions.Accordion.partials.AccordionContent';

const AccordionContent: FC<AccordionItemProps> = ({ content }) => (
  <div className="relative">
    {content?.map((item) => (
      <div key={item.id}>
        <div className="flex justify-between mt-4 items-center">
          {item.textItem && item.textItem}
          <div className="ml-6">
            {item.inputData.inputType === 'percent' ? (
              <SpecialPercentageInput
                name={item.inputData.name}
                minValue={item.inputData.minValue}
                maxValue={item.inputData.maxValue}
                register={item.inputData.register}
                errors={item.inputData.errors}
              />
            ) : (
              <SpecialHourInput
                name={item.inputData.name}
                minValue={item.inputData.minValue}
                maxValue={item.inputData.maxValue}
                register={item.inputData.register}
                errors={item.inputData.errors}
              />
            )}
          </div>
        </div>

        {item?.accordionItem &&
          item?.accordionItem.map((accordionItem) => (
            <AccordionContentItem key={accordionItem.id} accordionItem={accordionItem} />
          ))}
      </div>
    ))}
  </div>
);

AccordionContent.displayName = displayName;

export default AccordionContent;

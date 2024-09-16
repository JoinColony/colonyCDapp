import { type IconProps } from '@phosphor-icons/react';
import React, { type ComponentType, type FC } from 'react';

interface BaseTitleSectionProps {
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
}

export const BaseTitleSection: FC<BaseTitleSectionProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <section className="flex flex-col md:p-0.5">
      <div className="w-fit rounded-full border-[6px] border-gray-50 bg-gray-200 p-1">
        <Icon size={22} className="text-gray-600" />
      </div>
      <div className="mt-2.5 px-0.5 md:mt-2.5">
        <p className="text-md font-medium">{title}</p>
        <p className="mt-1.5 text-sm font-normal text-gray-600 md:mt-[5px]">
          {description}
        </p>
      </div>
    </section>
  );
};

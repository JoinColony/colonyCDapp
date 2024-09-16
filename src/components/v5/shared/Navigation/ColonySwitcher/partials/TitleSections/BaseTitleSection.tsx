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
    <section className="flex flex-col">
      <div className="w-fit rounded-full bg-gray-50 p-1.5">
        <div className="w-fit rounded-full bg-gray-200 p-[5px]">
          <Icon size={22} className="text-gray-600" />
        </div>
      </div>
      <div className="mt-[9px] md:mt-3">
        <p className="text-md font-medium">{title}</p>
        <p className="mt-1.5 text-sm font-normal text-gray-600">
          {description}
        </p>
      </div>
    </section>
  );
};

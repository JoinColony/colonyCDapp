import clsx from 'clsx';
import React, { type FC } from 'react';

import AvatarUploader from '~v5/common/AvatarUploader/index.ts';
import { Input } from '~v5/common/Fields/index.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';
import Textarea from '~v5/common/Fields/Textarea/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { type RowItemProps } from './types.ts';

const displayName = 'v5.pages.UserProfilePage.partials.RowItem';

const RowItem: FC<RowItemProps> = (props): JSX.Element => {
  const { descriptionClassName, title, description, headerProps } = props;
  const labelDescription = (
    <div className={clsx(descriptionClassName, 'flex flex-col gap-1')}>
      <span className="text-1 leading-5">{title}</span>
      {description && (
        <span className="text-gray-600 text-sm">{description}</span>
      )}
    </div>
  );

  if ('inputProps' in props) {
    const { className, inputProps } = props;

    return (
      <div className={className}>
        {labelDescription}
        <div className="w-full">{inputProps && <Input {...inputProps} />}</div>
      </div>
    );
  }

  if ('avatarUploaderProps' in props) {
    const { avatarUploaderProps } = props;

    return (
      <>
        {labelDescription}
        {avatarUploaderProps && (
          <div className="w-full">
            <AvatarUploader {...avatarUploaderProps} />
          </div>
        )}
      </>
    );
  }

  if ('textAreaProps' in props) {
    const { className, textAreaProps } = props;

    return (
      <div className={className}>
        {labelDescription}
        {textAreaProps && (
          <div className="w-full">
            <Textarea {...textAreaProps} />
          </div>
        )}
      </div>
    );
  }

  if ('title' in props && 'description' && 'buttonProps' in props) {
    const { className, buttonProps } = props;

    return (
      <div className={className}>
        {labelDescription}
        {buttonProps && <Button {...buttonProps} />}
      </div>
    );
  }

  if ('switchProps' in props) {
    const { className, switchProps } = props;
    return (
      <div className={className}>
        {labelDescription}
        {switchProps && <Switch {...switchProps} />}
      </div>
    );
  }

  if (
    'headerProps' in props ||
    'copyAddressProps' in props ||
    'buttonProps' in props
  ) {
    const { buttonProps, copyAddressProps } = props;

    return (
      <>
        {headerProps && (
          <div className="flex w-full">
            <h5 className="heading-5">{headerProps?.title}</h5>
          </div>
        )}
        {copyAddressProps && (
          <div className="flex md:flex-row flex-col items-center justify-between p-3 bg-gray-50 rounded-lg w-full">
            <div className="flex items-center mb-3 md:mb-0">
              <copyAddressProps.icon size={18} />
              <span className="text-md ml-2 truncate block w-full">
                {copyAddressProps.walletAddress}
              </span>
            </div>
            {buttonProps && <Button {...buttonProps} />}
          </div>
        )}
      </>
    );
  }

  if ('contentProps' in props) {
    const { className, contentProps } = props;
    return (
      <>
        {contentProps && (
          <div className={className}>
            {labelDescription}
            {contentProps}
          </div>
        )}
      </>
    );
  }

  return <div />;
};

RowItem.displayName = displayName;

export default RowItem;

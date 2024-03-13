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
      <span className="leading-5 text-1">{title}</span>
      {description && (
        <span className="text-sm text-gray-600">{description}</span>
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
          <div className="flex w-full flex-col items-center justify-between rounded-lg bg-gray-50 p-3 md:flex-row">
            <div className="mb-3 flex items-center md:mb-0">
              {copyAddressProps.icon ? (
                <copyAddressProps.icon size={18} />
              ) : null}
              <span className="ml-2 block w-full truncate text-md">
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

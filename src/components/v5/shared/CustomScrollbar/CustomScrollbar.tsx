import React, { FC, PropsWithChildren } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

import { useMobile } from '~hooks';
import { CustomScrollbarProps } from './types';

const displayName = 'v5.CustomScrollbar';

const CustomScrollbar: FC<PropsWithChildren<CustomScrollbarProps>> = ({
  children,
  mobileHeight,
  height,
}) => {
  const isMobile = useMobile();

  return (
    <Scrollbar
      style={{
        width: '100%',
        height: '60vh',
        maxHeight: isMobile ? mobileHeight : height,
      }}
      translateContentSizeYToHolder
      translateContentSizeXToHolder={false}
      trackYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return (
            <span
              {...restProps}
              ref={elementRef}
              className="!bg-transparent !w-[0.3125rem]"
            />
          );
        },
      }}
      contentProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div {...restProps} ref={elementRef} className="!block" />;
        },
      }}
      thumbYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return (
            <div {...restProps} ref={elementRef} className="!bg-gray-100" />
          );
        },
      }}
    >
      {children}
    </Scrollbar>
  );
};

CustomScrollbar.displayName = displayName;

export default CustomScrollbar;

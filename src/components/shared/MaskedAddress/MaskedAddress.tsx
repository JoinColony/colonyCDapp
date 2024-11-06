import clsx from 'clsx';
import React, { type RefObject, forwardRef } from 'react';

import { type Address } from '~types/index.ts';

import getMaskedAddress from './getMaskedAddress.ts';

interface Props {
  /*
   * The address to be masked by the helper util
   */
  address: Address;

  /*
   * String pattern to use when masking the address
   */
  mask?: string;

  /*
   * Custom classname
   */
  className?: string;

  /*
   * In some instances we want to show the full address
   * Ironic, no? A full "masked" address :)
   */
  full?: boolean;

  /* Testing */
  dataTest?: string;
}

/*
 * @NOTE We're forwarding the ref so we can access the child's ref from the parent
 * See: https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components
 */
const MaskedAddress = forwardRef(
  (
    { address, mask = '...', full = false, dataTest, className }: Props,
    ref: RefObject<any>,
  ) => {
    const { result, cutAddress } = getMaskedAddress({
      address,
      isFull: full,
      mask,
    });

    return (
      <span
        className={clsx('text-sm font-normal leading-none', className)}
        title={address}
        ref={ref}
        data-test={dataTest}
      >
        {cutAddress ? (
          <>
            {cutAddress.header}
            {cutAddress.start}
            {full ? <span className="mx-1">{cutAddress.middle}</span> : mask}
            {cutAddress.end}
          </>
        ) : (
          <>{result}</>
        )}
      </span>
    );
  },
);

export default MaskedAddress;

import React, { useEffect, useMemo, useState, ReactElement } from 'react';

import Popover, { PopoverChildFn } from '~shared/Popover';
import { usePrevious, useMobile } from '~hooks';

import { removeValueUnits } from '~utils/css';

import {
  TransactionOrMessageGroups,
  transactionCount,
} from './transactionGroup';

import GasStationContent from './GasStationContent';

import styles from './GasStationPopover.css';

interface Props {
  transactionAndMessageGroups: TransactionOrMessageGroups;
  children: ReactElement | PopoverChildFn;
}

const displayName = 'frame.GasStation.GasStationPopover';

const GasStationPopover = ({
  children,
  transactionAndMessageGroups,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [txNeedsSigning, setTxNeedsSigning] = useState(false);
  /*
   * @NOTE `transactionAndMessageGroups` is actually a immutable record
   * (hence the need for the .toJS() call) however, TS doesn't infer the type
   * properly, so it trows an error
   */
  // @ts-ignore
  const transactionsAndMessages = transactionAndMessageGroups.toJS();
  const txCount = useMemo(
    () => transactionCount(transactionsAndMessages),
    [transactionsAndMessages],
  );

  const prevTxCount: number | void = usePrevious(txCount);
  const isMobile = useMobile();

  useEffect(() => {
    if (prevTxCount != null && txCount > prevTxCount) {
      setOpen(true);
      setTxNeedsSigning(true);
    }
  }, [txCount, prevTxCount, setTxNeedsSigning]);

  /*
   * @NOTE Offset Calculations
   * See: https://popper.js.org/docs/v2/modifiers/offset/
   *
   * Skidding:
   * Half the width of the reference element (width) plus the horizontal offset
   * Note that all skidding, for bottom aligned elements, needs to be negative.
   *
   * Distace:
   * This is just the required offset in pixels. Since we are aligned at
   * the bottom of the screen, this will be added to the bottom of the
   * reference element.
   */
  const popoverOffset = useMemo(() => {
    return isMobile ? [0, 25] : [0, removeValueUnits(styles.verticalOffset)];
  }, [isMobile]);

  return (
    <Popover
      appearance={{ theme: 'grey' }}
      renderContent={({ close }) => (
        <GasStationContent
          transactionAndMessageGroups={transactionsAndMessages}
          autoOpenTransaction={txNeedsSigning}
          setAutoOpenTransaction={setTxNeedsSigning}
          close={close}
        />
      )}
      placement="bottom-end"
      showArrow={false}
      isOpen={isOpen}
      onClose={() => {
        setOpen(false);
        setTxNeedsSigning(false);
      }}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: popoverOffset,
            },
          },
        ],
      }}
    >
      {children}
    </Popover>
  );
};

GasStationPopover.displayName = displayName;

export default GasStationPopover;

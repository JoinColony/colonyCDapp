import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import Avatar from '~shared/Avatar';
import { DialogSection } from '~shared/Dialog';
import { filterUserSelection } from '~shared/SingleUserPicker';

import {
  extractTokenName,
  getChainNameFromSafe,
  getSelectedNFTData,
  getTxServiceBaseUrl,
} from '~utils/safes';
import { Message, NFTData } from '~types';

import { FormSafeTransaction, TransactionSectionProps } from '../../types';
import {
  AvatarXS,
  ErrorMessage as Error,
  Loading,
  RecipientPicker,
} from '../shared';

import SingleNFTPicker from './SingleNFTPicker';

import styles from './TransferNFTSection.css';

const displayName = `common.ControlSafeDialog.ControlSafeForm.TransferNFTSection`;

const MSG = defineMessages({
  selectNFT: {
    id: `${displayName}.selectNFT`,
    defaultMessage: 'Select the NFT held by the Safe',
  },
  NFTPickerPlaceholder: {
    id: `${displayName}.NFTPickerPlaceholder`,
    defaultMessage: 'Select NFT to transfer',
  },
  contract: {
    id: `${displayName}.contract`,
    defaultMessage: 'Contract',
  },
  idLabel: {
    id: `${displayName}.idLabel`,
    defaultMessage: 'Id',
  },
  nftDetails: {
    id: `${displayName}.nftDetails`,
    defaultMessage: 'NFT details',
  },
  noNftsFound: {
    id: `${displayName}.noNftsFound`,
    defaultMessage: 'No NFTs found',
  },
  nftLoading: {
    id: `${displayName}.nftLoading`,
    defaultMessage: 'Loading NFTs',
  },
  nftError: {
    id: `${displayName}.nftError`,
    defaultMessage: 'Unable to fetch NFTs. Please check your connection',
  },
});

const getFilteredNFTData = (
  nftData: NFTData[],
  transactions: FormSafeTransaction[],
  transactionIndex: number,
) =>
  nftData.filter((nft, i) => {
    const isNFTSelected = transactions.some(
      (transaction) =>
        transaction.nft?.walletAddress === nft.address &&
        transactionIndex !== i,
    );

    return !isNFTSelected;
  });

const TransferNFTSection = ({
  colony,
  disabledInput,
  transactionIndex,
}: TransactionSectionProps) => {
  const { watch, setValue } = useFormContext();
  const currentNFT = watch(`transactions.${transactionIndex}.nft`);
  const currentNFTData = watch(`transactions.${transactionIndex}.nftData`);
  const transactions: FormSafeTransaction[] = watch('transactions');
  const safe = watch('safe');
  const [savedNFTs, setSavedNFTs] = useState({});
  const [availableNFTs, setAvailableNFTs] = useState<any[]>();
  const [nftError, setNFTError] = useState<Message>('');
  const [isLoadingNFTData, setIsLoadingNFTData] = useState<boolean>(false);

  /*
   * So the form shows loading spinner immediately when entering from main menu
   * but not when clicking "back" from preview
   */
  const isFirstFetch = !availableNFTs && !nftError && !currentNFTData;

  useEffect(() => {
    const getNFTs = async (): Promise<void> => {
      setNFTError('');
      setIsLoadingNFTData(true);
      const chainName = getChainNameFromSafe(safe.profile.displayName);
      const baseUrl = getTxServiceBaseUrl(chainName);

      try {
        const response = await fetch(
          `${baseUrl}/v2/safes/${safe.walletAddress}/collectibles/`,
        );

        if (response.status === 200) {
          const data = await response.json();
          setSavedNFTs((nfts) => ({
            ...nfts,
            [safe.walletAddress]: data.results,
          }));

          setAvailableNFTs(
            getFilteredNFTData(data.results, transactions, transactionIndex),
          );
        }
      } catch (e) {
        setNFTError(MSG.nftError);
      } finally {
        setIsLoadingNFTData(false);
      }
    };

    const savedNFTData = savedNFTs[safe.walletAddress];
    if (savedNFTData) {
      setNFTError('');
      setAvailableNFTs(
        getFilteredNFTData(savedNFTData, transactions, transactionIndex),
      );
    } else {
      getNFTs();
    }
  }, [safe, savedNFTs, setSavedNFTs, transactions, transactionIndex]);

  useEffect(() => {
    if (!currentNFT && currentNFTData) {
      setValue(`transactions.${transactionIndex}.nftData`, null);
    }
  }, [currentNFT, setValue, currentNFTData, transactionIndex]);

  if (isLoadingNFTData || isFirstFetch) {
    return <Loading message={MSG.nftLoading} />;
  }

  if (nftError) {
    return <Error error={nftError} />;
  }

  if (availableNFTs?.length === 0) {
    return <Error error={MSG.noNftsFound} />;
  }

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.nftPicker}>
          <SingleNFTPicker
            appearance={{ width: 'wide' }}
            label={MSG.selectNFT}
            name={`transactions.${transactionIndex}.nft`}
            filter={filterUserSelection}
            excludeFilterValue
            renderAvatar={AvatarXS}
            data={availableNFTs || []}
            disabled={disabledInput}
            placeholder={MSG.NFTPickerPlaceholder}
            onSelected={(selectedNFT) => {
              const nftData = getSelectedNFTData(
                selectedNFT,
                availableNFTs || [],
              );
              // selectedNFT comes from availableNFTs, so getSelectedNFTData won't return undefined (it's using .find())
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setValue(`transactions.${transactionIndex}.nftData`, nftData);
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.nftDetailsContainer}>
          <div className={styles.nftImageContainer}>
            <div className={styles.nftContentValue}>
              <FormattedMessage {...MSG.nftDetails} />
            </div>
            <div className={styles.nftImage}>
              <Avatar
                avatar={currentNFTData?.imageUri || undefined}
                notSet={!currentNFTData?.imageUri}
                seed={currentNFTData?.address?.toLocaleLowerCase()}
                placeholderIcon="nft-icon"
                title="nftImage"
                size="l"
              />
            </div>
          </div>
          <div className={styles.nftDetails}>
            <div className={styles.nftLineItem}>
              <div className={styles.nftContentLabel}>
                <FormattedMessage {...MSG.contract} />
              </div>
              {currentNFTData && (
                <div className={styles.nftContractContent}>
                  <Avatar
                    avatar={currentNFTData.imageUri || undefined}
                    notSet={!currentNFTData.imageUri}
                    placeholderIcon="nft-icon"
                    title="NFT"
                    size="xs"
                    className={styles.nftContractAvatar}
                  />
                  <div className={styles.nftName}>
                    {extractTokenName(
                      currentNFTData.name || currentNFTData.tokenName,
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.nftLineItem}>
              <div className={styles.nftContentLabel}>
                <FormattedMessage {...MSG.idLabel} />
              </div>
              {currentNFTData && (
                <div className={styles.nftContentValue}>
                  {currentNFTData.id}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <RecipientPicker
          colony={colony}
          disabledInput={disabledInput}
          transactionIndex={transactionIndex}
        />
      </DialogSection>
    </>
  );
};

TransferNFTSection.displayName = displayName;

export default TransferNFTSection;

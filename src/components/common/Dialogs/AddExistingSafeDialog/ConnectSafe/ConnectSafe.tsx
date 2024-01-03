import React, { ReactNode, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  ETHEREUM_NETWORK,
  GNOSIS_AMB_BRIDGES,
  GNOSIS_NETWORK,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants';
import {
  CONNECT_SAFE_INSTRUCTIONS,
  getModuleLink,
  MODULE_ADDRESS_INSTRUCTIONS,
  SAFE_CONTROL_LEARN_MORE,
} from '~constants/externalUrls';
import Button from '~shared/Button';
import { DialogSection } from '~shared/Dialog';
import ExternalLink from '~shared/ExternalLink';
import { Input } from '~shared/Fields';
import Icon from '~shared/Icon';
import { isAddress } from '~utils/web3';

import { StatusText, AddExistingSafeProps } from '../types';

import CopyableData from './CopyableData/CopyableData';

import defaultStyles from '../AddExistingSafeDialogForm.css';
import styles from './ConnectSafe.css';

const displayName =
  'common.AddExistingSafeDialog.AddExistingSafeDialogForm.ConnectSafe';

const MSG = defineMessages({
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Step 2: Connect the Safe',
  },
  warning: {
    id: `${displayName}.warning`,
    defaultMessage: `Be sure you understand bridging before using. <a>Learn more</a>`,
  },
  instructions: {
    id: `${displayName}.instructions`,
    defaultMessage: `Giving this colony permission to control a Safe requires installing an app within your Safe. <a>Bridge Module app setup instructions</a>`,
  },
  amb: {
    id: `${displayName}.amb`,
    defaultMessage: 'AMB Contract Address',
  },
  controller: {
    id: `${displayName}.controller`,
    defaultMessage: 'Controller Contract Address',
  },
  chain: {
    id: `${displayName}.chain`,
    defaultMessage: 'Chain ID',
  },
  moduleLink: {
    id: `${displayName}.moduleLink`,
    defaultMessage: `<a>Click to go to the Safe and add the Bridge Module</a>`,
  },
  moduleSubtitle: {
    id: `${displayName}.moduleSubtitle`,
    defaultMessage: 'Add the module to the Safe',
  },
  moduleDetailsSubtitle: {
    id: `${displayName}.moduleDetailsSubtitle`,
    defaultMessage: 'Add Bridge details',
  },
  moduleAddress: {
    id: `${displayName}.moduleAddress`,
    defaultMessage: 'Module contract address',
  },
  where: {
    id: `${displayName}.where`,
    defaultMessage: 'Where to find this?',
  },
  moduleFound: {
    id: `${displayName}.moduleFound`,
    defaultMessage: 'Safe module found on {selectedChain}',
  },
  moduleLoading: {
    id: `${displayName}.moduleLoading`,
    defaultMessage: 'Loading Module details...',
  },
  beware: {
    id: `${displayName}.beware`,
    defaultMessage: 'Beware!',
  },
});

const LearnMoreLink = (chunks: ReactNode) => (
  <ExternalLink href={SAFE_CONTROL_LEARN_MORE} className={styles.learnMoreLink}>
    {chunks}
  </ExternalLink>
);

const InstructionLink = (chunks: ReactNode) => (
  <ExternalLink href={CONNECT_SAFE_INSTRUCTIONS}>{chunks}</ExternalLink>
);

const getModuleLinkValue = (moduleHref: string) => ({
  a: (chunks: ReactNode) => (
    <ExternalLink href={moduleHref}>{chunks}</ExternalLink>
  ),
});

const ConnectSafe = ({
  setStepIndex,
  colonyAddress,
  loadingModuleState,
}: Pick<
  AddExistingSafeProps,
  'colonyAddress' | 'setStepIndex' | 'loadingModuleState'
>) => {
  const {
    watch,
    formState: { isSubmitting, errors, dirtyFields },
    clearErrors,
  } = useFormContext();
  const { chainId, contractAddress, moduleContractAddress } = watch();
  const [isLoadingModule, setIsLoadingModule] = loadingModuleState;
  const { moduleContractAddress: moduleContractAddressError } = errors;
  const { moduleContractAddress: moduleContractAddressDirtied } = dirtyFields;

  useEffect(() => {
    if (isLoadingModule && moduleContractAddressError) {
      clearErrors('moduleContractAddress');
    }
  }, [isLoadingModule, moduleContractAddressError, clearErrors]);

  const selectedChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === Number(chainId),
  );

  const moduleHref = getModuleLink(
    selectedChain?.shortName.toLowerCase() ||
      ETHEREUM_NETWORK.shortName.toLowerCase(),
    contractAddress,
  );

  const getStatusText = (): StatusText | Record<string, never> => {
    const isValidAddress =
      !moduleContractAddressError &&
      moduleContractAddressDirtied &&
      isAddress(moduleContractAddress);

    if (isLoadingModule) {
      return { status: MSG.moduleLoading };
    }

    if (!isValidAddress) {
      return {};
    }

    return {
      status: MSG.moduleFound,
      statusValues: {
        selectedChain: selectedChain?.name,
      },
    };
  };

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.warning}>
          <Icon
            name="triangle-warning"
            className={styles.warningIcon}
            title={MSG.beware}
          />
          <FormattedMessage
            {...MSG.warning}
            values={{
              a: LearnMoreLink,
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <span className={defaultStyles.subtitle}>
          <FormattedMessage {...MSG.subtitle} />
        </span>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={defaultStyles.instructions}>
          <FormattedMessage
            {...MSG.instructions}
            values={{
              a: InstructionLink,
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div
          className={`${defaultStyles.instructions} ${styles.moduleLinkSection}`}
        >
          <span className={defaultStyles.subtitle}>
            <FormattedMessage {...MSG.moduleSubtitle} />
          </span>
          <FormattedMessage
            {...MSG.moduleLink}
            values={getModuleLinkValue(moduleHref)}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.info}>
          <CopyableData
            label={MSG.amb}
            text={GNOSIS_AMB_BRIDGES[chainId].foreignAMB}
          />
          <CopyableData label={MSG.controller} text={colonyAddress} />
          <CopyableData
            label={MSG.chain}
            text={GNOSIS_NETWORK.chainId.toString()}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.moduleContractAddressContainer}>
          <div
            className={`${defaultStyles.subtitle} ${styles.moduleAddressSubtitle}`}
          >
            <FormattedMessage {...MSG.moduleDetailsSubtitle} />
          </div>
          <div className={styles.moduleLabel}>
            <span>
              <FormattedMessage {...MSG.moduleAddress} />
            </span>
            <ExternalLink href={MODULE_ADDRESS_INSTRUCTIONS} text={MSG.where} />
          </div>
          <Input
            name="moduleContractAddress"
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            disabled={isSubmitting}
            onChange={(e) => {
              if (isAddress(e.target.value)) {
                setIsLoadingModule(true);
              }
            }}
            onBlur={(e) => {
              if (!moduleContractAddressDirtied && isAddress(e.target.value)) {
                setIsLoadingModule(true);
              }
            }}
            {...getStatusText()}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={() => setStepIndex((step) => step - 1)}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => setStepIndex((step) => step + 1)}
          text={{ id: 'button.continue' }}
          type="submit"
          loading={isSubmitting}
          disabled={
            !!errors.moduleContractAddress ||
            !moduleContractAddressDirtied ||
            isLoadingModule
          }
          style={{ width: defaultStyles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ConnectSafe.displayName = displayName;

export default ConnectSafe;

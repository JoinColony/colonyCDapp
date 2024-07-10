/* eslint-disable camelcase */
import React, { useContext, useState } from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { COLONY_DOCS } from '~constants/index.ts';
import {
  FeatureFlag,
  FeatureFlagsContext,
} from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import {
  type BridgeXyzDrain,
  useBridgeXyzMutationMutation,
  useBridgeXyzQueryLazyQuery,
} from '~gql';
import {
  // CREATE_COLONY_ROUTE_BASE,
  LANDING_PAGE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes/index.ts';
import { type KYCLinksMutationBody } from '~types/offramp.ts';
import { formatText } from '~utils/intl.ts';
import FourOFourMessage from '~v5/common/FourOFourMessage/index.ts';
import Button from '~v5/shared/Button/Button.tsx';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';

const displayName = 'frame.FourOFour';

const MSG = defineMessages({
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Looks like the page you’re looking for isn’t here. The link to this page may be broken or you may have bookmarked a page that’s been removed. ',
  },
  goHomeBtn: {
    id: `${displayName}.goHome`,
    defaultMessage: 'Go to app home',
  },
  docsLink: {
    id: `${displayName}.docsLink`,
    defaultMessage: 'Colony Docs',
  },
  userAccountLink: {
    id: `${displayName}.userAccountLink`,
    defaultMessage: 'User account',
  },
  createColonyLink: {
    id: `${displayName}.createColony`,
    defaultMessage: 'Create a colony',
  },
});

const FourOFour = () => {
  const [bridgeXYZMutation] = useBridgeXyzMutationMutation();
  const [bridgeXYZQuery] = useBridgeXyzQueryLazyQuery();
  const featureFlags = useContext(FeatureFlagsContext);
  const cryptoToFiatFeatureFlag = featureFlags[FeatureFlag.CRYPTO_TO_FIAT];

  const [fee, setFee] = useState<string | null>(null);
  const [liquidations, setLiquidations] = useState<any[]>([]);

  const getKYCLinks = () => {
    const body: KYCLinksMutationBody = {
      full_name: 'My Apple Pie',
      email: 'apple@pie.com',
    };

    bridgeXYZMutation({
      variables: {
        input: {
          body,
          path: 'v0/kyc_links',
        },
      },
    })
      .then((data) => {
        // eslint-disable-next-line no-console
        console.log(data);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error! ', err);
      });
  };

  const checkKYCStatus = () => {
    bridgeXYZMutation({
      variables: {
        input: {
          body: {},
          path: 'v0/kyc_links/{kycLinkID}',
        },
      },
    })
      .then((data) => {
        // eslint-disable-next-line no-console
        console.log(data);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error! ', err);
      });
  };

  const getOfframpFees = async () => {
    const feesResponse = await bridgeXYZQuery({
      variables: { input: { path: 'v0/developer/fees' } },
    });

    const transactionFee =
      feesResponse.data?.bridgeXYZQuery?.transactionFee || null;

    setFee(transactionFee);
  };

  const getLiquidations = async () => {
    const liquidationsResponse = await bridgeXYZQuery({
      variables: {
        input: {
          path: 'v0/customers/{customerID}/liquidation_addresses/{liquidationAddressID}/drains',
        },
      },
    });

    setLiquidations(
      (liquidationsResponse.data?.bridgeXYZQuery?.drains as BridgeXyzDrain[]) ||
        [],
    );
  };

  return (
    <MainLayout>
      {cryptoToFiatFeatureFlag?.isEnabled &&
        !cryptoToFiatFeatureFlag?.isLoading && (
          <div className="mx-auto flex max-w-80 flex-col gap-4 py-20">
            <Button onClick={getKYCLinks}>Get KYC links</Button>
            <Button onClick={checkKYCStatus}>Check KYC status</Button>
            <Button onClick={getOfframpFees}>Get the current fees</Button>
            <Button onClick={getLiquidations}>
              Get the liquidations history
            </Button>
            {fee !== null && <span>The fee is {fee}</span>}
            {liquidations.map((liquidation) => (
              <span>{liquidation}</span>
            ))}
          </div>
        )}
      <FourOFourMessage
        description={formatText(MSG.description)}
        links={
          <>
            <a
              href={COLONY_DOCS}
              target="_blank"
              rel="noreferrer noopener"
              className="mb-2 text-sm text-blue-400 underline"
            >
              {formatText(MSG.docsLink)}
            </a>
            <Link
              to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
              className="mb-2 text-sm text-blue-400 underline"
            >
              {formatText(MSG.userAccountLink)}
            </Link>
            {/*
          @BETA disabled for now
          <Link
            to={CREATE_COLONY_ROUTE_BASE}
            className="mb-2 text-sm text-blue-400 underline"
          >
            {formatText(MSG.createColonyLink)}
          </Link>
          */}
          </>
        }
        primaryLinkButton={
          <ButtonLink
            mode="primarySolid"
            to={LANDING_PAGE_ROUTE}
            className="flex-1"
          >
            {formatText(MSG.goHomeBtn)}
          </ButtonLink>
        }
      />
    </MainLayout>
  );
};

FourOFour.displayName = displayName;

export default FourOFour;

/* eslint-disable camelcase */
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { COLONY_DOCS } from '~constants/index.ts';
import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import { useBridgeXyzMutationMutation, useBridgeXyzQueryLazyQuery } from '~gql';
import {
  // CREATE_COLONY_ROUTE_BASE,
  LANDING_PAGE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes/index.ts';
import {
  type PutCustomerMutationBody,
  type KYCLinksMutationBody,
  type CreateExternalAccountMutationBody,
} from '~types/offramp.ts';
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

  const [fee, setFee] = useState<string | null>(null);

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

  const putCustomer = () => {
    const body: PutCustomerMutationBody = {
      address: {
        city: 'United',
        country: 'USA',
        postal_code: '123',
        state: 'New York',
        street_line_1: '123',
        street_line_2: '456',
      },
      birth_date: '2020-01-01',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      signed_agreement_id: 'asdas',
      tax_identification_number: '123',
    };

    bridgeXYZMutation({
      variables: {
        input: {
          body,
          path: 'v0/customers/{customerID}',
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

  const createExternalAccount = () => {
    const body: CreateExternalAccountMutationBody = {
      address: {
        city: 'Chicago',
        country: 'USA',
        postal_code: '90210',
        state: 'NY',
        street_line_1: '123 Murica Street',
        street_line_2: 'Georgetown',
      },
      first_name: 'Johnny',
      last_name: 'Dapp',
      account: {
        account_number: 'thisisanaccountnumber',
        routing_number: 'thisisaroutingnumber',
      },
      account_owner_name: 'Johnny Dapp',
      bank_name: 'HSBC',
      currency: 'usd',
      iban: {
        account_number: 'thisisanaccountnumber',
        bic: '1234',
        country: 'USA',
      },
      account_type: 'us',
    };

    bridgeXYZMutation({
      variables: {
        input: {
          body,
          path: 'v0/customers/{customerID}/external_accounts',
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
      variables: { input: { path: 'v0/developer/fees', body: '' } },
    });

    const transactionFee =
      feesResponse.data?.bridgeXYZQuery?.transactionFee || null;

    setFee(transactionFee);
  };

  return (
    <MainLayout>
      <div className="mx-auto flex max-w-80 flex-col gap-4 py-20">
        <Button onClick={getKYCLinks}>Get KYC links</Button>
        <Button onClick={putCustomer}>Put customer</Button>
        <Button onClick={checkKYCStatus}>Check KYC status</Button>
        <Button onClick={createExternalAccount}>Create external account</Button>
        <Button onClick={getOfframpFees}>Get the current fees</Button>
        {fee !== null && <span>The fee is {fee}</span>}
      </div>
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

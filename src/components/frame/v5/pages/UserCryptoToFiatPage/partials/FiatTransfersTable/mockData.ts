// mockData.ts

import type { Transfer } from './types';

export const mockTransfers: Transfer[] = [
  {
    id: '1',
    amount: '100.00',
    state: 'awaiting_funds',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-25T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash1',
    receipt: {
      url: 'https://receipt1.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '200.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
  {
    id: '2',
    amount: '200.00',
    state: 'in_review',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-24T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash2',
    receipt: {
      url: 'https://receipt2.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '343.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'eur',
    },
  },
  {
    id: '3',
    amount: '150.00',
    state: 'funds_received',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-23T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash3',
    receipt: {
      url: 'https://receipt3.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '200.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
  {
    id: '4',
    amount: '50.00',
    state: 'payment_submitted',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-22T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash4',
    receipt: {
      url: 'https://receipt4.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '2500.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
  {
    id: '5',
    amount: '300.00',
    state: 'payment_processed',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-21T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash5',
    receipt: {
      url: 'https://receipt5.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '1100.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
  {
    id: '6',
    amount: '500.00',
    state: 'canceled',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-20T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash6',
    receipt: {
      url: 'https://receipt6.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '700.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
  {
    id: '7',
    amount: '600.00',
    state: 'error',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-19T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash7',
    receipt: {
      url: 'https://receipt7.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '900.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
  {
    id: '8',
    amount: '700.00',
    state: 'returned',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-18T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash8',
    receipt: {
      url: 'https://receipt8.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '800.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
  {
    id: '9',
    amount: '800.00',
    state: 'refunded',
    // eslint-disable-next-line camelcase
    created_at: '2023-06-17T12:34:56Z',
    // eslint-disable-next-line camelcase
    deposit_tx_hash: '0xhash9',
    receipt: {
      url: 'https://receipt9.com',
      // eslint-disable-next-line camelcase
      outgoing_amount: '1000.00',
      // eslint-disable-next-line camelcase
      destination_currency: 'usd',
    },
  },
];

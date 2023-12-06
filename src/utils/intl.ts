import { createIntl, createIntlCache } from '@formatjs/intl';
import { MessageDescriptor } from 'react-intl';
import { ReactNode } from 'react';

import { nanoid } from 'nanoid';
import {
  AnyMessageValues,
  ComplexMessageValues,
  Message,
  SimpleMessageValues,
  UniversalMessageValues,
} from '~types';

import colonyMessages from '../i18n/en.json';
import actionMessages from '../i18n/en-actions';
import eventsMessages from '../i18n/en-events';
import systemMessages from '../i18n/en-system-messages';
import motionStatesMessages from '../i18n/en-motion-states';

// https://formatjs.io/docs/intl

const cache = createIntlCache();

/* For use outside of React components */
/**
 *
 * @param messages A messages object of the form: { id: message }
 * @param locale Specify the locale. Defaults to 'en'.
 * @returns Intl object, with helpful utils such as `formatMessage`
 */
export const intl = <T = string>(
  messages: Record<string, string> = {},
  locale = 'en',
) =>
  createIntl<T>(
    {
      messages: {
        ...colonyMessages,
        ...actionMessages,
        ...eventsMessages,
        ...systemMessages,
        ...motionStatesMessages,
        ...messages,
      },
      locale,
    },
    cache,
  );

export const isMessageDescriptor = (
  message?: Message,
): message is MessageDescriptor =>
  typeof message === 'object' &&
  ('id' in message || 'description' in message || 'defaultMessage' in message);

const { formatMessage: formatIntlMessage } = intl<ReactNode>();

const addKeyToFormattedMessage = (
  formattedMessage: ReturnType<typeof formatIntlMessage>,
) => {
  if (Array.isArray(formattedMessage)) {
    return formattedMessage.map((element) => {
      if (typeof element === 'object') {
        return {
          ...element,
          // apply key when formatting ComplexMessageValues
          key: nanoid(),
        };
      }

      return element;
    });
  }

  return formattedMessage;
};

// Overloads. Ensures return type is correctly inferred from type of messageValues.
export function formatText(
  message: Message | undefined,
  messageValues?: SimpleMessageValues,
): string;
export function formatText(
  message: Message | undefined,
  messageValues?: ComplexMessageValues,
): ReactNode;
export function formatText(
  message: Message | undefined,
  messageValues?: UniversalMessageValues,
): ReactNode;
export function formatText(
  message: Message | undefined,
  messageValues?: AnyMessageValues,
): ReactNode;
// Implementation
export function formatText(
  message: Message | undefined,
  messageValues?: UniversalMessageValues,
) {
  if (typeof message === 'undefined') {
    return undefined;
  }
  if (isMessageDescriptor(message)) {
    const formattedMessage = formatIntlMessage(message, messageValues);
    return addKeyToFormattedMessage(formattedMessage);
  }

  return message;
}

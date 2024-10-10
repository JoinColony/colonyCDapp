import { createIntl, createIntlCache } from '@formatjs/intl';
import { nanoid } from 'nanoid';
import { type ReactNode, cloneElement, isValidElement } from 'react';

import {
  type AnyMessageValues,
  type ComplexMessageValues,
  type SimpleMessageValues,
  type UniversalMessageValues,
  type Message,
  type TypedMessageDescriptor,
} from '~types/index.ts';

import actionMessages from '../i18n/en-actions.ts';
import eventsMessages from '../i18n/en-events.ts';
import motionStatesMessages from '../i18n/en-motion-states.ts';
import systemMessages from '../i18n/en-system-messages.ts';
import colonyMessages from '../i18n/en.json';

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

export const isTypedMessageDescriptor = (
  message?: Message,
): message is TypedMessageDescriptor =>
  typeof message === 'object' &&
  ('id' in message || 'description' in message || 'defaultMessage' in message);

const { formatMessage: formatIntlMessage } = intl<ReactNode>();

const addKeyToFormattedMessage = (
  formattedMessage: ReturnType<typeof formatIntlMessage>,
  key?: string,
) => {
  if (Array.isArray(formattedMessage)) {
    return formattedMessage.map((element) =>
      addKeyToFormattedMessage(element, key),
    );
  }

  if (isValidElement(formattedMessage)) {
    // apply key when formatting ComplexMessageValues
    return cloneElement(formattedMessage, { key: key ?? nanoid() });
  }

  return formattedMessage;
};

// Overloads. Ensures return type is correctly inferred from type of messageValues.
export function formatText(
  message: Message,
  messageValues?: SimpleMessageValues,
): string;
export function formatText(
  message: Message,
  messageValues?: ComplexMessageValues,
  keyForComplexMessageValues?: string,
): ReactNode;
export function formatText(
  message: Message,
  messageValues?: UniversalMessageValues,
  keyForComplexMessageValues?: string,
): ReactNode;
export function formatText(
  message: Message,
  messageValues?: AnyMessageValues,
  keyForComplexMessageValues?: string,
): ReactNode;
// Implementation
export function formatText(
  message: Message,
  messageValues?: UniversalMessageValues,
  /*
   * If you're experiencing an infinite render loop when calling this function
   * it's possibly due to the ever-changing random key that's generated.
   * Pass in a static key to avoid this.
   */
  keyForComplexMessageValues?: string,
) {
  if (isTypedMessageDescriptor(message)) {
    const formattedMessage = formatIntlMessage(message, messageValues);
    return addKeyToFormattedMessage(
      formattedMessage,
      keyForComplexMessageValues,
    );
  }

  return message;
}

/**
 * @param fieldName { id: 'name', defaultMessage: 'Name' }
 * @param validationMessage 'required'
 * @returns `{fieldName} is a required field`
 * ---
 * @param fieldName { id: 'name', defaultMessage: 'Name' }
 * @param validationMessage 'length'
 * @param length null | undefined
 * @throws `length is required when validationMessage is min, max or length`
 * ---
 * @param fieldName { id: 'name', defaultMessage: 'Name' }
 * @param validationMessage 'min'
 * @param length 3
 * @returns `{fieldName} must be at least {length} characters`
 * ---
 */
export function formErrorMessage(
  fieldName: Message,
  validationMessage: 'required' | 'invalid',
): string;
export function formErrorMessage(
  fieldName: Message,
  validationMessage: 'min' | 'max' | 'length',
  length: number,
): string;
export function formErrorMessage(
  fieldName: Message,
  validationMessage: 'required' | 'min' | 'max' | 'invalid' | 'length',
  length?: number,
) {
  if (
    (validationMessage === 'min' ||
      validationMessage === 'max' ||
      validationMessage === 'length') &&
    length === undefined
  ) {
    throw new Error(
      'length is required when validationMessage is min, max or length',
    );
  }

  return formatText(
    { id: `form.${validationMessage}` },
    {
      fieldName: formatText(fieldName),
      length,
    },
  );
}

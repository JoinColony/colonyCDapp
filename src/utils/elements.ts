import { type FormatNumeralOptions, formatNumeral } from 'cleave-zen';

interface GetInputTextWidthOptions {
  usePlaceholderAsFallback?: boolean;
  formattingOptions?: FormatNumeralOptions;
}

export const getInputTextWidth = (
  input: HTMLInputElement,
  {
    usePlaceholderAsFallback,
    formattingOptions,
  }: GetInputTextWidthOptions = {},
): number => {
  const textMeasureContainer = document.createElement('span');
  document.body.appendChild(textMeasureContainer);

  const computedStyles = [];
  const inputComputedStyles = window.getComputedStyle(input);
  for (let i = 0; i < inputComputedStyles.length; i += 1) {
    const key = inputComputedStyles[i];

    computedStyles[key] = inputComputedStyles.getPropertyValue(key);
  }

  Object.entries(computedStyles).forEach(([key, value]) => {
    if (key.startsWith('font') && key in textMeasureContainer.style) {
      textMeasureContainer.style[key] = value;
    }
  });

  if (formattingOptions) {
    textMeasureContainer.innerHTML =
      formatNumeral(input.value, formattingOptions) ||
      (usePlaceholderAsFallback ? input.placeholder : '0');
  } else {
    textMeasureContainer.innerHTML =
      (input.type === 'number' && !Number.isNaN(input.valueAsNumber)
        ? input.value.toString()
        : input.value) || (usePlaceholderAsFallback ? input.placeholder : '0');
  }

  const textWidth = textMeasureContainer.getBoundingClientRect().width + 2;

  textMeasureContainer.remove();

  return textWidth;
};

export const stripHTMLFromText = (text: string): string => {
  const tempDiv = document.createElement('div');

  tempDiv.innerHTML = text;

  return tempDiv.textContent || tempDiv.innerText || '';
};

export const getElementWithSelector = (selector: string): HTMLElement | null =>
  document.querySelector(selector);

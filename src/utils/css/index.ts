import { capitalizeFirstLetter } from '../strings.ts';

/**
 * This function maps an appearance object onto CSS modules classes
 * The theme replaces the main class, the others will be treated as modifiers for the main class.
 * Example:
 *
 * appearance={{ theme: 'foo', colorSchema: 'dark', direction: 'horizontal' }}
 * yields
 * Component_themeFoo_xxx Component_colorSchemaDark_xxx Component_directionHorizontal_xxx
 *
 * appearance={{ colorSchema: 'dark', direction: 'horizontal' }}
 * yields
 * Component_main_xxx Component_colorSchemaDark_xxx Component_directionHorizontal_xxx
 *
 * @method getMainClasses
 *
 * @param {object} appearance Appearance object
 * @param {styleObject} CSS modules styles object
 * @param {state} State styles object
 *
 * @return {string} The composed class names string
 */
export const getMainClasses = (
  { theme, ...modifiers }: any = {},
  /** @NOTE This is temporary typing until a proper type for CSS modules imports can be figured out */
  styleObject: any = {},
  state: { [k: string]: boolean } = {},
) => {
  const styles = [
    styleObject[theme ? `theme${capitalizeFirstLetter(theme)}` : 'main'],
  ];
  const modifierClasses = Object.keys(modifiers)
    .map((key) => styleObject[`${key}${capitalizeFirstLetter(modifiers[key])}`])
    .filter(Boolean);
  const stateClasses = Object.keys(state)
    .map((key) =>
      state[key] ? styleObject[`state${capitalizeFirstLetter(key)}`] : '',
    )
    .filter(Boolean);
  return [...styles, ...modifierClasses, ...stateClasses].join(' ');
};

export const removeValueUnits = (valueWithUnit: string): number => {
  /*
   * Taken from MDN: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
   */
  const measurementUnits = [
    'cm',
    'mm',
    'Q',
    'in',
    'pc',
    'pt',
    'px',
    'em',
    'ex',
    'ch',
    'rem',
    'lh',
    'vw',
    'vh',
    'vmin',
    'vmax',
    /*
     * Percent char is escaped for sanity
     */

    '%',
  ];
  return parseInt(
    valueWithUnit.replace(
      new RegExp(`(${measurementUnits.join('|')})$`, 'g'),
      '',
    ),
    10,
  );
};

/**
 * This function is intended for use when tailwind classes are being assigned to a variable.
 * It works in conjunction with prettier-plugin-tailwindcss to automatically sort the classes
 * in template literal strings tagged with 'tw'.
 *
 * Example:
 * tw`p-4 bg-white` will automatically sort when the file is saved to: 'bg-white p-4'.
 *
 * @method tw
 *
 * @param {Array<string>} strings Array of strings from the template literal
 * @param {...any} values Values to be interpolated into the template literal
 *
 * @return {string} The composed class names string with classes sorted
 */
export const tw = (strings, ...values) =>
  String.raw({ raw: strings }, ...values);

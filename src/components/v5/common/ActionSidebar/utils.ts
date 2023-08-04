export const translateAction = (action: string) => {
  // Change action name to match this actions.simplePayment, first word have to be lowerCase, second and go on words are capitalized

  const actionName = action
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  return `actions.${actionName}`;
};

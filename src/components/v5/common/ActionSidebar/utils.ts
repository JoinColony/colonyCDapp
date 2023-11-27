export const translateAction = (action: string) => {
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

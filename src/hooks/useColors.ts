import { DomainColor } from '~gql';

const useColors = () => {
  const colors = Object.values(DomainColor).map((color) => {
    return {
      label: color,
      value: color,
      color,
      isDisabled: false,
    };
  });

  return {
    options: colors || [],
    key: 'colors',
    title: { id: 'actions.colors' },
    isAccordion: false,
  };
};

export default useColors;

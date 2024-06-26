exports.handler = async (event) => {
  const all = event.arguments?.input || {};

  console.log(all);

  return 'Yay';
};

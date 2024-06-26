const { kycLinksHandler } = require('./handlers/kycLinks');

exports.handler = async (event) => {
  const { path } = event.arguments?.input || {};

  const handlers = {
    'v0/kyc_links': kycLinksHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handler = handlers[path] || handlers.default;

  return handler(event);
};

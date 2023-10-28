const { default: fetch, Request } = require('node-fetch');

const graphqlRequest = async (queryOrMutation, variables, url, authKey) => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  const request = new Request(url, options);

  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    return body;
  } catch (error) {
    /*
     * Something went wrong... obviously
     */
    console.error(error);
    return null;
  }
};

/* Taken from generated.ts make sure this is up to date when
 * adding new notification types */
let NotificationType;
(function (NotificationType) {
  /** User is assigned a task in a Colony */
  NotificationType['Assignment'] = 'Assignment';
  /** Notification does not fit defined types */
  NotificationType['Custom'] = 'Custom';
  /** User has been mentioned */
  NotificationType['Mention'] = 'Mention';
  /** Colony Action ready for further interaction */
  NotificationType['Ready'] = 'Ready';
})(NotificationType || (NotificationType = {}));

const removeInterpolationMarkers = (message) => {
  return message.replace(/[\[\]]/g, '');
};

module.exports = {
  graphqlRequest,
  NotificationType,
  removeInterpolationMarkers,
};

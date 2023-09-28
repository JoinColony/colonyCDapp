const { default: fetch, Request } = require('node-fetch');

// https://support.perspectiveapi.com/s/?language=en_US
// Perspective is an API that makes it easier to host better conversations.
// The API uses machine learning models to score the perceived impact a comment might have on a conversation.
// Developers and publishers can use this score to give feedback to commenters,
// help moderators more easily review comments, or allow readers to more easily find interesting or productive comments, and more.
async function perspectiveFilter(content, apiKey) {
  if (!apiKey) {
    return;
  }

  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`;

  const data = {
    comment: { text: content },
    languages: ['en'],
    requestedAttributes: { TOXICITY: {} },
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  const request = new Request(url, options);
  const response = await fetch(request);

  if (response.ok) {
    // NOTE: how do we use this score?
    const result = await response.json();

    console.log('Perspective response:', JSON.stringify(result));
  } else {
    throw new Error(`Something went wrong: ${response.statusText}`);
  }
}

/*
 * Akismet is a spam filter protection service. It returns a boolean value indicating whether
 * the text has be classed as Spam or not.
 * https://akismet.com/
 */
async function akismetFilter(actionId, comment_content, user_ip, user_agent, apiKey) {
  if (!apiKey) {
    return;
  }

  const url = `https://rest.akismet.com/1.1/comment-check`;
  const headers = {
    'User-Agent': 'WordPress/4.4.1 | Akismet/3.1.7',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const homePage = 'https://xdai.colony.io';

  const data = {
    blog: homePage,
    user_ip,
    user_agent,
    permalink: `${homePage}/colony/a/tx/${actionId}`,
    comment_type: 'comment',
    comment_content,
    // Remove in production
    is_test: true,
  };

  // Create URL encoded data
  let urlEncodedData = `api_key=${encodeURIComponent(apiKey)}`;
  for (const key in data) {
    urlEncodedData += `&${key}=${encodeURIComponent(data[key])}`;
  }

  const options = {
    method: 'POST',
    headers: headers,
    body: urlEncodedData,
  };

  const request = new Request(url, options);
  const response = await fetch(request);

  if (response.ok) {
    // NOTE: this returns a boolean value of yay or nay (needs more testing)
    const result = await response.json();

    console.log('Akismet response:', JSON.stringify(result));
  } else {
    throw new Error(`Something went wrong: ${response.statusText}`);
  }
}

module.exports = {
  perspectiveFilter,
  akismetFilter,
};

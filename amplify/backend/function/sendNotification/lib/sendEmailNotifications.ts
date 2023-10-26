import Mailjet from 'node-mailjet';

import { notNull, graphqlRequest } from '../../utils';

import {
  GetColonyContributors_SnDocument,
  GetColonyContributors_SnQuery,
  GetColonyContributors_SnQueryVariables,
  Params,
} from './types';

export const sendEmail = async (params: Params) => {
  const mailjet = new Mailjet({
    apiKey: params.mailJetApiKey,
    apiSecret: params.mailJetApiSecret,
  });

  if (params.userEmail) {
    await sendUserEmail({ ...params, mailjet });
  } else {
    await sendColonyEmail({ ...params, mailjet });
  }
};

const sendUserEmail = async (params: Params & { mailjet: Mailjet }) => {
  const { mailjet, userEmail, userName, title, userId } = params;

  try {
    const response = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        constructMessage({
          recipientEmail: userEmail,
          recipientName: userName || userId,
          subject: title,
          plainText: `Dear ${
            userName || userId
          }, welcome to Mailjet! May the colony ${title} be with you!`,
          html: `<h3>Dear ${
            userName || userId
          }, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the colony ${title} force be with you!`,
        }),
      ],
    });
    console.log(response.body);
  } catch (err) {
    console.error(err);
  }
};

const sendColonyEmail = async (params: Params & { mailjet: Mailjet }) => {
  const { mailjet, colonyId, title, graphqlURL, apiKey } = params;

  const contributorQuery = await graphqlRequest<
    GetColonyContributors_SnQuery,
    GetColonyContributors_SnQueryVariables
  >(
    GetColonyContributors_SnDocument,
    { colonyAddress: colonyId || '' },
    graphqlURL,
    apiKey,
  );

  if (contributorQuery.errors || !contributorQuery.data) {
    const [error] = contributorQuery.errors;
    throw new Error(error || 'Could not fetch member data from DynamoDB');
  }

  const contributors =
    contributorQuery?.data?.getContributorsByColony?.items.filter(notNull) ||
    [];

  const promiseArray = contributors
    .filter(
      (contributor) =>
        contributor.notificationSettings?.enableEmail &&
        contributor.user?.profile?.email,
    )
    .map((contributor) => {
      return mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          constructMessage({
            recipientEmail: contributor.user?.profile?.email,
            recipientName:
              contributor.user?.profile?.displayName ||
              contributor.user?.profile?.id,
            subject: title,
            plainText: `This is a colony wide notification for ${title}!`,
            html: `<h3>This is a colony wide notification for ${title}</h3>`,
          }),
        ],
      });
    });

  try {
    const responses = await Promise.all(promiseArray);
    responses.forEach((response) => console.log(response.body));
  } catch (err) {
    console.error(err);
  }
};

const constructMessage = ({
  recipientEmail,
  recipientName,
  subject,
  plainText,
  html,
}) => ({
  From: {
    Email: 'hello@colony.io',
    Name: 'Colony Notifications',
  },
  To: [
    {
      Email: recipientEmail,
      Name: recipientName,
    },
  ],
  Subject: subject,
  TextPart: plainText,
  HTMLPart: html,
});

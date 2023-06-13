import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Domain } from '~types';

import styles from './ActionsListItemMeta.css';

const displayName = 'common.ColonyActions.ActionsListItemMeta';

const MSG = defineMessages({
  domain: {
    id: `${displayName}.domain`,
    defaultMessage: 'Team {domainId}',
  },
  // titleCommentCount: {
  //   id: `${displayName}.titleCommentCount`,
  //   defaultMessage: `{formattedCommentCount} {commentCount, plural,
  //       one {comment}
  //       other {comments}
  //     }`,
  // },
});

const getDomainName = (fromDomain: Domain) =>
  fromDomain.metadata?.name ?? (
    <FormattedMessage {...MSG.domain} values={{ domainId: fromDomain.id }} />
  );

// interface CommentCountProps {
//   commentCount: number;
// }

// const CommentCount = ({ commentCount }: CommentCountProps) => {
//   const commentCountTitle = formatText(MSG.titleCommentCount, {
//     commentCount,
//     formattedCommentCount: commentCount.toString(),
//   });

//   return (
//     <span className={styles.commentCount}>
//       <Icon
//         appearance={{ size: 'extraTiny' }}
//         className={styles.commentCountIcon}
//         name="comment"
//         title={commentCountTitle}
//       />
//       <Numeral value={commentCount} title={commentCountTitle} />
//     </span>
//   );
// };

interface ActionsListItemMetaProps {
  // commentCount: number;
  fromDomain?: Domain;
}

const ActionsListItemMeta = ({
  // commentCount,
  fromDomain,
}: ActionsListItemMetaProps) => {
  return (
    <div>
      {fromDomain && (
        <span className={styles.domain}>{getDomainName(fromDomain)}</span>
      )}
      {/* {!!commentCount && <CommentCount commentCount={commentCount} />} */}
    </div>
  );
};

ActionsListItemMeta.displayName = displayName;

export default ActionsListItemMeta;

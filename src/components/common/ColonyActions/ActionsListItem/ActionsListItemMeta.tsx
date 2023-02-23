import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext } from '~hooks';
import { findDomainByNativeId } from '~utils/domains';
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
  fromDomain.name ? (
    fromDomain.name
  ) : (
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
  fromDomainId?: number;
}

const ActionsListItemMeta = ({
  // commentCount,
  fromDomainId,
}: ActionsListItemMetaProps) => {
  const { colony } = useColonyContext();
  const fromDomain = findDomainByNativeId(fromDomainId, colony);
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

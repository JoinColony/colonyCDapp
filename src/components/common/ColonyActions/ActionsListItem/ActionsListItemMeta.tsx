import React from 'react';

import styles from './ActionsListItemMeta.css';

const displayName = 'common.ColonyActions.ActionsListItemMeta';

// const MSG = defineMessages({

// titleCommentCount: {
//   id: `${displayName}.titleCommentCount`,
//   defaultMessage: `{formattedCommentCount} {commentCount, plural,
//       one {comment}
//       other {comments}
//     }`,
// },
// });

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
  domainName: string;
}

const ActionsListItemMeta = ({
  // commentCount,
  domainName,
}: ActionsListItemMetaProps) => {
  return (
    <div>
      <span className={styles.domain}>{domainName}</span>
      {/* {!!commentCount && <CommentCount commentCount={commentCount} />} */}
    </div>
  );
};

ActionsListItemMeta.displayName = displayName;

export default ActionsListItemMeta;

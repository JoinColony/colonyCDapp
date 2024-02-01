import { Id } from '@colony/colony-js';
import { pipe } from 'lodash/fp';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { mapPayload, withMeta } from '~utils/actions.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';

export const TmpRemoveVerifiedMembers = () => {
  const {
    colony: { colonyAddress, name },
  } = useColonyContext();
  const navigate = useNavigate();
  const [members, setMembers] = useState('');

  const unverifyMembers = useAsyncFunction({
    submit: ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS,
    error: ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS_ERROR,
    success: ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS_SUCCESS,
    transform: pipe(
      mapPayload((payload) => {
        return payload;
      }),
      withMeta({
        setTxHash: (txHash: string) => {
          navigate(setQueryParamOnUrl(window.location.pathname, 'tx', txHash), {
            replace: true,
          });
        },
      }),
    ),
  });

  const handleSubmit = () => {
    unverifyMembers({
      colonyAddress,
      colonyName: name,
      members: members.split(','),
      customActionTitle: 'Unverifying members!',
      domainId: Id.RootDomain,
      annotationMessage: 'Annotated bruh',
    });
  };

  return (
    <>
      <input
        style={{ border: '1px solid salmon' }}
        value={members}
        onChange={(e) => {
          setMembers(e.target.value);
        }}
      />
      <button type="button" onClick={handleSubmit}>
        Unverify
      </button>
    </>
  );
};

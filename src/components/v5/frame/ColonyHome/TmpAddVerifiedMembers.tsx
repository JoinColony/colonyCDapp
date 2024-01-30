import { Id } from '@colony/colony-js';
import { pipe } from 'lodash/fp';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAsyncFunction, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux/actionTypes';
import { mapPayload, withMeta } from '~utils/actions';
import { setQueryParamOnUrl } from '~utils/urls';

export const TmpAddVerifiedMembers = () => {
  const {
    colony: { colonyAddress, name },
  } = useColonyContext();
  const navigate = useNavigate();
  const [members, setMembers] = useState('');

  const verifyMembers = useAsyncFunction({
    submit: ActionTypes.ACTION_ADD_VERIFIED_MEMBERS,
    error: ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_ERROR,
    success: ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_SUCCESS,
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
    verifyMembers({
      colonyAddress,
      colonyName: name,
      members: members.split(','),
      customActionTitle: 'Verifying members!',
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
        Verify
      </button>
    </>
  );
};

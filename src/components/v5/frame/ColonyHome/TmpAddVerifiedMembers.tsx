import { Id } from '@colony/colony-js';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux/actionTypes';

export const TmpAddVerifiedMembers = () => {
  const {
    colony: { colonyAddress, name },
  } = useColonyContext();
  const dispatch = useDispatch();
  const [members, setMembers] = useState('');

  const handleSubmit = () => {
    // console.log('sabamito!');
    dispatch({
      type: ActionTypes.ACTION_ADD_VERIFIED_MEMBERS,
      payload: {
        colonyAddress,
        colonyName: name,
        members: members.split(','),
        customActionTitle: 'Verifying members!',
        domainId: Id.RootDomain,
        annotationMessage: 'Annotated bruh',
      },
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

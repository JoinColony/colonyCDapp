import React, { useEffect, useState } from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify'

import { listUsers } from '~gql';

import awsExports from '../../../aws-exports.js';

Amplify.configure({
  Auth: {
    identityPoolId: '123',
    region: awsExports.aws_project_region,
    cookieStorage: {
      domain: 'localhost',
      path: '/',
      secure: true
    }
  },
  ...awsExports,
});

const Entry = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers();
  }, [])

  async function fetchUsers() {
    try {
      const usersData = await API.graphql(graphqlOperation(listUsers));
      const users = usersData.data.listUsers.items;
      setUsers(users);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  return (
    <>
      <div>Users created in Colony Network</div>
      <ul>
        {users.map(({ walletAddress, username }) => (
          <li><b>Username:</b> {username} <b>Address:</b> {walletAddress}</li>
        ))}
      </ul>
    </>
  );
};

export default Entry;

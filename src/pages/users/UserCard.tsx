import React from 'react';
import type { User } from '../../entities/user/user.types';

interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>{user.first_name} {user.last_name}</h3>
      <p>{user.bio}</p>
    </div>
  );
};
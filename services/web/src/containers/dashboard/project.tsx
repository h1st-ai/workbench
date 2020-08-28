import React from 'react';
import { IProject } from 'types/store';

import styles from './style.module.css';
// import { Avatar } from 'components/profile-photo';

export function ProjectListItem({
  author_username,
  author_name,
  name,
  workspace,
  status,
  author_picture,
  updated_at,
  created_at,
}: IProject) {
  return (
    <tr>
      <td>{name}</td>
      <td>{author_name}</td>
      <td>{updated_at}</td>
    </tr>
  );
}

export function ProjectGridItem({
  author_username,
  author_name,
  name,
  workspace,
  status,
  author_picture,
  updated_at,
  created_at,
}: IProject) {
  const author = {
    username: author_username,
    firstName: author_name.split(' ')[0],
    lastName: author_name.split(' ')[1],
    attributes: {
      picture: author_picture,
    },
  };

  return (
    <li className={styles.card}>
      <h4>{name}</h4>
      <p>
        Last edited <span>{updated_at}</span>{' '}
      </p>

      <div className={styles.author}>
        {/* <Avatar profile={author} size="medium" /> */}
      </div>
    </li>
  );
}

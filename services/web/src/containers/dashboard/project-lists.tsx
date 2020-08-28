import React from 'react';
import faker from 'faker';
import { useDispatch, useSelector } from 'react-redux';

import { IProject, IStore } from 'types/store';
import { ProjectGridItem, ProjectListItem } from './project';
import { VIEW_MODE_LIST, VIEW_MODE_GRID } from 'constants/actions';

import styles from './style.module.css';

const data: any = [];

for (let i = 0; i < 12; i++) {
  data.push({
    author_username: faker.internet.userName(),
    author_name: faker.name.findName(),
    name: faker.commerce.productName(),
    workspace: 'home/project/workbench',
    status: faker.random.boolean(),
    owner_picture: faker.internet.avatar(),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
  });
}

export default function ProjectLists(): any {
  const { viewMode } = useSelector((store: IStore) => store.dashboard);
  const projects = data.map((p: IProject) => {
    if (viewMode === VIEW_MODE_LIST) {
      return <ProjectListItem {...p} />;
    } else if (viewMode === VIEW_MODE_GRID) {
      return <ProjectGridItem {...p} />;
    }
    // return <li>{JSON.stringify(p)}</li>;
  });

  if (viewMode === VIEW_MODE_LIST) {
    return (
      <table className={styles.projectList}>
        <tr>
          <th>Project Name</th>
          <th>Author</th>
          <th>Last updated</th>
        </tr>
        {projects}
      </table>
    );
  } else if (viewMode === VIEW_MODE_GRID) {
    return <ul className={styles.cardList}>{projects}</ul>;
  }
  return projects;
}

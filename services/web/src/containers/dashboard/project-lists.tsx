import React from 'react';
import faker from 'faker';
import { useDispatch, useSelector } from 'react-redux';

import { IProject, IStore } from 'types/store';
import { ProjectGridItem, ProjectListItem } from './project';
import { VIEW_MODE_LIST, VIEW_MODE_GRID } from 'constants/actions';

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

export default function ProjectLists() {
  const { viewMode } = useSelector((store: IStore) => store.dashboard);
  const projects = data.map((p: IProject) => {
    if (viewMode === VIEW_MODE_LIST) {
      return <ProjectListItem {...p} />;
    } else if (viewMode === VIEW_MODE_GRID) {
      return <ProjectGridItem {...p} />;
    }
    return <li>{JSON.stringify(p)}</li>;
  });
}

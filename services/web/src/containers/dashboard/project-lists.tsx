import React, { useState, ReactElement } from 'react';
import faker from 'faker';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from 'axios-hooks';
import { withKeycloak } from '@react-keycloak/web';

import { makeApiParams } from 'data/client';
import { dashboardActions } from 'reducers/dashboard';
import Icon from 'components/icon';

import { IProject, IStore } from 'types/store';
import { ProjectGridItem, ProjectListItem } from './project';
import { VIEW_MODE_LIST, VIEW_MODE_GRID } from 'constants/actions';

import styles from './style.module.css';

// const data: any = [];

// for (let i = 0; i < 12; i++) {
//   data.push({
//     author_username: faker.internet.userName(),
//     author_name: faker.name.findName(),
//     name: faker.commerce.productName(),
//     workspace: 'home/project/workbench',
//     status: faker.random.boolean(),
//     owner_picture: faker.internet.avatar(),
//     created_at: faker.date.past(),
//     updated_at: faker.date.past(),
//   });
// }

function ProjectLists({ keycloak }: any): any {
  const {
    setProjects,
    addProject,
    toggleCreateProjectDialog,
  } = dashboardActions;

  const { viewMode, projects, showCreateProjectDialog } = useSelector(
    (store: IStore) => store.dashboard,
  );
  const dispatch = useDispatch();

  const [{ data, loading, error }, refetch] = useAxios(
    makeApiParams({
      url: 'projects',
      method: 'GET',
      token: keycloak.token,
    }),
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  if (!loading && !error && data.success) {
    dispatch(setProjects({ projects: data.items }));
  }

  if (!loading && projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <CreateProjectDialog />
        <button onClick={() => dispatch(toggleCreateProjectDialog())}>
          Create your first project
        </button>
        <svg
          width="844"
          height="457"
          viewBox="0 0 844 457"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0)">
            <path
              d="M514.931 -0.0411967L388.833 152.158L540.996 278.285L667.094 126.086L514.931 -0.0411967Z"
              fill="#B9D6ED"
            />
            <path
              d="M649.696 141.726C649.696 141.726 636.867 153.937 639.712 157.094C642.557 160.25 663.767 157.094 663.767 157.094C663.767 157.094 665.009 162.734 673.751 162.423C682.494 162.113 700.341 162.423 700.341 162.423"
              fill="#E1D3B8"
            />
            <path
              d="M553.424 144.83L603.862 192.9C603.862 192.9 617.933 266.376 629.676 281.02C641.419 295.663 700.962 340.215 700.962 340.215L756.781 402.152L844 358.118L801.787 307.823C801.787 307.823 811.357 217.065 805.253 199.937C800.804 187.467 748.504 141.778 715.085 110.524C701.893 98.2094 683.891 92.4659 665.992 94.8978L569.564 107.937C565.633 108.455 564.391 113.474 567.547 115.854L578.048 123.667L663.405 124.288L715.706 214.27L664.647 213.443C664.647 213.443 610.536 117.51 557.097 130.756C550.786 132.257 548.716 140.277 553.424 144.83Z"
              fill="#F4E9D4"
            />
            <path
              d="M754.66 187.416C754.66 187.416 702.152 110.162 691.702 101.107C683.891 94.3287 673.751 94.3287 673.751 94.3287"
              stroke="#D6C29A"
              strokeMiterlimit="10"
            />
            <path
              d="M781.25 181.672C781.25 181.672 728.587 126.875 708.256 107.058C698.945 98.0024 690.564 96.6053 690.564 96.6053"
              stroke="#D6C29A"
              strokeMiterlimit="10"
            />
            <path
              d="M800.339 160.923L555.855 150.057L524.661 131.481L558.545 120.045L801.632 130.86C809.909 131.222 816.375 138.259 816.013 146.538C815.703 154.817 808.667 161.285 800.339 160.923Z"
              fill="#9F9FBF"
            />
            <path
              d="M616.588 153.213L559.063 150.678L553.424 145.296C548.665 140.794 550.734 132.774 557.097 131.17C577.945 126.048 598.844 137.431 616.588 153.213Z"
              fill="#F4E9D4"
            />
            <path
              d="M801.58 152.747C805.523 152.747 808.719 149.55 808.719 145.607C808.719 141.663 805.523 138.466 801.58 138.466C797.637 138.466 794.441 141.663 794.441 145.607C794.441 149.55 797.637 152.747 801.58 152.747Z"
              fill="white"
            />
            <path
              d="M571.427 107.679C571.427 107.679 584.204 120.408 592.016 104.884L571.427 107.679Z"
              fill="#FFFEFB"
            />
            <path
              d="M557.925 149.074C557.925 149.074 555.855 139.604 569.15 141.053C582.445 142.502 584.308 153.11 579.445 156.732C574.582 160.354 568.995 159.681 568.995 159.681"
              fill="#FFFEFB"
            />
            <path
              d="M319.618 115.674L124.652 83.475L92.4604 278.487L287.427 310.686L319.618 115.674Z"
              fill="#B9D6ED"
            />
            <path
              d="M116.396 130.963C116.396 130.963 170.921 158.232 220.221 99.1409"
              stroke="white"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M261.761 106.023C261.761 106.023 235.534 190.934 114.016 145.451"
              stroke="white"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M203.357 211.166C203.357 211.166 256.537 246.61 236.361 301.355"
              stroke="white"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M317.063 128.893C317.063 128.893 271.746 153.368 262.744 190.727C253.743 228.086 312.148 254.268 269.832 307.771"
              stroke="white"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M311.527 162.32C311.527 162.32 237.086 189.382 299.888 232.743"
              stroke="white"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M0 377.263L40.4541 352.374C40.4541 352.374 72.2172 271.189 82.2014 256.183C90.8923 243.092 125.552 173.341 134.399 155.541C135.744 152.851 139.158 152.023 141.537 153.782C144.486 155.955 147.694 160.043 147.694 167.546L164.61 127.755C166.007 124.495 170.404 123.771 172.68 126.462C176.198 130.601 179.767 139.449 178.577 158.18L192.959 118.183C194.304 114.405 199.477 113.836 201.598 117.303C205.736 123.978 210.651 135.361 210.392 151.454L212.306 145.969C213.806 141.622 219.962 141.674 221.411 146.021C226.532 161.492 231.602 190.52 214.375 223.429C214.375 223.429 217.893 255.976 193.062 298.044L186.596 347.2L225.756 347.666C225.756 347.666 274.281 327.227 290.835 360.653C292.231 363.499 290.524 366.914 287.42 367.535C270.866 370.64 223.48 379.954 207.081 388.026C187.061 397.857 154.005 416.64 118.362 415.709L59.2326 457L0 377.263Z"
              fill="#F4E9D4"
            />
            <path
              d="M148.107 166.252L102.635 265.911"
              stroke="#D6C29A"
              strokeMiterlimit="10"
            />
            <path
              d="M179.457 154.714L132.64 267.98"
              stroke="#D6C29A"
              strokeMiterlimit="10"
            />
            <path
              d="M211.168 151.298L166.938 274.448"
              stroke="#D6C29A"
              strokeMiterlimit="10"
            />
            <path
              d="M211.789 147.211C211.789 147.211 224.153 161.13 203.719 169.512L211.789 147.211Z"
              fill="#FFFEFB"
            />
            <path
              d="M191.665 121.649C191.665 121.649 208.478 129.514 184.837 140.588L191.665 121.649Z"
              fill="#FFFEFB"
            />
            <path
              d="M163.989 129.049C163.989 129.049 176.663 143.071 154.522 151.299L163.989 129.049Z"
              fill="#FFFEFB"
            />
            <path
              d="M133.881 156.525C133.881 156.525 142.883 167.494 125.346 173.652L133.881 156.525Z"
              fill="#FFFEFB"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="844" height="457" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  }

  const projectList = projects.map((p: IProject) => {
    if (viewMode === VIEW_MODE_LIST) {
      return <ProjectListItem {...p} />;
    } else if (viewMode === VIEW_MODE_GRID) {
      return <ProjectGridItem {...p} />;
    }
  });

  if (viewMode === VIEW_MODE_LIST) {
    return (
      <table className={styles.projectList}>
        <tr>
          <th>Project Name</th>
          <th>Author</th>
          <th>Last updated</th>
        </tr>
        {projectList}
      </table>
    );
  } else if (viewMode === VIEW_MODE_GRID) {
    return <ul className={styles.cardList}>{projectList}</ul>;
  }

  return projectList;
}

function CreateProjectDialog() {
  const { addProject, toggleCreateProjectDialog } = dashboardActions;
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const { viewMode, projects, showCreateProjectDialog } = useSelector(
    (store: IStore) => store.dashboard,
  );

  if (showCreateProjectDialog) {
    return (
      <div className="modal-wrapper">
        <div className="dialog">
          <h3 className="title">Create a new Project</h3>
          <input
            className="text-input"
            placeholder="Project Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="form-actions">
            <button disabled={!value} className="btn primary">
              CREATE
            </button>
            <button
              className="btn"
              onClick={() => dispatch(toggleCreateProjectDialog())}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default withKeycloak(ProjectLists);

//

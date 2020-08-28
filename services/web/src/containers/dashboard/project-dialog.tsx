import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { IProject, IStore } from 'types/store';
import { dashboardActions } from 'reducers/dashboard';
import { selectAuth } from 'reducers/auth';
import LoadingIndicator from 'components/load-indicator';
import useAxios from 'axios-hooks';
import axios from 'axios';

import styles from './style.module.css';
import Icon from 'components/icon';
import { makeApiParams } from 'data/client';

export default function CreateProjectDialog() {
  const {
    setCurrentProjectStatus,
    toggleCreateProjectDialog,
    setPollingProjectId,
  } = dashboardActions;

  const [value, setValue] = useState('');
  const [projectId, setProjectId] = useState(null);
  const dispatch = useDispatch();

  const { token } = useSelector((store: IStore) => store.auth);
  const {
    viewMode,
    currentProjectStatus,
    showCreateProjectDialog,
  } = useSelector((store: IStore) => store.dashboard);

  // function createProject() {
  //
  // }

  if (showCreateProjectDialog) {
    return (
      <div className="modal-wrapper">
        <div className="dialog">
          <h3 className="title">Create a new Project</h3>
          {currentProjectStatus && <CreateProjectStatus projectName={value} />}

          {!currentProjectStatus && (
            <div>
              <input
                className="text-input"
                placeholder="Project Name"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="form-actions">
                <button
                  disabled={!value}
                  className="btn primary"
                  onClick={async () => {
                    dispatch(setCurrentProjectStatus({ status: 'creating' }));

                    const res = await axios.request(
                      makeApiParams({
                        url: 'project',
                        method: 'POST',
                        data: {
                          project_name: value,
                        },
                        token,
                      }),
                    );

                    console.log('res', res);
                    if (res.data.status === 'sucess') {
                      const { id, status } = res.data.item;
                      setProjectId(id);
                      dispatch(setCurrentProjectStatus({ status }));
                      dispatch(setPollingProjectId({ id }));
                    }
                  }}
                >
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
          )}
        </div>
      </div>
    );
  }

  return null;
}

function CreateProjectStatus({ projectName }: any) {
  const {
    setCurrentProjectStatus,
    toggleCreateProjectDialog,
  } = dashboardActions;

  const dispatch = useDispatch();
  const { token } = useSelector((store: IStore) => store.auth);
  const { currentProjectStatus, pollingProjectId } = useSelector(
    (store: IStore) => store.dashboard,
  );

  const loading = true;

  if (currentProjectStatus !== 'running') {
    setTimeout(async () => {
      const res = await axios.request(
        makeApiParams({
          url: `projects/${pollingProjectId}`,
          method: 'POST',
          token,
        }),
      );

      console.log(res.data);

      dispatch(setCurrentProjectStatus({ status: 'starting' }));
    }, 2000);
  }

  let currentStep = 1;

  switch (currentProjectStatus) {
    case 'starting':
      currentStep = 1;
      break;

    case 'running':
      currentStep = 2;

    default:
      currentStep = 0;
      break;
  }

  const steps = [
    {
      finished: 'Project created!',
      label: 'Creating...',
      future: 'Creat a project',
    },
    {
      finished: 'Project initialized!',
      label: 'Initializing...',
      future: 'Initialize project',
    },
    {
      finished: 'Ready to use!',
      label: 'Finalizing...',
      future: 'Finalize project',
    },
  ];

  if (loading) {
    return (
      <div>
        <div className={styles.creatingPane}>
          <LoadingIndicator />
          <p>Creating {projectName}...</p>
          <ul>
            {steps.map((s, i) => {
              if (i < currentStep) {
                return (
                  <li>
                    Step {i + 1}: {s.finished}{' '}
                    <Icon icon="check" fill="#1a804d" />
                  </li>
                );
              }

              if (i === currentStep) {
                return (
                  <li>
                    Step {i + 1}: {s.label}
                  </li>
                );
              }

              return (
                <li>
                  Step {i + 1}: {s.future}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return null;

  // const [{ data, loading, error }, refetch] = useAxios(
  //   makeApiParams({
  //     url: 'projects',
  //     method: 'POST',
  //     token,
  //   }),
  // );
}

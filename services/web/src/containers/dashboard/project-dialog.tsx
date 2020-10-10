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
import { Route } from 'react-router-dom';

export default function CreateProjectDialog() {
  const {
    setCurrentProjectStatus,
    toggleCreateProjectDialog,
    setPollingProjectId,
  } = dashboardActions;

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { token } = useSelector((store: IStore) => store.auth);
  const { currentProjectStatus, showCreateProjectDialog } = useSelector(
    (store: IStore) => store.dashboard,
  );

  let pollInterVal = 1000;

  function poll(pId: string) {
    axios
      .request(
        makeApiParams({
          url: `project/${pId}`,
          method: 'GET',
          token,
        }),
      )
      .then((res) => {
        const currentStatus = res.data.item.status;

        if (currentStatus === 'running') {
          // dispatch(toggleCreateProjectDialog({ value: false }));
          setTimeout(() => {
            window.location.href = `/project/${pId}/#/home/project`;
          }, 2000);
        } else {
          setTimeout(
            () => {
              poll(pId);
            },
            pollInterVal < 10000 ? (pollInterVal += 1000) : pollInterVal,
          );
        }
      });
  }

  const createProject = async () => {
    if (value == null || value == '') {
      setError('Please enter a project name.');
      return;
    } else if (!value.match(/^[a-zA-Z]/)) {
      setError('Project name must start with a letter');
      return;
    } else if (value.match(/[^a-zA-Z0-9\- _]/)) {
      setError('Project name can not contain special character');
      return;
    } else if (value.length > 50) {
      setError('Project name can not be longer than 50 characters');
      return;
    }

    setError('');

    setLoading(true);
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
    if (res.data.status === 'success') {
      const { id } = res.data.item[0];
      setProjectId(id);
      setTimeout(() => poll(id), 1000);
    }
  };

  if (showCreateProjectDialog) {
    return (
      <div className="modal-wrapper">
        <div className="dialog wide">
          <div className="dialog-header">
            <h3 className="title">Create a new Project</h3>
          </div>
          <div className="dialog-container">
          {loading && (
            <div className={styles.creatingPane}>
              <LoadingIndicator />
              <p>Creating {value}...</p>
            </div>
          )}

          {!loading && (
            <div>
              <label className="field-label" htmlFor="project-name">
                Project name
              </label>
              <input
                className="text-input"
                placeholder="Project Name"
                name="project-name"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) createProject();
                }}
              />
              <label className="field-label">Instance size</label>
              <div className="instance-wrapper">
                <div className="instance-col is-selected">
                  <h3>Small</h3>
                    <ul className="instance-specs">
                      <li>
                        <div className="instance-specs-label">
                          CPU
                        </div>
                        <div className="instance-specs-value">
                          1 x 1 Ghz
                        </div>
                      </li>
                      <li>
                        <div className="instance-specs-label">
                          RAM
                        </div>
                        <div className="instance-specs-value">
                          256 Mb
                        </div>
                      </li>
                      <li>
                        <div className="instance-specs-label">
                          GPU
                        </div>
                        <div className="instance-specs-value">
                          4 Gb
                        </div>
                      </li>
                    </ul>
                </div>

                <div className="instance-col">
                  <h3>Medium</h3>
                    <ul className="instance-specs">
                      <li>
                        <div className="instance-specs-label">
                          CPU
                        </div>
                        <div className="instance-specs-value">
                          1 x 1 Ghz
                        </div>
                      </li>
                      <li>
                        <div className="instance-specs-label">
                          RAM
                        </div>
                        <div className="instance-specs-value">
                          256 Mb
                        </div>
                      </li>
                      <li>
                        <div className="instance-specs-label">
                          GPU
                        </div>
                        <div className="instance-specs-value">
                          4 Gb
                        </div>
                      </li>
                    </ul>
                </div>

                <div className="instance-col">
                  <h3>Large</h3>
                    <ul className="instance-specs">
                      <li>
                        <div className="instance-specs-label">
                          CPU
                        </div>
                        <div className="instance-specs-value">
                          1 x 1 Ghz
                        </div>
                      </li>
                      <li>
                        <div className="instance-specs-label">
                          RAM
                        </div>
                        <div className="instance-specs-value">
                          256 Mb
                        </div>
                      </li>
                      <li>
                        <div className="instance-specs-label">
                          GPU
                        </div>
                        <div className="instance-specs-value">
                          4 Gb
                        </div>
                      </li>
                    </ul>
                </div>
              </div>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <div className="form-actions">
                <button className="btn primary" onClick={createProject}>
                  Create
                </button>
                <button
                  className="btn secondary empty"
                  onClick={() => {
                    setError('');
                    dispatch(toggleCreateProjectDialog({ value: false }));
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }

  return <p>{showCreateProjectDialog}</p>;
}

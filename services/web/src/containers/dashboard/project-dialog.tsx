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
          // server makes sure that when status is running mean the container is accessible
          window.location.href = `https://cloud.h1st.ai/project/${pId}/#/home/project`;
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
    console.log(value)

    if (value == null || value == "") {
      setError("Please enter a project name.")
      return
    } else if (value.match("^\\d")) {
      setError("Project name can not start with a number")
      return
    }

    setError("")

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
  }

  if (showCreateProjectDialog) {
    return (
      <div className="modal-wrapper">
        <div className="dialog">
          <h3 className="title">Create a new Project</h3>
          {loading && (
            <div className={styles.creatingPane}>
              <LoadingIndicator />
              <p>Creating {value}...</p>
            </div>
          )}

          {!loading && (
            <div>
              <input
                className="text-input"
                placeholder="Project Name"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {
                error && <div style="color: red">{error}</div>
              }
              <div className="form-actions">
                <button
                  className="btn primary"
                  onClick={createProject}
                >
                  CREATE
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setError("");
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
    );
  }

  return <p>{showCreateProjectDialog}</p>;
}

import React, { useState } from 'react';
import klass from 'classnames';

import { useDispatch, useSelector } from 'react-redux';
import { IStore } from 'types/store';
import { dashboardActions } from 'reducers/dashboard';
import LoadingIndicator from 'components/load-indicator';
import axios from 'axios';

import styles from './style.module.css';
import { makeApiParams } from 'data/client';

interface IInstances {
  [key: string]: IInstanceConfig;
}

interface IInstanceConfig {
  cpu: number;
  ram: number;
  gpu?: number;
  label?: string;
}

const INSTANCE_CONFIG: IInstances = {
  small: {
    cpu: 1024,
    ram: 1024 * 2,
  },
  medium: {
    cpu: 1024 * 8,
    ram: 1024 * 32,
  },
  large: {
    cpu: 1024 * 16,
    ram: 1024 * 120,
  },
};

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
  const [size, setSize] = useState('small');
  const dispatch = useDispatch();

  const { token } = useSelector((store: IStore) => store.auth);
  const { showCreateProjectDialog } = useSelector(
    (store: IStore) => store.dashboard,
  );

  let pollInterVal = 1000;

  async function poll(pId: string) {
    // get the new token everytime this function is invoked
    const { token } = useSelector((store: IStore) => store.auth);

    const res = await axios.request(
      makeApiParams({
        url: `project/${pId}`,
        method: 'GET',
        token,
      }),
    );

    const currentStatus = res.data.item.status;

    if (currentStatus === 'running') {
      console.log('additonal ping');

      try {
        await axios.get(`/project/${pId}/#/home/project`);
      } catch (error) {
        console.log('error', error.response.status);
        // @ts-ignore
        window.ga(
          'send',
          'event',
          'Errors',
          '404',
          `/project/${pId}/#/home/project`,
        );
      } finally {
        setTimeout(() => {
          window.location.href = `/project/${pId}/#/home/project`;
        }, 2000);
      }
    } else {
      setTimeout(
        () => {
          poll(pId);
        },
        pollInterVal < 10000 ? (pollInterVal += 1000) : pollInterVal,
      );
    }
    // .then((res) => {

    // });
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
          ram: INSTANCE_CONFIG[size].ram,
          cpu: INSTANCE_CONFIG[size].cpu,
          gpu: INSTANCE_CONFIG[size].gpu,
        },
        token,
      }),
    );

    console.log('res', res);
    if (res.data.status === 'success') {
      const { id } = res.data.item;
      setProjectId(id);
      setTimeout(() => poll(id), 1000);
    }
  };

  const renderSize = () => {
    return Object.keys(INSTANCE_CONFIG).map((s: string) => {
      return (
        <div
          className={klass('instance-col', { 'is-selected': s === size })}
          onClick={() => setSize(s)}
        >
          <h3>{s}</h3>
          <ul className="instance-specs">
            <li>
              <div className="instance-specs-label">CPU</div>
              <div className="instance-specs-value">
                {INSTANCE_CONFIG[s].cpu / 1024}
              </div>
            </li>
            <li>
              <div className="instance-specs-label">RAM</div>
              <div className="instance-specs-value">
                {INSTANCE_CONFIG[s].ram / 1024}G
              </div>
            </li>
          </ul>
        </div>
      );
    });
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
                <div className="instance-wrapper">{renderSize()}</div>
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

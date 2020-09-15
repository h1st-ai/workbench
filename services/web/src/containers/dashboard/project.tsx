import React, { useState } from 'react';
import { IProject, IStore } from 'types/store';
import { formatDistance } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';

import { dashboardActions } from 'reducers/dashboard';
import Icon from 'components/icon';
import { ThreeDotIndicator } from 'components/load-indicator';
import axious from 'axios';
import { makeApiParams } from 'data/client';

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
      <td>{formatDistance(updated_at, new Date())}</td>
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
  id,
  index,
}: IProject) {
  const { updateProjectInfo, removeProjectAt } = dashboardActions;
  const dispatch = useDispatch();

  const [startLoading, setStartLoading] = useState(false);
  const [trashLoading, setTrashLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { token } = useSelector((store: IStore) => store.auth);

  if (!author_name) {
    return null;
  }

  // const author = {
  //   username: author_username,
  //   firstName: author_name.split(' ')[0],
  //   lastName: author_name.split(' ')[1],
  //   attributes: {
  //     picture: author_picture,
  //   },
  // };

  function renderStatus() {
    if (startLoading) return 'starting...';
    if (stopLoading) return 'stopping...';
    if (trashLoading) return 'deleting...';

    return status;
  }

  function getProjectUrl(id: string) {
    return `/project/${id}/#/home/project`;
  }

  function poll(
    url: string,
    options: any,
    interval: number,
    resultHandler: Function,
    desiredValue: any,
    onFinsish?: Function,
  ) {
    setTimeout(async () => {
      const result = await axious.request(
        makeApiParams({
          url,
          method: options.method,
          token,
        }),
      );

      const processedResult = resultHandler(result);

      if (processedResult !== desiredValue) {
        poll(url, options, interval, resultHandler, desiredValue, onFinsish);
      } else {
        if (onFinsish) onFinsish(result);
      }
    }, interval);
  }

  async function start() {
    if (startLoading) return false;

    setStartLoading(true);

    try {
      const res = await axious.request(
        makeApiParams({
          url: `project/${id}/start`,
          method: 'POST',
          token,
        }),
      );

      if (res.data.success) {
        poll(
          `project/${id}`,
          { method: 'GET' },
          1000,
          (e: any) => e.data.item.status,
          'running',
          () => {
            setTimeout(() => {
              window.location.href = getProjectUrl(id);
            }, 2000);
          },
        );
      }
    } catch (error) {
      console.log(error);
      setStartLoading(false);
    }
  }

  async function stop() {
    if (stopLoading) return false;

    setStopLoading(true);

    try {
      const res = await axious.request(
        makeApiParams({
          url: `project/${id}/stop`,
          method: 'POST',
          token,
        }),
      );

      if (res.data.success) {
        poll(
          `project/${id}`,
          { method: 'GET' },
          1000,
          (e: any) => e.data.item.status,
          'stopped',
          () => {
            dispatch(
              updateProjectInfo({
                index,
                transformer: (input: IProject) => ({
                  ...input,
                  status: 'stopped',
                }),
              }),
            );

            // give some time for the renderer to work
            setTimeout(() => setStopLoading(false), 500);
          },
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setStopLoading(false);
    }
  }

  async function deleteProject() {
    if (trashLoading) return false;

    const confirmedName = prompt(
      `Are you sure you want to delete "${name}"? Confirm by entering the project's name.`,
    );

    if (!confirmedName) return null;

    if (confirmedName.toLocaleLowerCase() !== name.toLocaleLowerCase()) {
      return alert('Names mismatched');
    }

    setTrashLoading(true);

    try {
      const res = await axious.request(
        makeApiParams({
          url: `project/${id}`,
          method: 'DELETE',
          token,
        }),
      );

      if (res.data.status === 'success') {
        setTrashLoading(false);

        dispatch(
          removeProjectAt({
            index,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }

  function renderActions() {
    let btn = null;

    switch (status) {
      case 'stopped':
        btn = (
          <button
            data-tip="Start this project"
            className={`${styles.actionBtn} ${styles.playBtn}`}
            onClick={start}
          >
            {startLoading && <ThreeDotIndicator width={20} fill="#bbb" />}
            {!startLoading && (
              <Icon icon="play" width={20} height={20} fill="#31c16c" />
            )}
          </button>
        );
        break;

      case 'running':
        btn = (
          <button
            className={`${styles.actionBtn} ${styles.playBtn}`}
            onClick={stop}
          >
            {stopLoading && <ThreeDotIndicator width={20} fill="#bbb" />}
            {!stopLoading && (
              <Icon icon="stop" fill="#f00" width={20} height={20} />
            )}
          </button>
        );
    }

    return (
      <div className={styles.actions}>
        <div className={styles.mainActions}>
          {renderStatus()} {btn}
        </div>

        <button className={styles.trashBtn} onClick={deleteProject}>
          {trashLoading && <ThreeDotIndicator width={20} fill="#bbb" />}
          {!trashLoading && <Icon icon="trash" width={20} height={20} />}
        </button>
      </div>
    );
  }

  return (
    <li className={styles.card} key={id}>
      <div className={styles.innerContent}>
        <h4>
          {status === 'running' && <a href={getProjectUrl(id)}>{name}</a>}

          {status !== 'running' && name}
        </h4>

        <div className={styles.author}>
          <small>
            Created{' '}
            <strong>{formatDistance(new Date(updated_at), new Date())}</strong>{' '}
            ago
          </small>

          {/* <img src={author.attributes.picture} />{' '} */}
          {/* {`${author.firstName} ${author.lastName}`} */}
        </div>
      </div>

      {renderActions()}
    </li>
  );
}

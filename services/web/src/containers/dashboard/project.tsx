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
        <nav className="actionsDropdownWrapper">
          <button className="menuTrigger">
            <svg width="31" height="7" viewBox="0 0 31 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3.5" cy="3" r="3" fill="#B0B6C1"/>
              <circle cx="15.5" cy="3" r="3" fill="#B0B6C1"/>    
              <circle cx="27.5" cy="3" r="3" fill="#B0B6C1"/>
            </svg>
          </button>
          <ul className="actionsDropdown">
            <li className="actionRename">
              <button>
                <span className="menuIcon">
                  <svg  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.58 4.26006C15.7632 4.07313 15.8659 3.82181 15.8659 3.56006C15.8659 3.29831 15.7632 3.04699 15.58 2.86006L13 0.29006C12.8126 0.103809 12.5592 -0.000732422 12.295 -0.000732422C12.0308 -0.000732422 11.7774 0.103809 11.59 0.29006L4 7.88006V11.8101H8C8.31 11.8101 15.74 4.11006 15.58 4.26006ZM6 9.81006V8.71006L12.29 2.42006L13.46 3.56006L7.17 9.81006H6Z" fill="#B0B6C1"/>
                    <path d="M15.58 4.26006C15.7632 4.07313 15.8659 3.82181 15.8659 3.56006C15.8659 3.29831 15.7632 3.04699 15.58 2.86006L13 0.29006C12.8126 0.103809 12.5592 -0.000732422 12.295 -0.000732422C12.0308 -0.000732422 11.7774 0.103809 11.59 0.29006L4 7.88006V11.8101H8C8.31 11.8101 15.74 4.11006 15.58 4.26006ZM6 9.81006V8.71006L12.29 2.42006L13.46 3.56006L7.17 9.81006H6Z" fill="#B0B6C1"/>
                    <path d="M16 13.8101H0V15.8101H16V13.8101Z" fill="#B0B6C1"/>
                    <path d="M16 13.8101H0V15.8101H16V13.8101Z" fill="#B0B6C1"/>
                  </svg>
                </span>
                Rename
                </button>
            </li>
            <li className="actionDelete">
              <button> 
                <span className="menuIcon">
                  <svg  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3H12V0H4V3H0V5H1V16H15V5H16V3ZM6 2H10V3H6V2ZM13 14H3V5H13V14Z" fill="#C22F25"/>
                    <path d="M7 7H5V12H7V7Z" fill="#C22F25"/>
                    <path d="M11 7H9V12H11V7Z" fill="#C22F25"/>
                  </svg>
                </span>
              Delete</button>
            </li>
          </ul>
        </nav>
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

        <div className={styles.projectMeta}>
          <span className={styles.projectMetaLabel}>
            Created{' '}
           
          </span>
          <span className={styles.timmeStamp}> 
            {formatDistance(new Date(updated_at), new Date())}{' '}
            ago</span>

          {/* <img src={author.attributes.picture} />{' '} */}
          {/* {`${author.firstName} ${author.lastName}`} */}
        </div>
      </div>

      {renderActions()}
    </li>
  );
}

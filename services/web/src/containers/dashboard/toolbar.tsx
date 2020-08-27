import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import klass from 'classnames';
import ReactTooltip from 'react-tooltip';

import { IStore } from 'types/store';
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from 'constants/actions';
import Icon from 'components/icon';
import SearchBox from 'components/search-box';
import { dashboardActions } from 'reducers/dashboard';
import styles from './style.module.css';

const Toolbar = () => {
  const { switchViewMode, setSearchKeyword } = dashboardActions;
  const dispatch = useDispatch();
  const { viewMode } = useSelector((store: IStore) => store.dashboard);

  return (
    <div className={styles.toolBar}>
      <SearchBox
        onSearch={(keyword: string) => {
          dispatch(setSearchKeyword({ keyword }));
        }}
      />
      <div className={styles.listModes}>
        <button
          data-tip="View as grid"
          className={klass({ [styles.active]: viewMode === VIEW_MODE_GRID })}
          onClick={() => {
            dispatch(switchViewMode());
          }}
        >
          <Icon icon="grid" width={24} height={24} />
        </button>
        <button
          data-tip="View as list"
          className={klass({ [styles.active]: viewMode === VIEW_MODE_LIST })}
          onClick={() => {
            dispatch(switchViewMode());
          }}
        >
          <Icon icon="list" width={24} height={24} />
        </button>
      </div>
      <ReactTooltip delayShow={1000} effect="solid" />
    </div>
  );
};

export default Toolbar;

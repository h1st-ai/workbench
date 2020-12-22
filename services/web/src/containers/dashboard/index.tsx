import React from 'react';
import AppHeader from 'components/app-header';
import Toolbar from './toolbar';
import styles from './style.module.css';
import ProjectList from './project-lists';

function DashboardContainer() {
  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        {/* <Toolbar /> */}
        <ProjectList />
      </div>
    </div>
  );
}

export default DashboardContainer;

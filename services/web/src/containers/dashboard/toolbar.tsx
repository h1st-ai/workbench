import React from 'react';

import SearchBox from 'components/search-box';
import styles from './style.module.css';

const Toolbar = () => {
  return (
    <div className={styles.toolBar}>
      <SearchBox />
    </div>
  );
};

export default Toolbar;

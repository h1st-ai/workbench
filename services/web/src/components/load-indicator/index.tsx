import React from 'react';

import styles from './style.module.css';

function LoadingIndicator({ width = 40, height = 40 }) {
  return (
    <div style={{ width, height }} className={styles.loadWrapper}>
      <div className={styles.loader}></div>

      <div className={`${styles.loaderSection} ${styles.sectionLeft}}`} />
      <div className={`${styles.loaderSection} ${styles.sectionRight}}`} />
    </div>
  );
}

export default LoadingIndicator;

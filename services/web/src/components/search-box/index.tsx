import React, { useState } from 'react';
import Icon from 'components/icon';

import styles from './style.module.css';

interface ISearchBox {
  initialValue?: string;
  onChange?: Function;
  onSearch?: Function;
}

function SearchBox({ onChange, onSearch }: ISearchBox) {
  const [value, setValue] = useState('');

  const valueChanged = (e: any) => {
    console.log(e.target.value);
    setValue(e.target.value);

    if (onChange) {
      onChange.call(e.target.value);
    }
  };

  const search = () => {
    if (onSearch) {
      onSearch.call(value);
    }
  };

  return (
    <div className={styles.input}>
      <input type="text" value={value} onChange={valueChanged} />
      <a onClick={search}>
        <Icon icon="search" />
      </a>
    </div>
  );
}

export default SearchBox;

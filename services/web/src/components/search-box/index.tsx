import React, { useState } from 'react';
import Icon from 'components/icon';

import styles from './style.module.css';

interface ISearchBox {
  initialValue?: string;
  onChange?: Function;
  onSearch?: Function;
  placeholder?: string;
}

function SearchBox({
  onChange,
  onSearch,
  placeholder = 'Search...',
}: ISearchBox) {
  const [value, setValue] = useState('');
  const [plcHolder, setPlaceholder] = useState(placeholder);

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

  const onFocus = () => {
    if (value !== '') {
      setPlaceholder(value);
    }

    setValue('');
  };

  return (
    <div className={styles.input}>
      <input
        placeholder={plcHolder}
        type="text"
        value={value}
        onChange={valueChanged}
        onFocus={onFocus}
      />
      <a onClick={search}>
        <Icon icon="search" />
      </a>
    </div>
  );
}

export default SearchBox;

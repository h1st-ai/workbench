import * as React from 'react';
import classnames from 'classnames';

interface IRadioInputItem {
  value: string;
  name: string;
  title: string;
  description?: string | JSX.Element;
  onSelect: Function;
  selected: any;
}

const InputItem = ({
  value = '',
  name = '',
  title,
  description,
  onSelect,
  selected,
}: IRadioInputItem) => {
  const checkboxId = `checkbox-${value}`;
  return (
    <div
      className={classnames('radio-button-item', {
        selected: selected === value,
      })}
    >
      <div className="input-box">
        <input
          id={checkboxId}
          type="radio"
          value={value}
          checked={value === selected}
          name={name}
          onChange={e => onSelect(e.target.value)}
        />
      </div>
      <div className="information">
        <label htmlFor={checkboxId}>
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </label>
      </div>
    </div>
  );
};

const SelectBox = ({ name = 'select' }) => {
  const [selected, setSelected] = React.useState('small');
  const choices = [
    {
      name,
      value: 'large',
      title: 'Large',
      description: <div>8GB RAM | 4 CPU</div>,
    },
    {
      name,
      value: 'medium',
      title: 'Medium',
      description: <div>4GB RAM | 2 CPU</div>,
    },
    {
      name,
      value: 'small',
      title: 'Small',
      description: <div>2GB RAM | 1 CPU</div>,
    },
  ];

  return (
    <div className="radio-button-box">
      {choices.map((choice, idx) => (
        <InputItem
          key={idx}
          {...choice}
          selected={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  );
};

export { SelectBox };

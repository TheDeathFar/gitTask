import React from 'react';

interface Props {
  className?: string,
  text?: string,
  isActive: boolean
}

const InputHint: React.FC<Props> = (props) => {
  const { className = ``, text, isActive } = props;

  return (
    (isActive && text)
      ? (
        <div className={`InputHint uk-position-absolute uk-overlay uk-padding-small ${className}`}>
          <div className={`uk-flex uk-flex-middle uk-height-1-1`}>
          <span className={`InputHint-span uk-active`}>
            {text}
          </span>
          </div>
        </div>
      )
      : null
  );
};


export default InputHint;

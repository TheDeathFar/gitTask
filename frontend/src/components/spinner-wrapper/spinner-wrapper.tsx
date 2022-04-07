import React from "react";

interface Props {
  loading: boolean,
  onClick?: () => void,
  isError?: boolean | string,
  errorText?: boolean | string,
  className?: string
}

const SpinnerWrapper: React.FC<Props> = (props) => {
  const {
    className = ``,
    children = undefined,
    loading,
    isError = false,
    onClick = () => {
    },
    errorText = ``,
  } = props;

  return (
    <>
      <div className={`SpinnerIcon ${(!loading) ? `SpinnerIcon--hidden` : ``}`}>
        <span className={`SpinnerIcon-icon`} />
      </div>
      <div className={`SpinnerError ${(!isError) ? `SpinnerError--hidden` : ``}`}>
        <button className={`SpinnerError-button`}
                onClick={onClick} />
        <span className={`SpinnerError-text`}>{errorText}</span>
      </div>
      <div className={`SpinnerContent ${(loading || isError) ? `SpinnerContent--hidden` : ``} ${className}`}>
        {children}
      </div>
    </>

  );
};


export default SpinnerWrapper;

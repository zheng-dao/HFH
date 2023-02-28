export default function PageTitle(props) {
  return (
    <header className={props.headerClassName}>
      {props.preamble && <h3>{props.preamble}</h3>}

      <h1>
        {props.prefix && <span>{props.prefix} </span>}
        {props.title}
        {props.extraButtonTitle && (
          <button className={props.extraButtonClassName} onClick={props.extraButtonOnClick}>
            {props.extraButtonTitle}
          </button>
        )}
      </h1>
    </header>
  );
}

PageTitle.defaultProps = {
  preamble: '',
  prefix: '',
  title: '',
  headerClassName: 'content-header',
  extraButtonTitle: '',
  extraButtonOnClick: () => {},
  extraButtonClassName: '',
};

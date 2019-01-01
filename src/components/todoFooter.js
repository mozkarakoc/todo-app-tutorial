/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import classNames from 'classnames';
import { ALL_TODOS, COMPLETED_TODOS, ACTIVE_TODOS } from '../types/constants';

const Footer = (props) => {
  const activeTodoWord = pluralize('item', props.count);
  let clearButton = null;

  if (props.completedCount > 0) {
    clearButton = (
      <button
        type="button"
        className="clear-completed"
        onClick={props.onClearCompleted}
      >
        Clear completed
      </button>
    );
  }

  const nowShowing = props.nowShowing;
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{props.count}</strong>
        {' '}
        {activeTodoWord}
        {' '}
        left
      </span>
      <ul className="filters">
        <li>
          <a
            role="link"
            onClick={() => { props.handleFiltering(ALL_TODOS); }}
            className={classNames({ selected: nowShowing === ALL_TODOS })}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            role="link"
            onClick={() => { props.handleFiltering(ACTIVE_TODOS); }}
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            role="link"
            onClick={() => { props.handleFiltering(COMPLETED_TODOS); }}
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

Footer.propTypes = {
  completedCount: PropTypes.number,
  count: PropTypes.number,
  handleFiltering: PropTypes.func.isRequired,
  nowShowing: PropTypes.oneOf([ALL_TODOS, COMPLETED_TODOS, ACTIVE_TODOS]).isRequired,
  onClearCompleted: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  completedCount: 0,
  count: 0,
};

export default Footer;

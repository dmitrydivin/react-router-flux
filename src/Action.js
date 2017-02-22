import React from 'react';
import invariant from 'invariant';

/**
 * A <Action> is used to presentation event to route redirect
 */
export default class Action extends React.Component {
  static propTypes = {
    /**
     * Event name
     */
    on: React.PropTypes.string.isRequired,
    /**
     * Route path
     */
    to: React.PropTypes.string.isRequired,
    /**
     * Route query parameters
     */
    query: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.func
    ]),
    /**
     * Route state parameters
     */
    state: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.func
    ]),
    /**
     * Route path parameters
     */
    params: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.func
    ])
  };

  render() {
    invariant(
      false,
      '<Action> elements are for <Dispatcher/> inside only and should not be rendered'
    );
  }
}
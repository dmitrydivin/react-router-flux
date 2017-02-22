import React from 'react';
import invariant from 'invariant';

/**
 * A <View> is used to declare route entry point
 */
export default class View extends React.Component {
  static propTypes = {
    /**
     * Define route path
     */
    path: React.PropTypes.string.isRequired
  };

  render() {
    invariant(
      false,
      '<View> elements are for <Dispatcher/> inside only and should not be rendered'
    );
  }
}
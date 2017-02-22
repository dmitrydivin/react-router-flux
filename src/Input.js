import React from 'react';
import invariant from 'invariant';

/**
 * A <Input> is used to declare model for the Component
 */
export default class Input extends React.Component {
  static propTypes = {
    /**
     * Variable name
     */
    name: React.PropTypes.string.isRequired,
    /**
     * Variable value
     */
    value: React.PropTypes.any
  };

  render() {
    invariant(
      false,
      '<Input> elements are for <View/> or <Dispatcher/> inside only and should not be rendered'
    );
  }
}
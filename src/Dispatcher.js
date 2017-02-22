import React from 'react';

import invariant from 'invariant';

import Input from './Input';
import Action from './Action';
import View from './View';

import upperFirst from 'lodash/upperFirst';
import isFunction from 'lodash/isFunction';
import {formatPattern} from 'react-router';

class RouteWrapper extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {
    let {model, defaultModel, actions, originComponent} = this.props.route;

    let {router} = this.context;

    let componentProps = {};

    Object.keys(model).forEach((name) => {
      let value = model[name];

      if (isFunction(value)) {
        let {location, params} = this.props;
        let query = location.query || {};
        let state = location.state || {};
        let result = value({params, query, state});
        if (result !== undefined) {
          componentProps[name] = result;
        }
      } else if (value !== undefined) {
        componentProps[name] = value;
      }
    });


    Object.keys(defaultModel).forEach((name) => {
      if (componentProps[name] == undefined) {
        let value = defaultModel[name];

        if (isFunction(value)) {
          let {location, params} = this.props;
          let query = location.query || {};
          let state = location.state || {};
          let result = value({params, query, state});
          if (result !== undefined) {
            componentProps[name] = result;
          }
        } else if (value !== undefined) {
          componentProps[name] = value;
        }
      }
    });

    actions.forEach((action) => {
      let {on, to, state, query, params} = action;

      let eventName = 'on' + upperFirst(on);
      componentProps[eventName] = (values) => {
        let formatParams = {};
        if (params) {
          if (isFunction(params)) {
            formatParams = params(values);
          } else {
            formatParams = params;
          }
        }
        let pathname = formatPattern(to, formatParams);
        let route = {pathname};
        if (state) {
          if (isFunction(state)) {
            route.state = state(values);
          } else {
            route.state = state;
          }
        }

        if (query) {
          if (isFunction(query)) {
            route.query = query(values);
          } else {
            route.query = query;
          }
        }
        router.push(route);
      };
    });

    return React.createElement(originComponent, componentProps);
  }
}

/**
 * A <Dispatcher> is used to declare route rules
 */
export default class Dispatcher extends React.Component {
  static  propTypes = {
    /**
     * React component
     */
    component: React.PropTypes.func.isRequired
  };

  static createRouteFromReactElement(element) {
    let {children, component} = element.props;

    const defaultModel = {};

    const actions = [];
    const views = [];

    React.Children.forEach(children, (element) => {
      if (element.type === Input) {
        let {name, value} = element.props;
        defaultModel[name] = value;

      } else if (element.type === View) {
        let {path, children} = element.props;

        let model = {};

        if (children) {
          React.Children.forEach(children, (element) => {
            if (element.type === Input) {
              let {name, value} = element.props;
              model[name] = value;
            } else {
              throw new Error(`Illegal use element ${element.type.name} in View, expected [Input]`);
            }
          });
        }

        views.push({path, model});
      } else if (element.type === Action) {
        let {on, to, query, state, params} = element.props;
        actions.push({on, to, query, state, params});
      } else {
        throw new Error(`Illegal use element ${element.type.name} in Dispatcher, expected [Input, View, Action]`);
      }
    });

    return {
      childRoutes: views.map(({path, model}) => {
        return {
          model,
          defaultModel,
          actions,
          path,
          originComponent: component,
          component: RouteWrapper
        }
      })
    }
  }

  render() {
    invariant(
      false,
      '<Dispatcher> elements are for router configuration only and should not be rendered'
    );
  }
}
import React from 'react';
import {Router, Route} from 'react-router';
import expect from 'expect'
import { render, unmountComponentAtNode } from 'react-dom';
import createHistory from 'react-router/lib/createMemoryHistory';
import Dispatcher from '../Dispatcher';
import Input from '../Input';
import Action from '../Action';
import View from '../View';

describe('<Dispatcher>', () => {
  const Label = (props) => {
    return (<label>{props.label}</label>);
  };

  class Loader extends React.Component {
    componentDidMount () {
      this.props.onLoaded();
    }

    render() {
      return (<div>loading...</div>);
    }
  }

  let node;
  beforeEach(function () {
    node = document.createElement('div')
  });

  afterEach(function () {
    unmountComponentAtNode(node)
  });

  it('should check set variable from root scope', (done) => {
    render(
      <Router history={createHistory('/form')}>
        <Dispatcher component={Label}>
          <Input name="label" value="label.1"/>

          <View path="/form"/>
        </Dispatcher>
      </Router>, node, () => {
        expect(node.textContent).toEqual('label.1');
        done()
      }
    )
  });

  describe('should check use default value', () => {
    it('override', (done) => {
      render(
        <Router history={createHistory('/form')}>
          <Dispatcher component={Label}>
            <Input name="label" value="label.1"/>

            <View path="/form">
              <Input name="label" value="label.2"/>
            </View>
          </Dispatcher>
        </Router>, node, () => {
          expect(node.textContent).toEqual('label.2');
          done()
        }
      )
    });

    it('not override if undefined', (done) => {
      render(
        <Router history={createHistory('/form')}>
          <Dispatcher component={Label}>
            <Input name="label" value="label.1"/>

            <View path="/form">
              <Input name="label" value={undefined}/>
            </View>
          </Dispatcher>
        </Router>, node, () => {
          expect(node.textContent).toEqual('label.1');
          done()
        }
      )
    });

    it('not override if undefined in function', (done) => {
      render(
        <Router history={createHistory('/form')}>
          <Dispatcher component={Label}>
            <Input name="label" value="label.1"/>

            <View path="/form">
              <Input name="label" value={() => undefined}/>
            </View>
          </Dispatcher>
        </Router>, node, () => {
          expect(node.textContent).toEqual('label.1');
          done()
        }
      )
    });
  });


  it('should action redirect', (done) => {
    render(
      <Router history={createHistory('/load')}>
        <Dispatcher component={Loader}>
          <View path="/load"/>

          <Action on="loaded" to="/completed"/>
        </Dispatcher>

        <Dispatcher component={Label}>
          <View path="/completed"/>
        </Dispatcher>
      </Router>, node, function() {
        expect(this.state.location.pathname).toEqual('/completed');
        done();
      }
    )
  });

  it('should use inheritable route path', (done) => {
    render(
      <Router history={createHistory('/supplier/edit')}>
        <Route path="/supplier">
          <Dispatcher component={Label}>
            <View path="edit">
              <Input name="label" value="label.1"/>
            </View>
          </Dispatcher>
        </Route>

      </Router>, node, () => {
        expect(node.textContent).toEqual('label.1');
        done()
      }
    )
  });

  it('should check set model from query params', (done) => {
    render(
      <Router history={createHistory('/label?name=test')}>
        <Dispatcher component={Label}>
          <View path="/label">
            <Input name="label" value={({query}) => query.name}/>
          </View>
        </Dispatcher>
      </Router>, node, () => {
        expect(node.textContent).toEqual('test');
        done()
      }
    );
  });

  it('should check set model from path params', (done) => {
    render(
      <Router history={createHistory('/label/test')}>
        <Dispatcher component={Label}>
          <View path="/label/:name">
            <Input name="label" value={({params}) => params.name}/>
          </View>
        </Dispatcher>
      </Router>, node, () => {
        expect(node.textContent).toEqual('test');
        done()
      }
    );
  });
});
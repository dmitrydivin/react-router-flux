Powerful extension for [react-router](https://github.com/ReactTraining/react-router) to declare routes.

### Installation

Using [npm](https://www.npmjs.com/):


```sh
$ npm install --save react-router-flux
```

And then you can import components as follows:

```javascript
// using an ES6 transpiler, like babel
import { Dispatcher, View, Action, Input } from 'react-router-flux';


// not using an ES6 transpiler
var Dispatcher = require('react-router-flux').Dispatcher;
var View = require('react-router-flux').View;
var Action = require('react-router-flux').Action;
var Input = require('react-router-flux').Input;
```

### Declare route dispatcher

```javascript
<Dispatcher component={ReactClass}/>
```

### Props
| Property | Type         | Required | Description       |
|:---------|:-------------|:---------|:------------------|
|component | `ReactClass` | yes      | A React component |

### Declare view-state

The declaration can define in Dispatcher inside only

```javascript
<View path={String}/> 

```

### Props
| Property | Type    | Required | Description         |
|:---------|:--------|:---------|:--------------------|
|path      | `String`| yes      | Route path          |


### Declare inbound parameter into view-state

The declaration can define in a View inside and in a Dispatcher too, but as default value and can be overridden.

```javascript
<Input name={String} value={Any}/>
```

### Props
| Property | Type    | Required | Description         |
|:---------|:--------|:---------|:--------------------|
|name      | `String`| yes      | Input property name |
|value     | `Any`   | no       | Input property value|

> **Note**: If the value define as Function you can access to route variables 'params', 'query' and 'state', see below example.

### Declare transition

The declaration can define in Dispatcher inside only

```javascript
<Action on={String} to={String} query={Function|Object} 
                                state={Function|Object} 
                                params={Function|Object}/>
```

### Props
| Property | Type                   | Required | Description                              |
|:---------|:-----------------------|:---------|:-----------------------------------------|
|on        | `String`               | yes      | Event ID of the component                |
|to        | `String`               | yes      | Redirect Route path                      |
|query     | `Function` or `Object` | no       | Define query params for the Route path   |
|state     | `Function` or `Object` | no       | Define route state for the Router        |
|params    | `Function` or `Object` | no       | Define params for the Route path         |


### How Does It Use?

```javascript
class TodoMVC extends React.Component {
  render() {
    let {
      filter, /** filter parameter **/
      onFilter, /** to go to /todomvc/active when onFilter({filter: 'active'}) **/
      onFilterNotFound  /** to go to /error/404 **/
    } = this.props;
    //...
  }
};

//store filter variable as path parameter
//  `/todomvc`        ->   <TodoMVC filter="all"/>
//  `/todomvc/active` ->   <TodoMVC filter="active"/>
const mapping_v1 = (
  <Router>
    <Dispatcher component={TodoMVC}>
      {/*as default value*/}
      <Input name="filter" value="all"/>
      
      <View path="/todomvc(/:filter)">
        <Input name="filter" value={({params, query, state}) => params.filter}/>
      </View>
    
      <Action on="filter" to="/todomvc(/:filter)"
              params={({filter}) => { return {filter} }}/>
      <Action on="filterNotFound" to="/error/404"/>
    </Dispatcher>
  </Router>
);

//store filter variable as path parameter v_2
//  `/todomvc`        ->   <TodoMVC filter="all"/>
//  `/todomvc/active` ->   <TodoMVC filter="active"/>
const mapping_v2 = (
  <Router>
    <Dispatcher component={TodoMVC}>
      <View path="/todomvc">
        <Input name="filter" value="all"/>
      </View>
      
      <View path="/todomvc/active">
        <Input name="filter" value="active"/>
      </View>
      
      <View path="/todomvc/completed">
        <Input name="filter" value="completed"/>
      </View>
    
      <Action on="filter" to="/todomvc(/:filter)"
              params={({filter}) => { return {filter} }}/>
    </Dispatcher>
  </Router>
);


//store filter variable as query parameter
//  `/todomvc`               ->   <TodoMVC filter="all"/>
//  `/todomvc?filter=active` ->   <TodoMVC filter="active"/>
const mapping_v3 = (
  <Router>
    <Dispatcher component={TodoMVC}>
      {/*as default value*/}
      <Input name="filter" value="all"/>
      
      <View path="/todomvc">
        <Input name="filter" value={({params, query, state}) => query.filter}/>
      </View>
  
      <Action on="filter" to="/todomvc"
              query={({filter}) => { return {filter} }}/>
      <Action on="filterNotFound" to="/error/404"/>
    </Dispatcher>
  </Router>
);

```

### License

MIT, © 2017 Dmitry Divin.

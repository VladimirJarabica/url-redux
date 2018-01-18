# url-redux
Simple reducer for synchronizing url search params with redux state

## Usage
### Initializing reducers
Take default export function and use it as one of your reducers.
Preferably under `url` key, to make selector work.
```
import { combineReducers } from 'redux';
import urlReducer from 'url-redux';

const setQueryToWindow = (query) => {
    window.search = query;
};

const reducer = combineReducers({
    ...yourReducer,
    // if the setQueryToWindow is not specified, default window.history.pushState used
    url: urlReducer(setQueryToWindow),
})
```

### Inside Component
Selector and actions in action.
```
import * as React from 'react';
import { connect } from 'react-redux;
import {
    addParam,
    removeParam,
    getUrlParams,
} from 'url-redux';

const SELECTION = "selection",

class App extends React.Component {
    handleSelection = ev => {
        const value = ev.target.value;
        this.props.dispatch(addParam(SELECTION, value));
    }

    handleRemove = () => {
        this.props.dispatch(removeParam(SELECTION));
    }

    render() {
        const { selection } = this.props
        return (
         <div>
            <h3>{selection}</h3>
            <select> onChange={this.handleSelection}
                <option value="all">All</option>
                <option value="first">First</option>
                <option value="second">Seconf</option>
            </select>
            <button onClick={this.handleRemove}>Remove</button>
         </div>
        )
    }
}
export default connect(state => ({
    selection: getUrlParams(state)[SELECTION] || 'all',
}))(App);
```
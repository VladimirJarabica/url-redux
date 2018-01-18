// @flow
import R from 'ramda';

// =======
// Actions
type AddParam = {|
  type: 'url-redux/ADD_PARAM',
  payload: {
    key: string,
    param: string,
  },
|};
type RemoveParam = {|
  type: 'url-redux/REMOVE_PARAM',
  payload: {
    key: string,
  },
|};

type Action = AddParam | RemoveParam;

type Url = { [key: string]: string }; // TODO: add support for arrays

export const addParam = (key: string, param: string): AddParam => ({
  type: 'url-redux/ADD_PARAM',
  payload: { key, param },
});

export const removeParam = (key: string): RemoveParam => ({
  type: 'url-redux/REMOVE_PARAM',
  payload: { key },
});

// ================
// Helper functions
export const makeQuery = (params: Url): string =>
  R.compose(
    R.concat('?'),
    R.join('&'),
    R.map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    ),
    R.keys,
  )(params);

export const parseQuery = (query: string): Url =>
  R.compose(
    R.reduce((acc, keyParam) => {
      const [key, param] = R.split('=')(keyParam);
      return R.assoc(key, param, acc);
    }, {}),
    R.filter(Boolean),
    R.split('&'),
    R.ifElse(query => R.head(query) === '?', R.tail, R.identity),
  )(query);

const pushUrlToWindow = (query: string) => {
  if (!window) return;
  window.history.pushState(
    {},
    null,
    `${window.location.origin}${window.location.pathname}${query}`,
  );
};

// ======
// Reducer
const INITIAL_STATE = R.compose(
  parseQuery,
  R.pathOr('', ['location', 'search']),
)(window);

const urlReducer = (pushUrl: string => void = pushUrlToWindow) => (
  state: Url = INITIAL_STATE,
  action: Action,
): Url => {
  if (!window) return state; // Server rendering
  switch (action.type) {
    case 'url-redux/ADD_PARAM':
      const addedParams = R.assoc(
        action.payload.key,
        action.payload.param,
        state.url,
      );
      pushUrl(addedParams);
      return addedParams;
    case 'url-redux/REMOVE_PARAM':
      const removedParams = R.dissoc(action.payload.key, state);
      pushUrl(removedParams);
      return removedParams;
    default:
      return state;
  }
};

// ========
// Selector
// Can be used only if this reducer is under "url"
export const getUrlParams = (state: { url: Url }): Url => state.url;

export default urlReducer;

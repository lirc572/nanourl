import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

let store;

const initialState = {
  username:
    typeof window !== "undefined"
      ? localStorage.getItem("nanourlUsername")
      : null,
  password:
    typeof window !== "undefined"
      ? localStorage.getItem("nanourlPassword")
      : null,
  remember:
    typeof window !== "undefined"
      ? localStorage.getItem("nanourlRememberCredentials")
      : null,
  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("nanourlAccessToken")
      : null,
  baseUrl: "https://nanourl.ml",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CREDENTIALS":
      const { username, password } = action.payload;
      localStorage.setItem("nanourlUsername", username);
      localStorage.setItem("nanourlPassword", password);
      return {
        ...state,
        username,
        password,
      };
    case "SET_REMEMBER_CREDENTIALS":
      const { remember } = action.payload;
      localStorage.setItem("nanourlRememberCredentials", remember);
      return {
        ...state,
        remember,
      };
    case "SET_ACCESS_TOKEN":
      const { accessToken } = action.payload;
      localStorage.setItem("nanourlAccessToekn", accessToken);
      return {
        ...state,
        accessToken,
      };
    case "LOG_OUT":
      localStorage.removeItem("nanourlAccessToekn");
      return {
        ...state,
        accessToken: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

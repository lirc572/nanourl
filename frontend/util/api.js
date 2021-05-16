import { initializeStore } from "../store";
import { message } from "antd";
import axios from "axios";
import Router from "next/router";

let instance;
let _baseUrl;

function initInstance() {
  const { baseUrl, accessToken } = initializeStore().getState();
  _baseUrl = baseUrl;
  return axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function getAxiosInstance() {
  let _instance = instance ?? initInstance();

  // Use the latest working access token
  _instance.interceptors.request.use(
    function (config) {
      const { accessToken } = initializeStore().getState();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    function (error) {
      console.log(`Set token error: ${error}`);
      return Promise.reject(error);
    }
  );

  // Automatically update access token if the server issues one in the response headers
  _instance.interceptors.response.use(
    function (response) {
      if (response.headers["Updated-Token"]) {
        initializeStore().dispatch({
          type: "SET_ACCESS_TOKEN",
          payload: {
            accessToken: response.headers["Updated-Token"],
          },
        });
      }
      return response;
    },
    function (error) {
      if (
        error.request.responseURL != `${_baseUrl}/login` &&
        error.request.responseURL != `${_baseUrl}/register`
      ) {
        if (error.response.status === 401) {
          message.error("Authentication failed. Please login again!", 5);
          initializeStore().dispatch({ type: "LOG_OUT" });
          Router.push("/");
        }
      }
      return Promise.reject(error);
    }
  );

  if (!instance) {
    instance = _instance;
  }
  return _instance;
}

export async function registerAccount(username, password) {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "post",
      url: "/register",
      transformRequest: (data, headers) => {
        delete headers["Authorization"];
        headers["Content-Type"] = "application/json";
        return JSON.stringify(data);
      },
      data: {
        username,
        password,
      },
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response;
      }
    } else {
      console.log(error);
    }
  }
}

export async function loginToAccount(username, password) {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "post",
      url: "/login",
      transformRequest: (data, headers) => {
        delete headers["Authorization"];
        headers["Content-Type"] = "application/json";
        return JSON.stringify(data);
      },
      data: {
        username,
        password,
      },
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response;
      }
    } else {
      console.log(error);
    }
  }
}

export async function checkToken() {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "post",
      url: "/checktoken",
    });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        (error.response && error.response.status > 299) ||
        error.response.status < 200
      ) {
        return false;
      }
    }
    return null;
  }
}

export async function readShortUrls() {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "get",
      url: "/api/v1/shorturls",
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createShortUrl(alias, url) {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "post",
      url: "/api/v1/shorturls",
      data: {
        alias,
        url,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function readShortUrl(alias) {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "get",
      url: `/api/v1/shorturls/${alias}`,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateShortUrl(alias, url) {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "put",
      url: `/api/v1/shorturls/${alias}`,
      data: {
        url,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteShortUrl(alias) {
  const _instance = getAxiosInstance();
  try {
    const res = await _instance({
      method: "delete",
      url: `/api/v1/shorturls/${alias}`,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

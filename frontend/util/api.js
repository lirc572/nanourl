import { initializeStore } from "../store";
import axios from "axios";

export async function registerAccount(username, password) {
  const { baseUrl } = initializeStore().getState();
  try {
    const res = await axios.post(`${baseUrl}/register`, {
      username,
      password,
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
  const { baseUrl } = initializeStore().getState();
  try {
    const res = await axios.post(`${baseUrl}/login`, {
      username,
      password,
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

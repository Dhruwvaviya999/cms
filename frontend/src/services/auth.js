import api from "../api/index.js";

export const signUp = (data) => {
  return api.post("/v1/auth/sign-up", data);
};

export const signIn = (data) => {
  return api.post("/v1/auth/sign-in", data);
};

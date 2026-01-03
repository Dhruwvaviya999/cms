import api from "../api";

export const rewriteContent = (data) => {
  return api.post("/v1/content/rewrite", data);
};

import client from "./clinet";

export const loginRequest = async (email, password) => {
  const res = await client.post("/users/login", { email, password });
  return res.data;          
};

export const fetchMe = async () => {
  const res = await client.get("/users/me"); 
  return res.data;          
};

export const signupRequest = async (payload) => {
 
  const res = await client.post("/users/", payload);
  return res.data;          
};

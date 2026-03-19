import axiosInstance from "../lib/axiosInstance";

export async function registerUser(formData) {
  const { data } = await axiosInstance.post("/users/signup", formData);
  return data.data;
}

export async function logInUser(formData) {
  const { data } = await axiosInstance.post("/users/signin", formData);
  return data.data;
}

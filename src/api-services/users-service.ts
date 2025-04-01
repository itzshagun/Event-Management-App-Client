import axios from "axios";
import Cookies from "js-cookie"; 

const API = axios.create({
  baseURL: "http://localhost:5000", // ✅ Ensure correct API base URL
  headers: { "Content-Type": "application/json" },
});

export const registerUser = async (data: any) => {
  // ✅ Fixed 'never' type
  try {
    const response = await API.post("/api/users/register", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed"); // ✅ Improved error handling
  }
};

export const loginUser = async (data: any) => {
  try {
    const response = await API.post("/api/users/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Your account is blocked. Contact the administrator.");
    }
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


export const getCurrentUser = async () => {
  const response = await axios.get("/api/users/current-user");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get("/api/users/get-all-users");
  return response.data;
};

export const updateUserData = async (data: any) => {
  try {
    const token = Cookies.get("token"); // ✅ Get token from cookies
    const response = await axios.put("/api/users/update-user", data, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Attach token
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "User update failed");
  }
};

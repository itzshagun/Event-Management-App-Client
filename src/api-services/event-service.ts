import axios from "axios";

export const createEvent = async (data: any) => {
  console.log("Creating Event - Data Sent:", data); // Debugging
  const response: any = await axios.post("/api/events/create-event", data);
  return response.data;
};

export const getEvents = async (filters: any) => {
  const response: any = await axios.get(
    `/api/events/get-events?searchText=${filters.searchText}&date=${filters.date}`
  );
  return response.data;
};

export const getEventById = async (id: string) => {
  const response: any = await axios.get(`/api/events/get-event/${id}`);
  console.log("Fetched Event Data:", response.data);
  return response.data;
};

export const updateEvent = async (id: string, data: any) => {
  const response: any = await axios.put(`/api/events/edit-event/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response: any = await axios.delete(`/api/events/delete-event/${id}`);
  return response.data;
};

import axios from "axios";

/**
 * Sends a booking request to the backend API
 * @param data Booking details object
 * @returns API response
 */
export const createBooking = async (data: any) => {
    
    try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token from localStorage
        const response = await axios.post('/api/bookings/create-booking', data, {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach token
        });
        return response.data;
    } catch (error: any) {
        console.error("🚨 Booking API Error:", error.response?.data || error.message); // ✅ Log the backend error
        throw error;
    }
};

export const getUserBookings = async () => {
    try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token from localStorage
        const response = await axios.get("/api/bookings/get-user-bookings", {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach token
        });
        return response.data;
    } catch (error: any) {
        console.error("🚨 Fetch Bookings Error:", error.response?.data || error.message);
        throw error;
    }
}

// export const getAllBookings = async () => {
//     const response = await axios.get('/api/bookings/get-all-bookings');
//     return response.data;
// }

export const getAllBookings = async () => {
    try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token
        const response = await axios.get('/api/bookings/get-all-bookings', {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach token
        });
        return response.data;
    } catch (error: any) {
        console.error("🚨 Fetch All Bookings Error:", error.response?.data || error.message);
        throw error;
    }
};

export const cancelBooking = async (data: any) => {
    try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token from localStorage
        const response = await axios.post('/api/bookings/cancel-booking', data, {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach token
        });
        return response.data;
    } catch (error: any) {
        console.error("🚨 Cancel Booking Error:", error.response?.data || error.message);
        throw error;
    }
};

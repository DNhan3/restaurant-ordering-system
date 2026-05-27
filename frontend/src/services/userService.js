import { API_URL } from '../config';

export const userService = {
    getUserByEmail: async (email) => {
        const response = await api.post(`/users/find`, { email });
        return response.data;
    },
};
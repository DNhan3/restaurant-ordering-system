import { API_URL } from '../config';

export const userService = {
    getUserByEmail: async (email) => {
        const response = await fetch(`${API_URL}/users/find`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        
            body: JSON.stringify({ email }),
        });
        return response.json();
    },
};
import api from '../api/axios';

export const foodService = {
  getAll: async () => {
    const response = await api.get(`/foods`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/foods?category=${category}`);
    return response.data;
  },

  create: async (food) => {
    const response = await api.post(`/admin/foods`, food);
    return response.data;
  },

  update: async (id, food) => {
    const response = await api.patch(`/admin/foods/${id}`, food);
    return response.data;
  },

  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(`/admin/foods/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

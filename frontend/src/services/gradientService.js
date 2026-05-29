import API from './api';

export const saveGradient = async (name, colors, type, angle) => {
  try {
    const response = await API.post('/gradients', { name, colors, type, angle });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to save gradient';
    return { success: false, error: message };
  }
};

export const getSavedGradients = async () => {
  try {
    const response = await API.get('/gradients');
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load gradients';
    return { success: false, error: message };
  }
};

export const deleteGradient = async (id) => {
  try {
    const response = await API.delete(`/gradients/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete gradient';
    return { success: false, error: message };
  }
};

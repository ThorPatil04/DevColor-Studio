import API from './api';

export const savePalette = async (name, colors) => {
  try {
    const response = await API.post('/palettes', { name, colors });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to save palette';
    return { success: false, error: message };
  }
};

export const getSavedPalettes = async () => {
  try {
    const response = await API.get('/palettes');
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load palettes';
    return { success: false, error: message };
  }
};

export const deletePalette = async (id) => {
  try {
    const response = await API.delete(`/palettes/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete palette';
    return { success: false, error: message };
  }
};

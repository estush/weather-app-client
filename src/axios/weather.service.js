import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api', 
});

export const getWeather = async (city) => {
  try {
    const response = await apiClient.get('/weather', {
      params: { city },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; 
  }
};


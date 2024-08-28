import React, { useState } from 'react';
import '../style/Weather.scss';
import Logo from '../assets/logo-fintek.png';
import { getWeather } from '../axios/weather.service';

const Weather = () => {
  // State variables
  const [inputValue, setInputValue] = useState(''); // Input field value
  const [error, setError] = useState(''); // General error message
  const [weatherData, setWeatherData] = useState(null); // Weather data from API
  const [isSubmitted, setIsSubmitted] = useState(false); // Flag to check if form is submitted
  const [isLoading, setIsLoading] = useState(false); // Flag to check if data is loading

  // Handle form submission
  const handleSubmit = async () => {
    // Input validation checks
    if (!inputValue) {
      setError('Please enter a city name.');
      setWeatherData(null);
      setIsSubmitted(false);
    } else if (!/^[a-zA-Z\s]+$/.test(inputValue)) {
      setError('Invalid city name. Please enter only English letters.');
      setWeatherData(null);
      setIsSubmitted(false);
    } else {
      setError(''); // Clear previous error message
      setIsLoading(true); // Start loading data
      setIsSubmitted(false); // Reset flag

      try {
        // Fetch weather data from API
        const data = await getWeather(inputValue);
        if (data) {
          setWeatherData(data);
          setIsSubmitted(true);
        } else {
          setError('No data available for this city.');
        }
      } catch (error) {
        // Handle errors thrown by the API
        if (error.response && error.response.status === 400) {
          setError('City not found. Please check the spelling and try again.');
        } else {
          setError('Failed to fetch weather data.');
        }
      } finally {
        setIsLoading(false); // End loading data
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Check for non-English characters
    if (/[\u0590-\u05FF]/.test(value)) {
      setError('Hebrew letters are not allowed. Please enter only English letters.');
    } else {
      setError('');
    }

    setInputValue(value); // Update input field value
  };

  return (
    <div className="weather-container" role="main" aria-labelledby="weather-title">
      <div className="weather-content">
        <div className="weather-logo">
          <img src={Logo} alt="Website logo" className="logo" />
        </div>
        <div className="weather-box">
          {/* Display message and input field when the form is not submitted or data is loading */}
          <div className={`weather-info ${isSubmitted || isLoading ? 'hide' : ''}`} aria-live="polite">
            <p>Use our app <br /> to see the weather <br /> around the world</p>
            <h5 id="weather-title">City Name</h5>
            <div className="weather-input-container">
              <input
                type="text"
                aria-required="true"
                aria-labelledby="weather-title"
                aria-describedby="city-name-desc"
                placeholder="Enter a city name..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <button onClick={handleSubmit} aria-label="Check the weather for the entered city">Check</button>
            </div>
            {error && <p role="alert" className="error-message">{error}</p>}
            {isLoading && <p role="status" className="note">Loading...</p>}
          </div>

          {/* Display weather data when the form is submitted */}
          {isSubmitted && weatherData && (
            <div className="weather-display" aria-live="polite">
              <div className="weather-display weather-turquoise">
                <h2 className="city">{weatherData.city}</h2>
                <h3 className="cun">{weatherData.country}</h3>
                <p className='date-time'>{weatherData.dateTime}</p>
                <h1 className='temp'>{weatherData.temperature}°</h1>
                <p className='cond'>{weatherData.condition}</p>
                <div className="weather-details">
                  {/* Display weather details in a table */}
                  <div className="weather-table">
                    <div className="weather-table-header">
                      <div className="weather-table-cell">Precipitation</div>
                      <div className="weather-table-cell">Humidity</div>
                      <div className="weather-table-cell">Wind</div>
                    </div>
                    <div className="weather-table-body">
                      <div className="weather-table-cell">{weatherData.precipitation} mm</div>
                      <div className="weather-table-cell">{weatherData.humidity}%</div>
                      <div className="weather-table-cell">{weatherData.wind} km/h</div>
                    </div>
                  </div>
                </div>

                {/* Display temperature data in a table */}
                <div className="temperature-table">
                  <div className="temperature-table-header">
                    {weatherData.temperatures.map(t => (
                      <div key={t.time} className="temperature-table-cell">{t.time}</div>
                    ))}
                  </div>
                  <div className="temperature-table-body">
                    {weatherData.temperatures.map(t => (
                      <div key={t.time} className="temperature-table-cell">{t.temperature}°</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;

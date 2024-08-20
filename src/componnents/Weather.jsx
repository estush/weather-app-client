import React, { useState } from 'react';
import '../style/Weather.scss';
import Logo from '../assets/logo-fintek.png';
import { getWeather } from '../axios/weather.service';

const Weather = () => {
  // State variables
  const [inputValue, setInputValue] = useState(''); // Value of the input field
  const [errorMessage, setErrorMessage] = useState(''); // Error message for validation
  const [weatherData, setWeatherData] = useState(null); // Weather data from the API
  const [error, setError] = useState(null); // Error message for API errors
  const [isSubmitted, setIsSubmitted] = useState(false); // Flag to check if the form is submitted
  const [isLoading, setIsLoading] = useState(false); // Flag to check if data is being fetched

  // Handle form submission
  const handleSubmit = async () => {
    // Input validation
    if (!inputValue) {
      setErrorMessage('Please enter a city name.');
      setWeatherData(null);
      setError(null);
      setIsSubmitted(false);
    } else if (!/^[a-zA-Z\s]+$/.test(inputValue)) {
      setErrorMessage('Invalid city name. Please enter only English letters.');
      setWeatherData(null);
      setError(null);
      setIsSubmitted(false);
    } else {
      setErrorMessage('');
      setIsSubmitted(false);
      setIsLoading(true);
      setWeatherData(null);
      setError(null);

      try {
        const data = await getWeather(inputValue);
        if (data) {
          setWeatherData(data);
          setIsSubmitted(true);
        } else {
          setError('No data available for this city.');
        }
      } catch (error) {
        if (error.response && error.response.status == 400) {
          setError('City not found. Please check the spelling and try again.');
        } else {
          setError('Failed to fetch weather data.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Check for non-English characters
    if (/[\u0590-\u05FF]/.test(value)) {
      setErrorMessage('Hebrew letters are not allowed. Please enter only English letters.');
    } else {
      setErrorMessage('');
    }

    setInputValue(value);
  };

  return (
    <div className="weather-container" role="main" aria-labelledby="weather-title">
      <div className="weather-content">
        <div className="weather-logo">
          <img src={Logo} alt="Website logo" className="logo" />
        </div>
        <div className="weather-box">
          {/* Display message and input field when not submitted or loading */}
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
            {errorMessage && <p role="alert" className="error-message">{errorMessage}</p>}
            {isLoading && <p role="status" className="note">Loading...</p>}
            {error && !isLoading && (
              <p role="alert" className="note">{error}</p>
            )}
          </div>

          {/* Display weather data when submitted */}
          {isSubmitted && weatherData && (
            <div className="weather-display" aria-live="polite">
              <div className="weather-display weather-turquoise">
                <h2 className="city">{weatherData.city}</h2>
                <h3 className="cun">{weatherData.country}</h3>
                <p className='date-time'>{weatherData.dateTime}</p>
                <h1 className='temp'>{weatherData.temperature}°</h1>
                <p className='cond'>{weatherData.condition}</p>
                <div className="weather-details">
                  {/* Display weather details in a table format */}
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

                {/* Display temperature data in a table format */}
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

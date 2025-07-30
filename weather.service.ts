import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface WeatherApiResponse {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
  units: string;
}

export interface ForecastApiResponse {
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
    dt_txt: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly currentWeatherUrl = 'https://weatherapi230.p.rapidapi.com/current';
  private readonly forecastUrl = 'https://open-weather13.p.rapidapi.com/city/fivedaysforcast';
  
  private readonly rapidApiHeaders = new HttpHeaders({
    'x-rapidapi-key': '7a18c59710mshdfa6f4cd6ca7b39p11d1f5jsnd105d5598d8e',
    'x-rapidapi-host': 'weatherapi230.p.rapidapi.com',
    'X-API-Key': '7a18c59710mshdfa6f4cd6ca7b39p11d1f5jsnd105d5598d8e'
  });

  constructor(private http: HttpClient) { }

  searchWeather(city: string): Observable<WeatherApiResponse> {
    if (!city || city.trim() === '') {
      return throwError(() => new Error('City name cannot be empty'));
    }

    const params = {
      units: 'metric',
      location: city.trim()
    };

    return this.http.get<WeatherApiResponse>(this.currentWeatherUrl, {
      headers: this.rapidApiHeaders,
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  getForecast(lat: number, lon: number): Observable<ForecastApiResponse> {
    const url = `${this.forecastUrl}/${lat}/${lon}`;
    return this.http.get<ForecastApiResponse>(url, { 
      headers: this.rapidApiHeaders 
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Failed to fetch weather data';

    if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.status === 404) {
      errorMessage = 'City not found. Please try another location.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your configuration.';
    } else if (error.status === 429) {
      errorMessage = 'Too many requests. Please wait and try again later.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    console.error('Weather API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}



// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// export interface WeatherApiResponse {
//   coord: any;
//   name: string;
//   sys: {
//     country: string;
//   };
//   weather: {
//     description: string;
//     icon: string;
//     main: string;
//   }[];
//   main: {
//     temp: number;
//     temp_min: number;
//     temp_max: number;
//     humidity: number;
//     pressure: number;
//   };
//   wind: {
//     speed: number;
//   };
//   dt: number;
// }

// export interface ForecastApiResponse {
//   list: {
//     dt: number;
//     main: {
//       temp: number;
//       temp_min: number;
//       temp_max: number;
//     };
//     weather: {
//       icon: string;
//       description: string;
//     }[];
//     dt_txt: string;
//   }[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private readonly currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
//   private readonly forecastUrl = 'https://open-weather13.p.rapidapi.com/city/fivedaysforcast';
//   private readonly rapidApiHeaders = new HttpHeaders({
//     'x-rapidapi-key': '7a18c59710mshdfa6f4cd6ca7b39p11d1f5jsnd105d5598d8e',
//     'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
//   });

//   constructor(private http: HttpClient) { }

//   searchWeather(city: string): Observable<WeatherApiResponse> {
//     if (!city || city.trim() === '') {
//       return throwError(() => new Error('City name cannot be empty'));
//     }

//     const url = `${this.currentWeatherUrl}?q=${encodeURIComponent(city.trim())}&units=metric`;
//     return this.http.get<WeatherApiResponse>(url).pipe(
//       catchError(this.handleError)
//     );
//   }

//   getForecast(lat: number, lon: number): Observable<ForecastApiResponse> {
//     const url = `${this.forecastUrl}/${lat}/${lon}`;
//     return this.http.get<ForecastApiResponse>(url, { headers: this.rapidApiHeaders }).pipe(
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'Failed to fetch weather data';

//     if (error.status === 0) {
//       errorMessage = 'Network error. Please check your connection.';
//     } else if (error.status === 404) {
//       errorMessage = 'City not found. Please try another location.';
//     } else if (error.status === 401) {
//       errorMessage = 'Invalid API key. Please check your configuration.';
//     } else if (error.status === 429) {
//       errorMessage = 'Too many requests. Please wait and try again later.';
//     } else if (error.error && error.error.message) {
//       errorMessage = error.error.message;
//     }

//     console.error('Weather API Error:', error);
//     return throwError(() => new Error(errorMessage));
//   }
// }




// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map, switchMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherApiResponse {
//   private geoUrl = 'https://api.openweathermap.org/geo/1.0/direct'; // To get coordinates
//   private rapidApiUrl = 'https://open-weather13.p.rapidapi.com/city/fivedaysforcast';
//   private geoApiKey = 'your_openweathermap_api_key_here'; // Needed for geo API

//   private headers = new HttpHeaders({
//     'x-rapidapi-key': '7a18c59710mshdfa6f4cd6ca7b39p11d1f5jsnd105d5598d8e',
//     'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
//   });

//   constructor(private http: HttpClient) {}

//   /**
//    * Search weather using city name → coordinates → forecast
//    */
//   searchWeather(city: string): Observable<any> {
//     if (!city || city.trim() === '') {
//       return throwError(() => new Error('City name cannot be empty'));
//     }

//     // Step 1: Get latitude/longitude from city name
//     const geoUrl = `${this.geoUrl}?q=${encodeURIComponent(city)}&limit=1&appid=${this.geoApiKey}`;

//     return this.http.get<any[]>(geoUrl).pipe(
//       switchMap((locations) => {
//         if (!locations.length) {
//           throw new Error('City not found');
//         }

//         const { lat, lon } = locations[0];

//         // Step 2: Use lat/lon to get weather from RapidAPI
//         const url = `${this.rapidApiUrl}/${lat}/${lon}`;
//         return this.http.get<any>(url, { headers: this.headers });
//       }),
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse) {
//     let message = 'Something went wrong fetching weather data';
//     if (error.status === 404) {
//       message = 'City not found. Try another name.';
//     } else if (error.status === 401) {
//       message = 'Unauthorized. Check your API keys.';
//     } else if (error.status === 429) {
//       message = 'Too many requests. Please wait.';
//     }
//     return throwError(() => new Error(message));
//   }
// }





// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from '../environments/environment';

// export interface WeatherApiResponse {
//   name: string;
//   sys: {
//     country: string;
//   };
//   weather: {
//     description: string;
//     icon: string;
//     main: string;
//   }[];
//   main: {
//     temp: number;
//     temp_min: number;
//     temp_max: number;
//     humidity: number;
//     pressure: number;
//   };
//   wind: {
//     speed: number;
//   };
//   dt: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
//   private readonly apiKey = environment.openWeatherApiKey;

//   constructor(private http: HttpClient) { }

//   /**
//    * Search for weather by city name
//    */
//   searchWeather(city: string): Observable<WeatherApiResponse> {
//     if (!city || city.trim() === '') {
//       return throwError(() => new Error('City name cannot be empty'));
//     }

//     const encodedCity = encodeURIComponent(city.trim());
//     const url = `${this.apiUrl}?q=${encodedCity}&appid=${this.apiKey}&units=metric`;

//     return this.http.get<WeatherApiResponse>(url).pipe(
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * Handle errors from the OpenWeather API
//    */
//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'Failed to fetch weather data';

//     if (error.status === 0) {
//       errorMessage = 'Network error. Please check your connection.';
//     } else if (error.status === 404) {
//       errorMessage = 'City not found. Please try another location.';
//     } else if (error.status === 401) {
//       errorMessage = 'Invalid API key. Please check your configuration.';
//     } else if (error.status === 429) {
//       errorMessage = 'Too many requests. Please wait and try again later.';
//     } else if (error.error && error.error.message) {
//       errorMessage = error.error.message;
//     }

//     console.error('Weather API Error:', error);
//     return throwError(() => new Error(errorMessage));
//   }
// }



// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from '../environments/environment';



// interface WeatherApiResponse {
//   name: string;
//   sys: {
//     country: string;
//   };
//   weather: {
//     description: string;
//     icon: string;
//     main: string;
//   }[];
//   main: {
//     temp: number;
//     temp_min: number;
//     temp_max: number;
//     humidity: number;
//     pressure: number;
//   };
//   wind: {
//     speed: number;
//   };
//   dt: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
//   private apiKey = environment.openWeatherApiKey;

//   constructor(private http: HttpClient) { }

//   searchWeather(city: string): Observable<WeatherApiResponse> {
//     if (!city || city.trim() === '') {
//       return throwError(() => new Error('City name cannot be empty'));
//     }

//     const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
    
//     return this.http.get<WeatherApiResponse>(url).pipe(
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'Failed to fetch weather data';
    
//     if (error.status === 404) {
//       errorMessage = 'City not found. Please try another location.';
//     } else if (error.status === 401) {
//       errorMessage = 'Invalid API key. Please check configuration.';
//     } else if (error.status === 429) {
//       errorMessage = 'Too many requests. Please try again later.';
//     }
    
//     console.error('Weather API Error:', error);
//     return throwError(() => new Error(errorMessage));
//   }
// }



// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private apiUrl = "https://api.openweathermap.org/data/2.5/weather";
//   private apiKey = environment.openWeatherApiKey;

//   constructor(private http: HttpClient) { }

//   searchWeather(city: string): Observable<any> {
//     if (!city || city.trim() === '') {
//       return throwError(() => new Error('City name cannot be empty'));
//     }

//     const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
    
//     return this.http.get(url).pipe(
//       catchError(error => {
//         console.error('API Error:', error);
//         let errorMsg = 'Failed to fetch weather data';
        
//         if (error.status === 404) {
//           errorMsg = 'City not found. Please try another location.';
//         } else if (error.status === 401) {
//           errorMsg = 'Invalid API key. Please check configuration.';
//         } else if (error.status === 429) {
//           errorMsg = 'Too many requests. Please try again later.';
//         }
        
//         return throwError(() => new Error(errorMsg));
//       })
//     );
//   }
// }






// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private apiUrl = "https://api.openweathermap.org/data/2.5/weather";
//   private apiKey = environment.openWeatherApiKey;

//   constructor(private http: HttpClient) { }

//   searchWeather(city: string): Observable<any> {
//     if (!city || city.trim() === '') {
//       return throwError(() => new Error('City name cannot be empty'));
//     }

//     const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
    
//     return this.http.get(url).pipe(
//       catchError(error => {
//         console.error('Error details:', error);
//         let errorMsg = 'Failed to fetch weather data. Please try again.';
        
//         if (error.status === 404) {
//           errorMsg = 'City not found. Please try another location.';
//         } else if (error.status === 401) {
//           errorMsg = 'Invalid API key. Please check configuration.';
//         }
        
//         return throwError(() => new Error(errorMsg));
//       })
//     );
//   }
// }




// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, catchError, throwError } from 'rxjs';
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private apiUrl = "https://api.openweathermap.org/data/2.5/weather";
//   private apiKey = environment.openWeatherApiKey;

//   constructor(private http: HttpClient) { }

//   searchWeather(city: string): Observable<any> {
//     if (!city || city.trim() === '') {
//       return throwError(() => new Error('City name cannot be empty'));
//     }

//     const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}`;
    
//     return this.http.get(url).pipe(
//       catchError(error => {
//         console.error('Error fetching weather data:', error);
//         return throwError(() => new Error('Failed to fetch weather data. Please try again later.'));
//       })
//     );
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { debounceTime } from 'rxjs/operators';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
  units: string;
}

interface ForecastItem {
  day: string;
  date: string;
  icon: string;
  temp: string;
  description: string;
}

@Component({
  selector: 'app-weatherapp',
  templateUrl: './weatherapp.component.html',
  styleUrls: ['./weatherapp.component.scss']
})
export class WeatherappComponent implements OnInit {
  searchForm: FormGroup;
  data: WeatherData | null = null;
  forecast: ForecastItem[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  lastUpdated: string = '';

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService
  ) {
    this.searchForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    const cityControl = this.searchForm.get('city');
    if (cityControl) {
      cityControl.valueChanges.pipe(
        debounceTime(1000)
      ).subscribe((cityName: string) => {
        if (cityName && cityName.length >= 2) {
          this.searchWeather();
        }
      });
    }
  }

  searchWeather() {
    const city = this.searchForm.get('city')?.value?.trim();
    
    if (!city) {
      this.errorMessage = 'Please enter a city name';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.data = null;
    this.forecast = [];

    this.weatherService.searchWeather(city).subscribe({
      next: (response) => {
        this.processWeatherData(response);
    
        this.isLoading = false;
      },
      error: (error) => {
        this.handleWeatherError(error);
      }
    });
  }

  private processWeatherData(response: WeatherData) {
    this.data = {
      location: response.location,
      temperature: response.temperature,
      description: response.description,
      humidity: response.humidity,
      wind_speed: response.wind_speed,
      units: response.units
    };
    this.lastUpdated = new Date().toLocaleTimeString();
  }

  private handleWeatherError(error: Error) {
    this.isLoading = false;
    this.errorMessage = error.message || 'Failed to fetch weather data';
    console.error('Search error:', error);
    this.data = null;
    this.forecast = [];
  }

  getWeatherIcon(description: string): string {

    const iconMap: {[key: string]: string} = {
      'clear sky': '01d',
      'few clouds': '02d',
      'scattered clouds': '03d',
      'broken clouds': '04d',
      'shower rain': '09d',
      'rain': '10d',
      'thunderstorm': '11d',
      'snow': '13d',
      'mist': '50d'
    };
    const iconCode = iconMap[description.toLowerCase()] || '01d';
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  get cityErrors() {
    return this.searchForm.get('city')?.errors;
  }
}



// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { WeatherService } from '../weather.service';
// import { debounceTime } from 'rxjs/operators';

// interface WeatherData {
//   name: string;
//   sys: {
//     country: string;
//   };
//   coord: {
//     lat: number;
//     lon: number;
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

// interface ForecastItem {
//   day: string;
//   date: string;
//   icon: string;
//   temp: string;
//   description: string;
// }

// @Component({
//   selector: 'app-weatherapp',
//   templateUrl: './weatherapp.component.html',
//   styleUrls: ['./weatherapp.component.scss']
// })
// export class WeatherappComponent implements OnInit {
//   searchForm: FormGroup;
//   data: WeatherData | null = null;
//   forecast: ForecastItem[] = [];
//   errorMessage: string = '';
//   isLoading: boolean = false;
//   lastUpdated: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private weatherService: WeatherService
//   ) {
//     this.searchForm = this.fb.group({
//       city: ['', [Validators.required, Validators.minLength(2)]]
//     });
//   }

//   ngOnInit(): void {
//     const cityControl = this.searchForm.get('city');
//     if (cityControl) {
//       cityControl.valueChanges.pipe(
//         debounceTime(1000)
//       ).subscribe((cityName: string) => {
//         if (cityName && cityName.length >= 2) {
//           this.searchWeather();
//         }
//       });
//     }
//   }

//   searchWeather() {
//     const city = this.searchForm.get('city')?.value?.trim();
    
//     if (!city) {
//       this.errorMessage = 'Please enter a city name';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.data = null;
//     this.forecast = [];

//     this.weatherService.searchWeather(city).subscribe({
//       next: (response) => {
//         this.processWeatherData(response);
//         if (response.coord) {
//           this.getForecastData(response.coord.lat, response.coord.lon);
//         }
//       },
//       error: (error) => {
//         this.handleWeatherError(error);
//       }
//     });
//   }

//   private getForecastData(lat: number, lon: number) {
//     this.weatherService.getForecast(lat, lon).subscribe({
//       next: (forecastResponse) => {
//         this.processForecastData(forecastResponse);
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.isLoading = false;
//         console.error('Forecast error:', error);
//       }
//     });
//   }

//   private processWeatherData(response: WeatherData) {
//     if (response?.main) {
//       this.data = {
//         ...response,
//         main: {
//           temp: response.main.temp,
//           temp_max: response.main.temp_max,
//           temp_min: response.main.temp_min,
//           humidity: response.main.humidity,
//           pressure: response.main.pressure
//         }
//       };
//       this.lastUpdated = new Date().toLocaleTimeString();
//     } else {
//       this.errorMessage = 'Invalid weather data received';
//     }
//   }

//   private processForecastData(response: any) {
//     if (response?.list) {
//       // Group by day and take one entry per day
//       const dailyForecasts = this.groupByDay(response.list);
//       this.forecast = dailyForecasts.slice(0, 5).map(item => ({
//         day: this.getDayName(new Date(item.dt_txt).getDay()),
//         date: new Date(item.dt_txt).toLocaleDateString(),
//         icon: item.weather[0].icon,
//         temp: Math.round(item.main.temp).toString(),
//         description: item.weather[0].description
//       }));
//     }
//   }

//   private groupByDay(forecastList: any[]): any[] {
//     const daysMap = new Map<string, any>();
    
//     forecastList.forEach(item => {
//       const date = new Date(item.dt_txt).toLocaleDateString();
//       if (!daysMap.has(date)) {
//         daysMap.set(date, item);
//       }
//     });
    
//     return Array.from(daysMap.values());
//   }

//   private getDayName(dayIndex: number): string {
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return days[dayIndex];
//   }

//   private handleWeatherError(error: Error) {
//     this.isLoading = false;
//     this.errorMessage = error.message || 'Failed to fetch weather data';
//     console.error('Search error:', error);
//     this.data = null;
//     this.forecast = [];
//   }

//   getWeatherIcon(iconCode: string): string {
//     return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
//   }

//   get cityErrors() {
//     return this.searchForm.get('city')?.errors;
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { WeatherService } from '../weather.service';
// import { debounceTime } from 'rxjs/operators';

// interface WeatherData {
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

// interface ForecastItem {
//   day: string;
//   icon: string;
//   temp: string;
// }

// @Component({
//   selector: 'app-weatherapp',
//   templateUrl: './weatherapp.component.html',
//   styleUrls: ['./weatherapp.component.scss']
// })
// export class WeatherappComponent implements OnInit {
//   searchForm: FormGroup;
//   data: WeatherData | null = null;
//   forecast: ForecastItem[] = [];
//   errorMessage: string = '';
//   isLoading: boolean = false;
//   lastUpdated: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private weatherService: WeatherService
//   ) {
//     this.searchForm = this.fb.group({
//       city: ['', [Validators.required, Validators.minLength(2)]]
//     });
//   }

//   ngOnInit(): void {
//     const cityControl = this.searchForm.get('city');
//     if (cityControl) {
//       cityControl.valueChanges.pipe(
//         debounceTime(1000)
//       ).subscribe((cityName: string) => {
//         if (cityName && cityName.length >= 2) {
//           this.searchWeather();
//         }
//       });
//     }
//   }

//   searchWeather() {
//     const city = this.searchForm.get('city')?.value?.trim();
    
//     if (!city) {
//       this.errorMessage = 'Please enter a city name';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.data = null;
//     this.forecast = [];

//     this.weatherService.searchWeather(city).subscribe({
//       next: (response) => {
//         this.isLoading = false;
//         this.processWeatherData(response);
//       },
//       error: (error) => {
//         this.handleWeatherError(error);
//       }
//     });
//   }

//   private processWeatherData(response: WeatherData) {
//     if (response?.main) {
//       this.data = {
//   ...response,
//   main: {
//     temp: this.kelvinToCelsius(response.main.temp),
//     temp_max: this.kelvinToCelsius(response.main.temp_max),
//     temp_min: this.kelvinToCelsius(response.main.temp_min),
//     humidity: response.main.humidity,
//     pressure: response.main.pressure
//   },
//   weather: response.weather,
//   sys: response.sys,
//   wind: response.wind,
//   dt: response.dt,
//   name: response.name
// };

//       // this.data = {
//       //   ...response,
//       //   main: {
//       //     temp: this.kelvinToCelsius(response.main.temp),
//       //     temp_max: this.kelvinToCelsius(response.main.temp_max),
//       //     temp_min: this.kelvinToCelsius(response.main.temp_min),
//       //     humidity: response.main.humidity,
//       //     pressure: response.main.pressure
//       //   }
//       // };
//       this.lastUpdated = new Date().toLocaleTimeString();
//       this.generateForecast();
//     } else {
//       this.errorMessage = 'Invalid weather data received';
//     }
//   }

//   private handleWeatherError(error: Error) {
//     this.isLoading = false;
//     this.errorMessage = error.message || 'Failed to fetch weather data';
//     console.error('Search error:', error);
//     this.data = null;
//     this.forecast = [];
//   }

//   kelvinToCelsius(kelvin: number): number {
//     return Math.round(kelvin - 273.15);
//   }

//   getWeatherIcon(iconCode: string): string {
//     return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
//   }

//   generateForecast() {
//     const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];
//     const baseTemp = this.data?.main.temp || 20;
    
//     this.forecast = days.map((day, i) => ({
//       day,
//       icon: this.getForecastIcon(i),
//       temp: Math.round(baseTemp + (Math.random() * 6 - 3)).toString()
//     }));
//   }

//   private getForecastIcon(index: number): string {
//     const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
//     return icons[index % icons.length];
//   }

//   get cityErrors() {
//     return this.searchForm.get('city')?.errors;
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { WeatherService } from '../weather.service';
// import { debounceTime } from 'rxjs/operators';

// interface WeatherData {
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

// interface ForecastItem {
//   day: string;
//   icon: string;
//   temp: string;
// }

// @Component({
//   selector: 'app-weatherapp',
//   templateUrl: './weatherapp.component.html',
//   styleUrls: ['./weatherapp.component.scss']
// })
// export class WeatherappComponent implements OnInit {
//   searchForm: FormGroup;
//   data: WeatherData | null = null;
//   forecast: ForecastItem[] = [];
//   errorMessage: string = '';
//   isLoading: boolean = false;

//   // constructor(
//   //   private fb: FormBuilder,
//   //   private weatherService: WeatherService
//   // ) {
//   //   this.searchForm = this.fb.group({
//   //     city: ['', [Validators.required, Validators.minLength(2)]]
//   //   });
//   // }
//   constructor(private fb: FormBuilder) {
//   this.searchForm = this.fb.group({
//     city: ['', [Validators.required, Validators.minLength(2)]]
//   });
// }

//   ngOnInit(): void {
//     const cityControl = this.searchForm.get('city');
//     if (cityControl) {
//       cityControl.valueChanges.pipe(
//         debounceTime(1000)
//       ).subscribe((cityName: string) => {
//         if (cityName && cityName.length >= 2) {
//           this.searchWeather(cityName);
//         }
//       });
//     }
//   }

//   // searchWeather(city: string) {
//   //   if (!this.searchForm || !city || city.trim() === '') {
//   //     this.errorMessage = 'Please enter a valid city name';
//   //     return;
//   //   }

//   //   this.isLoading = true;
//   //   this.errorMessage = '';

//   //   this.weatherService.searchWeather(city).subscribe({
//   //     next: (response) => {
//   //       this.isLoading = false;
//   //       if (response && response.main) {
//   //         this.data = {
//   //           ...response,
//   //           main: {
//   //             temp: this.kelvinToCelsius(response.main.temp),
//   //             temp_max: this.kelvinToCelsius(response.main.temp_max),
//   //             temp_min: this.kelvinToCelsius(response.main.temp_min),
//   //             humidity: response.main.humidity,
//   //             pressure: response.main.pressure
//   //           }
//   //         };
//   //         this.generateForecast();
//   //       }
//   //     },
//   //     error: (error) => {
//   //       this.isLoading = false;
//   //       this.errorMessage = error.message || 'Failed to fetch weather data';
//   //       console.error('Search error:', error);
//   //     }
//   //   });
//   // }
//   searchWeather() {
//   const city = this.searchForm.get('city')?.value; // Safe access
//   if (!city || city.trim() === '') {
//     this.errorMessage = 'Please enter a city name';
//     return;
//   }
//   // ... rest of your API call logic
// }

//   kelvinToCelsius(kelvin: number): number {
//     return Math.round(kelvin - 273.15);
//   }

//   getWeatherIcon(iconCode: string): string {
//     return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
//   }

//   generateForecast() {
//     const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri'];
//     this.forecast = days.map((day, i) => ({
//       day,
//       icon: i % 2 === 0 ? '01d' : '03d',
//       temp: Math.round(this.data!.main.temp + (Math.random() * 4 - 2)).toString()
//     }));
//   }

//   get cityErrors() {
//     return this.searchForm.get('city')?.errors;
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { WeatherService } from '../weather.service';
// import { catchError, debounceTime, Observable, throwError } from 'rxjs';

// interface WeatherData {
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

// interface ForecastItem {
//   day: string;
//   icon: string;
//   temp: string; // Changed to string to match template expectations
// }

// @Component({
//   selector: 'app-weatherapp',
//   templateUrl: './weatherapp.component.html',
//   styleUrls: ['./weatherapp.component.scss']
// })
// export class WeatherappComponent implements OnInit {
//   searchForm!: FormGroup;
//   data: WeatherData | null = null;
//   forecast: ForecastItem[] = [];
//   errorMessage: string = '';
//   apiUrl: any;
//   http: any;
//   apiKey: any;

//   constructor(
//     private fb: FormBuilder,
//     private weatherService: WeatherService
//   ) {
//     this.searchForm = this.fb.group({
//       city: ['', Validators.required]
//     });
//   }

//   // ngOnInit(): void {
//   //   this.searchForm.get('city')?.valueChanges.pipe(
//   //     debounceTime(1000)
//   //     .subscribe((cityName: string) => {
//   //       if (cityName) {
//   //         this.searchWeather(cityName);
//   //       }
//   //     });
//   // }
//   ngOnInit(): void {
//   this.searchForm.get('city')?.valueChanges.pipe(
//     debounceTime(1000)
//   ).subscribe((cityName: string) => {
//     if (cityName) {
//       this.searchWeather(cityName);
//     }
//   });
// }

//   // searchWeather(city: string) {
//   //   if (!city || city.trim() === '') {
//   //     this.errorMessage = 'Please enter a city name';
//   //     return;
//   //   }
//   //   this.errorMessage = '';
//   //   this.weatherService.searchWeather(city).subscribe({
//   //     next: (response: any) => {
//   //       if (response && response.main) {
//   //         this.data = {
//   //           ...response,
//   //           main: {
//   //             temp: this.kelvinToCelsius(response.main.temp),
//   //             temp_max: this.kelvinToCelsius(response.main.temp_max),
//   //             temp_min: this.kelvinToCelsius(response.main.temp_min),
//   //             humidity: response.main.humidity,
//   //             pressure: response.main.pressure
//   //           }
//   //         };
//   //         this.generateForecast();
//   //       } else {
//   //         this.errorMessage = 'Invalid weather data received';
//   //       }
//   //     },
//   //     error: (error) => {
//   //       console.log('API error:', error);
//   //       this.errorMessage = 'Failed to fetch weather data. Please try again.';
//   //     }
//   //   });
//   // }
//   searchWeather(city: string): Observable<any> {
//   if (!city || city.trim() === '') {
//     return throwError(() => new Error('City name cannot be empty'));
//   }

//   const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
  
//   return this.http.get(url).pipe(
//     catchError((error: { status: number; }) => {
//       console.error('Error details:', error);
//       let errorMsg = 'Failed to fetch weather data. Please try again.';
      
//       if (error.status === 404) {
//         errorMsg = 'City not found. Please try another location.';
//       } else if (error.status === 401) {
//         errorMsg = 'Invalid API key. Please check configuration.';
//       }
      
//       return throwError(() => new Error(errorMsg));
//     })
//   );
// }

//   kelvinToCelsius(kelvin: number): number {
//     return kelvin - 273.15;
//   }

//   getWeatherIcon(iconCode: string): string {
//     return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
//   }

//   generateForecast() {
//     const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri'];
//     this.forecast = days.map((day, i) => ({
//       day,
//       icon: i % 2 === 0 ? '01d' : '03d',
//       temp: Math.round(this.data!.main.temp + (Math.random() * 4 - 2)).toString() // Convert to string
//     }));
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { WeatherService } from '../weather.service';
// import { debounceTime } from 'rxjs';
// import { error } from 'console';

// interface WeatherData{
//   name:string;
//   sys:{
//     country:string;
//   };
//   weather:{
//     description:string;
//     icon:string;
//     main:string;
//   }[];
//   main:{
//     temp:number;
//     temp_min:number;
//     temp_max:number;
//     humidity:number;
//     pressure:number;
//   };
//   wind:{
//     speed:number;
//   };
//   dt:number;
// }
// interface ForecastItem{
//   day:string;
//   icon:string;
//   temp:string;
// }

// @Component({
//   selector: 'app-weatherapp',
//   templateUrl: './weatherapp.component.html',
//   styleUrls: ['./weatherapp.component.scss']
// })
// export class WeatherappComponent implements OnInit {
//   searchForm!:FormGroup;
//   data:WeatherData | null=null;
//   forecast:ForecastItem[]=[];
//   errorMessage:string='';


//   constructor(private fb:FormBuilder,
//     private weatherService:WeatherService
//   ) { 
//     this.searchForm=this.fb.group({
//       city:['',Validators.required]
//     })
//   }

//   ngOnInit(): void {
//     this.searchForm.get('city')?.valueChanges.pipe(
//       debounceTime(1000)
//     ).subscribe((cityName)=>{
//       if (cityName){
//         this.searchWeather(cityName)
//       }
//     })
//   }
//   searchWeather(city:string){
//     if (!city || city.trim()===''){
//       this.errorMessage='Please enter a city name';
//       return;
//     }
//     this.errorMessage='';
//     this.weatherService.searchWeather(city).subscribe({
//       next:(response:any)=>{
//         if (response && response.main){
//           this.data={
//             ...response,
//             main:{
//               temp:this.kelvinToCelsius(response.main.temp),
//               temp_max:this.kelvinToCelsius(response.main.temp_max),
//               temp_min:this.kelvinToCelsius(response.main.temp_min),
//               humidity:response.main.humidity,
//               pressure:response.main.pressure
//             }
//           };
//           this.generateForecast();
//         }else {
//           this.errorMessage='Invalid weather data received';
//         }
//       },
//       error:(error)=>{
//         console.log('API error:',error);
//         this.errorMessage='Failed to fetch weather data. Please try again.';

//       }
//     })
//   }
//   kelvinToCelsius(kelvin:number): number {
//     return kelvin - 273.15;
//     throw new Error('Method not implemented.');
//   }
//   getWeatherIcon(iconCode:string):string{
//     return `https://openweathermap.org/img/wn/${iconCode}@2x.png`

//   }
//    generateForecast() {
//     // This is mock data - replace with actual forecast API call
//     const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri'];
//     this.forecast = days.map((day, i) => ({
//       day,
//       icon: i % 2 === 0 ? '01d' : '03d', // Alternate between sun and clouds
//       temp: Math.round(this.data!.main.temp + (Math.random() * 4 - 2)) // Random temp variation
//     }));
 

//   }

// }

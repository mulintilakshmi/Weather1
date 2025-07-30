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





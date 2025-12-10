import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  get<T>(endpoint: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: any) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    this.error.set(errorMessage);
    this.loading.set(false);
    console.error(errorMessage);
  }
}

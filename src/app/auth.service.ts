import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://test-demo.aemenersol.com/api/account/login';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  signIn(username: string, password: string): Observable<string> {
    const body = { username, password };

    return this.http.post<string>(this.apiUrl, body);
  }

  clearToken(): void {
    this.token = null;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }
}

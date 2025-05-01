import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Token } from '../models/Token.model';
import { NewUser } from '../models/User_in.model';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = 'https://unfspring2025wfa3.azurewebsites.net';
  TokenSignal = signal<string | null>(localStorage.getItem('authToken'));
  UserSignal = signal<User | null>(null);
  isLoading = signal(false);

  constructor(private httpClient: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        this.UserSignal.set(JSON.parse(user));
      } catch {
        this.UserSignal.set(null);
      }
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  async FetchUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const result = await firstValueFrom(
        this.httpClient.get<{ id: number; email: string; name: string }>(
          `${this.BASE_URL}/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      this.UserSignal.set(result);
      localStorage.setItem('user', JSON.stringify(result));
      return;
    } catch (err) {
      console.log('Error fetching user info:', err);
      return;
    }
  }

  async Login(username: string, password: string) {
    this.isLoading.set(true);
    let basicAuth = 'Basic ' + btoa(`${username}:${password}`);
    try {
      let result = await firstValueFrom(
        this.httpClient.post<Token>(`${this.BASE_URL}/user/login`, null, {
          headers: { Authorization: basicAuth },
        })
      );
      localStorage.setItem('authToken', result.token);
      this.TokenSignal.set(result.token);

      await this.FetchUser();

      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  Logout(): void {
    localStorage.removeItem('authToken');
    this.TokenSignal.set(null);
    this.UserSignal.set(null);
  }

  async Register(name: string, email: string, password: string) {
    const newUser: NewUser = {
      name: name,
      email: email,
      password: password,
    };

    try {
      this.isLoading.set(true);
      let res = await firstValueFrom(
        this.httpClient.post<User>(`${this.BASE_URL}/user`, newUser)
      );
      return res;
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      this.isLoading.set(true);
    }
  }
}

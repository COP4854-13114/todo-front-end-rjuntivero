import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Token } from '../models/Token.model';
import { NewUser } from '../models/User_in.model';
import { User } from '../models/User.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = import.meta.env.NG_APP_BACKEND_URL;
  TokenSignal = signal<string | null>(localStorage.getItem('authToken'));
  UserSignal = signal<User | null>(null);
  isLoading = signal(false);

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        this.UserSignal.set(JSON.parse(user));
      } catch {
        this.UserSignal.set(null);
      }
    }
  }

  showMessage(message: string, type: 'success' | 'error' | 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`],
    });
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
      throw err;
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
      this.showMessage('Login successful!', 'success');
      return true;
    } catch (err) {
      throw err;
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
      this.showMessage(
        'Registration successful! You can now log in.',
        'success'
      );
      return res;
    } catch (err) {
      throw err;
    } finally {
      this.isLoading.set(true);
    }
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Token } from '../models/Token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = 'https://unfspring2025wfa3.azurewebsites.net';
  TokenSignal = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private httpClient: HttpClient) {}

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
  }

  // Register(): void {
  //   const newUser = {
  //     id: 0,
  //     email: this.email,
  //     password: this.password,
  //     name: 'RJ',
  //   };

  //   this.http
  //     .post<User>(' http://localhost:3000/user', newUser)
  //     .subscribe((response) => {
  //       console.log(newUser);
  //     });
  // }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Token } from '../models/Token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  TokenSignal = signal<string | null>(null);

  constructor(private httpClient: HttpClient) {}

  async Login(username: string, password: string) {
    let basicAuth = 'Basic ' + btoa(`${username}:${password}`);
    try {
      let result = await firstValueFrom(
        this.httpClient.post<Token>('http://localhost:3000/user/login', null, {
          headers: { Authorization: basicAuth },
        })
      );
      localStorage.setItem('authToken', JSON.stringify(result));
      this.TokenSignal.set(result.token);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

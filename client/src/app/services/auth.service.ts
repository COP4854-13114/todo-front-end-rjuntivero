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

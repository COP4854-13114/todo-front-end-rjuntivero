import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  PerformLogin() {
    this.authService.Login(this.username, this.password).then((result) => {
      if (result) {
        console.log('Login successful');
      } else {
        console.log('Login failed');
      }
    });
    alert(`username: ${this.username} + password: ${this.password}`);
  }
}

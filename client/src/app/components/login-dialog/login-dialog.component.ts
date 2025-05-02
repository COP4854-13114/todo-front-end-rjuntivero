import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css',
})
export class LoginDialogComponent {
  constructor(public authSvc: AuthService) {}

  isRegisterMode = signal(false);

  readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  nameFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [Validators.required]);

  close() {
    this.dialogRef.close('User closed the login dialog');
  }

  toggleMode() {
    this.isRegisterMode.update((value) => !value);
  }

  async handleSubmit() {
    if (this.isRegisterMode()) {
      await this.Register();
    } else {
      await this.Login();
    }
  }

  async Register() {
    if (
      this.emailFormControl.invalid ||
      this.passwordFormControl.invalid ||
      this.nameFormControl.invalid
    ) {
      return;
    }
    try {
      this.authSvc.Register(
        this.nameFormControl.value!,
        this.emailFormControl.value!,
        this.passwordFormControl.value!
      );
    } catch (err) {
      console.error('Registration error:', err);
      const error = err as any;
      const status = error?.status;
      const message = error?.error?.message || 'An error occurred';

      if (status === 400) {
        this.emailFormControl.setErrors({ backend: message });
      } else if (status === 409) {
        this.emailFormControl.setErrors({ backend: 'Email already in use' });
      } else {
        this.authSvc.showMessage(
          'Registration failed. Please try again later.',
          'error'
        );
      }
    }
  }

  async Login() {
    if (this.emailFormControl.invalid || this.passwordFormControl.invalid) {
      return;
    }

    try {
      const res = await this.authSvc.Login(
        this.emailFormControl.value!,
        this.passwordFormControl.value!
      );

      if (res) {
        this.dialogRef.close();
      } else {
        console.error('Login failed:');
      }
    } catch (err) {
      this.authSvc.showMessage(
        'Login failed. Invalid Username or password.',
        'error'
      );
      console.error('Login error:', err);
      const error = err as any;
      const status = error?.status;
      const message = error?.error?.message || 'An error occurred';

      if (status === 400) {
        this.passwordFormControl.setErrors({ backend: message });
        this.passwordFormControl.markAsTouched();
        this.passwordFormControl.updateValueAndValidity();
      } else if (status === 404) {
        this.emailFormControl.setErrors({ backend: message });
        this.emailFormControl.markAsTouched();
        this.emailFormControl.updateValueAndValidity();
      } else {
      }
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  handleSubmit() {
    if (this.isRegisterMode()) {
      this.Register();
    } else {
      this.Login();
    }
  }

  Register() {
    if (
      this.emailFormControl.invalid ||
      this.passwordFormControl.invalid ||
      this.nameFormControl.invalid
    ) {
      return;
    }
    try {
    } catch (err) {}
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
      console.error('Login error:', err);
    }
  }
}

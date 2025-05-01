import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TodosService } from '../../services/todos.service';
import { TodoList } from '../../models/TodoList.model';

@Component({
  selector: 'share-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './share-list-dialog.component.html',
  styleUrl: './share-list-dialog.component.css',
})
export class ShareListDialogComponent {
  constructor(private todoSvc: TodosService) {}
  readonly dialogRef = inject(MatDialogRef<ShareListDialogComponent>);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  close() {
    this.dialogRef.close();
  }

  async handleSubmit() {
    if (this.emailFormControl.invalid) return;

    const email = this.emailFormControl.value as string;

    try {
      const res = await this.todoSvc.ShareTodoList(
        this.todoSvc.SelectedTodoList() as TodoList,
        email
      );

      console.log('Todo List Shared:', res);
      this.dialogRef.close(email);
    } catch (err) {
      console.error(err);
      const error = err as any;

      const status = error?.status;
      const message = error?.error?.message || 'An error occurred';

      if (status === 400) {
        this.emailFormControl.setErrors({ backend: message });
      } else if (status === 404) {
        this.emailFormControl.setErrors({ backend: 'User not found' });
      } else {
        this.emailFormControl.setErrors({ backend: 'Failed to share list' });
      }
    }
  }
}

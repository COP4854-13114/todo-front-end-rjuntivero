import { Component, computed, effect, inject } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { SharedUser } from '../../models/SharedUser.model';

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
  constructor(private todoSvc: TodosService, private authSvc: AuthService) {}

  readonly dialogRef = inject(MatDialogRef<ShareListDialogComponent>);

  sharedWithUsers = computed(() => {
    const todoList = this.todoSvc.SelectedTodoList();
    console.log('Computed runs - SelectedTodoList is', todoList);
    return todoList?.shared_with ?? [];
  });

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  close() {
    this.dialogRef.close();
  }

  async RemoveSharedUser(email: string) {
    const selectedList = this.todoSvc.SelectedTodoList();
    if (!selectedList) return;

    try {
      await this.todoSvc.RemoveSharedUser(selectedList.id, email);

      const updatedList = {
        ...selectedList,
        shared_with:
          selectedList.shared_with?.filter((u) => u.email !== email) ?? [],
      };

      this.todoSvc.SelectedTodoList.set(updatedList);

      this.todoSvc.showMessage('User removed from shared list.', 'success');
    } catch (err) {
      console.error(err);
      const error = err as any;
      const message = error?.error?.message || 'An error occurred';
      this.emailFormControl.setErrors({ backend: message });
    }
  }

  async handleSubmit() {
    if (this.emailFormControl.invalid) return;

    const email = this.emailFormControl.value as string;
    const currentUser = this.authSvc.UserSignal();
    const selectedList = this.todoSvc.SelectedTodoList();

    if (
      currentUser &&
      selectedList?.created_by === currentUser.id &&
      email === currentUser.email
    ) {
      this.emailFormControl.setErrors({ backend: 'You own this list' });
      return;
    }

    try {
      const res = await this.todoSvc.ShareTodoList(
        selectedList as TodoList,
        email
      );

      const updatedList = {
        ...selectedList!,
        shared_with: [...(selectedList?.shared_with ?? []), { email }],
      };

      this.todoSvc.SelectedTodoList.set(updatedList);
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

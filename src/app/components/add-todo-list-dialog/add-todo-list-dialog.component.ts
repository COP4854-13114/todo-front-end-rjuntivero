import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TodosService } from '../../services/todos.service';
import { TodoList_in } from '../../models/TodoList_in.model';

@Component({
  selector: 'add-todo-list-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  templateUrl: './add-todo-list-dialog.component.html',
  styleUrl: './add-todo-list-dialog.component.css',
})
export class AddTodoListDialogComponent {
  constructor(private todoSvc: TodosService) {}
  readonly dialogRef = inject(MatDialogRef<AddTodoListDialogComponent>);

  titleFormControl = new FormControl('', [Validators.required]);
  publicFormControl = new FormControl(false);

  close() {
    this.dialogRef.close();
  }

  handleSubmit() {
    if (this.titleFormControl.invalid) {
      return;
    } else {
      const newList: TodoList_in = {
        title: this.titleFormControl.value as string,
        public_list: this.publicFormControl.value as boolean,
      };

      this.todoSvc.AddTodoList(newList).then((res) => {
        console.log('New Todo List Created:', res);
      });

      this.dialogRef.close(newList);
    }
  }
}

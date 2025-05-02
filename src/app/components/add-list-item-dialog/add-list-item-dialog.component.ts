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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TodoListItemsService } from '../../services/todolistitems.service';
import { TodoListItem_in } from '../../models/TodoListItem_in.model';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'add-todo-list-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './add-list-item-dialog.component.html',
  styleUrl: './add-list-item-dialog.component.css',
})
export class AddListItemDialogComponent {
  constructor(
    public todoListSvc: TodoListItemsService,
    private todoSvc: TodosService
  ) {}

  readonly dialogRef = inject(MatDialogRef<AddListItemDialogComponent>);

  taskFormControl = new FormControl('', [Validators.required]);
  dueDateFormControl = new FormControl<string | null>(null);

  close() {
    this.dialogRef.close();
  }

  handleSubmit() {
    if (this.taskFormControl.invalid) return;

    const newItem: TodoListItem_in = {
      task: this.taskFormControl.value as string,
      due_date: this.dueDateFormControl.value || null,
    };

    this.todoListSvc
      .AddTodoListItem(this.todoSvc.SelectedTodoList()?.id as number, newItem)
      .then(() => {
        console.log('Item added successfully');
      });
    this.dialogRef.close(newItem);
  }
}

import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TodosService } from '../../services/todos.service';
import { TodoList } from '../../models/TodoList.model';

@Component({
  selector: 'delete-todo-list-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './delete-todo-list-dialog.component.html',
  styleUrl: './delete-todo-list-dialog.component.css',
})
export class DeleteTodoListDialogComponent {
  constructor(
    private todoSvc: TodosService,
    @Inject(MAT_DIALOG_DATA) public data: { todoList: TodoList }
  ) {}

  readonly dialogRef = inject(MatDialogRef<DeleteTodoListDialogComponent>);

  close() {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.todoSvc.DeleteTodoList(this.data.todoList).then((res) => {
      console.log('Todo List Deleted:', res);
    });
    this.dialogRef.close(this.data.todoList);
  }
}

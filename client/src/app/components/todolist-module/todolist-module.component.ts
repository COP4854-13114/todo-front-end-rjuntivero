import { CommonModule } from '@angular/common';
import { TodoListItem } from '../../models/TodoListItem.model';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { Component, computed, Input, signal } from '@angular/core';
import { TodoList } from '../../models/TodoList.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TodoListDialogComponent } from '../todo-list-dialog/todo-list-dialog.component';

@Component({
  selector: 'app-todolist-module',
  imports: [
    MatButtonModule,
    MatIcon,
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './todolist-module.component.html',
  styleUrl: './todolist-module.component.css',
})
export class TodolistModuleComponent {
  constructor(public authSvc: AuthService, private dialog: MatDialog) {}

  todoListSignal = signal<TodoList | null>(null);

  @Input() set TodoList(value: TodoList) {
    this.todoListSignal.set(value);
  }

  TodoListItems: TodoListItem[] = [];

  isSharedWithUser = computed(() => {
    const todo = this.todoListSignal();
    const userEmail = this.authSvc.UserSignal()?.email;

    if (!todo || !userEmail) return false;

    return (todo.shared_with ?? []).some(
      (sharedUser) => sharedUser.email === userEmail
    );
  });

  openDialog() {
    const dialogRef = this.dialog.open(TodoListDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Login dialog closed with:', result);
    });
  }

  isDisabled = computed(() => {
    const user = this.authSvc.UserSignal();
    const todo = this.todoListSignal();

    console.log('Checking if disabled:');
    console.log('User:', user);
    console.log('TodoList:', todo);

    if (!todo) return true;
    if (!user) return true;
    if (todo.public_list && todo.created_by !== user.id) return true;

    return false;
  });

  ngOnInit() {
    if (this.todoListSignal()?.list_items) {
      this.TodoListItems = this.todoListSignal()!.list_items;
    }
  }
}

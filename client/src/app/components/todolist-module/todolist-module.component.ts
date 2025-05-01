import { CommonModule } from '@angular/common';
import { TodoListItem } from '../../models/TodoListItem.model';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { Component, computed, Input, signal } from '@angular/core';
import { TodoList } from '../../models/TodoList.model';

@Component({
  selector: 'app-todolist-module',
  imports: [CommonModule, MatCardModule, MatCheckboxModule],
  templateUrl: './todolist-module.component.html',
  styleUrl: './todolist-module.component.css',
})
export class TodolistModuleComponent {
  constructor(public authSvc: AuthService) {}

  todoListSignal = signal<TodoList | null>(null);

  @Input() set TodoList(value: TodoList) {
    this.todoListSignal.set(value);
  }

  TodoListItems: TodoListItem[] = [];

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

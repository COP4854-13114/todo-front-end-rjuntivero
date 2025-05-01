import { Component, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TodoList } from '../../models/TodoList.model';
import { TodolistTabComponent } from '../todolist-tab/todolist-tab.component';
import { TodosService } from '../../services/todos.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [MatIcon, CommonModule, FormsModule, TodolistTabComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(
    public todoSvc: TodosService,
    private http: HttpClient,
    private authSvc: AuthService
  ) {}

  options = ['Public', 'Owned', 'Shared'];

  filteredTodoLists = computed(() => {
    const todos = this.todoSvc.TodoListsSignal() ?? [];
    const option = this.options[this.todoSvc.ListViewSignal()];
    const user = this.authSvc.UserSignal();

    return todos.filter((todo) => {
      if (option === 'Public') return todo.public_list;

      if (option === 'Owned') {
        if (!user) return false;
        return todo.created_by === user.id;
      }

      if (option === 'Shared')
        return !todo.public_list && todo.shared_with?.length > 0;

      return true;
    });
  });

  toggleOption(index: number) {
    this.todoSvc.ListViewSignal.set(index);
  }

  ngOnInit(): void {}
}

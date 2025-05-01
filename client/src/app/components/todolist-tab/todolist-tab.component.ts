import { Component, Input } from '@angular/core';
import { TodoList } from '../../models/TodoList.model';
import { TodosService } from '../../services/todos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todolist-tab',
  imports: [CommonModule],
  templateUrl: './todolist-tab.component.html',
  styleUrl: './todolist-tab.component.css',
})
export class TodolistTabComponent {
  @Input() TodoList!: TodoList;
  constructor(public todoSvc: TodosService) {}

  async SelectTodoList(selectedTodoList: TodoList) {
    const todoList = await this.todoSvc.GetTodoList(selectedTodoList.id);
    if (todoList) {
      this.todoSvc.SelectedTodoList.set(todoList);
    } else {
      console.error('Failed to fetch the Todo List.');
    }
  }
}

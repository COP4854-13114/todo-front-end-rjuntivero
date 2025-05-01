import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TodoList } from '../../models/TodoList.model';
import { TodoListItem } from '../../models/TodoListItem.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-todolist-module',
  imports: [MatCardModule, MatCheckboxModule],
  templateUrl: './todolist-module.component.html',
  styleUrl: './todolist-module.component.css',
})
export class TodolistModuleComponent {
  @Input() TodoList!: TodoList;

  TodoListItems: TodoListItem[] = [];
  constructor() {}

  ngOnInit() {
    if (this.TodoList?.list_items) {
      this.TodoListItems = this.TodoList.list_items;
    }
  }
}

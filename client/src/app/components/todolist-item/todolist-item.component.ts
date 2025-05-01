import { Component, Input } from '@angular/core';
import { TodoListItem } from '../../models/TodoListItem.model';
import { TodoListItemsService } from '../../services/todolistitems.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todolist-item',
  imports: [MatCheckboxModule, MatIcon, FormsModule],
  templateUrl: './todolist-item.component.html',
  styleUrl: './todolist-item.component.css',
})
export class TodolistItemComponent {
  @Input() item!: TodoListItem;
  @Input() disabled = false;

  constructor(
    private todoListItemsSvc: TodoListItemsService,
    public authSvc: AuthService,
    public todoSvc: TodosService
  ) {}

  toggleCompleted(completed: boolean) {
    if (this.disabled) return;

    this.todoListItemsSvc.UpdateTodoListItem(
      this.item.todo_list_id,
      this.item.id,
      {
        task: this.item.task,
        due_date: this.item.due_date,
        completed: completed,
      }
    );
  }

  deleteItem() {
    if (this.disabled) return;

    this.todoListItemsSvc.DeleteTodoListItem(
      this.item.todo_list_id,
      this.item.id
    );
  }
}

import { effect, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TodoListItem } from '../models/TodoListItem.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TodosService } from './todos.service';
import { TodoListItem_in } from '../models/TodoListItem_in.model';
import { TodoListItem_Patch } from '../models/TodoListItem_Patch.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TodoListItemsService {
  BASE_URL = import.meta.env.NG_APP_BACKEND_URL;

  TodoListItemsSignal = signal<TodoListItem[] | null>([]);
  headers = new HttpHeaders();

  constructor(
    private httpClient: HttpClient,
    private todosSvc: TodosService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      const selectedList = this.todosSvc.SelectedTodoList();

      this.TodoListItemsSignal.set(null);

      if (selectedList) {
        this.RefreshTodoListItems(selectedList.id);
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error' | 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`],
    });
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    if (!token) return new HttpHeaders();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  async RefreshTodoListItems(todoListId: number) {
    try {
      const res = await firstValueFrom(
        this.httpClient.get<TodoListItem[]>(
          `${this.BASE_URL}/todo/${todoListId}/items`,
          {
            headers: this.getHeaders(),
          }
        )
      );

      this.TodoListItemsSignal.set(
        res.map((item) => ({
          ...item,
          todo_list_id: todoListId,
        }))
      );
      return;
    } catch (err) {
      console.log(err);
      this.TodoListItemsSignal.set(null);
      return err;
    }
  }

  async AddTodoListItem(todoListId: number, item: TodoListItem_in) {
    try {
      let res = await firstValueFrom(
        this.httpClient.post(`${this.BASE_URL}/todo/${todoListId}/item`, item, {
          headers: this.getHeaders(),
        })
      );

      this.RefreshTodoListItems(todoListId);
      this.showMessage('Todo item added successfully!', 'success');
      return res;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async UpdateTodoListItem(
    list_id: number,
    itemId: number,
    updatedItem: TodoListItem_Patch
  ) {
    try {
      let res = await firstValueFrom(
        this.httpClient.patch(
          `${this.BASE_URL}/todo/${list_id}/item/${itemId}`,
          updatedItem,
          {
            headers: this.getHeaders(),
          }
        )
      );
      this.showMessage('Todo item updated successfully!', 'success');
      return res;
    } catch (err) {
      console.log(err);
      this.showMessage('Failed to update todo item.', 'error');
      return err;
    }
  }

  async DeleteTodoListItem(todoListId: number, itemId: number) {
    try {
      await firstValueFrom(
        this.httpClient.delete(
          `${this.BASE_URL}/todo/${todoListId}/item/${itemId}`,
          {
            headers: this.getHeaders(),
          }
        )
      );

      this.RefreshTodoListItems(todoListId);
      this.showMessage('Todo item deleted successfully!', 'success');
      return;
    } catch (err) {
      console.log(err);
      this.showMessage('Failed to delete todo item.', 'error');
      return err;
    }
  }
}

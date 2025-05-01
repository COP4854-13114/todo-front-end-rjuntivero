import { effect, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TodoListItem } from '../models/TodoListItem.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TodosService } from './todos.service';
import { TodoListItem_in } from '../models/TodoListItem_in.model';

@Injectable({
  providedIn: 'root',
})
export class TodoListItemsService {
  BASE_URL = 'https://unfspring2025wfa3.azurewebsites.net';

  TodoListItemsSignal = signal<TodoListItem[] | null>([]);
  headers = new HttpHeaders();

  constructor(private httpClient: HttpClient, private todosSvc: TodosService) {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.headers = this.headers.append('Authorization', `Bearer ${token}`);
    }

    effect(() => {
      const selectedList = this.todosSvc.SelectedTodoList();

      this.TodoListItemsSignal.set(null);

      if (selectedList) {
        this.RefreshTodoListItems(selectedList.id);
      }
    });
  }

  async RefreshTodoListItems(todoListId: number) {
    try {
      const result = await firstValueFrom(
        this.httpClient.get<TodoListItem[]>(
          `${this.BASE_URL}/todo/${todoListId}/items`,
          {
            headers: this.headers,
          }
        )
      );

      this.TodoListItemsSignal.set(result);
    } catch (err) {
      console.log(err);
      this.TodoListItemsSignal.set(null);
    }
  }

  async AddTodoListItem(todoListId: number, item: TodoListItem_in) {
    try {
      let res = await firstValueFrom(
        this.httpClient.post(`${this.BASE_URL}/todo/${todoListId}/item`, item, {
          headers: this.headers,
        })
      );

      this.RefreshTodoListItems(todoListId);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // async DeleteTodoListItem(todoListId: number, itemId: number) {
  //   try {
  //     await firstValueFrom(
  //       this.httpClient.delete(`${this.BASE_URL}/todo/${todoListId}/items/${itemId}`, {
  //         headers: this.headers,
  //       })
  //     );

  //     this.RefreshTodoListItems(todoListId);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}

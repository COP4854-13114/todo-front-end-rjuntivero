import { effect, Injectable, signal } from '@angular/core';
import { TodoList } from '../models/TodoList.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { TodoList_in } from '../models/TodoList_in.model';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  // BASE_URL = 'http://localhost:3000';
  BASE_URL = 'https://unfspring2025wfa3.azurewebsites.net';

  TodoListsSignal = signal<TodoList[] | null>([]);
  SelectedTodoList = signal<TodoList | null>(null);
  isLoading = signal(false);
  ListViewSignal = signal<number>(0);
  headers = new HttpHeaders();

  constructor(private httpClient: HttpClient, private authSvc: AuthService) {
    effect(() => {
      const token = this.authSvc.TokenSignal();

      this.GetTodoLists();
    });

    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('Token:', token);
      this.headers = this.headers.append('Authorization', `Bearer ${token}`);
    }

    this.GetTodoLists().then((todoLists) => {
      if (todoLists) {
        this.TodoListsSignal.set(todoLists);
        if (todoLists.length > 0) {
          this.SelectedTodoList.set(todoLists[0]);
        }
      }
    });
  }

  async GetTodoLists() {
    this.isLoading.set(true);
    try {
      let result = await firstValueFrom(
        this.httpClient.get<TodoList[]>(`${this.BASE_URL}/todo`, {
          headers: this.headers,
        })
      );
      const normalized = result.map((todo) => ({
        ...todo,
        shared_with: todo.shared_with ?? [],
      }));

      return normalized;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async GetTodoList(selectedTodoListID: number) {
    this.isLoading.set(true);
    try {
      let result = await firstValueFrom(
        this.httpClient.get<TodoList>(
          `${this.BASE_URL}/todo/${selectedTodoListID}`,
          { headers: this.headers }
        )
      );
      return result;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async AddTodoList(list: TodoList_in) {
    this.isLoading.set(true);
    const newTodoList = {
      title: list.title,
      public_list: list.public_list,
    };

    try {
      let res = await firstValueFrom(
        this.httpClient.post<TodoList>(`${this.BASE_URL}/todo`, newTodoList, {
          headers: this.headers,
        })
      );
      this.GetTodoLists().then((todoLists) => {
        this.TodoListsSignal.set(todoLists);
      });
      return res;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      this.isLoading.set(false);
      return;
    }
  }
}

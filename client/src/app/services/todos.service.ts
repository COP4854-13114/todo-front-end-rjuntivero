import { effect, Injectable, signal } from '@angular/core';
import { TodoList } from '../models/TodoList.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { TodoList_in } from '../models/TodoList_in.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  BASE_URL = 'https://unfspring2025wfa3.azurewebsites.net';

  TodoListsSignal = signal<TodoList[] | null>([]);
  SelectedTodoList = signal<TodoList | null>(null);
  isLoading = signal(false);
  ListViewSignal = signal<number>(0);
  headers = new HttpHeaders();

  constructor(
    private httpClient: HttpClient,
    private authSvc: AuthService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      const token = this.authSvc.TokenSignal();
      const view = this.ListViewSignal();

      this.RefreshTodoLists();
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

  filterTodoLists(
    todos: TodoList[],
    view: string,
    user: User | null
  ): TodoList[] {
    return todos.filter((todo) => {
      if (view === 'Public') return todo.public_list;
      if (view === 'Owned') return user && todo.created_by === user.id;
      if (view === 'Shared')
        return !todo.public_list && user && todo.created_by !== user.id;
      return true;
    });
  }

  async RefreshTodoLists() {
    const todoLists = await this.GetTodoLists();
    this.TodoListsSignal.set(todoLists);

    const option = ['Public', 'Owned', 'Shared'][this.ListViewSignal()];
    const user = this.authSvc.UserSignal();
    const filtered = this.filterTodoLists(todoLists ?? [], option, user);

    if (filtered.length > 0) {
      this.SelectedTodoList.set(filtered[0]);
    } else {
      this.SelectedTodoList.set(null);
    }
  }

  async GetTodoLists() {
    this.isLoading.set(true);
    try {
      let result = await firstValueFrom(
        this.httpClient.get<TodoList[]>(`${this.BASE_URL}/todo`, {
          headers: this.getHeaders(),
        })
      );
      return result.map((todo) => ({
        ...todo,
        shared_with: todo.shared_with ?? [],
      }));
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
          { headers: this.getHeaders() }
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
    try {
      const res = await firstValueFrom(
        this.httpClient.post<TodoList>(`${this.BASE_URL}/todo`, list, {
          headers: this.getHeaders(),
        })
      );
      await this.RefreshTodoLists();
      this.showMessage('List created successfully!', 'success');
      return res;
    } catch (err) {
      console.log(err);
      this.showMessage('Failed to create list.', 'error');
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async UpdateTodoList(
    list_id: number,
    updateData: { title: string; public_list: boolean }
  ) {
    this.isLoading.set(true);
    try {
      await firstValueFrom(
        this.httpClient.patch(`${this.BASE_URL}/todo/${list_id}`, updateData, {
          headers: this.getHeaders(),
        })
      );
      await this.RefreshTodoLists();
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async DeleteTodoList(list: TodoList) {
    this.isLoading.set(true);
    try {
      await firstValueFrom(
        this.httpClient.delete(`${this.BASE_URL}/todo/${list.id}`, {
          headers: this.getHeaders(),
        })
      );
      await this.RefreshTodoLists();
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async ShareTodoList(list: TodoList, email: string) {
    this.isLoading.set(true);
    try {
      let res = await firstValueFrom(
        this.httpClient.post(
          `${this.BASE_URL}/todo/${list.id}/share`,
          { email },
          {
            headers: this.getHeaders(),
          }
        )
      );

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}

import { Injectable, signal } from '@angular/core';
import { TodoList } from '../models/TodoList.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TodosService {
  // BASE_URL = 'http://localhost:3000';
  BASE_URL = 'https://unfspring2025wfa3.azurewebsites.net';
  TodoListsSignal = signal<TodoList[] | null>([]);
  SelectedTodoList = signal<TodoList | null>(null);
  isLoading = signal(false);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    const todoLists = this.GetTodoLists().subscribe((todoLists: TodoList[]) => {
      this.TodoListsSignal.set(todoLists);
      if (todoLists.length > 0) {
        this.SelectedTodoList.set(todoLists[0]);
      }
    });

    console.log(todoLists);
  }

  GetTodoLists() {
    return this.httpClient.get<TodoList[]>(`${this.BASE_URL}/todo`);
  }

  async GetTodoList(selectedTodoListID: number) {
    this.isLoading.set(true);
    try {
      let result = await firstValueFrom(
        this.httpClient.get<TodoList>(
          `${this.BASE_URL}/todo/${selectedTodoListID}`
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

  AddTodoList(): void {
    this.isLoading.set(true);
    const newTodoList = {
      title: 'jajklsd',
      public_list: true,
    };

    let headers = new HttpHeaders();
    if (localStorage.getItem('authToken')) {
      console.log('Token:', localStorage.getItem('authToken'));
      headers = headers.append(
        'Authorization',
        `Bearer ${localStorage.getItem('authToken')}`
      );
    }

    this.httpClient
      .post<TodoList>(`${this.BASE_URL}/todo`, newTodoList, { headers })
      .subscribe((response: any) => {
        console.log('Todo List created:', response);
      });
    this.isLoading.set(false);
  }
}

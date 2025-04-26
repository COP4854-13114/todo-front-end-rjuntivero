import { Injectable, signal } from '@angular/core';
import { TodoList } from '../models/TodoList.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class TodosService {
  BASE_URL = 'http://localhost:3000';
  TodoListsSignal = signal<TodoList[] | null>([]);
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getTodoLists() {
    return this.httpClient.get<TodoList[]>(`${this.BASE_URL}/todos`);
  }

  addTodoList(): void {
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
      .post<TodoList>(' http://localhost:3000/todo', newTodoList, { headers })
      .subscribe((response: any) => {
        console.log('Todo List created:', response);
      });
  }
}

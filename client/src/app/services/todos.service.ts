import { Injectable, signal } from '@angular/core';
import { TodoList } from '../models/TodoList.model';
import { HttpClient } from '@angular/common/http';
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
}

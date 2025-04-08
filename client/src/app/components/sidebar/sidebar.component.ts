import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

interface TodoList {
  id: number;
  title: string;
  created_at: string;
  created_by: number;
  public_list: boolean;
  list_items: TodoListItem[];
  shared_with: SharedUser[];
}

interface TodoListItem {
  id: number;
  task: string;
  completed: boolean;
  todo_list_id: number;
  completed_by: number | null;
  completed_date: string | null;
  updated_at: string;
  due_date: string | null;
  completed_by_user: CompletedByUser | null;
}

interface SharedUser {
  email: string;
}

interface CompletedByUser {
  email: string;
  name: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private http: HttpClient) {}
  publicTodoLists: TodoList[] = [];
  ownedTodoLists: TodoList[] = [];
  sharedTodoLists: TodoList[] = [];
  visibleTodoLists: TodoList[] = [];
  token: string | null = localStorage.getItem('authToken');
  currentUserId: string | null = localStorage.getItem('current_user');

  ngOnInit(): void {
    let headers = new HttpHeaders();

    if (this.token) {
      headers = headers.append('Authorization', `Bearer ${this.token}`);
    }

    this.http
      .get<any[]>('http://localhost:3000/todo', {
        headers,
        observe: 'response',
      })
      .subscribe(
        (response: HttpResponse<any[]>) => {
          const data = response.body;
          const responseHeaders = response.headers;

          console.log('Response Headers:', responseHeaders);
          console.log('Content-Type:', responseHeaders.get('Content-Type')); // Example: Get a specific header

          if (!data || data.length === 0) {
            this.publicTodoLists = [];
            this.ownedTodoLists = [];
            this.sharedTodoLists = [];
            this.visibleTodoLists = [];
            return;
          }

          if (this.token) {
            this.publicTodoLists = data.filter((todo) => todo.public_list);
            this.ownedTodoLists = data.filter((todo) => todo.isOwned);
            this.sharedTodoLists = data.filter((todo) => todo.isShared);
            this.visibleTodoLists = [
              ...this.publicTodoLists,
              ...this.ownedTodoLists,
              ...this.sharedTodoLists,
            ];
          } else {
            this.publicTodoLists = data?.filter((todo) => todo.public_list);
            this.visibleTodoLists = this.publicTodoLists;
          }
          console.log('Visible Todo Lists:', this.visibleTodoLists);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
}

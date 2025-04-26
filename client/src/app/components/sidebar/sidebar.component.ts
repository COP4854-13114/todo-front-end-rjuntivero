import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TodoList } from '../../models/TodoList.model';
import { TodolistTabComponent } from '../todolist-tab/todolist-tab.component';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, TodolistTabComponent],
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
  currentUserId: number | undefined = localStorage.getItem('current_user')
    ? parseInt(localStorage.getItem('current_user')!)
    : undefined;

  newTodoListTitle: string = '';
  email: string = '';
  password: string = '';
  loginEmail: string = '';
  loginPassword: string = '';

  ngOnInit(): void {
    // let headers = new HttpHeaders();
    // // localStorage.clear();
    // this.http
    //   .get<TodoList[]>('http://localhost:3000/todo', {
    //     headers,
    //     observe: 'response',
    //   })
    //   .subscribe(
    //     (response: HttpResponse<any[]>) => {
    //       const data = response.body;
    //       const responseHeaders = response.headers;
    //       console.log('Response Headers:', responseHeaders);
    //       console.log('Content-Type:', responseHeaders.get('Content-Type'));
    //       if (!data || data.length === 0) {
    //         this.publicTodoLists = [];
    //         this.ownedTodoLists = [];
    //         this.sharedTodoLists = [];
    //         this.visibleTodoLists = [];
    //         return;
    //       }
    //       if (this.token) {
    //         this.publicTodoLists = data.filter((todo) => todo.public_list);
    //         this.ownedTodoLists = data.filter((todo) => todo.isOwned);
    //         this.sharedTodoLists = data.filter((todo) => todo.isShared);
    //         this.visibleTodoLists = [
    //           ...this.publicTodoLists,
    //           ...this.ownedTodoLists,
    //           ...this.sharedTodoLists,
    //         ];
    //       } else {
    //         this.publicTodoLists = data?.filter((todo) => todo.public_list);
    //         this.visibleTodoLists = this.publicTodoLists;
    //       }
    //       console.log('Visible Todo Lists:', this.visibleTodoLists);
    //     },
    //     (error) => {
    //       console.error('Error fetching data:', error);
    //     }
    //   );
  }
}

import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TodoList } from '../../models/TodoList.model';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
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

  register(): void {
    const newUser = {
      id: 0,
      email: this.email,
      password: this.password,
      name: 'RJ',
    };

    this.http
      .post<User>(' http://localhost:3000/user', newUser)
      .subscribe((response) => {
        console.log(newUser);
      });
  }

  login(): void {
    const credentials = {
      loginEmail: this.loginEmail,
      loginPassword: this.loginPassword,
    };

    const authValue = `${this.loginEmail}:${this.loginPassword}`;
    const encodedAuthValue = btoa(authValue);
    console.log('Encoded Auth Value:', encodedAuthValue);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', `Basic ${encodedAuthValue}`);
    console.log(this.token);

    this.http
      .post<{ token: string }>(
        ' http://localhost:3000/user/login',
        credentials,
        { headers }
      )
      .subscribe((response) => {
        console.log(response);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('current_user', this.loginEmail);
      });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    console.log('Logged out successfully!');
  }

  addTodoList(): void {
    const newTodoList = {
      title: this.newTodoListTitle,
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

    this.http
      .post<TodoList>(' http://localhost:3000/todo', newTodoList, { headers })
      .subscribe((response) => {
        console.log('Todo List created:', response);
        this.visibleTodoLists.push(response);
      });
  }

  ngOnInit(): void {
    let headers = new HttpHeaders();
    // localStorage.clear();

    this.http
      .get<TodoList[]>('http://localhost:3000/todo', {
        headers,
        observe: 'response',
      })
      .subscribe(
        (response: HttpResponse<any[]>) => {
          const data = response.body;
          const responseHeaders = response.headers;

          console.log('Response Headers:', responseHeaders);
          console.log('Content-Type:', responseHeaders.get('Content-Type'));

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

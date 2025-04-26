import { Component, OnInit, signal } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { firstValueFrom } from 'rxjs';
import { TodoList } from '../../models/TodoList.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private todoSvc: TodosService) {}

  todoSignal = signal<TodoList[]>([]);
  async ngOnInit() {
    try {
      let data = await firstValueFrom(this.todoSvc.getTodoLists());
      this.todoSignal.set(data);
    } catch (err) {
      console.log(err);
    }
  }
}

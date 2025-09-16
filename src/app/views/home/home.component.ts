import { Component } from '@angular/core';
import { TodolistModuleComponent } from '../../components/todolist-module/todolist-module.component';
import { TodosService } from '../../services/todos.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [MatProgressSpinnerModule, TodolistModuleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(public todoSvc: TodosService) {}
}

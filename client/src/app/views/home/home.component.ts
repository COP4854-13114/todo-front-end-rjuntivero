import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TodolistModuleComponent } from '../../components/todolist-module/todolist-module.component';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, TodolistModuleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(public todoSvc: TodosService) {}
}

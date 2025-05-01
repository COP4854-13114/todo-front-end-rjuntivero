import { Component } from '@angular/core';
import { ActionbuttonComponent } from '../actionbutton/actionbutton.component';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-navbar',
  imports: [ActionbuttonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public todoSvc: TodosService) {}
}

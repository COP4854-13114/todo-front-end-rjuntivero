import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-todolist-module',
  imports: [MatCardModule],
  templateUrl: './todolist-module.component.html',
  styleUrl: './todolist-module.component.css',
})
export class TodolistModuleComponent {}

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-actionbutton',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './actionbutton.component.html',
  styleUrl: './actionbutton.component.css',
})
export class ActionbuttonComponent {}

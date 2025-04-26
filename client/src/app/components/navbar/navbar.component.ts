import { Component } from '@angular/core';
import { ActionbuttonComponent } from '../actionbutton/actionbutton.component';

@Component({
  selector: 'app-navbar',
  imports: [ActionbuttonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {}

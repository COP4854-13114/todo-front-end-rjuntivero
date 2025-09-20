import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { AddTodoListDialogComponent } from '../add-todo-list-dialog/add-todo-list-dialog.component';
import { ComponentType } from '@angular/cdk/overlay';
@Component({
  selector: 'app-actionbutton',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './actionbutton.component.html',
  styleUrl: './actionbutton.component.css',
})
export class ActionbuttonComponent {
  constructor(public authSvc: AuthService, private dialog: MatDialog) {}

  openDialog(type: 'login' | 'add') {
    const component: ComponentType<any> =
      type === 'login' ? LoginDialogComponent : AddTodoListDialogComponent;

    const dialogRef = this.dialog.open(component);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(
        `${type === 'login' ? 'Login' : 'Add Todo List'} dialog closed with:`,
        result
      );
    });
  }
}

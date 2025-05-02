import { CommonModule } from '@angular/common';
import { TodoListItem } from '../../models/TodoListItem.model';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { Component, computed, Input, signal } from '@angular/core';
import { TodoList } from '../../models/TodoList.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DeleteTodoListDialogComponent } from '../delete-todo-list-dialog/delete-todo-list-dialog.component';
import { ComponentType } from '@angular/cdk/overlay';
import { AddListItemDialogComponent } from '../add-list-item-dialog/add-list-item-dialog.component';
import { ShareListDialogComponent } from '../share-list-dialog/share-list-dialog.component';
import { TodoListItemsService } from '../../services/todolistitems.service';
import { TodolistItemComponent } from '../todolist-item/todolist-item.component';
import { FormControl, Validators } from '@angular/forms';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todolist-module',
  imports: [
    MatButtonModule,
    MatIcon,
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    TodolistItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './todolist-module.component.html',
  styleUrl: './todolist-module.component.css',
})
export class TodolistModuleComponent {
  constructor(
    public authSvc: AuthService,
    private todoSvc: TodosService,
    private dialog: MatDialog,
    private todoListItemsSvc: TodoListItemsService
  ) {}

  todoListSignal = signal<TodoList | null>(null);
  editingTitle = signal(false);
  titleFormControl = new FormControl('', [Validators.required]);

  startEditing() {
    this.editingTitle.set(true);
    this.titleFormControl.setValue(this.todoListSignal()!.title);
  }

  async submitTitle() {
    const newTitle = this.titleFormControl.value?.trim();

    // If empty → don't allow
    if (!newTitle) {
      this.todoSvc.showMessage("Title can't be empty.", 'error');
      this.editingTitle.set(false);
      return;
    }

    // If unchanged → don't patch
    if (newTitle === this.todoListSignal()!.title) {
      this.editingTitle.set(false);
      return;
    }

    this.editingTitle.set(false);

    const currentList = this.todoListSignal()!;
    const payload = {
      title: newTitle,
      public_list: currentList.public_list,
    };

    try {
      await this.todoSvc.UpdateTodoList(currentList.id, payload);
      await this.todoSvc.RefreshTodoLists();
      this.todoSvc.showMessage('List title updated!', 'success');
    } catch (err) {
      this.todoSvc.showMessage('Failed to update title.', 'error');
    }
  }

  @Input() set TodoList(value: TodoList) {
    this.todoListSignal.set(value);
  }

  get TodoListItemsSignal() {
    return this.todoListItemsSvc.TodoListItemsSignal;
  }
  readonly visibleItems = computed(() => this.TodoListItemsSignal() ?? []);

  readonly isReady = computed(() => {
    return (
      this.todoListSignal() !== null && this.TodoListItemsSignal() !== null
    );
  });
  isSharedWithUser = computed(() => {
    const todo = this.todoListSignal();
    const user = this.authSvc.UserSignal();

    if (!todo || !user) return false;

    return !todo.public_list && todo.created_by !== user.id;
  });

  openDialog(type: 'add-item' | 'delete-list' | 'share-list') {
    let component: ComponentType<any> | undefined;
    if (type === 'add-item') {
      component = AddListItemDialogComponent;
    } else if (type === 'delete-list') {
      component = DeleteTodoListDialogComponent;
    } else if (type === 'share-list') {
      component = ShareListDialogComponent;
    } else {
      return;
    }
    if (!component) return;

    const data = {
      todoList: this.todoListSignal(),
    };

    const dialogRef = this.dialog.open(component, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`${type} dialog closed with:`, result);
    });
  }

  isDisabled = computed(() => {
    const user = this.authSvc.UserSignal();
    const todo = this.todoListSignal();

    console.log('Checking if disabled:');
    console.log('User:', user);
    console.log('TodoList:', todo);

    if (!todo) return true;
    if (!user) return true;
    if (todo.public_list && todo.created_by !== user.id) return true;

    return false;
  });
}

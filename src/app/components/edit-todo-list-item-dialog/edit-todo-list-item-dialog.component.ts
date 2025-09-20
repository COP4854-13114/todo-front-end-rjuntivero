import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TodoListItemsService } from '../../services/todolistitems.service';
import { TodoListItem } from '../../models/TodoListItem.model';
import { TodosService } from '../../services/todos.service';
import { Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TodoListItem_Patch } from '../../models/TodoListItem_Patch.model';

@Component({
  selector: 'edit-todo-list-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './edit-todo-list-item-dialog.component.html',
  styleUrl: './edit-todo-list-item-dialog.component.css',
})
export class EditTodoListItemDialogComponent {
  constructor(
    private todoListSvc: TodoListItemsService,
    public authSvc: AuthService,
    private todoSvc: TodosService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public item: TodoListItem
  ) {}

  readonly dialogRef = inject(MatDialogRef<EditTodoListItemDialogComponent>);

  taskFormControl!: FormControl<string | null>;
  dueDateFormControl!: FormControl<string | null>;

  close() {
    this.dialogRef.close();
  }

  async handleSubmit() {
    if (this.taskFormControl.invalid) return;

    const updatedItem: TodoListItem_Patch = {
      task: this.taskFormControl.value as string,
      due_date: this.dueDateFormControl.value || null,
      completed: this.item.completed,
    };

    try {
      await this.todoListSvc.UpdateTodoListItem(
        this.todoSvc.SelectedTodoList()!.id,
        this.item.id,
        updatedItem
      );
      this.dialogRef.close(updatedItem);
    } catch (err) {
      console.error('Failed to update todo item', err);
    }
  }
  ngOnInit() {
    this.taskFormControl = new FormControl<string>(
      (this.item.task ?? '') as string,
      [Validators.required]
    );

    this.dueDateFormControl = new FormControl<string | null>(
      this.item.due_date || null
    );
  }
}

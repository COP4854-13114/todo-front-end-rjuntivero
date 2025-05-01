import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

@Component({
  selector: 'add-todo-list-item-dialog',
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
  ],
  templateUrl: './add-list-item-dialog.component.html',
  styleUrl: './add-list-item-dialog.component.css',
})
export class AddListItemDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddListItemDialogComponent>);

  // Form Controls
  taskFormControl = new FormControl('', [Validators.required]);
  dueDateFormControl = new FormControl<string | null>(null);

  close() {
    this.dialogRef.close();
  }

  handleSubmit() {
    if (this.taskFormControl.invalid) return;

    const newItem = {
      task: this.taskFormControl.value,
      due_date: this.dueDateFormControl.value || null,
    };

    console.log('Creating new Todo Item:', newItem);
    this.dialogRef.close(newItem);
  }
}

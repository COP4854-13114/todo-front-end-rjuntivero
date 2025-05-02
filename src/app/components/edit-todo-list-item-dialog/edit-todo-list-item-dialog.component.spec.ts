import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTodoListItemDialogComponent } from './edit-todo-list-item-dialog.component';

describe('EditTodoListItemDialogComponent', () => {
  let component: EditTodoListItemDialogComponent;
  let fixture: ComponentFixture<EditTodoListItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTodoListItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTodoListItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTodoListDialogComponent } from './delete-todo-list-dialog.component';

describe('DeleteTodoListDialogComponent', () => {
  let component: DeleteTodoListDialogComponent;
  let fixture: ComponentFixture<DeleteTodoListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTodoListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTodoListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

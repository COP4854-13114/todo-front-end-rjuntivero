import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListItemDialogComponent } from './add-list-item-dialog.component';

describe('AddListItemDialogComponent', () => {
  let component: AddListItemDialogComponent;
  let fixture: ComponentFixture<AddListItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddListItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

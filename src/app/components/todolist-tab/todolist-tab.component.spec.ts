import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodolistTabComponent } from './todolist-tab.component';

describe('TodolistTabComponent', () => {
  let component: TodolistTabComponent;
  let fixture: ComponentFixture<TodolistTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodolistTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodolistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

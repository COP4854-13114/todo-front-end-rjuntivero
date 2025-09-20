import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodolistModuleComponent } from './todolist-module.component';

describe('TodolistModuleComponent', () => {
  let component: TodolistModuleComponent;
  let fixture: ComponentFixture<TodolistModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodolistModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodolistModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

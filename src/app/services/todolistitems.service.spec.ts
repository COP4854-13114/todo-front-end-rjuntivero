import { TestBed } from '@angular/core/testing';

import { TodoListItemsService } from './todolistitems.service';

describe('TodolistitemsService', () => {
  let service: TodoListItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoListItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

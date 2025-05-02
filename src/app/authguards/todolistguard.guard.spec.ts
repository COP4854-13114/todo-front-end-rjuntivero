import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { todolistGuard } from './todolistguard.guard';

describe('todolistGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => todolistGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

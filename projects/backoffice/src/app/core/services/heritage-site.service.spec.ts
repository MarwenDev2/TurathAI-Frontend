import { TestBed } from '@angular/core/testing';

import { HeritageSiteService } from './heritage-site.service';

describe('HeritageSiteService', () => {
  let service: HeritageSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeritageSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

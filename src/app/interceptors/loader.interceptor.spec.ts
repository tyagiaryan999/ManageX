import { TestBed } from '@angular/core/testing';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

import { LoaderInterceptor } from './loader.interceptor';
import { LoaderService } from '../services/loader.service';

describe('LoaderInterceptor', () => {
  let interceptor: LoaderInterceptor;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoaderService', [
      'showLoader',
      'hideLoader',
    ]);

    TestBed.configureTestingModule({
      providers: [LoaderInterceptor, { provide: LoaderService, useValue: spy }],
    });

    interceptor = TestBed.inject(LoaderInterceptor);
    loaderServiceSpy = TestBed.inject(
      LoaderService
    ) as jasmine.SpyObj<LoaderService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call showLoader and hideLoader', () => {
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: () =>
        of(new HttpResponse({ status: 200 })) as unknown as Observable<
          HttpEvent<any>
        >,
    };

    interceptor.intercept(req, next).subscribe({
      complete: () => {
        expect(loaderServiceSpy.showLoader).toHaveBeenCalled();
        expect(loaderServiceSpy.hideLoader).toHaveBeenCalled();
      },
    });
  });
});

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServiceService } from '../services/service.service';
import { Injector } from '@angular/core';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private ngxLoader: NgxUiLoaderService,
    private injector: Injector
  ) {}
  localStorageData: any;
  userData: any;

  // showLoader() {
  //   this.ngxLoader.start();
  //   setTimeout(() => this.ngxLoader.stop(), 1000);
  // }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('/URLlog')) {
      return next.handle(req);
    }

    const localUser = localStorage.getItem('user');
    const userData = localUser ? JSON.parse(localUser) : null;
    const email = userData?.email || 'Null123@gmail.com';
    this.loaderService.showLoader();
    // this.showLoader();
    const payload = {
      email,
      url: req.urlWithParams,
      Date: new Date().toISOString().split('T')[0],
    };

    const ser = this.injector.get(ServiceService);

    ser.URLlog(payload).subscribe((res: any) => {});
    return next
      .handle(req)
      .pipe(finalize(() => this.loaderService.hideLoader()));
  }
}

import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: 'ball-spin-clockwise', // or 'none' if you want custom gif spinner + hide SVG with CSS
  overlayColor: 'rgba(0,0,0,0.3)',
  hasProgressBar: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    importProvidersFrom(NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)),
  ],
};

/* const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: 'ball-spin-clockwise',
  overlayColor: 'rgba(0,0,0,0.3)',
  hasProgressBar: false,
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([]), 
    provideAnimations(),
    importProvidersFrom(NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)),
  ],
}; */

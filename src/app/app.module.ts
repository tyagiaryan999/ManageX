// app.module.ts ya standalone component ke module file me
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TaskModule } from './task/task.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    ToastModule,
    ConfirmDialogModule,
    DataViewModule,
    TaskModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule,

    // ProgressSpinnerModule,
  ],
  providers: [HttpClient, MessageService],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private messageService: MessageService) {}
}

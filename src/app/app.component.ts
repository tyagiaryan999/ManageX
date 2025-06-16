import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, NgxUiLoaderModule],
  providers: [HttpClient, MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ang_project';
  constructor(private ngxLoader: NgxUiLoaderService) {}

  showLoader() {
    this.ngxLoader.start();
    setTimeout(() => this.ngxLoader.stop(), 3000);
  }
}

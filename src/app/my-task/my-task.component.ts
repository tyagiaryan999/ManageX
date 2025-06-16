import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ServiceService } from '../services/service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-my-task',
  imports: [CommonModule, CardModule],
  templateUrl: './my-task.component.html',
  styleUrl: './my-task.component.css',
})
export class MyTaskComponent implements OnInit {
  tasks: any[] = [];
  loggedInUseremail: any;
  loggedInUserID: any;
  localStorageData: any;
  userData: any;
  workStatus: any;
  taskid: any;
  // userData: any;
  constructor(
    public dataSer: ServiceService,
    public NgxUiLoader: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.getLocalStorageDetails();
    this.mytask();
  }
  getLocalStorageDetails() {
    this.localStorageData = localStorage.getItem('user');
    this.userData = JSON.parse(this.localStorageData);
    this.loggedInUserID = this.userData.id;
    console.log('Localstorage ID', this.loggedInUserID);
  }
  mytask() {
    const payload = {
      assignto: this.loggedInUserID,
    };
    this.NgxUiLoader.start();
    this.dataSer.getTask(payload).subscribe((res: any) => {
      this.tasks = res.data;
      this.NgxUiLoader.stop();
      console.log('myTask Data', res);
    });
  }
  startbutton(data: any) {
    this.workStatus = 1;
    this.taskid = data;
    const payload = {
      status: this.workStatus,
      id: this.taskid,
    };
    this.dataSer.updateTask(payload).subscribe((res: any) => {
      console.log('Start Button return status');
      this.mytask();
    });
  }
}

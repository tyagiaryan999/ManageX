import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterModule, TableModule, RouterLink, ButtonModule],
  templateUrl: './task-list.component.html',

  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  taskData: any[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;

  loginDetailsData: any;
  loggedInUseremail: any;
  isdelete: number = 0;

  constructor(
    public ser: ServiceService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.getLocalStorageDetails();
    this.loading = true;
  }

  getLocalStorageDetails() {
    const data = localStorage.getItem('user');
    this.loginDetailsData = data ? JSON.parse(data) : null;
    this.loggedInUseremail = this.loginDetailsData?.email;
  }

  loadTasksLazy(event: any) {
    const page = event.first / event.rows;
    const limit = event.rows;

    const payload = {
      email: this.loggedInUseremail,
      delete: this.isdelete,
      page,
      limit,
    };

    this.loading = true;
    this.ngxLoader.start();
    this.ser.getTask(payload).subscribe((res: any) => {
      this.taskData = res.data;
      this.totalRecords = res.totalRecords;
      this.loading = false;
      this.ngxLoader.stop();
    });
  }

  is_Deleted(event: any, data: any) {
    this.isdelete = 1;
    const dataid = data.task_id;
    const payload = {
      delete: this.isdelete,
      dataid,
    };
    this.ser.isDeleted(payload).subscribe(() => {
      this.loadTasksLazy({ first: 0, rows: this.rows }); // reload first page
    });
  }

  navigateToEdit(task: any) {
    this.router.navigate(['home/tasklist/edit', task.task_id]);
  }
}

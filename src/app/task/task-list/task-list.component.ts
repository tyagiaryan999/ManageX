import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccordionModule } from 'primeng/accordion';
import { KeyValue } from '@angular/common';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    RouterLink,
    ButtonModule,
    AccordionModule,
  ],
  templateUrl: './task-list.component.html',

  styleUrl: './task-list.component.css',
  providers: [TitleCasePipe],
})
export class TaskListComponent implements OnInit {
  taskData: any[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;

  loginDetailsData: any;
  loggedInUseremail: any;
  isdelete: number = 0;
  activePanels: number[] = [0];
  showtable: boolean = true;
  // groupedData: any;
  groupedData: { [key: string]: any[] } = {};

  constructor(
    public ser: ServiceService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private TitleCasePipe: TitleCasePipe
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

    // this.loading = true;
    this.ngxLoader.start();
    this.ser.getTask(payload).subscribe((res: any) => {
      this.taskData = res.data;
      this.totalRecords = res.totalRecords;
      this.groupedData = res.grouped || {};
      // this.loading = false;
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
  getTaskSatus(status: number): string {
    switch (status) {
      case 0:
        return 'Not Started';
      case 1:
        return 'In Progress';
      case 2:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }
  accordianHead(category: KeyValue<string, any[]>): string {
    return `${this.TitleCasePipe.transform(category.key)} [${
      category.value.length
    }]`;
  }
  navigateToEdit(task: any) {
    this.router.navigate(['home/tasklist/edit', task.task_id]);
  }
}

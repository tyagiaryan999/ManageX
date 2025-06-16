import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServiceService } from '../services/service.service';
@Component({
  selector: 'app-dasboard-og',
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    TagModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './dasboard-og.component.html',
  styleUrl: './dasboard-og.component.css',
})
export class DasboardOGComponent implements OnInit {
  constructor(public ser: ServiceService) {}
  userData: any;
  localStorageData: any;
  totalRecords: any;
  allUsers: any;
  stats: any = [];
  totalTasksRecords: any;
  taskData: any;
  WorkStatus: any;
  userRecords: any;
  userTotal: any;
  taskRecords: any;
  taskTotal: any;
  deleteTask: any;
  ngOnInit(): void {
    this.getLocalStorageDetails();
    this.dashboarddata();
  }
  getLocalStorageDetails() {
    this.localStorageData = localStorage.getItem('user');
    this.userData = JSON.parse(this.localStorageData);
  }

  dashboarddata() {
    const payload = {
      email: this.userData.email,
    };
    this.ser.dashboardData(payload).subscribe((res: any) => {
      this.userRecords = res.userRecords;
      this.userTotal = res.userTotal;
      this.taskRecords = res.taskRecords;
      this.taskTotal = res.taskTotal;
      this.deleteTask = res.deletedTasksCount;
      const inProgressCount = this.taskRecords.filter(
        (task: any) => task.work_status === 1
      ).length;
      const completedCount = this.taskRecords.filter(
        (task: any) => task.work_status === 2
      ).length;
      const notStartedCount = this.taskRecords.filter(
        (task: any) => task.work_status === 0
      ).length;
      const deletedCount = this.taskRecords.filter(
        (task: any) => task.is_deleted === 1
      ).length;
      this.stats = [
        {
          title: 'Total Users',
          count: this.userTotal,
          icon: 'pi pi-users',
          color: 'bg-blue',
          iconColor: 'icon-blue',
        },
        {
          title: 'Total Tasks',
          count: this.taskTotal,
          icon: 'pi pi-list',
          color: 'bg-green',
          iconColor: 'icon-green',
        },
        {
          title: 'Not Started',
          count: notStartedCount,
          icon: 'pi pi-clock',
          color: 'bg-gray',
          iconColor: 'icon-gray',
        },
        {
          title: 'In Progress',
          count: inProgressCount,
          icon: 'pi pi-spinner',
          color: 'bg-yellow',
          iconColor: 'icon-yellow',
        },
        {
          title: 'Completed Tasks',
          count: completedCount,
          icon: 'pi pi-check-circle',
          color: 'bg-purple',
          iconColor: 'icon-purple',
        },
        // {
        //   title: 'Deleted Task',
        //   count: this.deleteTask,
        //   icon: 'pi pi-user-minus',
        //   color: 'bg-red',
        //   iconColor: 'icon-red',
        // },
      ];
    });
  }
}

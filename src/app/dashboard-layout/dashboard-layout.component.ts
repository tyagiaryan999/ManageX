import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { HeaderComponent } from '../shared/header/header.component';
import { RouterModule } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  providers: [ServiceService],
})
export class DashboardLayoutComponent implements OnInit {
  imagePath = 'http://192.168.1.185/rn21footage/Aryan/Uploads/';
  // imagePath = 'C:UsersaryanOneDriveDesktopangular_learnserver\\uploads';
  loggedInUsername = '';
  loggedInUseremail = '';
  loggedInUserPhoto = '';
  loading: boolean = false;
  constructor(public ser: ServiceService) {}

  ngOnInit(): void {
    this.getLocalStorageDetails();
    this.getLoginUser();
  }

  getLocalStorageDetails() {
    const data = localStorage.getItem('user');
    if (data) {
      const user = JSON.parse(data);
      this.loggedInUseremail = user.email;
    }
  }

  getLoginUser() {
    const payload = { email: this.loggedInUseremail };
    this.ser.loginUserinfo(payload).subscribe((data: any) => {
      const user = data.data[0];
      this.loggedInUsername = user.user_name;
      this.loggedInUserPhoto = this.imagePath + user.user_image;
    });
  }
  //   listenToLoading(): void {
  //     this._loading.loadingSub
  //       .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
  //       .subscribe((loading) => {
  //         this.loading = loading;
  //       });
  //   }
}

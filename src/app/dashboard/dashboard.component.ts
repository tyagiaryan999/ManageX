import { Component, OnInit } from '@angular/core';
import { ServiceService, Product } from '../services/service.service';
//import {ServiceService} from '../data.service'
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TooltipOptions } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DataViewModule } from 'primeng/dataview';
import { FormBuilder } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { jsPDF } from 'jspdf';

import { CalendarModule } from 'primeng/calendar';
// interface PageEvent {
//   first: number;
//   rows: number;
//   page: number;
//   pageCount: number;
// }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,

  imports: [
    DataViewModule,
    SelectButtonModule,
    TagModule,
    RatingModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CommonModule,
    ConfirmPopupModule,
    ToastModule,
    MessageModule,
    ConfirmDialogModule,
    TooltipModule,
    OverlayPanelModule,
    PaginatorModule,
    FormsModule,
    CalendarModule,
  ],
  styleUrls: ['./dashboard.component.css'],
  providers: [ServiceService, MessageService, ConfirmationService],
})
export class DashboardComponent implements OnInit {
  layout: 'list' | 'grid' = 'list';
  viewMode: 'normal' | 'compact' = 'normal';
  // layout: string = 'list';
  // isGridView: boolean = false;
  // currentView: 'list' | 'grid' = 'list';
  // currentView: 'list' | 'grid' = 'list';
  currentView: string = 'list';
  products: Product[] = [];
  searchTerm: string = '';
  dialogVisible: boolean = false;
  imagePath: any = 'http://192.168.1.185/rn21footage/Aryan/Uploads/';
  // imagePath: any = 'C:UsersaryanOneDriveDesktopangular_learnserver\\uploads';
  imagePreview: string | ArrayBuffer | null = null;
  imagefilename: any;
  loggedInUserPhoto: string = '';
  loggedInUseremail: string = '';
  loggedInUserid: any;
  loggedInUsername: string = '';
  loggedInUserdata: string = '';
  image: any;
  defaultimage: any = 'Potrait_Placeholder.png';
  formData = new FormData();
  userData: any;
  localStorageData: any;
  totalRecords: number = 0;
  imagesend: any;
  selectuser: any;
  userFormValue: any;
  allUsers: any[] = [];
  selectedUser: any;
  name: any;
  first: number = 0;
  rows: number = 10;
  selectedDate: Date | null = null;
  showDatePickerForUser: string | null = null;
  userActivityData: any;

  constructor(
    public ser: ServiceService,
    public router: Router,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.userFormValue = this.fb.group({
      name: [''],
      password: [''],
      age: [''],
      email: [''],
      address: [''],
      number: [''],
    });
  }

  // onPageChange(event: any) {
  //   this.first = event.first / 10;
  //   this.rows = event.rows;
  //   this.getAllUsers(this.first, this.rows);
  // }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    const page = this.first / this.rows;
    this.getAllUsers(page, this.rows);
  }

  ngOnInit() {
    this.getLocalStorageDetails();
    this.getloginuser();
    // this.getAllUsers();
    this.getAllUsers(0, this.rows);
  }
  getLocalStorageDetails() {
    this.localStorageData = localStorage.getItem('user');
    this.userData = JSON.parse(this.localStorageData);
  }
  tooltipOptions: TooltipOptions = {
    showDelay: 150,
    // autoHide: false,
    tooltipEvent: 'hover',
    tooltipPosition: 'right',
  };
  selectImage(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    this.image = file.name;
    const reader = new FileReader();

    const previewReader = new FileReader();
    previewReader.onload = () => {
      this.imagePreview = previewReader.result;
    };
    previewReader.readAsDataURL(file);

    reader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const blobImage = new Blob([uint8Array], { type: file.type });

      const formData = new FormData();
      formData.append('userImage', file);

      this.ser.uploadfile(formData).subscribe((data: any) => {
        if (data.message == 'File uploaded successfully') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image Uploaded',
          });
          this.imagefilename = data.file.filename;
        }
      });
    };

    reader.readAsArrayBuffer(file);
  }
  onSearch() {
    // this.getAllUsers();
    // this.searchTerm = this.searchTerm.replace(/^\s+|\s+$/g, ''); // REMOVE SPACE FROM START AND END
    this.searchTerm = this.searchTerm.trim();
    if (this.searchTerm.length > 2) {
      this.getAllUsers();
    }
    if (this.searchTerm.length == 0) {
      this.getAllUsers();
    }
  }

  getAllUsers(first?: any, rows?: any) {
    const payload = {
      email: this.userData.email,
      // id: this.localStorageData.id,
      name: this.searchTerm,
      pagination: {
        page: first,
        limit: rows,
      },
    };
    this.ngxLoader.start();
    this.ser.getAllUser(payload).subscribe((res: any) => {
      this.allUsers = res?.data?.records || [];

      this.totalRecords = res.data.totalRecords;
      this.ngxLoader.stop();
    });
  }

  visible: boolean = false;

  showDialog() {
    this.userFormValue.reset();
    this.visible = true;
    this.mode = 'Add';
    this.imagePreview = null;
  }

  addUser() {
    if (this.userFormValue.valid) {
      const payload = {
        ...this.userFormValue.value,
        imagePath: this.imagefilename ? this.imagefilename : '',
        loggedInUseremail: this.userData.email,
      };
      console.log('payload in dashboooo->', payload);

      this.ser.addUser(payload).subscribe((data: any) => {
        console.log('Submitted Values', payload);
        console.log('Data returned from service', data);

        console.log('Image Path:', this.imagePath);
        if (data.message === 'Duplicate User') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email already Registered!',
          });
        } else if (data.message === 'User Submitted Successfully') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User Registered',
          });
          this.visible = false;
          this.imagefilename = '';

          this.getAllUsers();
        }
      });
    } else {
      this.userFormValue.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter Valid Details',
      });
    }
  }

  patchformdata(data: any) {
    this.userFormValue.patchValue({
      name: data.user_name,
      password: data.user_password,
      age: data.age,
      email: data.email,
      number: data.phone_number,
      address: data.address,
    });
    this.imagefilename = data.user_image;
    this.imagePreview = this.imagePath + data.user_image;
    this.visible = true;
    this.mode = 'Edit';
  }
  deleteUser(event: any, data: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',

      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',

      accept: () => {
        this.ser.deleteUserById(data).subscribe((data: any) => {
          console.log('deleted data', data);
          if (data.message == 'User Deleted') {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Record deleted',
            });
            this.getAllUsers();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong',
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
  // selectedUser: any;
  mode: string = 'Add';
  editUserDetails: any;

  edituser_operation(user: any) {
    this.selectedUser = user;
    console.log('selected user is : ', this.selectedUser);

    this.ser.getUserById(this.selectedUser).subscribe((res: any) => {
      this.editUserDetails = res.data[0] || [];

      this.patchformdata(this.editUserDetails);
    });
  }

  cancelButton() {
    this.visible = false;

    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'Cancelled',
      life: 3000,
    });
  }

  // editUser: boolean = false;
  Update_User(user: any) {
    if (!this.userFormValue.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter Valid Details',
      });
      return;
    }

    const payload = {
      ...this.userFormValue.value,
      imagePath: this.imagefilename,
    };
    this.ser.updateUserById(payload).subscribe((data: any) => {
      console.log('Data returned from updateUser:', data);
      this.selectedUser = '';

      if (data.message == 'User Updated') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User Updated',
        });
        this.getAllUsers();
        this.visible = false;
        this.userFormValue.reset();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Email already Registered!',
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.userFormValue.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
  getloginuser() {
    const payload = {
      email: this.userData.email,
    };
    this.ser.loginUserinfo(payload).subscribe((data: any) => {
      const user = data.data[0];
      this.loggedInUserdata = data.data[0];
      this.loggedInUsername = user.user_name;
      this.loggedInUserPhoto = this.imagePath + user.user_image;
      this.loggedInUseremail = user.email;
    });
  }
  // userActivityInfo(user: any) {
  //   let email = 'tyagiaryan999@gmail.com';
  //   this.ser.userActivityInfo().subscribe((res: any) => {
  //     alert('UserActivity Works');
  //     this.userActivityData = res.data;
  //     const doc = new jsPDF();
  //     const jsonStr = JSON.stringify(this.userActivityData, null, 2);
  //     const lines = doc.splitTextToSize(jsonStr, 180);
  //     doc.setFontSize(14);
  //     doc.text('User Activity', 10, 10);
  //     doc.setFontSize(10);
  //     doc.text(lines, 20, 15);
  //     doc.save('User_Activity_Data.pdf');
  //     console.log('UserActivity Data', this.userActivityData);
  //   });
  // }
  getISTDateString(date: Date): string {
    const offset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(date.getTime() + offset);

    const year = ist.getFullYear();
    const month = String(ist.getMonth() + 1).padStart(2, '0');
    const day = String(ist.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  openDateSelection(user: any) {
    this.selectedDate = null;
    this.showDatePickerForUser = user.email;
  }

  onDateSelected(user: any) {
    if (this.selectedDate) {
      this.userActivityInfo(user, this.selectedDate);
      this.showDatePickerForUser = null;
      this.selectedDate = null;
    }
  }

  cancelDateSelection() {
    this.showDatePickerForUser = null;
    this.selectedDate = null;
  }
  userActivityInfo(user: any, activityDate: Date) {
    let email = user.email;
    const payload = {
      email: user.email,
      activityDate: this.getISTDateString(activityDate),
    };
    console.log('Data InuSerActivityyyyyy', payload);

    this.ser.userActivityInfo(payload).subscribe((res: any) => {
      // alert('UserActivity Works');
      this.userActivityData = res.data;

      if (!this.userActivityData || this.userActivityData.length === 0) {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text('User Activity', 10, 10);
        doc.setFontSize(12);
        doc.text('No data found for this user on selected date.', 10, 30);
        doc.save(`${email}_nodata.pdf`);
        return;
      }

      const doc = new jsPDF();
      const jsonStr = JSON.stringify(this.userActivityData, null, 2);
      const lines = doc.splitTextToSize(jsonStr, 180);

      let y = 20;
      const lineHeight = 6;
      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(14);
      doc.text('User Activity', 10, 10);

      doc.setFontSize(10);

      lines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - 10) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += lineHeight;
      });

      doc.save(`${email}.pdf`);
      this.getAllUsers();
      console.log('UserActivity Data', this.userActivityData);
    });
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  MaxLengthValidator,
  MinLengthValidator,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { ServiceService } from '../services/service.service';
import { UserLoginComponent } from '../user-login/user-login.component';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { Validator } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TooltipOptions } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-userdetails',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MessagesModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    TooltipModule,
    FormsModule,
  ],
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.css',
  providers: [ServiceService, MessageService],
})
export class UserdetailsComponent {
  constructor(
    public router: Router,
    public dataSer: ServiceService,
    public messageService: MessageService
  ) {
    //   this.dataSer.userData().subscribe(
    //     (data)=>{
    //     console.log(data);
    //   },(error)=>{
    //   }
    // ).unsubscribe();
  }

  image: any;
  image_path: any = 'http://192.168.1.185/rn21footage/Aryan/Uploads/';
  formData = new FormData();
  // ImageVisible: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  imagePath: any;
  showOtpDialog: boolean = false;
  enteredOtp: string = '';

  // loggedInUseremail:any;

  userFormValue: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    number: new FormControl('', Validators.required),
  });

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

    // const formData = new FormData();

    reader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const blobImage = new Blob([uint8Array], { type: file.type });

      const formData = new FormData();
      formData.append('userImage', file);
      this.dataSer.uploadfile(formData).subscribe((data: any) => {
        if (data.message == 'File uploaded successfully') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image Uploaded',
          });
          this.image_path = file.name;
          // this.imageUrl = "http://192.168.1.179/Layout365Data/Abhay/";
          // this.imageUrl = this.imageUrl + this.image;
        }
      });
      // setTimeout(() => {
      //   this.ImageVisible = true;
      // }, 500);
    };

    reader.readAsArrayBuffer(file);
  }

  ngOnInit() {
    localStorage.clear();
  }
  // otpVerify() {
  //   if (this.userFormValue.valid) {
  //     this.showOtpDialog = true;
  //     this.onsubmit();
  //   } else {
  //     this.userFormValue.markAllAsTouched();
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: 'Enter Valid Details',
  //     });
  //   }
  // }
  onsubmit() {
    if (this.userFormValue.valid) {
      const payload = {
        ...this.userFormValue.value,
        imagePath: this.image_path,
      };

      this.dataSer.addUser(payload).subscribe((data: any) => {
        console.log('Submitted Values', payload);
        console.log('Data returned from service', data);

        console.log('Image Path:', this.image_path);

        // if (!this.image_path) {
        //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No Image Uploaded' });
        //   return;
        // }

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
          setTimeout(() => {
            this.router.navigate(['']);
          }, 1000);
        }
      });
    } else {
      this.userFormValue.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'All fields are required',
      });
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const value = this.userFormValue.get(fieldName);
    if (value && value.invalid && (value.dirty || value.touched)) {
      return true;
    } else {
      return false;
    }
  }
}

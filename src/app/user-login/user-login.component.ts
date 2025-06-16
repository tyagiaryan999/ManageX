import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../services/service.service';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-user-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MessagesModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    DialogModule,
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
  providers: [ServiceService, MessageService],
})
export class UserLoginComponent {
  constructor(
    public router: Router,
    public dataSer: ServiceService,
    public messageService: MessageService
  ) {}
  showOtpDialog: boolean = false;
  enteredOtp: any;
  loading = false;
  backendotp: any;
  ngOnInit() {
    localStorage.clear();
  }
  userlogin: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  closeDialog() {
    this.showOtpDialog = false;
  }
  verifyOtp() {
    console.log('VerifyOTP', this.enteredOtp);
    console.log('backendOtp', this.backendotp);
    if (this.backendotp == this.enteredOtp) {
      // alert('Mail works');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Loggedin',
      });
      setTimeout(() => {
        this.router.navigate(['/home/home']);
      }, 1000);
    } else {
      // alert('Wrong OTP');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Incorrect OTP, please try again',
      });
      // this.showOtpDialog = false;
    }
  }
  //onlogin(){
  // this.dataSer.loginUser(this.userlogin.value).subscribe((data: any) => {
  //   console.log('Login API response:', data);
  //   console.log('loginValues', this.userlogin.value);
  //   console.log('Onlogin message', data.message);
  //   if (data.message === 'success') {
  //     const user = {
  //       token: data.data.token,
  //       email: data.data.email,
  //       id: data.data.id,
  //     };
  //     // console.log('Set localItem', user);

  //     localStorage.setItem('user', JSON.stringify(user));

  //     // this.messageService.add({
  //     //   severity: 'success',
  //     //   summary: 'Success',
  //     //   detail: 'Loggedin',
  //     // });
  //     this.showOtpDialog = true;
  //     // this.router.navigate(['/home/home']);
  //     this.dataSer.otpMail(this.userlogin.value).subscribe((data: any) => {
  //       // console.log('otpMail data', data);

  //       // setTimeout(() => {
  //       //   this.router.navigate(['/home/home']);
  //       // }, 1000);
  //       this.backendotp = data.data.tokken;
  //       console.log('backendOTP....', this.backendotp);
  //     });
  //   } else {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: 'Server error, please try again',
  //     });
  //   }
  // });
  //}
  onlogin() {
    if (this.userlogin.valid) {
      this.dataSer.loginUser(this.userlogin.value).subscribe({
        next: (data: any) => {
          console.log('Login API response:', data);
          const user = {
            token: data.data.token,
            email: data.data.email,
            id: data.data.id,
          };

          localStorage.setItem('user', JSON.stringify(user));
          this.showOtpDialog = true;

          this.dataSer.otpMail(this.userlogin.value).subscribe((data: any) => {
            this.backendotp = data.data.tokken;
            console.log('backendOTP....', this.backendotp);
          });
        },
        error: (err) => {
          // alert(err.error.message || 'Invalid email or password');
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid email or password',
          });
        },
      });
    } else {
      this.userlogin.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Incorect Email or Password ',
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.userlogin.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

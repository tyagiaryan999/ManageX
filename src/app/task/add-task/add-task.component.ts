import { Component } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { TooltipOptions } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ServiceService } from '../../services/service.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-add-task',
  imports: [
    TooltipModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  taskCategories = [
    {
      name: 'Administrative',
      description:
        'Routine tasks that support the smooth running of operations.',
      examples: ['Scheduling meetings', 'Filing documents', 'Data entry'],
    },
    {
      name: 'Development',
      description: 'Tasks related to software or system development.',
      examples: ['Writing code', 'Debugging', 'Code review', 'Unit testing'],
    },
    {
      name: 'Design',
      description: 'Tasks involving visual or user interface design.',
      examples: ['Creating wireframes', 'Designing UI', 'Editing graphics'],
    },
    {
      name: 'Marketing',
      description: 'Tasks focused on promoting products or services.',
      examples: [
        'Creating campaigns',
        'Managing social media',
        'SEO optimization',
      ],
    },
    {
      name: 'Research',
      description:
        'Tasks that involve gathering, analyzing, or evaluating information.',
      examples: [
        'Conducting surveys',
        'Competitor analysis',
        'Literature review',
      ],
    },
    {
      name: 'Support',
      description: 'Tasks focused on assisting users or customers.',
      examples: [
        'Answering support tickets',
        'Troubleshooting issues',
        'User onboarding',
      ],
    },
    {
      name: 'Finance',
      description: 'Tasks related to financial management and accounting.',
      examples: ['Processing invoices', 'Managing budgets', 'Payroll'],
    },
    {
      name: 'Strategic Planning',
      description:
        'High-level tasks related to organizational goals and strategies.',
      examples: ['Creating roadmaps', 'Defining KPIs', 'Business planning'],
    },
  ];

  recordnames: any[] = [];
  filterednames: any[] = [];
  loggedInUseremail: any;
  taskFormGroup!: FormGroup;
  taskData: any;
  loginDetailsData: any;

  constructor(
    public ser: ServiceService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public NgxUiLoader: NgxUiLoaderService,
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.getLocalStorageDetails();

    this.taskFormGroup = this.fb.group({
      taskname: new FormControl('', Validators.required),
      assignto: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      // status: [],
      duedate: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  getLocalStorageDetails() {
    const data = localStorage.getItem('user');
    // this.loginDetailsData = this.JSON.parse(data);
    this.loginDetailsData = data ? JSON.parse(data) : null;
    this.loggedInUseremail = this.loginDetailsData.email;
  }

  filterNames(event: AutoCompleteCompleteEvent) {
    // let filtered: any[] = [];

    const payload = {
      name: event.query,
      email: this.loggedInUseremail,
    };
    console.log('Local Storage', this.loggedInUseremail);

    this.ser.getAllUser(payload).subscribe((res: any) => {
      this.filterednames = res.data.records || [];
      console.log('Autocomplete data', this.filterednames);
    });
  }
  submitTask() {
    if (this.taskFormGroup.valid) {
      const payload = {
        ...this.taskFormGroup.value,
        email: this.loggedInUseremail,
        createdAt: new Date(),
      };
      console.log('localstorage Emaillll', this.loginDetailsData.email);
      this.NgxUiLoader.start();
      this.ser.addTask(payload).subscribe((res: any) => {
        //this.taskData = res.message;
        console.log('TaskData', res.message);

        if (res.message === 'Duplicate task') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Task Already exist ',
          });
          this.NgxUiLoader.stop();
        } else {
          console.log('submit Task Data', this.taskData);
          // this.router.navigate(['../'], { relativeTo: this.route });

          this.router.navigate(['/home/tasklist'], { relativeTo: this.route });
          this.NgxUiLoader.stop();
        }
      });
    } else {
      this.taskFormGroup.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'All fields are required',
      });
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.taskFormGroup.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  goBackToList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

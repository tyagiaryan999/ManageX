import { Component, OnInit } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-edit-task',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AutoCompleteModule,
    ToastModule,
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent implements OnInit {
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
  // loggedInUseremail: any;
  loginDetailsData: any;
  taskFormGroup!: FormGroup;
  taskId: any;
  updateData: any;

  constructor(
    public ser: ServiceService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getLocalStorageDetails();
    // this.taskId = this.route.snapshot.paramMap.get('task_id');
    this.taskForm();
    this.getTaskId();
  }

  getTaskId() {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('task_id');
      console.log('ParamMap data ', this.taskId);

      this.ser.getTaskById(this.taskId).subscribe((res: any) => {
        console.log('getTaskById response', res.data);
        if (res.data) {
          this.patchFormData(res.data[0]);
        }
      });
    });
  }

  patchFormData(data: any) {
    debugger;
    this.taskFormGroup.patchValue({
      taskname: data.task_name,
      category: data.category,
      duedate: data.duedate,
      description: data.work_description,
    });
    if (data.assignedTo) {
      this.taskFormGroup.patchValue({
        assignto: { id: data.assignedTo, user_name: data.assignedToUser },
      });
    }
  }

  taskForm() {
    this.taskFormGroup = this.fb.group({
      taskname: ['', [Validators.required]],
      assignto: ['', [Validators.required]],
      category: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
  updateTask() {
    {
      const payload = {
        ...this.taskFormGroup.value,
        id: this.taskId,
      };
      console.log('Upadate Payload', payload);

      this.ser.updateTask(payload).subscribe((res: any) => {
        this.updateData = res.data;
        console.log('Update Data', this.updateData);
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.taskFormGroup.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getLocalStorageDetails() {
    const data = localStorage.getItem('user');
    this.loginDetailsData = data ? JSON.parse(data) : null;
    // this.loggedInUseremail = this.loginDetailsData.email;
  }
  goBackToList() {
    this.router.navigate(['../../'], { relativeTo: this.route });
    // this.router.navigate(['/tasks']);
  }
  filterNames(event: AutoCompleteCompleteEvent) {
    // let filtered: any[] = [];

    const payload = {
      name: event.query,
      email: this.loginDetailsData.email,
    };
    console.log('Local Storage', this.loginDetailsData.email);

    this.ser.getAllUser(payload).subscribe((res: any) => {
      this.filterednames = res.data.records || [];
      console.log('Autocomplete data', this.filterednames);
    });
  }
}

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

@Component({
  selector: 'app-edit-task',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AutoCompleteModule],
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
    this.getTaskId();
    this.taskForm();
  }

  getTaskId() {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('task_id');
      console.log('ParamMap data ', this.taskId);
    });
  }

  patchFormData(data: any) {
    this.taskFormGroup.patchValue({
      taskname: data.task_name,
      assignto: data.assignedTo,
      category: data.category,
      duedate: data.duedate,
      description: data.work_description,
    });
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
    debugger;
    const payload = {
      ...this.taskFormGroup.value,
      id: this.taskId,
    };
    this.ser.updateTask(payload).subscribe((res: any) => {
      this.updateData = res.data;
      console.log('Update Data', this.updateData);
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
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
}

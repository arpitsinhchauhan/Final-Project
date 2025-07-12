import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  isReload: boolean;
  userForm: FormGroup;
  showPumpFields: boolean = true;

  pumpOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 0);
  myForm: FormGroup;

  constructor(
    // private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private notificationService: NotificationService,
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      petrol_nozzle: [''],
      diesel_nozzle: [''],
      xp_petrol_nozzle: [''],
      powe_diesel_nozzle: [''],
    });
    if (this.data) {
      const formData = {
        ...this.data,
        petrol_nozzle: +this.data.petrol_nozzle,
        diesel_nozzle: +this.data.diesel_nozzle,
        xp_petrol_nozzle: +this.data.xp_petrol_nozzle,
        powe_diesel_nozzle: +this.data.powe_diesel_nozzle,
      };
      this.userForm.patchValue(formData);
    }
    // this.showPumpFields = this.data.role !== 'admin';
    this.userForm.get('role')?.valueChanges.subscribe(value => {
      this.showPumpFields = value?.toLowerCase() !== 'admin';
    });
  
    // Initialize showPumpFields in case form is pre-filled
    const initialRole = this.userForm.get('role')?.value;
    this.showPumpFields = initialRole?.toLowerCase() !== 'admin';
  }


  addUser(): void {
    if (this.userForm.invalid) {
      this.notificationService.failure('Please fill out all required fields correctly.');
      this.userForm.markAllAsTouched();
      return;
    }
    
    this.use.signUp(this.userForm.value).subscribe(
      response => {
        if (response && response.id) {
          this.notificationService.success('User Successfully Added.');
          this.dialogRef.close({ 'isReload': this.isReload });
        } else {
          this.notificationService.failure('Unexpected response received.');
        }
      },
      error => {
        this.notificationService.failure('User was not added successfully.');
      }
    );
  }

  editUser() {
    if (this.userForm.invalid) {
      this.notificationService.failure('Please fill out all required fields correctly.');
      this.userForm.markAllAsTouched();
      return;
    }
  
    const updatedUser = {
      ...this.data,
      ...this.userForm.value
    };
  
    this.use.updateUser(updatedUser).subscribe(
      response => {
        console.log(response);
        
        this.notificationService.success('User Successfully Updated.');
        this.dialogRef.close({ 'isReload': true });
      },
      error => {
        this.notificationService.failure('Failed to update user.');
      }
    );
  }
  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {

  isReload: boolean;
  inputValue: string = '';

  constructor(public dialogRef: MatDialogRef<ExpensesListComponent>,
    private user:UserServiceService,private notificationService:NotificationService
  ) { }

  ngOnInit(): void {
  }

 logInput() {
  const payload = { expensesList: this.inputValue };
  this.user.addExpence(payload).subscribe({
    next: res => {
      if (res) {
        this.notificationService.success("✅ Data saved successfully.");
        this.dialogRef.close({ isReload: this.isReload });
      }
    },
    error: (err) => console.error('Error saving:', err),
  });
 }

  cancel() {
    this.dialogRef.close({ isReload: this.isReload });
  }

}

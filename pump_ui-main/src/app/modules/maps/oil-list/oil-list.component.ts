import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-oil-list',
  templateUrl: './oil-list.component.html',
  styleUrls: ['./oil-list.component.scss']
})
export class OilListComponent implements OnInit {

 
  isReload: boolean;
  inputValue: string = '';

  constructor(public dialogRef: MatDialogRef<OilListComponent>,
    private user:UserServiceService,private notificationService:NotificationService
  ) { }

  ngOnInit(): void {
  }

 logInput() {
  const payload = { oilSellList: this.inputValue };
  this.user.addOilType(payload).subscribe({
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
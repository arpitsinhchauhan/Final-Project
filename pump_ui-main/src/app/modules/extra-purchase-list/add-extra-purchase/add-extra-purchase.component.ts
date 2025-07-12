import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_EXTRA_PURCHASE_ADD } from 'app/serviceult';

@Component({
  selector: 'app-add-extra-purchase',
  templateUrl: './add-extra-purchase.component.html',
  styleUrls: ['./add-extra-purchase.component.scss']
})
export class AddExtraPurchaseComponent implements OnInit {


  isReload: boolean;
  userId = localStorage.getItem('userId');
  row = [
    {
      extraType: 'XP Petrol',
      extra_quantity: '',
      extra_total: '',
      extra_vat: '',
      extra_cess: '',
      extra_total_purchase: '',
      extra_jtcpercentage: '',
      date: '',
      userId:this.userId
    },
    {
      extraType: 'Power Diesel',
      extra_quantity: '',
      extra_total: '',
      extra_vat: '',
      extra_cess: '',
      extra_total_purchase: '',
      extra_jtcpercentage: "",
      date: '',
      userId:this.userId
    }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService, @Inject(MAT_DIALOG_DATA) public purchase: any,
    public dialogRef: MatDialogRef<AddExtraPurchaseComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    if (this.purchase && this.purchase.date) {
      this.extraDetails.date = this.purchase.date;
    }
  }

  updateDate() {
    // Update the date field in each row with the selected date
    this.row.forEach(row => {
      row.date = this.extraDetails.date;
    });
  }
  extraDetails = {
    date: ''
  };


  

  addTable() {
    this.row.push({
      extraType: '',
      extra_quantity: '',
      extra_total: '',
      extra_vat: '',
      extra_cess: '',
      extra_total_purchase: '',
      extra_jtcpercentage: '',
      date: this.extraDetails.date || '',
      userId:this.userId
    });
  }

  deleteRow(index: number) {
    this.row.splice(index, 1);
    this.notificationService.success('Purchase Data Succefully Delete.');
  }

  totalPrice() {
    return this.row.reduce((acc, item) => acc + (parseFloat(item.extra_total_purchase) || 0), 0);
}

  validateData(): boolean {
    if (!this.extraDetails.date) {
      this.notificationService.failure('Date is required.');
      return false;
    }
    for (let item of this.row) {
      if (!this.isNumber(item.extra_quantity) || !this.isNumber(item.extra_total) || !this.isNumber(item.extra_vat) || !this.isNumber(item.extra_cess) || !this.isNumber(item.extra_jtcpercentage) || !this.isNumber(item.extra_total_purchase)) {
        this.notificationService.failure("All numeric fields must contain valid numbers.");
        return false;
      }
      if (!item.extraType) {
        this.notificationService.failure('Type field is required.');
        return false;
      }
    }
    return true;
  }

  order() {
    if (!this.validateData()) {
      return;
    }
    this.row.forEach(row => {
      row.date = this.extraDetails.date;
    });
  
    this.http.post<any>(API_EXTRA_PURCHASE_ADD, this.row)
      .subscribe(response => {
        if (response.length === 0) {
          this.notificationService.failure("No data received from the server.");
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success("Extra Purchase data Succefully Add");
        this.extraDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      });
  }


  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}


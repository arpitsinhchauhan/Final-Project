import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { API_PURCHASE_ADD } from 'app/serviceult';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  isReload: boolean;
  // userId: string;
  userId = localStorage.getItem('userId');
  row = [
    {
      type: 'Petrol',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: '',
      date: '',
      userId:this.userId
    },
    {
      type: 'Diesel',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: "",
      date: '',
      userId:this.userId
    }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService, @Inject(MAT_DIALOG_DATA) public purchase: any,
    public dialogRef: MatDialogRef<PurchaseReportComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    if (this.purchase && this.purchase.date) {
      this.purchaDipStockseDetails.date = this.purchase.date;
    }
  }

  updateDate() {
    // Update the date field in each row with the selected date
    this.row.forEach(row => {
      row.date = this.purchaDipStockseDetails.date;
    });
  }
  purchaDipStockseDetails = {
    date: ''
  };


  

  addTable() {
    this.row.push({
      type: '',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: '',
      date: this.purchaDipStockseDetails.date || '',
      userId:this.userId
    });
  }

  deleteRow(index: number) {
    this.row.splice(index, 1);
    this.notificationService.success('Purchase Data Succefully Delete.');
  }

  totalPrice() {
    return this.row.reduce((acc, item) => acc + (parseFloat(item.total_purchase) || 0), 0);
}

  validateData(): boolean {
    if (!this.purchaDipStockseDetails.date) {
      this.notificationService.failure('Date is required.');
      return false;
    }
    for (let item of this.row) {
      if (!this.isNumber(item.quantity) || !this.isNumber(item.total) || !this.isNumber(item.vat) || !this.isNumber(item.cess) || !this.isNumber(item.jtcpercentage) || !this.isNumber(item.total_purchase)) {
        this.notificationService.failure("All numeric fields must contain valid numbers.");
        return false;
      }
      if (!item.type) {
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
      row.date = this.purchaDipStockseDetails.date;
    });
  
    this.http.post<any>(API_PURCHASE_ADD, this.row)
      .subscribe(response => {
        if (response.length === 0) {
          this.notificationService.failure("No data received from the server.");
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success("Purchase data Succefully Add");
        this.purchaDipStockseDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      });
  }

  Edit(purchaseDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdatePurchase(purchaseDetails).subscribe(
      (response) => {
        this.notificationService.success('Purchase data updated successfully');
      },
      (error) => {
        console.error('Error updating society data:', error);
      }
    );
    this.dialogRef.close({ 'isReload': this.isReload });
  }
  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}



//   constructor(@Inject(MAT_DIALOG_DATA) public data: any,
//     private http: HttpClient,
//     private use: UserServiceService,
//     public dialogRef: MatDialogRef<PurchaseReportComponent>,
//     private notificationService: NotificationService) {
//     this.purchaseDetails = { ...data };
//   }

//   ngOnInit(): void {

//   }
//   purchaseDetails: PurchaseDetails = {
//     date: new Date(),
//     type: '',
//     quantity: '',
//     total: '',
//     vat: '',
//     cess: '',
//     total_purchase: '',
//   };

//   logData(): void {
//     // Assuming this.use.addPurchase(this.purchaseDetails) is your API call
//     if (!this.validateForm()) {
//       this.notificationService.showNotification("Please fill all the required fields.")
//       return;
//     }
//     this.use.addPurchase(this.purchaseDetails).subscribe(
//       (response) => {
//         this.notificationService.showNotification("Purchase Details Successfully added.")
//       },
//     );
//     this.dialogRef.close({ 'isReload': this.isReload });
//   }
//   validateForm(): boolean {
//     // Check if any required field is empty
//     return this.purchaseDetails.date !== null && this.purchaseDetails.type !== '' && this.purchaseDetails.quantity !== '' && this.purchaseDetails.total !== '';
//   }
//   calculateTotalPurchase(): void {
//     // Convert relevant fields to numbers and add them
//     const total = parseFloat(this.purchaseDetails.total);
//     const vat = parseFloat(this.purchaseDetails.vat);
//     const cess = parseFloat(this.purchaseDetails.cess);

//     // Ensure that all fields are numeric before calculating the sum
//     if (!isNaN(total) && !isNaN(vat) && !isNaN(cess)) {
//       this.purchaseDetails.total_purchase = (total + vat + cess).toString();
//     } else {
//       // Handle the case where one or more fields are not numeric
//       this.purchaseDetails.total_purchase = '';
//     }
//   }



//   cancel(): void {
//     this.dialogRef.close();
//   }





// }



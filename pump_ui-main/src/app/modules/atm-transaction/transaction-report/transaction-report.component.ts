import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { API_ATMSELL_ADD } from 'app/serviceult';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css']
})
export class TransactionReportComponent implements OnInit {
  isReload: boolean;
  total = 0;
  data: any = { name: [] };
  selectedDate!: Date | null;
  purchaDipStockseDetails: any = {
    date: ''
  };
  userId: string;
  currentUserId = localStorage.getItem('userId');
  // row = [
  //   {
  //     id: '',
  //     date: this.purchaDipStockseDetails.date,
  //     notes: '',
  //     price: '',
  //   },
  // ];

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<TransactionReportComponent>,
    private notificationService: NotificationService, @Inject(MAT_DIALOG_DATA) public transaction: any)
  { }

  ngOnInit() {
    console.log('transaction:', this.transaction);
  
    if (this.transaction?.date) {
      this.purchaDipStockseDetails.date = this.transaction.date;
    }
  
    const dataArray = Array.isArray(this.transaction?.data)
      ? this.transaction.data
      : Array.isArray(this.transaction)
        ? this.transaction
        : [];
  
    this.row = dataArray.map((t: any[], index: number) => {
      const row = {
        id: index + 1,
        name: t[0],
        amount: parseFloat(t[1]),
        transaction: t[2],
        userId: this.currentUserId
      };
      this.lastRowId = row.id;
      return row;
    });
  }
  
  order() {
    if (!this.isFormValid()) {
      this.notificationService.failure('Please fill in all required fields.');
      return
    }
    const data = {
      date: this.purchaDipStockseDetails.date,
      expenses: this.row
    };

    // Send data to backend
    this.http.post<any>(API_ATMSELL_ADD, data)
      .subscribe(response => {
        // const responseData = response.expenses;
        this.notificationService.success('Atm data succefully add.');
        this.purchaDipStockseDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      });
  }

  isFormValid(): boolean {
    if (!this.purchaDipStockseDetails.date) {
      return false;
    }
    for (let item of this.row) {
      if (!item.id || !item.name || item.amount == null || !item.transaction) {
        return false;
      }
    }
    return true;
  }
  purchaseDetails: any = {
    date: '' // You can set default date if needed
  };
  row: any[] = [];
  lastRowId: number = 0;

  addTable() {
    // Add a new row to the table
    if (this.purchaDipStockseDetails.date) {
    this.lastRowId++;
    this.userId = localStorage.getItem('userId');
    // this.row.push({ id: '', date: this.purchaDipStockseDetails.date, notes: '', price: '' });
    const newRow = { id: this.lastRowId, date: this.purchaDipStockseDetails.date, name: '', amount: '', transaction: '', userId: this.userId };
    this.row.push(newRow);
    }else{
      this.notificationService.failure('Please fill in all the required fields before adding a new row.');
    }
  }

  deleteRow(index: number) {
    // Remove a row from the table
    this.row.splice(index, 1);
  }
  
  totalPrice() {
    let sum = 0;
    this.row.forEach(item => {
      sum += parseInt(item.amount || '0', 10);
    });
    return sum;
  }
  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}




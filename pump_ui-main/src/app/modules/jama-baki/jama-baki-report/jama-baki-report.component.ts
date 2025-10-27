import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { API_CUSTOMER_NAME, API_JAMABAKI_ADD, API_JAMABAKI_DELETE, API_JAMABAKI_LIST } from 'app/serviceult';
import { CustomerComponent } from '../customer/customer.component';
import { UserServiceService } from 'app/services/user-service.service';
import { BillComponent } from 'app/modules/billing/dailog/bill/bill.component';

@Component({
  selector: 'app-jama-baki-report',
  templateUrl: './jama-baki-report.component.html',
  styleUrls: ['./jama-baki-report.component.css']
})
export class JamaBakiReportComponent implements OnInit {

  selectedDate!: Date | null;
  receiverSearch: string = '';
  isReload: boolean;
  purchaDipStockseDetails: any = {
    date: ''
  };
  row: any[] = [];
  lastRowId: number = 0;
  names: any[] = [];
  purchaseDetails: any = {
    date: ''
  };
  PumpName: string = '';
  userId: string;
  filteredNames: Object;

  constructor(private http: HttpClient, private use: UserServiceService,
    public dialogRef: MatDialogRef<JamaBakiReportComponent>, @Inject(MAT_DIALOG_DATA) public jamaBaki: any,
    private notificationService: NotificationService, private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.use.dialogZIndexAdjustment();
    this.getdata();
    this.getJamaBakiList();
    this.getUserName();
  }

  getdata() {
    if (this.jamaBaki && this.jamaBaki.date) {
      this.purchaDipStockseDetails.date = this.jamaBaki.date;
    }

    this.userId = localStorage.getItem('userId');
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;

    this.http.get<any[]>(url).subscribe((data) => {
      // Assuming response looks like: [{ id:1, name:'Raj', ...}, ...]
      this.names = data; // full objects
      this.filteredNames = [...this.names];
    });
  }


  getUserName() {
    this.userId = localStorage.getItem('userId');
    this.use.getUserNameAndNozzle(this.userId).subscribe(data => {
      this.PumpName = data.data.firstName;
    });
  }

  onReceiverOpened() {
    this.receiverSearch = '';
    this.filteredNames = [...this.names];
  }

  filterReceivers() {
    const searchLower = this.receiverSearch.toLowerCase();
    this.filteredNames = this.names.filter(item =>
      item.name.toLowerCase().includes(searchLower)
    );
  }


  addTable() {
    if (this.purchaDipStockseDetails.date) {
      this.lastRowId++;
      this.userId = localStorage.getItem('userId');
      const newRow = {
        id: this.jamaBaki.id,
        date: this.purchaDipStockseDetails.date,
        name: '',
        jama: 0,
        jamaNote: '',   // NEW FIELD
        baki: 0,
        bakiNote: '',   // NEW FIELD
        userId: this.userId
      };
      this.row.push(newRow);
    } else {
      this.notificationService.failure('Please fill in all the required fields before adding a new row.');
    }
  }



  totalJama() {
    return this.row.reduce((total, item) => total + parseFloat(item.jama || 0), 0).toFixed(2);
  }

  totalBaki() {
    return this.row.reduce((total, item) => total + parseFloat(item.baki || 0), 0).toFixed(2);
  }

  deleteRow(index: number) {
    const item = this.row[index];
    if (item.id) {
      this.http.delete(`${API_JAMABAKI_DELETE}/${item.id}`).subscribe({
        next: () => {
          this.notificationService.success("Row deleted successfully.");
          this.row.splice(index, 1); // remove from UI after backend confirms
        },
        error: () => {
          this.notificationService.failure("Failed to delete row from backend.");
        }
      });
    } else {
      this.row.splice(index, 1);
      this.notificationService.success("Row removed locally.");
    }
  }

  order() {
    this.userId = localStorage.getItem('userId');

    const payload = this.row.map(item => {
      const base = {
        id: item.id,
        customerName: item.customer?.name, // ✅ extract name safely
        customerId: item.customer?.id,
        date: this.jamaBaki.date,
        userId: this.userId
      };

      if (this.jamaBaki.type === 'jama') {
        return {
          ...base,
          jama: item.jama,
          jamaNote: item.jamaNote
        };
      } else {
        return {
          ...base,
          baki: item.baki,
          bakiNote: item.bakiNote
        };
      }
    });

    this.http.post<any>(API_JAMABAKI_ADD, payload).subscribe({
      next: () => {
        this.notificationService.success(`${this.jamaBaki.type === 'jama' ? 'Jama' : 'Baki'} details added successfully.`);
        this.dialogRef.close();
      },
      error: () => {
        this.notificationService.failure('Failed to save data. Please try again.');
      }
    });
  }


  displayCustomerName(customer: any): string {
    return customer?.name || '';
  }

  compareCustomers(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }


  AddCustomer() {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: '25%',
      height: '60%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  getJamaBakiList() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get<any[]>(API_JAMABAKI_LIST, { params }).subscribe((data) => {
      let filteredData = data;
      if (this.jamaBaki?.date) {
        filteredData = filteredData.filter(
          (item) =>
            new Date(item.date).toDateString() ===
            new Date(this.jamaBaki.date).toDateString()
        );
      }
      if (this.jamaBaki?.type === "jama") {
        filteredData = filteredData.filter(
          (item) => item.jama !== null && item.jama !== undefined && item.jama !== 0
        );
      } else if (this.jamaBaki?.type === "baki") {
        filteredData = filteredData.filter(
          (item) => item.baki !== null && item.baki !== undefined && item.baki !== 0
        );
      }
      this.row = filteredData.map(item => {
        const matchedCustomer =
          this.names.find(c => c.name === item.name) || { id: null, name: item.name };

        return {
          id: item.id,
          date: item.date,
          customer: matchedCustomer,
          jama: item.jama,
          jamaNote: item.jamaNote,
          baki: item.baki,
          bakiNote: item.bakiNote,
          userId: item.userId
        };
      });
    });
  }

  billBaki(selectedItem: any, index: number) {
    const billData = {
      date: selectedItem.date,
      customer: selectedItem.customer,
      PumpName: this.PumpName,
      // items: this.billRows.map(row => ({
      //   type: row.fuel,
      //   ltr: row.ltr,
      //   rate: row.rate,
      //   total: (row.ltr || 0) * (row.rate || 0)
      // })),
      // totalAmount: this.getGrandTotal()
    };
    this.dialog.open(BillComponent, {
      width: '50%',
      height: '100%',
      data: billData
    });
  }


}
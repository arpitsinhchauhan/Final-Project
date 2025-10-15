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
  filteredNames: string[] = [];
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
    this.http.get(url).subscribe((data) => {
      this.names = Object.values(data).map((item: any) => item.name);
      this.filteredNames = [...this.names];
    });
  }

  getUserName() {
    this.userId = localStorage.getItem('userId');
    this.use.getUserNameAndNozzle(this.userId).subscribe(data => {
      this.PumpName = data.data.firstName;
    });
  }

  filterReceivers() {
    const searchLower = this.receiverSearch.toLowerCase();
    this.filteredNames = this.names.filter(name =>
      name.toLowerCase().includes(searchLower)
    );
  }

  // Optional: reset filter when dropdown is opened
  onReceiverOpened() {
    this.receiverSearch = '';
    this.filteredNames = [...this.names];
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
    const isValid = this.row.every(item =>
      item.idJamabaki &&
      item.name &&
      (
        (this.jamaBaki.type === 'jama' && item.jama !== null) ||
        (this.jamaBaki.type === 'baki' && item.baki !== null)
      )
    );

    // if (!isValid) {
    //   this.notificationService.failure('Please fill in all the required fields before submitting.');
    //   return;
    // }

    // Build payload
    const payload = this.row.map(item => {
      const base = {
        id: item.id,
        name: item.name,
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
        this.notificationService.success(`${this.jamaBaki.type === 'jama' ? 'Jama' : 'Baki'} details successfully added.`);
        this.dialogRef.close();
      },
      error: () => {
        this.notificationService.failure('Failed to save data. Please try again.');
      }
    });
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
      this.row = filteredData.map(item => ({
        id: item.id,
        date: item.date,
        name: item.name,
        jama: item.jama,
        jamaNote: item.jamaNote,
        baki: item.baki,
        bakiNote: item.bakiNote,
        userId: item.userId
      }));
    });
  }

  billBaki(selectedItem: any, index: number) {

  }


}
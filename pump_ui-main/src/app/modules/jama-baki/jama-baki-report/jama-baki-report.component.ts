import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { API_CUSTOMER_NAME, API_JAMABAKI_ADD, API_JAMABAKI_LIST } from 'app/serviceult';
import { CustomerComponent } from '../customer/customer.component';

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
  userId: string;
  constructor(private http: HttpClient,
    public dialogRef: MatDialogRef<JamaBakiReportComponent>, @Inject(MAT_DIALOG_DATA) public jamaBaki: any,
    private notificationService: NotificationService, private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.getdata();
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
        idJamabaki: this.lastRowId,
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
    this.row.splice(index, 1);
    this.notificationService.success("Data succefully Delete.");
  }

  order() {
    if (this.row.every(item =>
        item.idJamabaki &&
        item.name &&
        item.jama !== null &&
        item.baki !== null
        // Notes are optional
      )) {
      this.http.post<any>(API_JAMABAKI_ADD, this.row)
        .subscribe(response => {
          this.notificationService.success('Jama & Baki details successfully added.');
          this.dialogRef.close();
        });
    } else {
      this.notificationService.failure('Please fill in all the required fields before submitting.');
    }
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

}
//   total = 0;
//   selectedDate!: Date | null;
//   purchaDipStockseDetails: any = {
//     date: ''
//   };


//   names: any[] = [];
//   constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,
//     public dialogRef: MatDialogRef<JamaBakiReportComponent>) {
//     (data);
//   }
//   getdata() {
//     this.http.get('http://localhost:8081/customerall').subscribe((data) => {
//       (data);
//       this.names = Object.values(data).map((item: any) => item.name);
//     });
//   }

//   onReceiverSelectionChange(event: MatSelectChange) {
//     (this.data.name); // Log the selected receiver value
//   }

//   ngOnInit() {
//     this.getdata();
//   }


//   order() {
//     if (this.row.every(item => item.idJamabaki && item.sender && item.receiver && item.amount)) {
//       this.http.post<any>('http://localhost:8081/jamabaki', this.row)
//         .subscribe(response => {
//           this.dialogRef.close();
//         });
//     } else {
//       alert('Please fill in all the required fields before submitting.');
//     }
//   }
//   purchaseDetails: any = {
//     date: '' 
//   };
//   row: any[] = [];
//   lastRowId: number = 0;



//   addTable() {
//     if (this.purchaDipStockseDetails.date && this.data.name) {
//       this.lastRowId++;
//       const newRow = { idJamabaki: this.lastRowId, date: this.purchaDipStockseDetails.date, sender: this.data.name, receiver: this.names, amount: '' };
//       this.row.push(newRow);
//     } else {
//       alert('Please fill in all the required fields before adding a new row.');
//     }
//   }

//   deleteRow(index: number) {
//     this.row.splice(index, 1);
//   }





//   totalPrice() {
//     let sum = 0;
//     this.row.forEach(item => {
//       sum += parseInt(item.amonut || '0', 10);
//     });
//     return sum;
//   }


// }




import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { API_ATMSELL_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-atm-transaction-pdf-excel',
  templateUrl: './atm-transaction-pdf-excel.component.html',
  styleUrls: ['./atm-transaction-pdf-excel.component.css']
})
export class AtmTransactionPdfExcelComponent implements OnInit {

  transaction: any = [];
  isReload: boolean;
  userId: string;

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, public dialogRef: MatDialogRef<AtmTransactionPdfExcelComponent>
  ) {
    // this.compD = data;
  }

  ngOnInit(): void {
    this.gettransaction();
  }

  gettransaction() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_ATMSELL_LIST, { params }).subscribe((data) => {
      this.transaction = data;
    });
  }
  exportToExcel() {
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(this.transaction.map(product => ({
      Date: product.date,
      Name: product.name,
      Amonut: product.amount,
      Transaction: product.transaction
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      Name: '',
      Amonut: this.getTransaction(),
      Transaction: ''
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaction Sell');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'Transaction_ATM.xlsx');
  }


  printTable(): void {
    const printContent = document.getElementById('TransactionTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload; // To reload the page and reset the original content
  }
  getTransaction(): number {
      return this.transaction.reduce((total, product) => 
        total + (parseFloat(product.amount) || 0), 0
      );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



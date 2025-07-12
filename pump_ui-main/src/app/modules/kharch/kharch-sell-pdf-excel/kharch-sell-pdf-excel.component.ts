import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { API_KHARCH_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-kharch-sell-pdf-excel',
  templateUrl: './kharch-sell-pdf-excel.component.html',
  styleUrls: ['./kharch-sell-pdf-excel.component.css']
})
export class KharchSellPdfExcelComponent implements OnInit {


  kharchlist: any = [];
  isReload: boolean;
  userId: string;

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, public dialogRef: MatDialogRef<KharchSellPdfExcelComponent>
  ) {
    // this.compD = data;
  }

  ngOnInit(): void {
    this.gettransaction();
  }

  gettransaction() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_KHARCH_LIST, { params }).subscribe((data) => {
      this.kharchlist = data;
    });
  }
  exportToExcel() {
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(this.kharchlist.map(product => ({
      Date: product.date,
      IndirectExpenses: product.expenses,
      Price: product.amount,
      Note: product.notes
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      IndirectExpenses: '',
      Price: this.getKharch(),
      Note: ''
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kharch Sell');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'Kharch_ATM.xlsx');
  }


  printTable(): void {
    const printContent = document.getElementById('kharchlistTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  }
  getKharch(): number {
      return this.kharchlist.reduce((total, product) => 
        total + (parseFloat(product.price) || 0), 0
      );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }


}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


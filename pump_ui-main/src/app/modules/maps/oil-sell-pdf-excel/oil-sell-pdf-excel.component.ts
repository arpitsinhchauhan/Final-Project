import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { API_OILSELL_ADD, API_OILSELL_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-oil-sell-pdf-excel',
  templateUrl: './oil-sell-pdf-excel.component.html',
  styleUrls: ['./oil-sell-pdf-excel.component.css']
})
export class OilSellPdfExcelComponent implements OnInit {

  isReload: boolean;
  OilsellList: any = [];
  userId:string;
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<OilSellPdfExcelComponent>
  ) {
    // this.compD = data;
  }

  ngOnInit(): void {
    this.getOilSell();
  }

  getOilSell() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_OILSELL_LIST, { params }).subscribe((data) => {
        this.OilsellList = data;
    });
  }
  exportToExcel() {
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(this.OilsellList.map(product => ({
      Date: product.date,
      Value: product.value,
      TotalSell: product.price
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      Value: '',
      Price: this.getTotalOilSell()
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Oil Sell');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'Oil_Sell.xlsx');
  }


  printTable(): void {
    const printContent = document.getElementById('OilsellTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // To reload the page and reset the original content
  }
  getTotalOilSell(): number {
      return this.OilsellList.reduce((total, product) => 
        total + (parseFloat(product.price) || 0), 0
      );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


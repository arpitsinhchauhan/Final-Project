import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { API_PURCHASE_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-puchase-pdf-excel',
  templateUrl: './puchase-pdf-excel.component.html',
  styleUrls: ['./puchase-pdf-excel.component.css']
})
export class PuchasePdfExcelComponent implements OnInit {
  productList: any = [];
  isReload: boolean;
  userId: string;
  constructor(private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<PuchasePdfExcelComponent>) { }

  ngOnInit(): void {  
    this.getPurchase();
  }


  // apiUrl = 'http://localhost:8081/purchases';
  getPurchase() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_PURCHASE_LIST, { params }).subscribe((data) => {
      this.productList = data;
    });
  }
  exportToExcel() {
    // Add a total row to the productList
    const totalPurchase = this.getTotalPurchase();
    const totalRow = {
      date: 'Total',
      type: '',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      jtcpercentage: '',
      total_purchase: totalPurchase
    };

    const dataWithTotal = [...this.productList, totalRow];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithTotal);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'purchase_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }

  printTable(): void {
    const printContent = document.getElementById('PurchaseTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload; // To reload the page and reset the original content
  }
  getTotalPurchase(): number {
    return this.productList.reduce((sum, product) => sum + product.total_purchase, 0);
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
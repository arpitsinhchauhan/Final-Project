import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { API_EXTRA_PURCHASE_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-extra-purchase-pdf-excel',
  templateUrl: './extra-purchase-pdf-excel.component.html',
  styleUrls: ['./extra-purchase-pdf-excel.component.scss']
})
export class ExtraPurchasePdfExcelComponent implements OnInit {

  extraPurchaseList: any = [];
  isReload: boolean;
  userId: string;
  constructor(private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<ExtraPurchasePdfExcelComponent>) { }

  ngOnInit(): void {  
    this.getPurchase();
  }


  getPurchase() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_EXTRA_PURCHASE_LIST, { params }).subscribe((data) => {
      this.extraPurchaseList = data;
    });
  }
  exportToExcel() {
    // Add a total row to the extraPurchaseList
    const extraTotalPurchase = this.getTotalPurchase();
    const totalRow = {
      date: 'Total',
      extra_type: '',
      extra_quantity: '',
      extra_total: '',
      extra_vat: '',
      extra_cess: '',
      extra_jtcpercentage: '',
      extra_total_purchase: extraTotalPurchase
    };

    const dataWithTotal = [...this.extraPurchaseList, totalRow];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithTotal);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Extra_purchase_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }

  printTable(): void {
    const printContent = document.getElementById('ExtraPurchaseTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // To reload the page and reset the original content
  }
  getTotalPurchase(): number {
    return this.extraPurchaseList.reduce((sum, product) => sum + product.extra_total_purchase, 0);
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
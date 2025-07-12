import { Component, OnInit } from '@angular/core';
import { API_JAMABAKI_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-jamabaki-pdf-excel',
  templateUrl: './jamabaki-pdf-excel.component.html',
  styleUrls: ['./jamabaki-pdf-excel.component.scss']
})
export class JamabakiPdfExcelComponent implements OnInit {

  
  isReload: boolean;
  JamabakiList: any = [];
  userId: string;
  constructor(private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<JamabakiPdfExcelComponent>,
  private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getJamaBaki();
  }


  getJamaBaki() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_JAMABAKI_LIST, { params }).subscribe((data) => {
      this.JamabakiList = data;
    });
  }

  exportToExcel() {
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(this.JamabakiList.map(product => ({
      Date: product.date,
      name:product.name,
      jama: product.jama,
      baki: product.baki,
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      name: '',
      jama: this.getTotalJama,
      baki: this.getTotalBaki()
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'JamaBaki');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'JamaBaki.xlsx');
  }


  printTable(): void {
    const printContent = document.getElementById('JamabakiTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  }
  getTotalJama(): number {
      return this.JamabakiList.reduce((sum, product) => 
        sum + (parseFloat(product.jama) || 0), 0);
  }

  getTotalBaki(): number {
    return this.JamabakiList.reduce((sum, product) => 
      sum + (parseFloat(product.baki) || 0), 0);
}

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

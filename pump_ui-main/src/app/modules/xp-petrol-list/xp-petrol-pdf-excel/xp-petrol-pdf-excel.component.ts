import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { API_XP_PETROL_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-xp-petrol-pdf-excel',
  templateUrl: './xp-petrol-pdf-excel.component.html',
  styleUrls: ['./xp-petrol-pdf-excel.component.scss']
})
export class XpPetrolPdfExcelComponent implements OnInit {

  
  isReload: boolean;
  xpPetrolList: any = [];
  userId: string;
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<XpPetrolPdfExcelComponent>
  ) {
  }

  ngOnInit(): void {
    this.getdata();
  }

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_XP_PETROL_LIST, { params }).subscribe((data) => {
      this.xpPetrolList = data;
    });
  }
  exportToExcel() {
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(this.xpPetrolList.map(product => ({
      Date: product.date,
      Pump: product.pump,
      CloseMeter: product.close_meter,
      OpenMeter: product.open_meter,
      Total: product.total,
      Testing: product.testing,
      xppetrol_ltr: product.xppetrol_ltr,
      Rate: product.rate,
      TotalSell: product.total_sell
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      Pump: '',
      CloseMeter: '',
      OpenMeter: '',
      Total: '',
      Testing: '',
      xppetrol_ltr: '',
      Rate: '',
      TotalSell: this.getTotalPetrolSell()
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'XP_PetrolTable');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'XP_Petrol.xlsx');
  }


  printTable(): void {
    const printContent = document.getElementById('XPPetrolTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload; // To reload the page and reset the original content
  }
  getTotalPetrolSell(): number {
    return this.xpPetrolList.reduce((total, product) => 
      total + (parseFloat(product.total_sell) || 0), 0
    );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

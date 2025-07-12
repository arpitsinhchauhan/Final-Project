import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { API_PETROL_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-petrol-sell-pdf-excel',
  templateUrl: './petrol-sell-pdf-excel.component.html',
  styleUrls: ['./petrol-sell-pdf-excel.component.css']
})
export class PetrolSellPdfExcelComponent implements OnInit {

  isReload: boolean;
  // productList: Map<String, String> | undefined;
  PetrolSelltList: any = [];
  userId: string;
  productList: Object;
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<PetrolSellPdfExcelComponent>
  ) {
  }

  ngOnInit(): void {
    this.getdata();
  }

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_PETROL_LIST, { params }).subscribe((data) => {
      this.PetrolSelltList = data;
    });
  }
  exportToExcel() {
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(this.PetrolSelltList.map(product => ({
      Date: product.date,
      Pump: product.pump,
      CloseMeter: product.close_meter,
      OpenMeter: product.open_meter,
      Total: product.total,
      Testing: product.testing,
      PetrolLtr: product.petrol_ltr,
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
      PetrolLtr: '',
      Rate: '',
      TotalSell: this.getTotalPetrolSell()
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Petrol Sell');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'Petrol_Sell.xlsx');
  }


  printTable(): void {
    const printContent = document.getElementById('PetrolSellTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload; // To reload the page and reset the original content
  }
  getTotalPetrolSell(): number {
    return this.PetrolSelltList.reduce((total, product) => 
      total + (parseFloat(product.total_sell) || 0), 0
    );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

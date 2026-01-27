import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-baki-details',
  templateUrl: './baki-details.component.html',
  styleUrls: ['./baki-details.component.scss']
})
export class BakiDetailsComponent implements OnInit {

  startDate: string;
  endDate: string;
  userId = localStorage.getItem("userId");
  bakiList: any[] = [];

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.startDate = data.startDate;
    this.endDate = data.endDate;
  }

  ngOnInit(): void {
    this.getBakiDetails();
  }

  getBakiDetails() {
    this.use.getBakiReport(this.startDate, this.endDate, this.userId)
      .subscribe((res) => {
        this.bakiList = res;
      });
  }

  exportExcel() {

    const excelData = this.bakiList.map(b => ({
      Date: b[0],
      Name: b[1],
      Type: b[2],
      Rate: b[3],
      LTR: b[4],
      Baki: b[5],
      Note: b[6]
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Baki Report');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, 'Baki_Report.xlsx');
  }

  pdf(): void {
    const printContent = document.getElementById('bakiListTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  }

  cancel() {
    this.dialog.closeAll();
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pump-total-baki-details',
  templateUrl: './pump-total-baki-details.component.html',
  styleUrls: ['./pump-total-baki-details.component.scss']
})
export class PumpTotalBakiDetailsComponent implements OnInit {

  startDate!: string;
  endDate!: string;
  userId: string | null = localStorage.getItem('userId');
  reportList: any[] = [];

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
  }

  ngOnInit(): void {
    this.getTotalBakiDetails();
  }

  getTotalBakiDetails(): void {
    this.use.getTotalBakiReport(this.startDate, this.endDate, this.userId!)
      .subscribe((res: any[]) => {
        this.reportList = res.map(r => ({
          date: r[0],
          name: r[1],
          type: r[2],
          rate: r[3],
          ltr: r[4],
          baki: r[5],
          bakiNote: r[6]
        }));
      });
  }



  exportExcel(): void {

    const excelData = this.reportList.map(b => ({
      Date: b.date,
      Name: b.name,
      Type: b.type,
      Rate: b.rate,
      LTR: b.ltr,
      Baki: b.baki,
      Note: b.bakiNote
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Baki Report');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob(
      [excelBuffer],
      { type: 'application/octet-stream' }
    );

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

  cancel(): void {
    this.dialog.closeAll();
  }
}
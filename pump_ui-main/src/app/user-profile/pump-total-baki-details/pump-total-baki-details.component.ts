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
          name: r[0],
          total_baki: r[1],
          total_jama: r[2],
          baki_total: r[3],
        }));
      });
  }



  exportExcel(): void {

    const excelData = this.reportList.map(b => ({
      Name: b.name,
      Total_Baki: b.total_baki,
      Total_Jama: b.total_jama,
      Baki_Total: b.baki_total,
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

  getTotalBaki(): number {
    return this.reportList.reduce((sum, b) =>
      sum + (parseFloat(b.baki_total) || 0), 0
    );
  }

  cancel(): void {
    this.dialog.closeAll();
  }
}
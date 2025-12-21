import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-pump-total-baki-details',
  templateUrl: './pump-total-baki-details.component.html',
  styleUrls: ['./pump-total-baki-details.component.scss']
})
export class PumpTotalBakiDetailsComponent implements OnInit {

  startDate: string;
  endDate: string;
  userId = localStorage.getItem("userId");
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

  getTotalBakiDetails() {
    this.use.getTotalBakiReport(this.startDate, this.endDate, this.userId)
      .subscribe((res) => {
        console.log(res);
        this.reportList = res.map(row => ({
        date: row[0],
        name: row[1],
        rate: row[2],
        type: row[3],
        ltr: row[4],
        baki: row[5],
        bakiNote: row[6]
      }));
      });
  }

  close() {
    this.dialog.closeAll();
  }
}

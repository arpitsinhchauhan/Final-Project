import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-baki-details',
  templateUrl: './baki-details.component.html',
  styleUrls: ['./baki-details.component.scss']
})
export class BakiDetailsComponent implements OnInit {

  startDate: string;
  endDate: string;
  userId = localStorage.getItem("userId");

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
        console.log(res);
      });

  }
}

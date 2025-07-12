import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "app/services/notification.service";
import { UserServiceService } from "app/services/user-service.service";
import { API_JAMABAKI_LIST } from "app/serviceult";
import { CustomerComponent } from "./customer/customer.component";
import { EditjamabakiComponent } from "./editjamabaki/editjamabaki.component";
import { JamaBakiReportComponent } from "./jama-baki-report/jama-baki-report.component";
import { JamabakiPdfExcelComponent } from "./jamabaki-pdf-excel/jamabaki-pdf-excel.component";

@Component({
  selector: "app-jama-baki",
  templateUrl: "./jama-baki.component.html",
  styleUrls: ["./jama-baki.component.css"],
})
export class JamaBakiComponent implements OnInit {
  searchTerm: string = '';
  jamabakiList: any = [];
  currentPage = 1;
  itemsPerPage = 4;
  searchText: string = "";
  userId: string;
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}
  ngOnInit(): void {
    this.getJamaBakiList();
  }

  getJamaBakiList() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get(API_JAMABAKI_LIST, { params }).subscribe((data) => {
      this.jamabakiList = data;
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  deleteRow(id: any) {
    this.use.deletejamabakidata(id).subscribe((result) => {
      this.notificationService.success("JamaBakidata deleted successfully");
      this.jamabakiList = result;
      this.getJamaBakiList();
    });
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditjamabakiComponent, {
      width: "50%",
      height: "45%",
      data: item,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getJamaBakiList();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: "25%",
      height: "60%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getJamaBakiList();
    });
  }

  openJamaBaki() {
    const dialogRef = this.dialog.open(JamaBakiReportComponent, {
      width: "50%",
      height: "60%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getJamaBakiList();
    });
  }

  	  
  searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.getJamaBakiList();
      return;
    }             
  
    this.jamabakiList = this.jamabakiList.filter((item: any) =>
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.getJamaBakiList();
  }

  openJamaBakiPdfExcel() {
    const dialogRef = this.dialog.open(JamabakiPdfExcelComponent, {
      width: "50%",
      height: "60%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getJamaBakiList();
    });
  }
}

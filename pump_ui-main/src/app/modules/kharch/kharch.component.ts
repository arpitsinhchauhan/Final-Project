import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "app/services/notification.service";
import { UserServiceService } from "app/services/user-service.service";
import { API_KHARCH_LIST } from "app/serviceult";
import { KharchReportComponent } from "./kharch-report/kharch-report.component";
import { KharchSellPdfExcelComponent } from "./kharch-sell-pdf-excel/kharch-sell-pdf-excel.component";

@Component({
  selector: "app-kharch",
  templateUrl: "./kharch.component.html",
  styleUrls: ["./kharch.component.css"],
})
export class KharchComponent implements OnInit {
  // productList: Map<String, String> | undefined;
  productList: any = [];
  transaction: any = [];
  tableData: any[] = [];
  searchTerm: string = "";
  dataSource: any[] | undefined; // Your data source array
  currentPage = 1; // Current page index
  itemsPerPage = 4;
  userId: string;

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getdata();
    this.dataSource = [];
  }

  getdata() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get(API_KHARCH_LIST, { params }).subscribe((data) => {
      this.productList = data;
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(KharchReportComponent, {
      width: "50%",
      height: "70%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
    });
  }

  deleteRow(idkharch: any) {
    this.use.deleteKharchdata(idkharch).subscribe((result) => {
      this.notificationService.success("kharchdata deleted successfully");
      this.productList = result;
      this.getdata();
    });
  }

  openExcelPdfKharch() {
    const dialogRef = this.dialog.open(KharchSellPdfExcelComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
    });
  }

 
				  
  searchData(): void {
const term = this.searchTerm.toLowerCase().trim();
if (!term) {
this.getdata();
return;
}             

this.productList = this.productList.filter((item: any) =>
(item.expenses && item.expenses.toLowerCase().includes(term)) ||
(item.date && item.date.toLowerCase().includes(term))
);
}

clearSearch() {
this.searchTerm = '';
this.getdata();
}

}

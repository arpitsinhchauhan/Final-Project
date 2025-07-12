import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_PURCHASE_LIST } from 'app/serviceult';
import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component';
import { PuchasePdfExcelComponent } from './puchase-pdf-excel/puchase-pdf-excel.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { UserDTO } from 'app/models/UserDTO';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  isReload: boolean;
  productList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 2; 
  userId: string;
  
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, private notificationService: NotificationService) {
   }

  ngOnInit(): void {
    this.getdata();
    this.dataSource = [
    ];
  }
  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_PURCHASE_LIST, { params }).subscribe((data) => {
      this.productList = data;
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(PurchaseReportComponent, {
      width: '60%',
      height: '81%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.productList.filter = filterValue;
  }


  search(): void {
    const term = this.searchTerm.toLowerCase().trim();
  
    this.productList = this.productList.filter((item: any) => {
      // convert item's date to dd-MM-yyyy string
      const formattedDate = formatDate(item.date, 'dd-MM-yyyy', 'en-US');
  
      return (
        formattedDate.includes(term) ||
        item.type?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    });
  
    if (!term) {
      this.productList = [...this.productList];
    }
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditPurchaseComponent, {
      width: '50%',
      height: '50%',
      data: item,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.isReload) {
        this.getdata();
      }
    });
  }


  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(PuchasePdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  deleteRow(id: any) {
       this.use.deletePurchasedata(id).subscribe((result) => {
      this.productList = result;
      this.notificationService.success('Product deleted successfully');
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
      (item.type && item.type.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.getdata();
  }
  
}

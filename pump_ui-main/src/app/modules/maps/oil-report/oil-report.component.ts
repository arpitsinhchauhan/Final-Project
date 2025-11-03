import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { OilSellDetails } from "../../../models/OilSellDetails";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { API_CUSTOMER_NAME, API_OILSELL_ADD, API_OILSELL_DELETE, API_OILSELL_LIST } from "app/serviceult";
import { NotificationService } from "app/services/notification.service";
import { UserServiceService } from "app/services/user-service.service";
import { OilListComponent } from "../oil-list/oil-list.component";
import { OillBillComponent } from "app/modules/billing/dailog/oill-bill/oill-bill.component";

@Component({
  selector: "app-oil-report",
  templateUrl: "./oil-report.component.html",
  styleUrls: ["./oil-report.component.css"],
})
export class OilReportComponent implements OnInit {

  searchText: string = "";
  filteredExpenses: string[] = [];
  total = 0;
  isReload: boolean;
  data: any = { name: [] };
  selectedDate!: Date | null;
  expenseFilterCtrl = new FormControl();
  purchaDipStockseDetails: any = { date: "" };
  filteredExpensesList: Observable<string[]>;
  typeList: string[] = [];
  userId: string;
  receiverSearch: string = '';
  purchaseDetails: any = { date: "" };
  filteredNames: any[] = [];
  names: any[] = [];
  PumpName: string = '';
  row: any[] = [];
  lastRowId: number = 0;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<OilReportComponent>,
    private notificationService: NotificationService,
    private use: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public oilData: any,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.use.dialogZIndexAdjustment();
    this.userId = localStorage.getItem('userId');

    if (this.oilData?.date) {
      this.purchaDipStockseDetails.date = this.oilData.date;
    }

    this.getCustomerName();
    this.getUserName();
    this.getoilList();
    this.getOilReport();
  }

  getCustomerName() {
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;
    this.http.get(url).subscribe((data: any) => {
      this.names = Object.values(data);
      this.filteredNames = [...this.names];
    });
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(data => {
      this.PumpName = data.data.firstName;
    });
  }

  getoilList() {
    this.use.getoilList().subscribe((response) => {
      this.typeList = response.map((item: any) => item.oilSellList);
      this.filteredExpenses = [...this.typeList];
    });
  }

  onReceiverOpened() {
    this.receiverSearch = '';
    this.filteredNames = [...this.names];
  }

  filterReceivers() {
    const searchLower = this.receiverSearch.toLowerCase();
    this.filteredNames = this.names.filter(item =>
      item.name.toLowerCase().includes(searchLower)
    );
  }

  getOilReport() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };

    this.http.get<any[]>(API_OILSELL_LIST, { params }).subscribe((data) => {
      if (this.oilData?.date) {
        if (this.names.length === 0) {
          setTimeout(() => this.getOilReport(), 200);
          return;
        }

        this.row = data
          .filter(item => new Date(item.date).toDateString() === new Date(this.oilData.date).toDateString())
          .map(item => {
            const matchedCustomer = this.names.find(c => c.name.trim().toLowerCase() === item.customerName?.trim().toLowerCase());
            return {
              ...item,
              customer: matchedCustomer || { name: item.customerName || '' }
            };
          });
      }
    });
  }

  onCustomerChange(selectedCustomer: any, item: any) {
    item.customer = selectedCustomer;
    item.customerName = selectedCustomer.name;
  }

  addTable() {
    if (this.purchaDipStockseDetails.date) {
      this.lastRowId++;
      this.row.push({
        id: this.lastRowId,
        date: this.purchaDipStockseDetails.date,
        customer: "",
        value: "",
        price: "",
        oilSellNote: "",
        userId: this.userId,
      });
    } else {
      this.notificationService.failure("Please select a date before adding a new row.");
    }
  }

  deleteRow(index: number) {
    const item = this.row[index];
    if (item.idOilSell) {
      this.http.delete(`${API_OILSELL_DELETE}/${item.idOilSell}`).subscribe({
        next: () => {
          this.notificationService.success("Row deleted successfully.");
          this.row.splice(index, 1);
        },
        error: () => {
          this.notificationService.failure("Failed to delete row from backend.");
        }
      });
    } else {
      this.row.splice(index, 1);
      this.notificationService.success("Row removed locally.");
    }
  }

  oilBill(selectedItem: any, index: number) {
    const billData = {
      PumpName: this.PumpName,
      customer: selectedItem.customer,
      date: this.purchaDipStockseDetails.date,
      oilType: selectedItem.value,
      price: selectedItem.price,
      note: selectedItem.oilSellNote,
    };

    const dialogRef = this.dialog.open(OillBillComponent, {
      width: "67%",
      height: "100%",
      disableClose: true,
      data: billData
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getoilList();
    });
  }

  order() {
    if (!this.purchaDipStockseDetails.date) {
      this.notificationService.failure("Please select a date before placing the order.");
      return;
    }

    if (!this.isValidData()) {
      this.notificationService.failure("Please fill all required fields.");
      return;
    }

    const data = { expenses: this.row };

    this.http.post<any>(API_OILSELL_ADD, data.expenses).subscribe(() => {
      this.notificationService.success("Oil sell data successfully added.");
      this.purchaDipStockseDetails.date = null;
      this.row = [];
      this.dialogRef.close();
    });
  }

  isValidData(): boolean {
    if (!this.purchaDipStockseDetails.date) return false;

    for (let item of this.row) {
      if (!item.customer || !item.value || !item.price) return false;
    }
    return true;
  }

  totalPrice() {
    return this.row.reduce((sum, item) => sum + parseFloat(item.price || "0"), 0);
  }

  cancel() {
    this.dialogRef.close({ isReload: this.isReload });
  }

  oilType() {
    const dialogRef = this.dialog.open(OilListComponent, {
      width: "40%",
      height: "30%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getoilList();
    });
  }

  onSelectOpened() {
    this.searchText = '';
    this.filteredExpenses = [...this.typeList];
  }

  onSearchChange() {
    const query = this.searchText.toLowerCase();
    this.filteredExpenses = this.typeList.filter(expense =>
      expense.toLowerCase().includes(query)
    );
  }
}
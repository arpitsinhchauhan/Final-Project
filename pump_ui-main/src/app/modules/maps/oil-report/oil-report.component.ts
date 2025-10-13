import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { OilSellDetails } from "../../../models/OilSellDetails";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { API_OILSELL_ADD, API_OILSELL_DELETE, API_OILSELL_LIST } from "app/serviceult";
import { NotificationService } from "app/services/notification.service";
import { UserServiceService } from "app/services/user-service.service";
import { OilListComponent } from "../oil-list/oil-list.component";

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
  purchaDipStockseDetails: any = {
    date: "",
  };
  filteredExpensesList: Observable<string[]>;
  typeList: string[] = [
  ];
  userId: string;
  purchaseDetails: any = {
    date: "",
  };
  row: any[] = [];
  lastRowId: number = 0;
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<OilReportComponent>,
    private notificationService: NotificationService,
    private use: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public oilData: any, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.use.dialogZIndexAdjustment();
    if (this.oilData && this.oilData.date) {
      this.purchaDipStockseDetails.date = this.oilData.date;
    }
    this.getoilList();
    this.getOilReport();
    this.row[0].id = "1";
    // this.userId = localStorage.getItem('userId');
    // this.row = [{ id: '0', date: this.purchaDipStockseDetails.date, value: '', price: '' }];
  }

  private _filterExpenses(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.typeList.filter((expense) =>
      expense.toLowerCase().includes(filterValue)
    );
  }
  order() {
    const userId = localStorage.getItem("userId");
    if (!this.purchaDipStockseDetails.date) {
      this.notificationService.failure(
        "Please select a date before placing the order."
      );
      return;
    }
    if (!this.isValidData()) {
      this.notificationService.failure("Please fill all required fields.");
      return;
    }
    const data = {
      // userId: userId,
      expenses: this.row,
    };

    // const data = {
    //   userId: userId,
    //   expenses: Array.isArray(this.row) ? this.row : [this.row]  // Ensure it's an array
    // };
    // Send data to backend
    this.http
      .post<any>(API_OILSELL_ADD, data.expenses)
      .subscribe((response) => {
        // const responseData = response.expenses;
        this.notificationService.success("Oilsell Data succefully add..");
        this.purchaDipStockseDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      });
  }
  isValidData(): boolean {
    if (!this.purchaDipStockseDetails.date) {
      return false;
    }

    for (let item of this.row) {
      if (!item.value || !item.price) {
        return false;
      }
    }
    return true;
  }


  addTable() {
    if (this.purchaDipStockseDetails.date) {
      this.lastRowId++;
      this.userId = localStorage.getItem("userId");
      // this.row.push({ id: '', date: this.purchaDipStockseDetails.date, notes: '', price: '' });
      const newRow = {
        id: this.purchaseDetails.id,
        date: this.purchaDipStockseDetails.date,
        value: "",
        price: "",
        oilSellNote: "",
        userId: this.userId,
      };
      this.row.push(newRow);
    } else {
      this.notificationService.failure(
        "Please fill in all the required fields before adding a new row."
      );
    }
  }

  deleteRow(index: number) {
    const item = this.row[index];
    if (item.idOilSell) {
      this.http.delete(`${API_OILSELL_DELETE}/${item.idOilSell}`).subscribe({
        next: () => {
          this.notificationService.success("Row deleted successfully.");
          this.row.splice(index, 1); // remove from UI after backend confirms
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


  totalPrice() {
    let sum = 0;
    this.row.forEach((item) => {
      sum += parseInt(item.price || "0", 10);
    });
    return sum;
  }

  cancel() {
    this.dialogRef.close({ isReload: this.isReload });
  }

  getoilList() {
    this.use.getoilList().subscribe((response) => {
      this.typeList = response.map((item: any) => item.oilSellList);
      this.filteredExpenses = [...this.typeList];
    });
  }

  onSearchChange() {
    const query = this.searchText.toLowerCase();
    this.filteredExpenses = this.typeList.filter(expense =>
      expense.toLowerCase().includes(query)
    );
  }

  onSelectOpened() {
    this.searchText = '';
    this.filteredExpenses = [...this.typeList];
  }


  oilType() {
    const dialogRef = this.dialog.open(OilListComponent, {
      width: "40%",
      height: "30%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getoilList();
    });
  }


  getOilReport() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get<any[]>(API_OILSELL_LIST, { params }).subscribe((data) => {
      if (this.oilData?.date) {
        this.row = data.filter(
          (item) => new Date(item.date).toDateString() === new Date(this.oilData.date).toDateString()
        );
      } else {
        this.row = data;
      }
    });
  }



}
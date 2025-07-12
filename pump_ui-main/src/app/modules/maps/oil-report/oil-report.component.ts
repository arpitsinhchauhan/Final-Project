import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { OilSellDetails } from "../../../models/OilSellDetails";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { API_OILSELL_ADD } from "app/serviceult";
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
    // "20 Ltr",
    // "10 Ltr",
    // "7.5 Ltr",
    // "5 Ltr",
    // "1 Ltr",
    // "0.500 Ltr",
    // "Tuti 1 Ltr",
    // "Tuti 0.500",
    // "4T 900",
    // "Break. 0.500",
    // "Break. 0.250",
    // "Gear 5 Ltr",
    // "Gear 1 Ltr",
  ];
  userId: string;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<OilReportComponent>,
    private notificationService: NotificationService,
    private use: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public oilData: any,private dialog: MatDialog
  ) {
    
  }

  ngOnInit() {
    if (this.oilData && this.oilData.date) {
      this.purchaDipStockseDetails.date = this.oilData.date;
    }
    this.getoilList();
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
      if (!item.id || !item.value || !item.price) {
        return false;
      }
    }
    return true;
  }
  purchaseDetails: any = {
    date: "", // You can set default date if needed
  };
  row: any[] = [];
  lastRowId: number = 0;

  addTable() {
    if (this.purchaDipStockseDetails.date) {
      this.lastRowId++;
      this.userId = localStorage.getItem("userId");
      // this.row.push({ id: '', date: this.purchaDipStockseDetails.date, notes: '', price: '' });
      const newRow = {
        id: this.lastRowId,
        date: this.purchaDipStockseDetails.date,
        value: "",
        price: "",
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
    // Remove a row from the table
    this.row.splice(index, 1);
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
      // Assuming response is array of objects with oilSellList as string values
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
}
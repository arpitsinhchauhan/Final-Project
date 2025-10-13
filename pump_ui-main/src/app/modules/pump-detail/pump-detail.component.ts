import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { API_AGGREGATED_DATA } from "app/serviceult";
import { UserServiceService } from "app/services/user-service.service";
import { AggregatedDataDTO } from "app/models/AggregatedDataDTO";

@Component({
  selector: "app-pump-detail",
  templateUrl: "./pump-detail.component.html",
  styleUrls: ["./pump-detail.component.css"],
})
export class PumpDetailComponent implements OnInit {
  // productList: any = [];
  startDate: string;
  totalPetrolSum: number = 0;
  endDate: string;
  combinedSummary: any[] = [];
  productList: AggregatedDataDTO[] = [];
  expenseHeaders: any[] = [];
  totalPetroltotalsum: number = 0;
  totalDieselsum: number = 0;
  totalDieseltotalSum: number = 0;
  totalOilTotalPrice: number = 0;
  totalKharchTotal: number = 0;
  totalPetrolQuantity: number = 0;
  totalPetrolTotal: number = 0;
  totalPetrolVat: number = 0;
  totalPetrolCess: number = 0;
  totalPetrolJtcpercentage: number = 0;
  totalPetrolTotalPurchase: number = 0;
  totalDieselQuantity: number = 0;
  totalDieselTotal: number = 0;
  totalDieselVat: number = 0;
  totalDieselCess: number = 0;
  totalDieselJtcpercentage: number = 0;
  totalDieselTotalPurchase: number = 0;
  totalAmountTotal: number = 0;
  totalJamaTotal: number = 0;
  totalBakiTotal: number = 0;
  // XP Petrol Totals
  totalXpPetrolTotalSum: number = 0;
  totalXpPetrolTotalSell: number = 0;
  totalXpPetrolQuantity: number = 0;
  totalXpPetrolTotal: number = 0;
  totalXpPetrolVat: number = 0;
  totalXpPetrolCess: number = 0;
  totalXpPetrolJtcpercentage: number = 0;
  totalXpPetrolTotalPurchase: number = 0;

  // Power Diesel Totals
  totalPowerDieselTotalSum: number = 0;
  totalPowerDieselTotalSell: number = 0;
  totalPowerDieselQuantity: number = 0;
  totalPowerDieselTotal: number = 0;
  totalPowerDieselVat: number = 0;
  totalPowerDieselCess: number = 0;
  totalPowerDieselJtcpercentage: number = 0;
  totalPowerDieselTotalPurchase: number = 0;
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;
  userId = localStorage.getItem("userId");

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
    this.getPurchase();
    this.getUserName();
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe((data) => {
      this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
      this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
    });
  }

  getPurchase() {
    const userId = localStorage.getItem("userId");
    const params = new HttpParams()
      .set("startDate", this.startDate.toString().split("T")[0])
      .set("endDate", this.endDate.toString().split("T")[0])
      .set("userId", userId);

    this.http
      .get<AggregatedDataDTO[]>(API_AGGREGATED_DATA, { params })
      .subscribe(
        (data) => {
          // build headers (unique expense names)
          this.expenseHeaders = this.getUniqueExpenseHeaders(data);

          // add expenseMap for quick lookup
          this.productList = data.map(item => ({
            ...item,
            expenseMap: this.buildExpenseMap(item.expensesList)
          }));

          this.calculateTotals();
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
  }

  getUniqueExpenseHeaders(data: any[]): string[] {
    const headers = new Set<string>();
    data.forEach(item => {
      if (Array.isArray(item.expensesList)) {
        item.expensesList.forEach((exp: any) => headers.add(exp.expenses));
      }
    });
    return Array.from(headers);
  }

  // Build a map: { "ASSOSIASAN FEE EXP": 10800, "BANK INTEREST": 2000, ... }
  buildExpenseMap(expensesList: any[]): { [key: string]: number } {
    const map: { [key: string]: number } = {};
    if (!Array.isArray(expensesList)) return map;
    expensesList.forEach(exp => {
      map[exp.expenses] = Number(exp.total_price ?? 0);
    });
    return map;
  }

  // Optional: Keep a function so template call won't break
  public getExpenseValue(expensesList: any[], header: string): number {
    if (!Array.isArray(expensesList)) return 0;
    const exp = expensesList.find(e => e.expenses === header);
    return exp ? Number(exp.total_price) : 0;
  }

  calculateTotals() {
    this.totalPetrolSum = this.productList.reduce((sum, item) => {
      return sum + item.petrolTotalSum;
    }, 0);
    this.totalPetroltotalsum = this.productList.reduce(
      (sum, item) => sum + item.petrolTotalTotalSell,
      0
    );
    this.totalDieselsum = this.productList.reduce(
      (sum, item) => sum + item.dieselTotalSum,
      0
    );
    this.totalDieseltotalSum = this.productList.reduce(
      (sum, item) => sum + item.dieselTotalTotalSell,
      0
    );

    this.totalOilTotalPrice = this.productList.reduce(
      (sum, item) => sum + item.oilTotalPrice,
      0
    );
    this.totalKharchTotal = this.productList.reduce(
      (sum, item) => sum + item.kharchTotal,
      0
    );
    this.totalPetrolQuantity = this.productList.reduce(
      (sum, item) => sum + item.petrolQuantity,
      0
    );
    this.totalPetrolTotal = this.productList.reduce(
      (sum, item) => sum + item.petrolTotal,
      0
    );
    this.totalPetrolVat = this.productList.reduce(
      (sum, item) => sum + item.petrolVat,
      0
    );
    this.totalPetrolCess = this.productList.reduce(
      (sum, item) => sum + item.petrolCess,
      0
    );
    this.totalPetrolJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.petrolJtcpercentage,
      0
    );
    this.totalPetrolTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.petrolTotalPurchase,
      0
    );
    this.totalDieselQuantity = this.productList.reduce(
      (sum, item) => sum + item.dieselQuantity,
      0
    );
    this.totalDieselTotal = this.productList.reduce(
      (sum, item) => sum + item.dieselTotal,
      0
    );
    this.totalDieselVat = this.productList.reduce(
      (sum, item) => sum + item.dieselVat,
      0
    );
    this.totalDieselCess = this.productList.reduce(
      (sum, item) => sum + item.dieselCess,
      0
    );
    this.totalDieselJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.dieselJtcpercentage,
      0
    );
    this.totalDieselTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.dieselTotalPurchase,
      0
    );
    this.totalAmountTotal = this.productList.reduce(
      (sum, item) => sum + item.amountTotal,
      0
    );
    this.totalJamaTotal = this.productList.reduce(
      (sum, item) => sum + item.jamaTotal,
      0
    );
    this.totalBakiTotal = this.productList.reduce(
      (sum, item) => sum + item.bakiTotal,
      0
    );
    this.totalXpPetrolTotalSum = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotalSum,
      0
    );
    this.totalXpPetrolTotalSell = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotalSell,
      0
    );
    this.totalXpPetrolQuantity = this.productList.reduce(
      (sum, item) => sum + item.xppetrolQuantity,
      0
    );
    this.totalXpPetrolTotal = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotal,
      0
    );
    this.totalXpPetrolVat = this.productList.reduce(
      (sum, item) => sum + item.xppetrolVat,
      0
    );
    this.totalXpPetrolCess = this.productList.reduce(
      (sum, item) => sum + item.xppetrolCess,
      0
    );
    this.totalXpPetrolJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.xppetrolJtcpercentage,
      0
    );
    this.totalXpPetrolTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotalPurchase,
      0
    );

    // Power Diesel totals
    this.totalPowerDieselTotalSum = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotalSum,
      0
    );
    this.totalPowerDieselTotalSell = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotalSell,
      0
    );
    this.totalPowerDieselQuantity = this.productList.reduce(
      (sum, item) => sum + item.powerdieselQuantity,
      0
    );
    this.totalPowerDieselTotal = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotal,
      0
    );
    this.totalPowerDieselVat = this.productList.reduce(
      (sum, item) => sum + item.powerdieselVat,
      0
    );
    this.totalPowerDieselCess = this.productList.reduce(
      (sum, item) => sum + item.powerdieselCess,
      0
    );
    this.totalPowerDieselJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.powerdieselJtcpercentage,
      0
    );
    this.totalPowerDieselTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotalPurchase,
      0
    );
  }

  exportToExcel(): void {
    const includeXpAndPower = this.xp_petrol_nozzle > 0 || this.powe_diesel_nozzle > 0;

    // ✅ Create rows with flat expense columns
    const dataForExcel = this.productList.map(item => {
      const row: any = { ...item };

      // Expand expensesList into separate columns
      if (item.expensesList) {
        item.expensesList.forEach((exp: any) => {
          row[exp.expenses] = exp.total_price; // e.g. row["ASSOSIASAN FEE EXP"] = 10800
        });
      }

      return row;
    });

    // ✅ Create totals row with same structure
    const totalsRow: any = {
      date: "Total",
      petrolTotalTotalSell: this.totalPetroltotalsum,
      dieselTotalSum: this.totalDieselsum,
      dieselTotalTotalSell: this.totalDieseltotalSum,
      oilTotalPrice: this.totalOilTotalPrice,
      kharchTotal: this.totalKharchTotal,
      petrolQuantity: this.totalPetrolQuantity,
      petrolTotal: this.totalPetrolTotal,
      petrolVat: this.totalPetrolVat,
      petrolCess: this.totalPetrolCess,
      petrolJtcpercentage: this.totalPetrolJtcpercentage,
      petrolTotalPurchase: this.totalPetrolTotalPurchase,
      dieselVat: this.totalDieselVat,
      dieselCess: this.totalDieselCess,
      dieselJtcpercentage: this.totalDieselJtcpercentage,
      dieselTotalPurchase: this.totalDieselTotalPurchase,
      amountTotal: this.totalAmountTotal,
      jamaTotal: this.totalJamaTotal,
      bakiTotal: this.totalBakiTotal
    };

    // Add expense totals into totals row
    this.expenseHeaders.forEach(header => {
      totalsRow[header] = this.productList.reduce((sum, item) => {
        const match = item.expensesList?.find((exp: any) => exp.expenses === header);
        return sum + (match ? match.total_price : 0);
      }, 0);
    });

    const dataWithTotals = [...dataForExcel, totalsRow];

    // ✅ Dynamically create header order (including expense columns)
    const headerOrder = [
      "date", "petrolTotalSum", "petrolRate", "petrolTotalTotalSell", "petrolgatt_Total",
      "dieselTotalSum", "dieselRate", "dieselTotalTotalSell", "dieselgatt_Total", "oilTotalPrice", "kharchTotal",
      "petrolQuantity", "petrolTotal", "petrolVat", "petrolCess", "petrolJtcpercentage",
      "petrolTotalPurchase", "dieselQuantity", "dieselTotal", "dieselVat", "dieselCess",
      "dieselJtcpercentage", "dieselTotalPurchase", "amountTotal", "jamaTotal", "bakiTotal",
      ...this.expenseHeaders // <-- dynamically add expense columns
    ];

    // ✅ Generate worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithTotals, {
      header: headerOrder,
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };

    XLSX.writeFile(workbook, "ProductList.xlsx");
  }


  close(){
    this.dialog.closeAll();
  }
}

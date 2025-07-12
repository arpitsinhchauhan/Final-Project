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
  totalPetrolltr: number = 0;
  totalPetroltotalsum: number = 0;
  totalDieselsum: number = 0;
  totalDieselltr: number = 0;
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
  totalXpPetrolLtr: number = 0;
  totalXpPetrolTotalSum: number = 0;
  totalXpPetrolTotalSell: number = 0;
  totalXpPetrolQuantity: number = 0;
  totalXpPetrolTotal: number = 0;
  totalXpPetrolVat: number = 0;
  totalXpPetrolCess: number = 0;
  totalXpPetrolJtcpercentage: number = 0;
  totalXpPetrolTotalPurchase: number = 0;

  // Power Diesel Totals
  totalPowerDieselLtr: number = 0;
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
          this.productList = data;
          this.calculateTotals();
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
  }

  calculateTotals() {
    this.totalPetrolSum = this.productList.reduce((sum, item) => {
      return sum + item.petrolTotalSum;
    }, 0);
    this.totalPetrolltr = this.productList.reduce(
      (sum, item) => sum + item.petrolLtr,
      0
    );
    this.totalPetroltotalsum = this.productList.reduce(
      (sum, item) => sum + item.petrolTotalTotalSell,
      0
    );
    this.totalDieselsum = this.productList.reduce(
      (sum, item) => sum + item.dieselTotalSum,
      0
    );
    this.totalDieselltr = this.productList.reduce(
      (sum, item) => sum + item.dieselLtr,
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
    // XP Petrol totals
    this.totalXpPetrolLtr = this.productList.reduce(
      (sum, item) => sum + item.xppetrolLtr,
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
    this.totalPowerDieselLtr = this.productList.reduce(
      (sum, item) => sum + item.powerdieselLtr,
      0
    );
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
    const totalsRow = {
      date: "Total",
      petrolTotalCloseMeter: "",
      petrolTotalOpenMeter: "",
      petrolTotalSum: this.totalPetrolSum,
      petrolTotalTesting: "",
      petrolLtr: this.totalPetrolltr,
      petrolRate: "",
      petrolTotalTotalSell: this.totalPetroltotalsum,
      dieselTotalCloseMeter: "",
      dieselTotalOpenMeter: "",
      dieselTotalSum: this.totalDieselsum,
      dieselTotalTesting: "",
      dieselLtr: this.totalDieselltr,
      dieselRate: "",
      dieselTotalTotalSell: this.totalDieseltotalSum,
      oilTotalPrice: this.totalOilTotalPrice,
      kharchTotal: this.totalKharchTotal,
      pType: "",
      petrolQuantity: this.totalPetrolQuantity,
      petrolTotal: this.totalPetrolTotal,
      petrolVat: this.totalPetrolVat,
      petrolCess: this.totalPetrolCess,
      petrolJtcpercentage: this.totalPetrolJtcpercentage,
      petrolTotalPurchase: this.totalPetrolTotalPurchase,
      dType: "",
      dieselQuantity: this.totalDieselQuantity,
      dieselTotal: this.totalDieselTotal,
      dieselVat: this.totalDieselVat,
      dieselCess: this.totalDieselCess,
      dieselJtcpercentage: this.totalDieselJtcpercentage,
      dieselTotalPurchase: this.totalDieselTotalPurchase,
      amountTotal: this.totalAmountTotal,
      jamaTotal: this.totalJamaTotal,
      bakiTotal: this.totalBakiTotal,
      xppetrolCloseMeter: "", // leave blank if not calculated
      xppetrolOpenMeter: "",
      xppetrolLtr: this.totalXpPetrolLtr,
      xppetrolTotalSum: this.totalXpPetrolTotalSum,
      xppetrolRate: "", 
      xppetrolTotalTesting: "",
      xppetrolTotalSell: this.totalXpPetrolTotalSell,
      xppetrolQuantity: this.totalXpPetrolQuantity,
      xppetrolTotal: this.totalXpPetrolTotal,
      xppetrolVat: this.totalXpPetrolVat,
      xppetrolCess: this.totalXpPetrolCess,
      xppetrolJtcpercentage: this.totalXpPetrolJtcpercentage,
      xppetrolTotalPurchase: this.totalXpPetrolTotalPurchase,

      // Power Diesel Totals
      powerdieselCloseMeter: "",
      powerdieselOpenMeter: "",
      powerdieselLtr: this.totalPowerDieselLtr,
      powerdieselTotalSum: this.totalPowerDieselTotalSum,
      powerdieselRate: "",
      powerdieselTotalTesting: "",
      powerdieselTotalSell: this.totalPowerDieselTotalSell,
      powerdieselQuantity: this.totalPowerDieselQuantity,
      powerdieselTotal: this.totalPowerDieselTotal,
      powerdieselVat: this.totalPowerDieselVat,
      powerdieselCess: this.totalPowerDieselCess,
      powerdieselJtcpercentage: this.totalPowerDieselJtcpercentage,
      powerdieselTotalPurchase: this.totalPowerDieselTotalPurchase,
    };

    const dataWithTotals = [...this.productList, totalsRow];

    // Define the headers you want in specific order
    const headerOrder = [
      "date",
      "petrolTotalCloseMeter",
      "petrolTotalOpenMeter",
      "petrolTotalSum",
      "petrolTotalTesting",
      "petrolLtr",
      "petrolRate",
      "petrolTotalTotalSell",
      "dieselTotalCloseMeter",
      "dieselTotalOpenMeter",
      "dieselTotalSum",
      "dieselTotalTesting",
      "dieselLtr",
      "dieselRate",
      "dieselTotalTotalSell",
      "oilTotalPrice",
      "kharchTotal",
      "pType",
      "petrolQuantity",
      "petrolTotal",
      "petrolVat",
      "petrolCess",
      "petrolJtcpercentage",
      "petrolTotalPurchase",
      "dType",
      "dieselQuantity",
      "dieselTotal",
      "dieselVat",
      "dieselCess",
      "dieselJtcpercentage",
      "dieselTotalPurchase",
      "amountTotal",
      "jamaTotal",
      "bakiTotal",
      "xppetrolCloseMeter",
      "xppetrolOpenMeter",
      "xppetrolLtr",
      "xppetrolRate",
      "xppetrolTotalSum",
      "xppetrolTotalTesting",
      "xppetrolTotalSell",
      "xppetrolQuantity",
      "xppetrolTotal",
      "xppetrolVat",
      "xppetrolCess",
      "xppetrolJtcpercentage",
      "xppetrolTotalPurchase",

      "powerdieselCloseMeter",
      "powerdieselOpenMeter",
      "powerdieselLtr",
      "powerdieselRate",
      "powerdieselTotalSum",
      "powerdieselTotalTesting",
      "powerdieselTotalSell",
      "powerdieselQuantity",
      "powerdieselTotal",
      "powerdieselVat",
      "powerdieselCess",
      "powerdieselJtcpercentage",
      "powerdieselTotalPurchase",
    ];

    // Map custom labels to headers (optional)
    const headerLabels = {
      date: "Date",
      petrolTotalCloseMeter: "Petrol Close Meter",
      petrolTotalOpenMeter: "Petrol Open Meter",
      petrolTotalSum: "Petrol Sum",
      petrolTotalTesting: "Petrol Testing",
      petrolLtr: "Petrol Liters",
      petrolRate: "Petrol Rate",
      petrolTotalTotalSell: "Petrol Total Sell",
      dieselTotalCloseMeter: "Diesel Close Meter",
      dieselTotalOpenMeter: "Diesel Open Meter",
      dieselTotalSum: "Diesel Sum",
      dieselTotalTesting: "Diesel Testing",
      dieselLtr: "Diesel Liters",
      dieselRate: "Diesel Rate",
      dieselTotalTotalSell: "Diesel Total Sell",
      oilTotalPrice: "Oil Total Price",
      kharchTotal: "Expenses Total",
      pType: "Petrol Type",
      petrolQuantity: "Petrol Quantity",
      petrolTotal: "Petrol Total",
      petrolVat: "Petrol VAT",
      petrolCess: "Petrol Cess",
      petrolJtcpercentage: "Petrol JTC %",
      petrolTotalPurchase: "Petrol Purchase Total",
      dType: "Diesel Type",
      dieselQuantity: "Diesel Quantity",
      dieselTotal: "Diesel Total",
      dieselVat: "Diesel VAT",
      dieselCess: "Diesel Cess",
      dieselJtcpercentage: "Diesel JTC %",
      dieselTotalPurchase: "Diesel Purchase Total",
      amountTotal: "Amount Total",
      jamaTotal: "Jama Total",
      bakiTotal: "Baki Total",
      xppetrolCloseMeter: "XP Petrol Close Meter",
      xppetrolOpenMeter: "XP Petrol Open Meter",
      xppetrolLtr: "XP Petrol Liters",
      xppetrolTotalSum: "XP Petrol Sum",
      xppetrolRate: "XP Petrol Rate",
      xppetrolTotalTesting: "XP Petrol Testing",
      xppetrolTotalSell: "XP Petrol Total Sell",
      xppetrolQuantity: "XP Petrol Quantity",
      xppetrolTotal: "XP Petrol Total",
      xppetrolVat: "XP Petrol VAT",
      xppetrolCess: "XP Petrol Cess",
      xppetrolJtcpercentage: "XP Petrol JTC %",
      xppetrolTotalPurchase: "XP Petrol Purchase Total",

      powerdieselCloseMeter: "Power Diesel Close Meter",
      powerdieselOpenMeter: "Power Diesel Open Meter",
      powerdieselLtr: "Power Diesel Liters",
      powerdieselTotalSum: "Power Diesel Sum",
      powerdieselRate: "Power Diesel Rate",
      powerdieselTotalTesting: "Power Diesel Testing",
      powerdieselTotalSell: "Power Diesel Total Sell",
      powerdieselQuantity: "Power Diesel Quantity",
      powerdieselTotal: "Power Diesel Total",
      powerdieselVat: "Power Diesel VAT",
      powerdieselCess: "Power Diesel Cess",
      powerdieselJtcpercentage: "Power Diesel JTC %",
      powerdieselTotalPurchase: "Power Diesel Purchase Total",
    

    };

    // Convert JSON to sheet with header order
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithTotals, {
      header: headerOrder,
    });

    // Replace headers with custom labels
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: 0 };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const originalHeader = worksheet[cell_ref]?.v;
      if (originalHeader && headerLabels[originalHeader]) {
        worksheet[cell_ref].v = headerLabels[originalHeader];
      }
    }

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };

    XLSX.writeFile(workbook, "ProductList.xlsx");
  }
}

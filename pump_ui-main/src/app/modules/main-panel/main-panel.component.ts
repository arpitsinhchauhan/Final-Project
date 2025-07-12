import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { OilReportComponent } from '../maps/oil-report/oil-report.component';
import { TransactionReportComponent } from '../atm-transaction/transaction-report/transaction-report.component';
import { KharchReportComponent } from '../kharch/kharch-report/kharch-report.component';
import { JamaBakiReportComponent } from '../jama-baki/jama-baki-report/jama-baki-report.component';
import { PurchaseReportComponent } from '../table-list/purchase-report/purchase-report.component';
import { DipStockReportComponent } from '../dip-stock/dip-stock-report/dip-stock-report.component';
import { NotificationService } from 'app/services/notification.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { API_BACKPAGE } from 'app/serviceult';
import { HttpClient } from '@angular/common/http';
import { ExtraDipAddEditComponent } from '../extra-dip/extra-dip-add-edit/extra-dip-add-edit.component';
import { AddExtraPurchaseComponent } from '../extra-purchase-list/add-extra-purchase/add-extra-purchase.component';
import { AddPetrolStockComponent } from '../add-petrol-stock/add-petrol-stock.component';
import { AddDieselStockComponent } from '../add-diesel-stock/add-diesel-stock.component';
import { AddXpPetrolStockComponent } from '../add-xp-petrol-stock/add-xp-petrol-stock.component';
import { AddPowerDieselStockComponent } from '../add-power-diesel-stock/add-power-diesel-stock.component';
import { AddGattComponent } from '../add-gatt/add-gatt.component';
import { AddDieselgattComponent } from '../add-dieselgatt/add-dieselgatt.component';
import { AddXpPetrolgattComponent } from '../add-xp-petrolgatt/add-xp-petrolgatt.component';
import { AddPowerDieselgattComponent } from '../add-power-dieselgatt/add-power-dieselgatt.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY', // for parsing input
  },
  display: {
    dateInput: 'DD-MM-YYYY', // format displayed in the input box
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


interface BackPageResponse {
  purchaseSellSummary: any;
  petrolSellSummary: any;
  dieselSellSummary: any;
  oilSellSummary: any;
  kharchSellSummary: [string, string][];
  transactionSellSummary: [string, string][];
  jamaSummary: [string, number][];
  bakiSummary: [string, number][];
}


@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]

})
export class MainPanelComponent implements OnInit {

  showPetrolPumpsCount: number = 0;
  showDieselPumpsCount: number = 0;
  showXpPetrolCount: number = 0;
  showPowerDieselCount: number = 0;


  kharchSellSummary: any[];
  transactionSellSummary: any[];
  jamaSummary: [string, number][] = [];
  bakiSummary: [string, number][] = [];
  firstTableData: [string, number][] = [];
  secondTableData: [string, number][] = [];

  reportDate: any;
  userId = localStorage.getItem('userId');

  currentTime: string = '';
  petrolPumps: any[] = [];
  dieselPumps: any[] = [];
  xpPetrol: any[] = [];
  powerDiesel: any[] = [];

  Petrolgatt: number = 0;
  dieselgatt: number = 0;
  XpPetrolgatt: number = 0;
  PowerDieselgatt: number = 0;

  petrolTotalLTR: number = 0;
  dieselTotalLTR: number = 0;

  xpPetrolTotalLTR: number = 0;
  xpPetrolTotalRS: number = 0;

  powerDieselTotalLTR: number = 0;
  powerDieselTotalRS: number = 0;

  petrolTotalRS: number = 0;
  dieselTotalRS: number = 0;

  totalRs: number = 0;
  oilsellTotal: number = 0;
  ATMTotal: number = 0;
  kharchTotal: number = 0;
  jamaTotal: number = 0;
  bakiTotal: number = 0;


  petrolPurchaseLTR: number = 0;
  dieselPurchaseLTR: number = 0;
  Total_Case: number = 0;

  Petrol_Ugadto_Stock: number = 0;
  Diesel_Ugadto_Stock: number = 0;

  XP_Petrol_Ugadto_Stock: number = 0;
  Power_Diesel_Ugadto_Stock: number = 0;

  petolQuantity: number = 0;
  dieselQuantity: number = 0;

  xpPetolQuantity: number = 0;
  powerDieselQuantity: number = 0;

  Petrol_dip: number = 0;
  Petrol_stock: number = 0;
  Diesel_dip: number = 0;
  Diesel_stock: number = 0;

  Extra_Petrol_dip: number = 0;
  Extra_Petrol_stock: number = 0;
  Extra_Diesel_dip: number = 0;
  Extra_Diesel_stock: number = 0;

  Total_petrol_stock: number = 0;
  Total_diesel_stock: number = 0;

  Total_Petrol: number = 0;
  Total_Diesel: number = 0;

  PumpName: string = '';
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;
  multipliers = {
    twothousand: null,
    fivehundred: null,
    twohundred: null,
    onehundred: null,
    fifty: null,
    twenty: null,
    ten: null
  };

  twothousand = 0;
  fivehundred = 0;
  twohundred = 0;
  onehundred = 0;
  fifty = 0;
  twenty = 0;
  ten = 0;
  totalCaseCase = 0;
  note: String = '';

  constructor(private dialog: MatDialog, private use: UserServiceService,
    private notificationService: NotificationService, private http: HttpClient
  ) { }

  showSelectedDate() {
    if(this.reportDate){
    const formatted = this.use.getFormattedDate(this.reportDate);
    this.getPetrolUgadtoStock();
    this.getDieselUgadtoStock();
    // this.getOnedayAgoUgadtoStock();
    this.getPetrolStock(formatted, this.userId);
    this.getDieselStock(formatted, this.userId);
    this.getXPPetrol(formatted, this.userId);
    this.getpowerDiesel(formatted, this.userId);
    this.getoillist();
    this.getTransactionlist();
    this.getKharchlist();
    this.getJamaBakilist();
    this.getPurchaselist();
    this.getExtraPurchaselist();
    this.getDiplist();
    this.getextraDiplist();
    this.getMoneyDetailsList();
    this.backPage();
    this.getxpPetrolUgadtoStock();
    this.getpowerDieselUgadtoStock();
      this.getPetrolGatt();
      this.getDieselGatt();
      this.getXpPetrolGatt();
      this.getPowerDieselGatt();
    }else{
      this.notificationService.failure("Plz Select the date..");
    }
  }


  ngOnInit() {
    this.getUserName();
    this.getUserPump();
    this.petrolPumps = [
      { name: 'Petrol Pump 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol Pump 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol Pump 3', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol Pump 4', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol Pump 5', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 }
    ];

    this.dieselPumps = [
      { name: 'Diesel Pump 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel Pump 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel Pump 3', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel Pump 4', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel Pump 5', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 }
    ];

    this.xpPetrol = [
      { name: 'xpPetrol Pump 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'xpPetrol Pump 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
    ];

    this.powerDiesel = [
      { name: 'powerDiesel Pump 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'powerDiesel Pump 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
    ];

    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  getUserPump() {
    this.use.getUserPump(this.userId).subscribe(
      response => {
        console.log(response);

        if (response && response.success && response.data) {
          const data = response.data;

          this.showPetrolPumpsCount = data.petrol_nozzle;
          this.showDieselPumpsCount = data.diesel_nozzle;
          this.showXpPetrolCount = data.xp_petrol_nozzle;
          this.showPowerDieselCount = data.powe_diesel_nozzle;

          // If you want total count
          const totalPumpCount = this.showPetrolPumpsCount + this.showDieselPumpsCount + this.showXpPetrolCount + this.showPowerDieselCount;
          console.log('Total Pump Count:', totalPumpCount);
        }
      },
      error => {
        console.error("Error fetching pump data", error);
      }
    );
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(
      data => {
        this.PumpName = data.data.firstName;
        this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
        this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
      }
    );
  }

  getPetrolStock(date: string, userId: string) {
    this.use.getPetrolList(date, userId).subscribe((data: any[]) => {
      this.petrolPumps.forEach(pump => {
        pump.openingMeter = null;
        pump.closingMeter = null;
        pump.saleLtr = 0;
        pump.testing = null;
        pump.ltr = 0;
        pump.rate = null;
        pump.total_rs = 0;
      });

      data.forEach((item: any) => {
        const pump = this.petrolPumps.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = +item.petrol_ltr;
          pump.rate = +item.rate;
          pump.ltr = +item.total;
          pump.total_rs = +item.total_sell;
        }
      });
      this.calculateTotals();
    });
  }

  getDieselStock(date: string, userId: string) {
    this.use.getDieselList(date, userId).subscribe((data: any[]) => {
      console.log('Diesel Data:', data);

      // Reset dieselPumps array before mapping new data
      this.dieselPumps.forEach(pump => {
        pump.openingMeter = null;
        pump.closingMeter = null;
        pump.saleLtr = 0;
        pump.testing = null;
        pump.ltr = 0;
        pump.rate = null;
        pump.total_rs = 0;
      });

      // Map the response data to dieselPumps based on pump name
      data.forEach((item: any) => {
        const pump = this.dieselPumps.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = +item.diesel_ltr;
          pump.rate = +item.rate;
          pump.ltr = +item.total;
          pump.total_rs = +item.total_sell;
        }
      });
      this.calculateTotals();
    });
  }


  getXPPetrol(date: string, userId: string) {
    this.use.getXPPetrolList(date, userId).subscribe((data: any[]) => {
      this.xpPetrol.forEach(pump => {
        pump.openingMeter = null;
        pump.closingMeter = null;
        pump.saleLtr = 0;
        pump.testing = null;
        pump.ltr = 0;
        pump.rate = null;
        pump.total_rs = 0;
      });

      data.forEach((item: any) => {
        const pump = this.xpPetrol.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = +item.xppetrol_ltr;
          pump.rate = +item.rate;
          pump.ltr = +item.total;
          pump.total_rs = +item.total_sell;
        }
      });
      this.calculateTotals();
    });
  }

  getpowerDiesel(date: string, userId: string) {
    this.use.getpowerDiesel(date, userId).subscribe((data: any[]) => {
      this.powerDiesel.forEach(pump => {
        pump.openingMeter = null;
        pump.closingMeter = null;
        pump.saleLtr = 0;
        pump.testing = null;
        pump.ltr = 0;
        pump.rate = null;
        pump.total_rs = 0;
      });

      data.forEach((item: any) => {
        const pump = this.powerDiesel.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = +item.powerdiesel_ltr;
          pump.rate = +item.rate;
          pump.ltr = +item.total;
          pump.total_rs = +item.total_sell;
        }
      });
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.petrolTotalLTR = this.petrolPumps.reduce((sum, p) => sum + p.ltr, 0);
    this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + p.total_rs, 0);

    this.dieselTotalLTR = this.dieselPumps.reduce((sum, p) => sum + p.ltr, 0);
    this.dieselTotalRS = this.dieselPumps.reduce((sum, p) => sum + p.total_rs, 0);

    this.xpPetrolTotalLTR = this.xpPetrol.reduce((sum, p) => sum + p.ltr, 0);
    this.xpPetrolTotalRS = this.xpPetrol.reduce((sum, p) => sum + p.total_rs, 0);

    this.powerDieselTotalLTR = this.powerDiesel.reduce((sum, p) => sum + p.ltr, 0);
    this.powerDieselTotalRS = this.powerDiesel.reduce((sum, p) => sum + p.total_rs, 0);

    this.totalRs = this.petrolTotalRS + this.dieselTotalRS + this.xpPetrolTotalRS + this.powerDieselTotalRS;
  }


  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  getAbs(value: number): number {
    return Math.abs(value || 0);
  }


 calculatePetrol(index: number) {
    const petrol = this.petrolPumps[index];
    const total = (petrol.closingMeter || 0) - (petrol.openingMeter || 0);
    const testing = petrol.testing || 0;
    const rate = petrol.rate || 0;
  
    petrol.saleLtr = Math.abs(total);
    petrol.ltr = total - testing;
  
    // Round to 2 decimal places
    petrol.total_rs = parseFloat(Math.abs(petrol.ltr * rate).toFixed(2));
  
    // Update Totals
    this.petrolTotalLTR = parseFloat(
      this.petrolPumps.reduce((sum, p) => sum + Math.abs(p.ltr || 0), 0).toFixed(2)
    );
    this.petrolTotalRS = parseFloat(
      this.petrolPumps.reduce((sum, p) => sum + (p.total_rs || 0), 0).toFixed(2)
    );
  
    this.updateTotalRs();
  }
  

  calculateDiesel(index: number) {
    const diesel = this.dieselPumps[index];
    const total = (diesel.closingMeter || 0) - (diesel.openingMeter || 0);
    const testing = diesel.testing || 0;
    const rate = diesel.rate || 0;
  
    diesel.saleLtr = parseFloat(Math.abs(total).toFixed(2));
    diesel.ltr = parseFloat((total - testing).toFixed(2));
    diesel.total_rs = parseFloat(Math.abs(diesel.ltr * rate).toFixed(2));
  
    // Update Totals
    this.dieselTotalLTR = parseFloat(
      this.dieselPumps.reduce((sum, d) => sum + Math.abs(d.ltr || 0), 0).toFixed(2)
    );
    this.dieselTotalRS = parseFloat(
      this.dieselPumps.reduce((sum, d) => sum + (d.total_rs || 0), 0).toFixed(2)
    );
  
    this.updateTotalRs();
  }
  


  calculateXpPetrol(index: number) {
    const xpPetrol = this.xpPetrol[index];
    const total = (xpPetrol.closingMeter || 0) - (xpPetrol.openingMeter || 0);
    const testing = xpPetrol.testing || 0;
    const rate = xpPetrol.rate || 0;
  
    xpPetrol.saleLtr = parseFloat(Math.abs(total).toFixed(2));
    xpPetrol.ltr = parseFloat((total - testing).toFixed(2));
    xpPetrol.total_rs = parseFloat(Math.abs(xpPetrol.ltr * rate).toFixed(2));
  
    // Update Totals
    this.xpPetrolTotalLTR = parseFloat(
      this.xpPetrol.reduce((sum, d) => sum + Math.abs(d.ltr || 0), 0).toFixed(2)
    );
    this.xpPetrolTotalRS = parseFloat(
      this.xpPetrol.reduce((sum, d) => sum + (d.total_rs || 0), 0).toFixed(2)
    );
  
    this.updateTotalRs();
  }
  

  calculatepowerDiesel(index: number) {
    const powerDiesel = this.powerDiesel[index];
    const total = (powerDiesel.closingMeter || 0) - (powerDiesel.openingMeter || 0);
    const testing = powerDiesel.testing || 0;
    const rate = powerDiesel.rate || 0;
  
    powerDiesel.saleLtr = parseFloat(Math.abs(total).toFixed(2));
    powerDiesel.ltr = parseFloat((total - testing).toFixed(2));
    powerDiesel.total_rs = parseFloat(Math.abs(powerDiesel.ltr * rate).toFixed(2));
  
    // Update Totals
    this.powerDieselTotalLTR = parseFloat(
      this.powerDiesel.reduce((sum, d) => sum + Math.abs(d.ltr || 0), 0).toFixed(2)
    );
    this.powerDieselTotalRS = parseFloat(
      this.powerDiesel.reduce((sum, d) => sum + (d.total_rs || 0), 0).toFixed(2)
    );
  
    this.updateTotalRs();
  }
  


  updateTotalRs() {
    const round = (value: number) => parseFloat(value.toFixed(2));
  
    this.petrolTotalRS = round(this.petrolPumps.reduce((sum, p) => sum + (p.total_rs || 0), 0));
    this.dieselTotalRS = round(this.dieselPumps.reduce((sum, d) => sum + (d.total_rs || 0), 0));
    this.xpPetrolTotalRS = round(this.xpPetrol.reduce((sum, d) => sum + (d.total_rs || 0), 0));
    this.powerDieselTotalRS = round(this.powerDiesel.reduce((sum, d) => sum + (d.total_rs || 0), 0));
    this.totalRs = round(
      this.petrolTotalRS + this.dieselTotalRS + this.xpPetrolTotalRS + this.powerDieselTotalRS
    );
  }
  

  openOilsellBakComponent(): void {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    if (this.reportDate) {
      const dialogRef = this.dialog.open(OilReportComponent, {
        width: '60%',
        height: '70%',
        data: { date: formattedDate }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getoillist();
      });
    } else {
      this.notificationService.failure("Select the Date ?");
    }
  }

  getoillist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getOillsellList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.oilsellTotal = data[0] ?? 0;
        } else {
          this.oilsellTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch oil sell data.");
      }
    );
  }



  openAtmBakComponent() {
    const dialogRef = this.dialog.open(TransactionReportComponent, {
      width: '60%',
      height: '70%',
      data: { date: this.use.getFormattedDate(this.reportDate) }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTransactionlist();
      this.backPage();
    });
  }

  getTransactionlist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getTransactionList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.ATMTotal = data[0] ?? 0;
        } else {
          this.ATMTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Transaction sell data.");
      }
    );
  }

  openKharchComponent() {
    const dialogRef = this.dialog.open(KharchReportComponent, {
      width: '60%',
      height: '70%',
      data: { date: this.use.getFormattedDate(this.reportDate) }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getKharchlist();
      this.backPage();
      // this.use.getKharchList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
      //   data => {
      //     this.kharchTotal=data[0];
      //   }
      // );
    });
  }

  getKharchlist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getKharchList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.kharchTotal = data[0] ?? 0;
        } else {
          this.kharchTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Kharch data.");
      }
    );
  }

  openJamaBakiComponent() {
    const dialogRef = this.dialog.open(JamaBakiReportComponent, {
      width: '60%',
      height: '70%',
      data: { date: this.use.getFormattedDate(this.reportDate) }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getJamaBakilist();
      this.backPage();
    });
  }

  getJamaBakilist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getJamaBakiList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.jamaTotal = data[0][0] ?? 0;
          this.bakiTotal = data[0][1] ?? 0;
        } else {
          this.jamaTotal = 0;
          this.bakiTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Jama&Baki data.");
      }
    );
  }

  addPetrolStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddPetrolStockComponent, {
      width: '40%',
      height: '30%',
      data: {
        date: formattedDate,
        openstock: this.Petrol_Ugadto_Stock
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPetrolUgadtoStock();
      }
    });
  }


  getPetrolUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getPetrolStock(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.Petrol_Ugadto_Stock = data.petrol ?? 0;
        } else {
          this.Petrol_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Petrol_Ugadto_Stock = 0;
      }
    );
  }

  addDieselStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddDieselStockComponent, {
      width: '40%',
      height: '30%',
      data: {
        date: formattedDate,
        dieselopenstock: this.Diesel_Ugadto_Stock
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDieselUgadtoStock();
    });
  }
  getDieselUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getDieselStock(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.Diesel_Ugadto_Stock = data.diesel ?? 0;
        } else {
          this.Diesel_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Diesel_Ugadto_Stock = 0;
      }
    );
  }

  addXPPetrolStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddXpPetrolStockComponent, {
      width: '40%',
      height: '30%',
      data: {
        date: formattedDate,
        xp_ugadto_stock: this.XP_Petrol_Ugadto_Stock
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getxpPetrolUgadtoStock();
    });
  }

  getxpPetrolUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getXpPetrolStock(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.XP_Petrol_Ugadto_Stock = data.Xppetrol ?? 0;
        } else {
          this.XP_Petrol_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.XP_Petrol_Ugadto_Stock = 0;
      }
    );
  }

  addPowerDieselStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddPowerDieselStockComponent, {
      width: '40%',
      height: '30%',
      data: {
        date: formattedDate,
        power_ugadto_stock: this.Power_Diesel_Ugadto_Stock
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getpowerDieselUgadtoStock();
    });
  }

  getpowerDieselUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getPowerDieselStock(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.Power_Diesel_Ugadto_Stock = data.Powerdiesel ?? 0;
        } else {
          this.Power_Diesel_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Power_Diesel_Ugadto_Stock = 0;
      }
    );
  }

  //   getOnedayAgoUgadtoStock() {
  //     const formattedDate = this.use.getFormattedDate(this.reportDate);
  //    this.use.getOneDayAgoStock(formattedDate, this.userId).subscribe(
  //     data => {
  //       if (data) {
  //         this.Petrol_Ugadto_Stock = data.petrol ?? 0;
  //         this.Diesel_Ugadto_Stock = data.diesel ?? 0;
  //       } else {
  //         this.Petrol_Ugadto_Stock = 0;
  //         this.Diesel_Ugadto_Stock = 0;
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching stock data', error);
  //       this.Petrol_Ugadto_Stock = 0;
  //       this.Diesel_Ugadto_Stock = 0;
  //     }
  //   );
  // }

  openPurchase(data?: any): void {
    const dialogRef = this.dialog.open(PurchaseReportComponent, {
      width: '70%',
      data: { date: this.use.getFormattedDate(this.reportDate) }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPurchaselist();
    });
  }

  getPurchaselist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getPurchaseiList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          for (const item of data) {
            const [quantity, type] = item;
            if (type === 'Petrol') {
              this.petolQuantity = quantity;
            } else if (type === 'Diesel') {
              this.dieselQuantity = quantity;
            }
          }
        } else {
          this.petolQuantity = 0;
          this.dieselQuantity = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }

  openExtraPurchase(data?: any): void {
    const dialogRef = this.dialog.open(AddExtraPurchaseComponent, {
      width: '70%',
      data: { date: this.use.getFormattedDate(this.reportDate) }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getExtraPurchaselist();
    });
  }

  getExtraPurchaselist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getExtraPurchaseiList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          for (const item of data) {
            const [quantity, type] = item;
            if (type === 'XP Petrol') {
              this.xpPetolQuantity = quantity;
            } else if (type === 'Power Diesel') {
              this.powerDieselQuantity = quantity;
            }
          }
        } else {
          this.xpPetolQuantity = 0;
          this.powerDieselQuantity = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }

  get totalCase(): number {
    return (
      (Number(this.totalRs) || 0) +
      (Number(this.oilsellTotal) || 0) -
      (Number(this.ATMTotal) || 0) -
      (Number(this.kharchTotal) || 0) -
      (Number(this.bakiTotal) || 0) +
      (Number(this.jamaTotal) || 0) -
      (Number(this.Petrolgatt) || 0)
    );
  }


  dipstock() {
    const dataToSend: any = {
      date: this.use.getFormattedDate(this.reportDate),
    };

    if (this.Petrol_dip || this.Petrol_stock || this.Diesel_dip || this.Diesel_stock) {
      dataToSend.type = 'edit';
      dataToSend.petroldip = this.Petrol_dip || null;
      dataToSend.pvalue = this.Petrol_stock || null;
      dataToSend.dieseldip = this.Diesel_dip || null;
      dataToSend.dvalue = this.Diesel_stock || null;
    } else {
      // If all data values are null, send 'add' type only with date
      dataToSend.type = 'add';
      dataToSend.petroldip = this.Petrol_dip || null;
      dataToSend.pvalue = this.Petrol_stock || null;
      dataToSend.dieseldip = this.Diesel_dip || null;
      dataToSend.dvalue = this.Diesel_stock || null;
    }

    // Open the dialog with the prepared data
    const dialogRef = this.dialog.open(DipStockReportComponent, {
      width: '60%',
      height: '70%',
      data: dataToSend
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDiplist();
    });
  }

  getDiplist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getDipList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.Petrol_dip = data[0][2] ?? 0;
          this.Petrol_stock = data[0][3] ?? 0;
          this.Diesel_dip = data[0][0] ?? 0;
          this.Diesel_stock = data[0][1] ?? 0;
        } else {
          this.Petrol_dip = 0;
          this.Petrol_stock = 0;
          this.Diesel_dip = 0;
          this.Diesel_stock = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }


  extraDipstock() {
    const dataToSend: any = {
      date: this.use.getFormattedDate(this.reportDate),
    };

    if (this.Petrol_dip || this.Petrol_stock || this.Diesel_dip || this.Diesel_stock) {
      dataToSend.type = 'edit';
      dataToSend.petroldip = this.Extra_Petrol_dip || null;
      dataToSend.pvalue = this.Extra_Petrol_stock || null;
      dataToSend.dieseldip = this.Extra_Diesel_dip || null;
      dataToSend.dvalue = this.Extra_Diesel_stock || null;
    } else {
      // If all data values are null, send 'add' type only with date
      dataToSend.type = 'add';
      dataToSend.petroldip = this.Extra_Petrol_dip || null;
      dataToSend.pvalue = this.Extra_Petrol_stock || null;
      dataToSend.dieseldip = this.Extra_Diesel_dip || null;
      dataToSend.dvalue = this.Extra_Diesel_stock || null;
    }

    // Open the dialog with the prepared data
    const dialogRef = this.dialog.open(ExtraDipAddEditComponent, {
      width: '60%',
      height: '70%',
      data: dataToSend
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getextraDiplist();
    });
  }

  getextraDiplist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getextraDipList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.Extra_Petrol_dip = data[0][2] ?? 0;
          this.Extra_Petrol_stock = data[0][3] ?? 0;
          this.Extra_Diesel_dip = data[0][0] ?? 0;
          this.Extra_Diesel_stock = data[0][1] ?? 0;
        } else {
          this.Extra_Petrol_dip = 0;
          this.Extra_Petrol_stock = 0;
          this.Extra_Diesel_dip = 0;
          this.Extra_Diesel_stock = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }


  get TotalPetrolStock(): number {
    const petrolUgadto = Number(this.Petrol_Ugadto_Stock) || 0;
    const petrolQty = Number(this.petolQuantity) || 0;
    const petrolGatt = Number(this.Petrolgatt) || 0;
    return petrolUgadto + petrolQty-petrolGatt;
  }

  get TotalDieselStock(): number {
    const dieselUgadto = Number(this.Diesel_Ugadto_Stock) || 0;
    const dieselQty = Number(this.dieselQuantity) || 0;
    const dieselGatt = Number(this.dieselgatt) || 0;
    return dieselUgadto + dieselQty - dieselGatt;
  }

  get TotalXPPetrolStock(): number {
    const xppetrolUgadto = Number(this.XP_Petrol_Ugadto_Stock) || 0;
    const xppetrolQty = Number(this.xpPetolQuantity) || 0;
    const xpPetrolGatt = Number(this.XpPetrolgatt) || 0;
    return xppetrolUgadto + xppetrolQty - xpPetrolGatt;
  }

  get TotalPowerDieselStock(): number {
    const PowerdieselUgadto = Number(this.Power_Diesel_Ugadto_Stock) || 0;
    const PowerdieselQty = Number(this.powerDieselQuantity) || 0;
    const Powerdieselgatt = Number(this.PowerDieselgatt) || 0;
    return PowerdieselUgadto + PowerdieselQty - Powerdieselgatt;
  }

  get TotalPetrolRemaining(): number {
    return this.TotalPetrolStock - (Number(this.petrolTotalLTR) || 0);
  }

  get TotalDieselRemaining(): number {
    return this.TotalDieselStock - (Number(this.dieselTotalLTR) || 0);
  }

  get TotalXPPetrolRemaining(): number {
    return this.TotalXPPetrolStock - (Number(this.xpPetrolTotalLTR) || 0);
  }

  get TotalPowerDieselRemaining(): number {
    return this.TotalPowerDieselStock - (Number(this.powerDieselTotalLTR) || 0);
  }


  Submit() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.userId = localStorage.getItem('userId');
    //   const petrolInputData = this.petrolPumps
    //   .filter(p => !(p.openingMeter === 0 && p.closingMeter === 0 && p.testing === 0 && p.rate === 0 && p.saleLtr === 0 && p.total_rs === 0 && p.ltr === 0))
    //   .map(p => ({
    //     date: String(this.use.getFormattedDate(this.reportDate)),      
    //     user_id: String(this.userId),                                  
    //     pump: String(p.name),                                          
    //     open_meter: String(p.openingMeter),                            
    //     close_meter: String(p.closingMeter),                           
    //     testing: String(p.testing),                                    
    //     rate: String(p.rate),                                          
    //     petrol_ltr: String(p.saleLtr),                                      
    //     total_sell: String(p.total_rs),                                
    //     total: String(p.ltr)                                      
    //   }));

    // const dieselInputData = this.dieselPumps
    //   .filter(d => !(d.openingMeter === 0 && d.closingMeter === 0 && d.testing === 0 && d.rate === 0 && d.saleLtr === 0 && d.total_rs === 0 && d.ltr === 0))
    //   .map(d => ({
    //     date: String(this.use.getFormattedDate(this.reportDate)),     
    //     user_id: String(this.userId),                                 
    //     pump: String(d.name),                                         
    //     open_meter: String(d.openingMeter),                           
    //     close_meter: String(d.closingMeter),                          
    //     testing: String(d.testing),                                   
    //     rate: String(d.rate),                                         
    //     diesel_ltr: String(d.saleLtr),                                     
    //     total_sell: String(d.total_rs),                               
    //     total: String(d.ltr)                                     
    //   }));
    const petrolInputData = this.petrolPumps
      .filter(p => !(
        (p.openingMeter === 0 || p.openingMeter === null) &&
        (p.closingMeter === 0 || p.closingMeter === null) &&
        (p.testing === 0 || p.testing === null) &&
        (p.rate === 0 || p.rate === null) &&
        (p.saleLtr === 0 || p.saleLtr === null) &&
        (p.total_rs === 0 || p.total_rs === null) &&
        (p.ltr === 0 || p.ltr === null)
      ))
      .map(p => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(p.name),
        open_meter: p.openingMeter !== null ? String(p.openingMeter) : '',
        close_meter: p.closingMeter !== null ? String(p.closingMeter) : '',
        testing: p.testing !== null ? String(p.testing) : '',
        rate: p.rate !== null ? String(p.rate) : '',
        petrol_ltr: p.saleLtr !== null ? String(p.saleLtr) : '',
        total_sell: p.total_rs !== null ? String(p.total_rs) : '',
        total: p.ltr !== null ? String(p.ltr) : ''
      }));
    const dieselInputData = this.dieselPumps
      .filter(d => !(
        (d.openingMeter === 0 || d.openingMeter === null) &&
        (d.closingMeter === 0 || d.closingMeter === null) &&
        (d.testing === 0 || d.testing === null) &&
        (d.rate === 0 || d.rate === null) &&
        (d.saleLtr === 0 || d.saleLtr === null) &&
        (d.total_rs === 0 || d.total_rs === null) &&
        (d.ltr === 0 || d.ltr === null)
      ))
      .map(d => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(d.name),
        open_meter: d.openingMeter !== null ? String(d.openingMeter) : '',
        close_meter: d.closingMeter !== null ? String(d.closingMeter) : '',
        testing: d.testing !== null ? String(d.testing) : '',
        rate: d.rate !== null ? String(d.rate) : '',
        diesel_ltr: d.saleLtr !== null ? String(d.saleLtr) : '',
        total_sell: d.total_rs !== null ? String(d.total_rs) : '',
        total: d.ltr !== null ? String(d.ltr) : ''
      }));


    const XppetrolInputData = this.xpPetrol
      .filter(p => !(
        (p.openingMeter === 0 || p.openingMeter === null) &&
        (p.closingMeter === 0 || p.closingMeter === null) &&
        (p.testing === 0 || p.testing === null) &&
        (p.rate === 0 || p.rate === null) &&
        (p.saleLtr === 0 || p.saleLtr === null) &&
        (p.total_rs === 0 || p.total_rs === null) &&
        (p.ltr === 0 || p.ltr === null)
      ))
      .map(p => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(p.name),
        open_meter: p.openingMeter !== null ? String(p.openingMeter) : '',
        close_meter: p.closingMeter !== null ? String(p.closingMeter) : '',
        testing: p.testing !== null ? String(p.testing) : '',
        rate: p.rate !== null ? String(p.rate) : '',
        xppetrol_ltr: p.saleLtr !== null ? String(p.saleLtr) : '',
        total_sell: p.total_rs !== null ? String(p.total_rs) : '',
        total: p.ltr !== null ? String(p.ltr) : ''
      }));
    const powerDieselInputData = this.powerDiesel
      .filter(p => !(
        (p.openingMeter === 0 || p.openingMeter === null) &&
        (p.closingMeter === 0 || p.closingMeter === null) &&
        (p.testing === 0 || p.testing === null) &&
        (p.rate === 0 || p.rate === null) &&
        (p.saleLtr === 0 || p.saleLtr === null) &&
        (p.total_rs === 0 || p.total_rs === null) &&
        (p.ltr === 0 || p.ltr === null)
      ))
      .map(p => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(p.name),
        open_meter: p.openingMeter !== null ? String(p.openingMeter) : '',
        close_meter: p.closingMeter !== null ? String(p.closingMeter) : '',
        testing: p.testing !== null ? String(p.testing) : '',
        rate: p.rate !== null ? String(p.rate) : '',
        powerdiesel_ltr: p.saleLtr !== null ? String(p.saleLtr) : '',
        total_sell: p.total_rs !== null ? String(p.total_rs) : '',
        total: p.ltr !== null ? String(p.ltr) : ''
      }));

    this.use.savefuleData(petrolInputData, dieselInputData).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅" + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });
    this.use.saveXpPowerData(XppetrolInputData, powerDieselInputData).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅" + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });

   const originalDate = new Date(this.reportDate);
    const nextDay = new Date(originalDate);
    nextDay.setDate(originalDate.getDate() + 1);
    const oneformattedDate = this.use.getFormattedDate(nextDay); 

    this.use.savePetrolStockData(this.userId, oneformattedDate, this.TotalPetrolRemaining).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅" + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });

    this.use.saveDieselStockData(this.userId, oneformattedDate, this.TotalDieselRemaining).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅" + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });

    this.use.saveXPPetrolStockData(this.userId, oneformattedDate, this.TotalXPPetrolRemaining).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅" + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });

    this.use.savePowerDieselStockData(this.userId, oneformattedDate, this.TotalPowerDieselRemaining).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅" + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });

	
    this.saveTotalCase();
    this.sendData();
  }
  printReport() {
    const originalTitle = document.title;
    const formatted = this.use.getFormattedDate(this.reportDate);
    document.title = `${formatted}`;
    window.print();
    document.title = originalTitle;
  }

  saveTotalCase() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.saveTotalCase(this.userId, formattedDate, this.totalCase).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅   " + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });
  }


  calculateTotal() {
    this.twothousand = 2000 * (this.multipliers.twothousand || 0);
    this.fivehundred = 500 * (this.multipliers.fivehundred || 0);
    this.twohundred = 200 * (this.multipliers.twohundred || 0);
    this.onehundred = 100 * (this.multipliers.onehundred || 0);
    this.fifty = 50 * (this.multipliers.fifty || 0);
    this.twenty = 20 * (this.multipliers.twenty || 0);
    this.ten = 10 * (this.multipliers.ten || 0);

    // Calculate Total
    this.totalCaseCase =
      this.twothousand +
      this.fivehundred +
      this.twohundred +
      this.onehundred +
      this.fifty +
      this.twenty +
      this.ten;
  }

  sendData() {
    const formatted = this.use.getFormattedDate(this.reportDate);
    const payload = {
      date: formatted,
      note: this.note,
      totalCaseCase: this.totalCaseCase,
      denominations: [
        { value: 'twothousand', total: this.twothousand, count: this.multipliers.twothousand || 0 },
        { value: 'fivehundred', total: this.fivehundred, count: this.multipliers.fivehundred || 0 },
        { value: 'twohundred', total: this.twohundred, count: this.multipliers.twohundred || 0 },
        { value: 'onehundred', total: this.onehundred, count: this.multipliers.onehundred || 0 },
        { value: 'fifty', total: this.fifty, count: this.multipliers.fifty || 0 },
        { value: 'twenty', total: this.twenty, count: this.multipliers.twenty || 0 },
        { value: 'ten', total: this.ten, count: this.multipliers.ten || 0 }
      ],
      userId: this.userId
    };
    console.log("Sending Payload: ", payload);
    this.use.saveMoneyDetails(payload).subscribe({
      next: res => {
        if (res.message.includes('successfully')) {
          this.notificationService.success("✅" + res.message);
        } else if (res.message.includes('already')) {
          this.notificationService.failure("⚠️" + res.message);
        }
      }
    });
  }
 downloadPDF() {
  const frontContent = document.getElementById('printable-content') as HTMLElement;
  const backPage = document.getElementById('back-page') as HTMLElement;
  const buttons = document.querySelector('.button-container') as HTMLElement;
  const formatted = this.use.getFormattedDate(this.reportDate);

  const pdf = new jsPDF('p', 'mm', 'a4');

  // Hide the buttons
  if (buttons) {
    buttons.style.display = 'none';
  }

  html2canvas(frontContent, { scale: 2 }).then(frontCanvas => {
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (frontCanvas.height * imgWidth) / frontCanvas.width;
    const contentDataURL = frontCanvas.toDataURL('image/png');

    let position = 0;

    if (imgHeight > pageHeight) {
      let remainingHeight = imgHeight;
      while (remainingHeight > 0) {
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        position -= pageHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    } else {
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    }

    // Back Page - force a new page
    html2canvas(backPage, { scale: 2 }).then(backCanvas => {
      pdf.addPage();
      const backImgHeight = (backCanvas.height * imgWidth) / backCanvas.width;
      const backDataURL = backCanvas.toDataURL('image/png');
      pdf.addImage(backDataURL, 'PNG', 0, 0, imgWidth, backImgHeight);

      pdf.save(`${formatted}.pdf`);

      // Show the buttons again
      if (buttons) {
        buttons.style.display = '';
      }
    });
  });
}




  getMoneyDetailsList() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getMoneyList(formattedDate, this.userId).subscribe(
      (data) => {
        this.note = data[0].note;
        this.totalCaseCase = data[0].totalCase;
        this.multipliers.twothousand = data[0].twothousand;
        this.multipliers.fivehundred = data[0].fivehundred;
        this.multipliers.twohundred = data[0].twohundred;
        this.multipliers.onehundred = data[0].onehundred;
        this.multipliers.fifty = data[0].fifty;
        this.multipliers.twenty = data[0].twenty;
        this.multipliers.ten = data[0].ten;
        this.calculateTotal();
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }

  backPage() {
    const userId = localStorage.getItem('userId');
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const apiUrl = `${API_BACKPAGE}?date=${formattedDate}&userId=${userId}`;

    this.http.get<BackPageResponse>(apiUrl, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    }).subscribe(
      response => {
        this.kharchSellSummary = response.kharchSellSummary || [];
        this.transactionSellSummary = response.transactionSellSummary || [];
        this.jamaSummary = response.jamaSummary || [];
        this.bakiSummary = response.bakiSummary || [];

        this.firstTableData = this.jamaSummary;
        this.secondTableData = this.bakiSummary;

        // this.firstTableData = this.jamaSummary.filter(item => item[1] <= 10000);
        // this.secondTableData = this.bakiSummary.filter(item => item[1] <= 10000);
      },
      error => {
        console.error('Error fetching data', error);
        this.firstTableData = [];
        this.secondTableData = [];
      }
    );
  }

  openPetrolGatt(data?: any){
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddGattComponent, {
      width: '30%',
      data: {
        date: formattedDate,
        petrolgatt: this.Petrolgatt
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPetrolGatt();
    });
  }

  getPetrolGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getPetrolGatt(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.Petrolgatt = data.petrolgatt ?? 0;
        } else {
          this.Petrolgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Petrolgatt = 0;
      }
    );
  }

  openDieselGatt(data?: any){
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddDieselgattComponent, {
      width: '30%',
      data: {
        date: formattedDate,
        dieselgatt: this.dieselgatt
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDieselGatt();
    });
  }

  getDieselGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getDieselGatt(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.dieselgatt = data.dieselgatt ?? 0;
        } else {
          this.dieselgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.dieselgatt = 0;
      }
    );
  }

  openXpPetrolGatt(data?: any){
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddXpPetrolgattComponent, {
      width: '30%',
      data: {
        date: formattedDate,
        xppetrolgatt: this.XpPetrolgatt
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getXpPetrolGatt();
    });
  }

  getXpPetrolGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getXpPetrolGatt(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.XpPetrolgatt = data.xpPetrolgatt ?? 0;
        } else {
          this.XpPetrolgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.XpPetrolgatt = 0;
      }
    );
  }

  openPowerDieselGatt(data?: any){
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddPowerDieselgattComponent, {
      width: '30%',
      data: {
        date: formattedDate,
        PowerDieselgatt: this.PowerDieselgatt
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPowerDieselGatt();
    });
  }

  getPowerDieselGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getPowerDieselGatt(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.PowerDieselgatt = data.powerDieselgatt ?? 0;
        } else {
          this.PowerDieselgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.PowerDieselgatt = 0;
      }
    );
  }
  

  cancel() {
    location.reload();
  }

}

import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Chartist from 'chartist';
import { DailyTotal } from '../../models/DailyTotal';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as d3 from 'd3';
import { API_CURRENTMOUNTH_TOTAL, API_CURRENTYEAR_TOTAL, API_DAILY_CHART, API_DAILY_TOTAL, API_DIESEL, API_DIESEL_CURRENTYEAR_DATE, API_JAMABAKI_CURRENTYEAR_DATE, API_OIL_PURCHASE_CURRENTYEAR_DATE, API_PETROL_CURRENTYEAR_DATE, API_POWER_DIESEL, API_POWER_DIESEL_CURRENTYEAR_DATE, API_Petrol, API_XP_PETROL_CURRENTYEAR_DATE, API_XP_Petrol } from 'app/serviceult';
import { ChartType, ChartConfiguration } from 'chart.js';
import { LoaderService } from 'app/services/loader.service';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dailyTotals: DailyTotal[] = [];
  startDate: string = '';
  endDate: string = '';
  productList: any = [];
  name: string = '';
  names: string = '';
  sentTransactions: any[] | undefined;
  receivedTransactions: any[] | undefined;
  senderAmountTotal: number = 0;
  receiverAmountTotal: number = 0;
  totalDifference: number = 0;
  dailyTotal: number;
  CurrentmonthTotal: number = 0;
  CurrentyearTotal: number = 0;
  currentPage = 1;
  itemsPerPage = 2;
  thumbnails: SafeUrl[] = [];
  customers: string[] = [];
  selectedCustomer: string = '';
  showPetrolPumpsCount: number = 0;
  showDieselPumpsCount: number = 0;
  showXpPetrolCount: number = 0;
  showPowerDieselCount: number = 0;
  min: number = 0;
  max: number = 100;
  append: string = '%';
  total: number = 1000000;

  baki: number = 500000;
  label: string = 'UN';
  value: number = 0;
  jamabaki: number;
  jamabakilabel: string;
  diesel: number;
  diesellabel: string;
  petrol: number = 0;
  petrollabel: string = '0';
  xppetrollabel: string = '0';
  powerDiesellabel: string = '0';
  oilPurchaseLabel: string = '0';
  userId = localStorage.getItem('userId');
  filterType: string = 'today';
  selectedYear = new Date().getFullYear();
  yearList: number[] = [];
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;

  petrolCurrentStock: number = 0;
  dieselCurrentStock: number = 0;
  xpPetrolCurrentStock: number = 0;
  powerDieselCurrentStock: number = 0;

  petrolCapacity: number = 20000;
  dieselCapacity: number = 20000;
  xpPetrolCapacity: number = 10000;
  powerDieselCapacity: number = 10000;

  nozzleSalesData: any[] = [];
  nozzleFilterType: string = 'today';
  nozzleSelectedYear: number = new Date().getFullYear();

  financialFilterType: string = 'today';
  financialSelectedYear = new Date().getFullYear();
  public financialChartData: ChartConfiguration['data'] = {
    labels: ['Income', 'Expense', 'Profit'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#28a745', '#dc3545', '#007bff'],
        hoverBackgroundColor: ['#218838', '#c82333', '#0069d9'],
        borderRadius: 8,
        barThickness: 40
      }
    ]
  };

  public financialChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => '₹' + context.raw.toLocaleString()
        }
      }
    }
  };

  chartOptions2: any;

  public chartType: ChartType = 'bar';

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderRadius: 8,
        barThickness: 22
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => context.raw.toLocaleString()
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,

        // ✔ Correct place for border in Chart.js v4
        border: {
          display: false,
          color: 'transparent',
          width: 0
        },

        grid: {
          color: '#e0e0e0'   // ✔ allowed
        },

        ticks: {
          callback: function (val) {
            const num = Number(val);
            return num / 1000 + 'K';
          }
        }
      },

      y: {
        border: {
          display: false
        },
        grid: {
          display: false
        }
      }
    }
  };


  constructor(private use: UserServiceService, private http: HttpClient, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private loaderService: LoaderService, private notificationService: NotificationService
  ) { }


  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.loaderService.display(false);
    this.getUserName();
    this.getDailytotal();
    this.getCurrentmonthtotal();
    this.getCurrentyear();
    this.getPiechartValue();
    this.getFinancialData();
    this.updatePieChart(); // Initial render with 0s

    // Consolidate pie chart data fetching with error handling for each call
    const errorHandler = (name: string) => catchError(err => {
      console.error(`Error fetching ${name}`, err);
      return of(0);
    });

    forkJoin({
      petrol: this.http.get<any>(`${API_PETROL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('petrol')),
      diesel: this.http.get<any>(`${API_DIESEL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('diesel')),
      xpPetrol: this.http.get<any>(`${API_XP_PETROL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('xpPetrol')),
      powerDiesel: this.http.get<any>(`${API_POWER_DIESEL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('powerDiesel')),
      oilPurchase: this.http.get<any>(`${API_OIL_PURCHASE_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('oilPurchase')),
      jamaBaki: this.http.get<any>(`${API_JAMABAKI_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('jamaBaki')),
      pumpData: this.use.getUserPump(this.userId).pipe(catchError(err => {
        console.error('Error fetching pumpData', err);
        return of({ success: false });
      })),
      petrolStock: this.use.getPetrolStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('petrolStock')),
      dieselStock: this.use.getDieselStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('dieselStock')),
      xpPetrolStock: this.use.getXpPetrolStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('xpPetrolStock')),
      powerDieselStock: this.use.getPowerDieselStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('powerDieselStock')),
      // Nozzle sales lists
      petrolSales: this.use.getPetrolList(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('petrolSales')),
      dieselSales: this.use.getDieselList(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('dieselSales')),
      xpPetrolSales: this.use.getXPPetrolList(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('xpPetrolSales')),
      powerDieselSales: this.use.getpowerDiesel(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('powerDieselSales'))
    }).subscribe({
      next: (results: any) => {
        console.log('Dashboard data fetched successfully:', results);

        this.processNozzleData(results);

        // Stock Levels
        this.petrolCurrentStock = results.petrolStock?.petrolRemaining || 0;
        this.dieselCurrentStock = results.dieselStock?.dieselRemaining || 0;
        this.xpPetrolCurrentStock = results.xpPetrolStock?.xppetrolRemaining || 0;
        this.powerDieselCurrentStock = results.powerDieselStock?.powerdieselRemaining || 0;

        // Petrol
        this.petrollabel = results.petrol || 0;
        this.petrol = Math.round(((Number(results.petrol) || 0) / this.total) * 100);

        // Diesel
        this.diesellabel = results.diesel || 0;
        this.diesel = Math.round(((Number(results.diesel) || 0) / this.total) * 100);

        // XP/Power/Oil
        this.xppetrollabel = results.xpPetrol || 0;
        this.powerDiesellabel = results.powerDiesel || 0;
        this.oilPurchaseLabel = results.oilPurchase || 0;

        // Jama Baki
        this.jamabakilabel = results.jamaBaki || 0;
        this.jamabaki = Math.round(((Number(results.jamaBaki) || 0) / this.baki) * 100);

        // Pump Data
        if (results.pumpData && results.pumpData.success && results.pumpData.data) {
          const data = results.pumpData.data;
          this.showPetrolPumpsCount = data.petrol_nozzle;
          this.showDieselPumpsCount = data.diesel_nozzle;
          this.showXpPetrolCount = data.xp_petrol_nozzle;
          this.showPowerDieselCount = data.powe_diesel_nozzle;
        }

        this.updatePieChart();
      },
      error: (err) => console.error('Critical error in Dashboard data fetching', err)
    });

    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 4; y <= currentYear + 1; y++) {
      this.yearList.push(y);
    }
  }

  onNozzleFilterChange() {
    this.getNozzleData();
  }

  getNozzleData() {
    let startDate: string;
    let endDate: string;
    const now = new Date();

    if (this.nozzleFilterType === 'today') {
      startDate = endDate = this.use.getFormattedDate(now);
    } else if (this.nozzleFilterType === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = this.use.getFormattedDate(firstDay);
      endDate = this.use.getFormattedDate(now);
    } else if (this.nozzleFilterType === 'year') {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      startDate = this.use.getFormattedDate(firstDay);
      endDate = this.use.getFormattedDate(now);
    } else if (this.nozzleFilterType === 'fy') {
      startDate = `${this.nozzleSelectedYear}-04-01`;
      endDate = `${this.nozzleSelectedYear + 1}-03-31`;
    }

    const getRangeList = (url: string) => {
      let params = new HttpParams().set('userId', this.userId);
      if (this.nozzleFilterType === 'today') {
        params = params.set('date', startDate);
      } else {
        params = params.set('startDate', startDate).set('endDate', endDate);
      }
      return this.http.get<any[]>(url, { params }).pipe(catchError(() => of([])));
    };

    forkJoin({
      petrolSales: getRangeList(API_Petrol),
      dieselSales: getRangeList(API_DIESEL),
      xpPetrolSales: getRangeList(API_XP_Petrol),
      powerDieselSales: getRangeList(API_POWER_DIESEL),
      pumpData: this.use.getUserPump(this.userId).pipe(catchError(() => of({})))
    }).subscribe((results: any) => {
      this.processNozzleData(results);
    });
  }

  processNozzleData(results: any) {
    const nozzleSalesMap = new Map<string, any>();

    const addSkeleton = (count: number, fuelType: string, prefix: string) => {
      for (let i = 1; i <= (count || 0); i++) {
        const name = `${prefix} ${i}`;
        // Use a standardized key for the map: "pump-name|fuel-type"
        const key = `${name.toLowerCase().trim()}|${fuelType.toLowerCase()}`;
        nozzleSalesMap.set(key, {
          nozzleName: name,
          fuelType: fuelType,
          liters: 0,
          amount: 0
        });
      }
    };

    const pumpInfo = results.pumpData?.data || {};
    addSkeleton(Number(pumpInfo.petrol_nozzle), 'Petrol', 'Petrol Pump');
    addSkeleton(Number(pumpInfo.diesel_nozzle), 'Diesel', 'Diesel Pump');
    addSkeleton(Number(pumpInfo.xp_petrol_nozzle), 'XP Petrol', 'xpPetrol Pump');
    addSkeleton(Number(pumpInfo.powe_diesel_nozzle), 'Power Diesel', 'powerDiesel Pump');

    const merge = (list: any[], fuelType: string, ltrField: string) => {
      if (!list || !Array.isArray(list)) return;
      list.forEach(item => {
        const rawName = item.pump || 'Unknown';
        const name = rawName.trim();
        const key = `${name.toLowerCase()}|${fuelType.toLowerCase()}`;

        if (!nozzleSalesMap.has(key)) {
          nozzleSalesMap.set(key, {
            nozzleName: name,
            fuelType: fuelType,
            liters: 0,
            amount: 0
          });
        }

        const data = nozzleSalesMap.get(key);
        data.liters += Number(item[ltrField]) || 0;
        data.amount += Number(item.total_sell) || 0;
      });
    };

    merge(results.petrolSales, 'Petrol', 'petrol_ltr');
    merge(results.dieselSales, 'Diesel', 'diesel_ltr');
    merge(results.xpPetrolSales, 'XP Petrol', 'xppetrol_ltr');
    merge(results.powerDieselSales, 'Power Diesel', 'powerdiesel_ltr');

    this.nozzleSalesData = Array.from(nozzleSalesMap.values());
  }

  onFilterChange() {
    this.getPiechartValue();
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(
      data => {
        this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
        this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
      }
    );
  }


  fetchData(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }
    const formattedStartDate = this.formatDate(this.startDate);
    const formattedEndDate = this.formatDate(this.endDate);

    this.use.getDailyTotals(formattedStartDate, formattedEndDate, this.userId)
      .subscribe(data => {
        this.dailyTotals = data;
      });

  }

  formatDate(date: string): string {
    const parts = date.split('-');
    if (parts.length !== 3) {
      this.notificationService.failure('Invalid date format.');
      return '';
    }
    const [year, month, day] = parts;
    return `${year}-${month}-${day}`;
  }

  getTotalRsSum(): number {
    return this.dailyTotals.reduce((sum, dailyTotal) => sum + dailyTotal.dailyTotal, 0);
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;
    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });
    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });
    seq2 = 0;
  };


  getDailytotal() {
    const userId = localStorage.getItem('userId');
    const url = `${API_DAILY_TOTAL}?userId=${userId}`;
    this.http.get<{ id: number, date: string, dailyTotal: number }[]>(url)
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.dailyTotal = data[0].dailyTotal;
        }
      });
  }

  getCurrentmonthtotal() {
    this.http.get<number>(`${API_CURRENTMOUNTH_TOTAL}?userId=${this.userId}`).subscribe((data) => {
      this.CurrentmonthTotal = data;
    });
  }

  getCurrentyear() {
    this.http.get<number>(`${API_CURRENTYEAR_TOTAL}?userId=${this.userId}`).subscribe((data) => {
      (data);
      this.CurrentyearTotal = data;
    });
  }
  createPieChart(data: any): void {
    const summaryData = [
      parseFloat(data.dieselSellSummary[0][0]),
      parseFloat(data.kharchSellSummary[0][0]),
      parseFloat(data.oilSellSummary[0][0]),
      parseFloat(data.petrolSellSummary[0][0]),
      parseFloat(data.purchaseSellSummary[0][0]),
      parseFloat(data.transactionSellSummary[0][0])
    ];
    const labels = [
      'Diesel Sell Summary',
      'Kharch Sell Summary',
      'Oil Sell Summary',
      'Petrol Sell Summary',
      'Purchase Sell Summary',
      'Transaction Sell Summary'
    ];
    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2;
    const svg = d3.select('#pieChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie();
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
    const pieData = pie(summaryData);
    svg.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.index.toString()))
      .attr('stroke', 'white')
      .attr('stroke-width', '2px');
    svg.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => labels[d.index]);
  }

  getPiechartValue() {
    let params = new HttpParams()
      .set('userId', this.userId)
      .set('filter', this.filterType);
    if (this.filterType === 'fy') {
      params = params.set('year', this.selectedYear.toString());
    }
    this.http.get<any>(`${API_DAILY_CHART}`, { params }).subscribe((data) => {

      const labels = [
        'Petrol Sale', 'XP Petrol Sale', 'Power Diesel Sale', 'Diesel Sale',
        'Oil Sale', 'Indirect Expenses', 'Credit ATM & Wallet', 'Deposit Bill', 'Customer Outstanding',
        'Petrol Purchase', 'Diesel Purchase', 'XP Petrol Purchase', 'Power Diesel Purchase', 'Oil Purchase'
      ];

      const datasetData = [
        data.petrolSellTotal,
        data.xpPetrolSellTotal,
        data.powerDieselSellTotal,
        data.dieselSellTotal,
        data.oilSellTotal,
        data.kharchTotal,
        data.atmTotal,
        data.jamaTotal,
        data.bakiTotal,
        data.totalPetrolPurchase,
        data.totalDieselPurchase,
        data.xpTotalPetrolPurchase,
        data.powerTotalDieselPurchase,
        data.totalOilPurchase
      ];

      const colors = [
        '#1b676f', '#ef7c8f', '#00A36C', '#4f52ec',
        '#EBB403', '#FF9F40', '#C9CBCF', '#00A36C',
        '#FF6F61', '#8A2BE2', '#FFD700', '#40E0D0', '#DC143C', '#20B2AA'
      ];

      // Remove XP/Power if nozzle count 0
      if (this.xp_petrol_nozzle === 0 && this.powe_diesel_nozzle === 0) {
        const removeLabels = ['XP Petrol Sale', 'Power Diesel Sale', 'XP Petrol Purchase', 'Power Diesel Purchase'];
        removeLabels.forEach(label => {
          const idx = labels.indexOf(label);
          if (idx !== -1) {
            labels.splice(idx, 1);
            datasetData.splice(idx, 1);
            colors.splice(idx, 1);
          }
        });
      }

      // Assign final chart data
      this.chartData = {
        labels: labels,
        datasets: [{
          data: datasetData,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderRadius: 8,
          barThickness: 22
        }]
      };

    });
  }

  getFinancialData() {
    let params = new HttpParams()
      .set('userId', this.userId)
      .set('filter', this.financialFilterType);

    if (this.financialFilterType === 'fy') {
      params = params.set('year', this.financialSelectedYear.toString());
    }

    this.http.get<any>(`${API_DAILY_CHART}`, { params }).subscribe((data) => {
      const income = (Number(data.petrolSellTotal) || 0) +
        (Number(data.xpPetrolSellTotal) || 0) +
        (Number(data.powerDieselSellTotal) || 0) +
        (Number(data.dieselSellTotal) || 0) +
        (Number(data.oilSellTotal) || 0);

      const expense = (Number(data.kharchTotal) || 0) +
        (Number(data.totalPetrolPurchase) || 0) +
        (Number(data.totalDieselPurchase) || 0) +
        (Number(data.xpTotalPetrolPurchase) || 0) +
        (Number(data.powerTotalDieselPurchase) || 0) +
        (Number(data.totalOilPurchase) || 0);

      const profit = income - expense;

      this.financialChartData = {
        labels: ['Income', 'Expense', 'Profit'],
        datasets: [{
          data: [income, expense, profit],
          backgroundColor: ['#28a745', '#dc3545', '#007bff'],
          hoverBackgroundColor: ['#218838', '#c82333', '#0069d9'],
          borderRadius: 8,
          barThickness: 40
        }]
      };
    });
  }




  // Individual data fetchers removed as they are now handled by forkJoin in ngOnInit

  // updatePieChart() {
  //   this.chartOptions2 = {
  //     animationEnabled: true,
  //     title: { text: "Fuel & Baki Distribution" },
  //     data: [{
  //       type: "pie",
  //       startAngle: 240,
  //       indexLabelPlacement: "outside",
  //       indexLabelFontSize: 14,
  //       indexLabelLineColor: "#000",
  //       indexLabelLineThickness: 1,
  //       indexLabel: "{label} - {y}",
  //       dataPoints: [
  //         { y: Number(this.petrollabel), label: "Petrol" },
  //         { y: Number(this.diesellabel), label: "Diesel" },
  //         { y: Number(this.xppetrollabel), label: "XP Petrol" },
  //         { y: Number(this.powerDiesellabel), label: "Power Diesel" },
  //         { y: Number(this.jamabakilabel), label: "Total Baki" },
  //       ]
  //     }]
  //   };
  // }
  updatePieChart() {
    const dataPoints: any[] = [];

    // Always visible
    dataPoints.push({ y: Number(this.petrollabel), label: "Petrol" });
    dataPoints.push({ y: Number(this.diesellabel), label: "Diesel" });

    // Conditionally visible
    if (this.showXpPetrolCount > 0) {
      dataPoints.push({
        y: Number(this.xppetrollabel),
        label: "XP Petrol"
      });
    }

    if (this.showPowerDieselCount > 0) {
      dataPoints.push({
        y: Number(this.powerDiesellabel),
        label: "Power Diesel"
      });
    }

    // Oil Purchase
    if (Number(this.oilPurchaseLabel) > 0) {
      dataPoints.push({
        y: Number(this.oilPurchaseLabel),
        label: "Oil Purchase"
      });
    }

    // Always visible
    dataPoints.push({
      y: Number(this.jamabakilabel),
      label: "Total Baki"
    });

    this.chartOptions2 = {
      animationEnabled: true,
      title: { text: "Fuel & Baki Distribution" },
      data: [{
        type: "pie",
        startAngle: 240,
        indexLabelPlacement: "outside",
        indexLabelFontSize: 14,
        indexLabelLineColor: "#000",
        indexLabelLineThickness: 1,
        indexLabel: "{label} - {y}",
        dataPoints: dataPoints
      }]
    };
  }

}
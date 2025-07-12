import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { DailyTotal } from '../../models/DailyTotal';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as d3 from 'd3';
import { API_CURRENTMOUNTH_TOTAL, API_CURRENTYEAR_TOTAL, API_DAILY_CHART, API_DAILY_TOTAL, API_DIESEL_CURRENTYEAR_DATE, API_JAMABAKI_CURRENTYEAR_DATE, API_PETROL_CURRENTYEAR_DATE, API_XP_PETROL_CURRENTYEAR_DATE } from 'app/serviceult';
import { ChartType, ChartConfiguration, ChartOptions } from 'chart.js';
import { LoaderService } from 'app/services/loader.service';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { dataproc } from 'googleapis/build/src/apis/dataproc';
import { STANDARD_DROPDOWN_ADJACENT_POSITIONS } from '@angular/cdk/overlay';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dailyTotals: DailyTotal[] = [];
  startDate: string = ''; // Initialize to empty string
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
  currentPage = 1; // Current page index
  itemsPerPage = 2;
  thumbnails: SafeUrl[] = [];
  // customers: any[] = [];
  customers: string[] = [];
  selectedCustomer: string = '';

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
  petrol: number;
  petrollabel: string;
  xppetrollabel: string;
  userId = localStorage.getItem('userId');
  filterType: string = 'today';
  chartOptions2: { animationEnabled: boolean; exportEnabled: boolean; title: { text: string; }; data: { type: string; startAngle: number; indexLabelPlacement: string; indexLabelFontSize: number; indexLabelLineColor: string; indexLabelLineThickness: number; indexLabel: string; dataPoints: { y: number; label: string; }[]; }[]; };
  

  constructor(private use: UserServiceService, private http: HttpClient, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private loaderService: LoaderService, private notificationService: NotificationService
  ) { }


  ngOnInit() {

    this.loaderService.display(false);
    this.userId = localStorage.getItem('userId');
    this.Customerall();
    this.getDailytotal();
    this.getCurrentmonthtotal();
    this.getCurrentyear();
    this.getPiechartValue();
    this.getPetrolCurrentYearData();
    this.getDieselCurrentYearData();
    this.getXpPetrolCurrentYearData();
    this.getJamaBakiCurrentYearData();
  }
  fetchData(): void {
    if (!this.startDate || !this.endDate) {
      // Handle case when either start or end date is not selected
      return;
    }
    const formattedStartDate = this.formatDate(this.startDate);
    const formattedEndDate = this.formatDate(this.endDate);

    this.use.getDailyTotals(formattedStartDate, formattedEndDate, this.userId)
      .subscribe(data => {
        this.dailyTotals = data;
      });

  }
  // formatDate(date: string): string {
  //   // Split the date string by '-' to get day, month, and year
  //   const parts = date.split('-');
  //   if (parts.length !== 3) {
  //     // Invalid date format
  //     this.notificationService.failure('Invalid date format.');
  //     return '';
  //   }
  //   // Re-arrange the parts and join them with '/'
  //   return `${parts[2]}/${parts[1]}/${parts[0]}`;
  // }
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
  Customerall() {
    // this.http.get<any>(API_CUSTOMER_ALL).subscribe((data: any) => {
    //   // Assuming 'customers' is the property containing the array of names
    //   this.names = data.map((data: any) => data.name);
    // });
  }

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
    // Extract and parse the actual values from the data
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
    const params = new HttpParams()
      .set('userId', this.userId)
      .set('filter', this.filterType);

    this.http.get<any>(`${API_DAILY_CHART}`, { params }).subscribe((data) => {
      this.chartData = {
        labels: [
          'Petrol_Sell',
          'XP_Petrol_Sell',
          'Power_Diesel_Sell',
          'Diesel_Sell',
          'Oil_Sell',
          'Kharch_Total',
          'ATM_Total',
          'Jama_Total',
          'Baki_Total',
          'Petrol_Purchase',
          'Diesel_Purchase',
          'XP_Petrol_Purchase',
          'Power_Diesel_Purchase'
        ],
        datasets: [
          {
            data: [
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
              data.powerTotalDieselPurchase
            ],
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
              '#9966FF', '#FF9F40', '#C9CBCF', '#00A36C',
              '#FF6F61', '#8A2BE2', '#FFD700', '#40E0D0',
              '#DC143C'
            ],
            hoverBackgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
              '#9966FF', '#FF9F40', '#C9CBCF', '#00A36C',
              '#FF6F61', '#8A2BE2', '#FFD700', '#40E0D0',
              '#DC143C'
            ]
          }
        ]
      };
    });

  }

  public chartType: ChartType = 'bar'; // Set to 'pie' for pie chart

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Sales',
        backgroundColor: [],
        hoverBackgroundColor: []
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 100,
        max: 120000,
        ticks: {
          stepSize: 10000
        }
      }
    }
  };


  getPetrolCurrentYearData() {
    this.http.get<any>(`${API_PETROL_CURRENTYEAR_DATE}?userId=${this.userId}`).subscribe((data) => {
      const percentage = (data / this.total) * 100;
      this.petrol = Math.round(percentage);
      // this.petrollabel = `Petrol_ltr: ${data}`;
      this.petrollabel = data;
      this.updatePieChart();
    });
  }

  getDieselCurrentYearData() {
    this.http.get<any>(`${API_DIESEL_CURRENTYEAR_DATE}?userId=${this.userId}`).subscribe((data) => {
      (data);
      // this.diesel = data;
      const percentage = (data / this.total) * 100;
      this.diesel = Math.round(percentage);
      // this.diesellabel = `Diesel_Ltr: ${data}`;
      this.diesellabel = data;
      this.updatePieChart();
    });
  }

  getXpPetrolCurrentYearData() {
    this.http.get<any>(`${API_XP_PETROL_CURRENTYEAR_DATE}?userId=${this.userId}`).subscribe((data) => {
      this.xppetrollabel = data;
      this.updatePieChart();
    });
  }

  getJamaBakiCurrentYearData() {
    this.http.get<any>(`${API_JAMABAKI_CURRENTYEAR_DATE}?userId=${this.userId}`).subscribe((data) => {
      (data);
      // this.jamabaki = data;
      const percentage = (data / this.baki) * 100;
      this.jamabaki = Math.round(percentage);
      // this.jamabakilabel = `Total Baki: ${data}`;
      this.jamabakilabel = data;
      this.updatePieChart();
    });
  }

  // chartOptions2: any = {
  //   animationEnabled: true,
  //   title: {
  //     text: "Fuel & Baki Distribution"
  //   },
  //   data: [{
  //     type: "pie",
  //     startAngle: 240,
  //     indexLabel: "{label} - {y}%",
  //     dataPoints: []  // Initially empty, populated in updatePieChart()
  //   }]
  // };
  

  updatePieChart() {
    // Fallback default values if data is missing
    const petrol = Number(this.petrollabel) || 0;
    const diesel = Number(this.diesellabel) || 0;
    const baki = Number(this.jamabakilabel) || 0;
    const xpPetrol = Number(this.xppetrollabel) || 0;
  
    const dataPoints = [
      { y: petrol, label: "Petrol" },
      { y: diesel, label: "Diesel" },
      { y: baki, label: "Total Baki" },
      // { y: xpPetrol, label: "XP Petrol" }
    ];
  
    this.chartOptions2 = {
      animationEnabled: true,
      exportEnabled: false,
      title: {
        text: "Fuel & Baki Distribution"
      },
      data: [{
        type: "pie",
        startAngle: 240,
        indexLabelPlacement: "outside",
        indexLabelFontSize: 14,
        indexLabelLineColor: "#000",
        indexLabelLineThickness: 1,
        indexLabel: "{label} - {y}%",
        dataPoints: dataPoints
      }]
    };
  }
}
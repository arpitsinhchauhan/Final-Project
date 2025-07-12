import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { CustomPdfViewerComponent } from "./custom-pdf-viewer/custom-pdf-viewer.component";
import { HttpClient } from "@angular/common/http";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
import {
  API_BACKPAGE,
  API_CUSTOMER_NAME,
  API_EMPLOYEE_DETAILS_LIST,
  API_REPORT,
} from "app/serviceult";
import { Employee } from "app/models/DailyTotal";
import { BackPageComponent } from "app/modules/back-page/back-page.component";
import { CustomerComponent } from "app/modules/jama-baki/customer/customer.component";
import { EmployeeDetailsComponent } from "app/modules/employee-details/employee-details.component";
import { EmployeeComponent } from "app/modules/employee/employee.component";
import { ItReturnComponent } from "app/modules/it-return/it-return.component";
import { MonthlyJamaBakiTotalComponent } from "app/modules/monthly-jama-baki-total/monthly-jama-baki-total.component";
import { PumpDetailComponent } from "app/modules/pump-detail/pump-detail.component";
import { LoaderService } from "app/services/loader.service";
import { UserServiceService } from "app/services/user-service.service";
import { NotificationService } from "app/services/notification.service";
import { ExpensesExcelComponent } from "./expenses-excel/expenses-excel.component";
import { retry } from "rxjs";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  isProcessing: boolean | undefined;
  startDate: string = ""; // Initialize to empty string
  endDate: string = "";
  productList: any = [];
  customers: string[] = [];
  senderAmountTotal: number = 0;
  receiverAmountTotal: number = 0;
  totalDifference: number = 0;
  dailyTotal: number;
  CurrentmonthTotal: number = 0;
  CurrentyearTotal: number = 0;
  currentPage = 1; // Current page index
  itemsPerPage = 2;
  selectedCustomer: string = "";
  name: string = "";
  names: string = "";
  thumbnails: SafeUrl[] = [];
  startDateJb: string; 
  endDateJb: string;
  userId: string;
  isReload: boolean;
  expensesList: string[] = []
  selectedExpense: string = '';
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;
  startDateExpen: string; 
  endDateExpen: string;

  startDatePdf: string;
  endDatePdf: string;

  constructor(
    private use: UserServiceService,
    private http: HttpClient,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loaderService.display(false);
    this.getdata();
    this.getCustomer();
    this.getexpensesList();
    this.getUserName();
  }

  EmployeeDetails() {
    const dialogRef = this.dialog.open(EmployeeComponent, {
      width: "40%",
      height: "87%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
      this.getCustomer();
    });
  }

  openDetails(items: any) {
    this.use.getExpensesAndNotes(items.name, items.userId).subscribe((data) => {
      const dialogRef = this.dialog.open(EmployeeDetailsComponent, {
        width: "50%",
        height: "50%",
        data: items.name,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.Customerall();
      });
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: "25%",
      height: "60%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  exportToExcel() {
    if (!this.startDate || !this.endDate) {
      this.notificationService.failure(
        "Please select both start date and end date"
      );
      return;
    }

    const dialogRef = this.dialog.open(PumpDetailComponent, {
      width: "90%",
      height: "90%",
      data: {
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
      this.getCustomer();
      this.getexpensesList();
    });
  }

  fetchTransactions(): void {
    // this.use.getTransactions(this.name).subscribe((data: Transaction[]) => {
    //   this.productList = data;
    //   this.calculateTotals();
    // });
  }
  calculateTotals() {
    // Reset totals to ensure fresh calculation each time the method is called
    this.senderAmountTotal = 0;
    this.receiverAmountTotal = 0;

    this.productList.forEach(
      (transaction: { sender: string; amount: string; receiver: string }) => {
        const amount = parseFloat(transaction.amount); // Convert amount from string to number

        if (!isNaN(amount)) {
          // Check if the amount is a valid number
          if (transaction.sender === this.name) {
            this.senderAmountTotal += amount;
          }
          if (transaction.receiver === this.name) {
            this.receiverAmountTotal += amount;
          }
        }
        this.totalDifference =
          this.receiverAmountTotal - this.senderAmountTotal;
      }
    );
    "send" + this.senderAmountTotal;
    "rec" + this.receiverAmountTotal;
  }

  Customerall() {
    this.userId = localStorage.getItem("userId");
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;
    this.http.get<any>(url).subscribe((data: any) => {
      // Assuming 'customers' is the property containing the array of names
      this.names = data.map((data: any) => data.name);
    });
  }

  getCustomer() {
    this.userId = localStorage.getItem("userId");
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;
    this.http.get(url).subscribe((data) => {
      this.customers = Object.values(data).map((item: any) => item.name);
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }
  getdata() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get(API_EMPLOYEE_DETAILS_LIST, { params }).subscribe((data) => {
      this.productList = data;
      // let objectURL = 'data:image/jpeg;base64,' + data[0].photo;
      // this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.productList.forEach((product) => {
        let objectURL = "data:image/jpeg;base64," + product.photo;
        this.thumbnails.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
      });
    });
  }

  bin2string(array: any) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }

  isFile(obj: any): obj is File {
    return obj instanceof File;
  }

  isBlob(obj: any): obj is Blob {
    return obj instanceof Blob;
  }
  image: any[] = [];

  getPhotoUrl(employee: Employee): any {
    if (this.isFile(employee.photo)) {
      const reader = new FileReader();
      reader.readAsDataURL(employee.photo);
      return new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
      });
    } else if (this.isBlob(employee.photo)) {
      const photoBlob = new Blob([employee.photo], { type: "image/jpeg" });
      return window.URL.createObjectURL(photoBlob);
    }
  }

  user_photo!: SafeResourceUrl;
  photo_url(data: string) {
    this.user_photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/jpeg;base64," + new Blob([data], { type: "image/jpeg" })
    );
  }
  // downloadReport(selectedDate: string): void {
  //   // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint URL
  //   const apiUrl = 'http://localhost:8081/ api/bill';

  //   // Append selected date to the API endpoint
  //   const urlWithParams = `${apiUrl}?date=${selectedDate}`;

  //   // Make a GET request to the API endpoint to download the PDF
  //   fetch(urlWithParams, {
  //     method: 'GET',
  //   })
  //     .then(response => {
  //       // Check if the response is successful
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.blob(); // Extract the binary data from the response
  //     })
  //     .then(blob => {
  //       // Create a blob URL for the downloaded PDF
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a temporary anchor element to trigger the download
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${selectedDate}.pdf`; // Set the filename for the downloaded PDF

  //       document.body.appendChild(a);

  //       // Click the anchor element to start the download
  //       a.click();

  //       // Cleanup: revoke the blob URL and remove the anchor element
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //     })
  // }
  selectedDate!: Date | null;
  selectedDateBakepage!: Date | null;

  // Function to handle date selection
  dateSelected(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    this.selectedDateBakepage = event.value;
  }

  downloadReport(): void {
    if (!this.selectedDate) {
      console.error("Please select a date");
      return;
    }
    // Make API call to download the PDF
    this.downloadPDF();
    this.isProcessing = true;
    // this.downloadPDF();
  }
  downloadPDF() {
    const userId = localStorage.getItem("userId");
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    // const apiUrl = `http://localhost:8081/portal/api/report?date=${this.selectedDate}&time=${currentTime}&userId=${userId}`;
    const apiUrl = `${API_REPORT}/report?date=${this.selectedDate}&time=${currentTime}&userId=${userId}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.selectedDate}.pdf`; // Set filename with date
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.openPdfViewer();
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  }

  backPage() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      this.dialog.open(BackPageComponent, {
        data: "Error: User ID not found",
      });
      return;
    }
    // const apiUrl = `http://localhost:8081/portal/api/bakePage?date=${this.selectedDateBakepage}&userId=${userId}`; // Changed 'userid' to 'userId'
    const apiUrl = `${API_BACKPAGE}?date=${this.selectedDateBakepage}&userId=${userId}`;

    // Send the HTTP GET request with the userId in the headers
    this.http
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userId}`, // Adjust the header key if necessary
        },
      })
      .subscribe(
        (response) => {
          this.dialog.open(BackPageComponent, {
            width: "60%",
            height: "87%",
            data: response,
          });
        },
        (error) => {
          this.dialog.open(BackPageComponent, {
            data: "Error: " + error.message,
          });
        }
      );
  }

  // downloadPDF() {
  //   // Construct the API URL with the selected date
  //   const apiUrl = `http://localhost:8081/api/bill?date=${this.selectedDate}`;

  //   // Make a GET request to the API endpoint to download the PDF
  //   fetch(apiUrl, {
  //     method: 'GET',
  //   })
  //     .then(response => {
  //       // Check if the response is successful
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.blob(); // Extract the binary data from the response
  //     })
  //     .then(blob => {
  //       // Create a blob URL for the PDF
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a temporary <a> element to trigger the download
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${this.selectedDate}.pdf`; // Set filename with date
  //       document.body.appendChild(a);
  //       a.click();

  //       // Clean up by revoking the blob URL and removing the <a> element
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //       this.openPdfViewer();
  //     })
  //     .catch(error => {
  //       // Handle any errors
  //       // console.error('Error downloading PDF:', error);
  //     });
  // }

  // backPage() {
  //   // Construct the API URL with the selected date
  //   const apiUrl = `http://localhost:8081/bakePage?date=${this.selectedDateBakepage}`;

  //   this.http.get(apiUrl).subscribe(
  //     response => {
  //       this.dialog.open(BackPageComponent, {
  //         width: '60%',
  //         height: '87%',
  //         data: response
  //       });
  //     },
  //     error => {
  //       this.dialog.open(BackPageComponent, {
  //         data: 'Error: ' + error.message
  //       });
  //     }
  //   );

  // }

  openPDFViewerComponent(fileName: string, pdfData: any) {
    const dialogRef = this.dialog.open(CustomPdfViewerComponent, {
      maxWidth: "40%",
      maxHeight: "90%",
      width: "40%",
      height: "90%",
      data: {
        pdfData: pdfData,
        title: fileName,
        selectedDate: this.selectedDate,
      },
    });
    // After the PDF viewer component is closed, initiate the download
    dialogRef.afterClosed().subscribe(() => {
      // this.PDF(fileName, pdfData);
    });
  }

  PDF(fileName: string, pdfData: any) {
    // Create a blob from PDF data
    const blob = new Blob([pdfData], { type: "application/pdf" });

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link to the document and trigger a click event to start download
    document.body.appendChild(link);
    link.click();
  }

  openPdfViewer() {
    let fileName1 = `${this.selectedDate}.pdf`;
    this.use.getPDFData(fileName1).subscribe(
      (response: ArrayBuffer) => {
        if (response.byteLength != 0) {
          // Open the custom PDF viewer component with PDF data
          this.openPDFViewerComponent(`${this.selectedDate}.pdf`, response);
        } else {
          this.openPdfViewer();
        }
      },
      (error: any) => {
        // console.error('Error fetching PDF:', error);
        this.isProcessing = false;
      }
    );
  }
  onCustomerSelectionChange(event: any): void {
    const dialogRef = this.dialog.open(MonthlyJamaBakiTotalComponent, {
      width: "50%",
      height: "50%",
      data: {
        customer: this.selectedCustomer,
        startDate: this.startDateJb,
        endDate: this.endDateJb,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  openITReturn() {
    const dialogRef = this.dialog.open(ItReturnComponent, {
      width: "70%",
      height: "70%",
    });

    dialogRef.afterClosed().subscribe((result) => {
    this.getexpensesList();

    });
  }

  getexpensesList() {
    this.use.getexpensesList().subscribe((response) => {
      this.expensesList = response.map((item) => item.expensesList);
    });
  }


  expensesExcel(event: any): void {
    const dialogRef = this.dialog.open(ExpensesExcelComponent, {
      width: "50%",
      height: "50%",
      data: {
        expense: this.selectedExpense,
        startDate: this.startDateExpen,
        endDate: this.endDateExpen,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getexpensesList();
      }
    });
  }

  pdf() {
    if (this.xp_petrol_nozzle == 0 || this.powe_diesel_nozzle == 0) {
      const pdfLogData = {
        userid: this.userId,
        downloadTime: new Date().toISOString(),
        fileType: 'PDF',
        fileName: `Profit&Loss` + this.startDatePdf + `to` + this.endDatePdf + `.pdf`
      };
      this.use.downloadPdf(this.userId, this.startDatePdf, this.endDatePdf).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfLogData.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.loaderService.display(false);
      },
        (error) => {
          console.error('Error downloading the file', error);
          this.loaderService.display(false);
        }
      );
    } else {
      const pdfLogData = {
        userid: this.userId,
        downloadTime: new Date().toISOString(),
        fileType: 'PDF',
        fileName: `Extra_Profit&Loss` + this.startDatePdf + `to` + this.endDatePdf + `.pdf`
      };
      this.use.extraPredownloadPdf(this.userId, this.startDatePdf, this.endDatePdf).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfLogData.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.loaderService.display(false);
      },
        (error) => {
          console.error('Error downloading the file', error);
          this.loaderService.display(false);
        }
      );
  }
  }


  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(
      data => {
        this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
        this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
      }
    );
  }
}

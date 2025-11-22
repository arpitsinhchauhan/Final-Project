import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_SEND_SMS } from 'app/serviceult';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-oill-bill',
  templateUrl: './oill-bill.component.html',
  styleUrls: ['./oill-bill.component.scss']
})
export class OillBillComponent implements OnInit {

  oillData: any;

  constructor(
    public dialogRef: MatDialogRef<OillBillComponent>, public notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {
    console.log(data);
    if (data) {
      this.oillData = data;
    }
  }

  ngOnInit(): void {

  }

  getGrandTotal(): number {
    return this.oillData?.items?.reduce((sum: number, i: any) => sum + i.total, 0) || 0;
  }


  downloadPDF() {
    const element = document.getElementById('invoice');
    const options = {
      margin: 10,
      filename: `invoice_${this.oillData.date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  }

  sendBill() {
    if (!this.oillData?.customer?.phone) {
      alert('Customer phone number not available.');
      return;
    }
    const baseUrl = API_SEND_SMS;
    const to = this.oillData.customer.phone.startsWith('+')
      ? this.oillData.customer.phone
      : '+91' + this.oillData.customer.phone.trim();
    const message = `Dear ${this.oillData.customer.name}, your Oil bill for ${this.oillData.oilType} on ${this.oillData.date} is ₹${this.oillData.price}. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const finalUrl = `${baseUrl}?to=${to}&message=${encodedMessage}`;
    this.http.get(finalUrl, { responseType: 'text' })
      .subscribe({
        next: (res) =>
          this.notificationService.success(res),
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}




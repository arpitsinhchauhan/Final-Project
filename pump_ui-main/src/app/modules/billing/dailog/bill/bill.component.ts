import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_SEND_SMS, API_SEND_WHATSAPP } from 'app/serviceult';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  billData: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private use: UserServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    if (data) {
      this.billData = data;
    }
  }

  ngOnInit(): void {
    console.log('Bill Data Received in ngOnInit:', this.billData);
  }

  getGrandTotal(): number {
    return this.billData?.items?.reduce((sum: number, i: any) => sum + i.total, 0) || 0;
  }


  downloadPDF() {
    const element = document.getElementById('invoice');
    const options = {
      margin: 10,
      filename: `invoice_${this.billData.date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  }

  sendBakiBill() {
    if (!this.billData?.customer?.phone) {
      alert('Customer phone number not available.');
      return;
    }
    const baseUrl = API_SEND_SMS;
    const to = this.billData.customer.phone.startsWith('+')
      ? this.billData.customer.phone.replace(/\s+/g, '')
      : '+91' + this.billData.customer.phone.trim().replace(/\s+/g, '');
    const totalAmount = this.getGrandTotal();
    const billDate = new Date(this.billData.date).toLocaleDateString('en-IN');
    const itemSummary = this.billData.items
      .map(item => `${item.type} ${item.ltr}L x ₹${item.rate} = ₹${item.total}`)
      .join(', ');
    const message = `Dear ${this.billData.customer.name}, your Baki bill dated ${billDate} includes: ${itemSummary}. Total payable: ₹${totalAmount}. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const finalUrl = `${baseUrl}?to=${to}&message=${encodedMessage}`;
    this.http.get(finalUrl, { responseType: 'text' })
      .subscribe({
        next: (res) => this.notificationService.success(res)
      });
  }

  sendBakiBillWhatsapp() {
    if (!this.billData?.customer?.phone) {
      alert('Customer phone number not available.');
      return;
    }

    const to = this.billData.customer.phone.startsWith('+')
      ? this.billData.customer.phone
      : '+91' + this.billData.customer.phone.trim();

    const totalAmount = this.getGrandTotal();
    const billDate = new Date(this.billData.date).toLocaleDateString('en-IN');
    const itemSummary = this.billData.items
      .map(item => `${item.type} ${item.ltr}L x ₹${item.rate} = ₹${item.total}`)
      .join(', ');

    const message = `Dear ${this.billData.customer.name}, your Baki bill dated ${billDate} includes: ${itemSummary}. Total payable: ₹${totalAmount}. Thank you!`;

    const finalUrl = `${API_SEND_WHATSAPP}?to=${encodeURIComponent(to)}&message=${encodeURIComponent(message)}`;
    this.http.get(finalUrl, { responseType: 'text' })
      .subscribe({
        next: (res) => this.notificationService.success(res),
        error: (err) => this.notificationService.failure('Failed to send WhatsApp:', err)
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}

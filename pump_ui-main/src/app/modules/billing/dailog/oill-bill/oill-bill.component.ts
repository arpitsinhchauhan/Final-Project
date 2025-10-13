import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-oill-bill',
  templateUrl: './oill-bill.component.html',
  styleUrls: ['./oill-bill.component.scss']
})
export class OillBillComponent implements OnInit {


  oillData: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OillBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private use: UserServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    if (data) {
      this.oillData = data;
    }
  }

  ngOnInit(): void {
    console.log('Bill Data Received in ngOnInit:', this.oillData);
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

  cancel() {
    this.dialogRef.close();
  }
}




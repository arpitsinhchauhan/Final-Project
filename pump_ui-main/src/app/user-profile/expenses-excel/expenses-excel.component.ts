import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-expenses-excel',
  templateUrl: './expenses-excel.component.html',
  styleUrls: ['./expenses-excel.component.scss']
})
export class ExpensesExcelComponent implements OnInit {

  isReload: boolean;
  expenseList: any[] = [];
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private user: UserServiceService, private dialogRef: MatDialogRef<ExpensesExcelComponent>) {
  }

  ngOnInit(): void {
    this.fetchExpence();
  }

  fetchExpence(): void {
    this.user.getExpenses(this.data.expense, this.data.startDate, this.data.endDate).subscribe((data: any[]) => {
      this.expenseList = data.map(item => ({
      date: item.date,
      expenses: item.expenses,
      price: item.price,
      note: item.notes
    }));
    });

  }


  printTable() {
    const printContent = document.getElementById('ExpenseTable')?.outerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent ?? '';
    window.print();
    document.body.innerHTML = originalContent;
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('ExpenseTable')!);
  
    // Append a row with the total
    const total = this.getTotalPrice();
    const lastRow = this.expenseList.length + 2; // +1 for header, +1 because Excel is 1-based
    const totalCellRef = `B${lastRow}`;
    const valueCellRef = `C${lastRow}`;
  
    ws[totalCellRef] = { v: 'Grand Total', t: 's' };
    ws[valueCellRef] = { v: total, t: 'n' };
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    XLSX.writeFile(wb, 'Expense_Data.xlsx');
  }
  

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
  getTotalPrice(): number {
    return this.expenseList.reduce((sum, item) => sum + (+item.price || 0), 0);
  }
  

}

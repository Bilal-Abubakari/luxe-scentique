import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from '../../core/services/api.service';
import { IncomeCategory } from '@luxe-scentique/shared-types';
import type { IOtherIncome } from '@luxe-scentique/shared-types';
const INCOME_LABELS: Record<IncomeCategory, string> = {
  [IncomeCategory.INVESTMENT]: 'Investment',
  [IncomeCategory.LOAN]: 'Loan',
  [IncomeCategory.GRANT]: 'Grant',
  [IncomeCategory.REFUND]: 'Refund',
  [IncomeCategory.COMMISSION]: 'Commission',
  [IncomeCategory.OTHER]: 'Other',
};
const INCOME_SEVERITY: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
  INVESTMENT: 'success', LOAN: 'warn', GRANT: 'success',
  REFUND: 'info', COMMISSION: 'info', OTHER: 'secondary',
};
@Component({
  selector: 'app-income',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, DatePipe,
    TableModule, ButtonModule, DialogModule, SelectModule, InputTextModule,
    InputNumberModule, TextareaModule, DatePickerModule, TagModule, ToastModule,
    SkeletonModule, ConfirmDialogModule, RippleModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
})
export class IncomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly msg = inject(MessageService);
  private readonly confirm = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);
  incomes = signal<IOtherIncome[]>([]);
  total = signal(0);
  isLoading = signal(true);
  isSaving = signal(false);
  showDialog = signal(false);
  editingId = signal<string | null>(null);
  currentPage = signal(0);
  pageSize = signal(15);
  filterStartDate = signal<Date | null>(null);
  filterEndDate = signal<Date | null>(null);
  totalAmount = signal(0);
  readonly categoryOptions = Object.entries(INCOME_LABELS).map(([value, label]) => ({ label, value: value as IncomeCategory }));
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: [null as IncomeCategory | null, Validators.required],
    date: [new Date(), Validators.required],
    source: [''],
    description: [''],
    reference: [''],
  });
  ngOnInit(): void { this.loadIncome(); }
  loadIncome(page = 0): void {
    this.isLoading.set(true);
    this.currentPage.set(page);
    const query: Record<string, string | number> = { page: page + 1, limit: this.pageSize() };
    if (this.filterStartDate()) query['startDate'] = (this.filterStartDate() as Date).toISOString().split('T')[0];
    if (this.filterEndDate()) query['endDate'] = (this.filterEndDate() as Date).toISOString().split('T')[0];
    this.api.getOtherIncome(query).subscribe({
      next: ({ data, total }) => {
        this.incomes.set(data); this.total.set(total);
        this.totalAmount.set(data.reduce((s, i) => s + i.amount, 0));
        this.isLoading.set(false);
      },
      error: () => { this.isLoading.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to load income entries.' }); },
    });
  }
  openAddDialog(): void {
    this.editingId.set(null);
    this.form.reset({ date: new Date() });
    this.showDialog.set(true);
  }
  openEditDialog(income: IOtherIncome): void {
    this.editingId.set(income.id);
    this.form.patchValue({
      title: income.title, amount: income.amount, category: income.category,
      date: new Date(income.date), source: income.source ?? '',
      description: income.description ?? '', reference: income.reference ?? '',
    });
    this.showDialog.set(true);
  }
  saveIncome(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving.set(true);
    const val = this.form.getRawValue();
    const dto = {
      title: val.title!, amount: val.amount!, category: val.category!,
      date: (val.date as Date).toISOString().split('T')[0],
      source: val.source || undefined, description: val.description || undefined,
      reference: val.reference || undefined,
    };
    const id = this.editingId();
    const obs = id ? this.api.updateOtherIncome(id, dto) : this.api.createOtherIncome(dto);
    obs.subscribe({
      next: () => {
        this.showDialog.set(false); this.isSaving.set(false);
        this.msg.add({ severity: 'success', summary: id ? 'Updated' : 'Recorded', detail: `"${dto.title}" ${id ? 'updated' : 'recorded'}.` });
        this.loadIncome(id ? this.currentPage() : 0);
      },
      error: () => { this.isSaving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to save income entry.' }); },
    });
  }
  deleteIncome(income: IOtherIncome): void {
    this.confirm.confirm({
      header: 'Delete Income Entry', message: `Delete "${income.title}"?`, icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger', label: 'Delete' },
      rejectButtonProps: { severity: 'secondary', label: 'Cancel', outlined: true },
      accept: () => {
        this.api.deleteOtherIncome(income.id).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Deleted', detail: `"${income.title}" removed.` }); this.loadIncome(0); },
          error: () => { this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete.' }); },
        });
      },
    });
  }
  onPageChange(event: { first: number; rows: number }): void {
    this.pageSize.set(event.rows);
    this.loadIncome(Math.floor(event.first / event.rows));
  }
  applyFilters(): void { this.loadIncome(0); }
  clearFilters(): void {
    this.filterStartDate.set(null); this.filterEndDate.set(null); this.loadIncome(0);
  }
  getCategorySeverity(cat: string) { return INCOME_SEVERITY[cat] ?? 'secondary'; }
  getCategoryLabel(cat: string): string { return INCOME_LABELS[cat as IncomeCategory] ?? cat; }
  fmt(amount: number): string {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 2 }).format(amount ?? 0);
  }
  get skeletonRows(): null[] { return Array.from({ length: 8 }); }
  get dialogTitle(): string { return this.editingId() ? 'Edit Income Entry' : 'Record Other Income'; }
  isFieldInvalid(field: string): boolean { const c = this.form.get(field); return !!(c && c.invalid && c.touched); }
}

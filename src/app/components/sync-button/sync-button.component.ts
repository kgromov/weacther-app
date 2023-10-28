import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TemperatureService} from "../../services/temperature.service";
import {finalize, Subject} from "rxjs";
import {SyncStatus} from "../../model/weather-data";
import {HttpStatusCode} from "@angular/common/http";
import {mergeMap} from "rxjs/operators";

@Component({
  selector: 'sync-button',
  templateUrl: './sync-button.component.html',
  styleUrls: ['./sync-button.component.css']
})
export class SyncButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public latestDate: string | undefined;
  @Output() public onSync: EventEmitter<SyncStatus> = new EventEmitter();

  showSyncButton: boolean = false;
  disableSyncButton: boolean = false;
  private subject$: Subject<void> = new Subject();

  constructor(private temperatureService: TemperatureService,
              private toastr: ToastrService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    if(changes.latestDate && changes.latestDate.currentValue) {
      console.log('syncButton: latestDate = ', this.latestDate);
      this.showSyncButton = this.isSyncAvailable;
    }
  }

  ngOnInit(): void {
    // this.showSyncButton = true;
    this.subject$.asObservable()
      .pipe(
        finalize(() => this.disableSyncButton = false),
        mergeMap(() => this.temperatureService.syncTemperature())
      ).subscribe((status: SyncStatus) => {
      this.showToaster(status);
    });
  }

  public onSyncClicked(): void {
    this.disableSyncButton = true;
    this.subject$.next();
  }

  private get isSyncAvailable(): boolean {
    if (!this.latestDate) {
      return true;
    }
    const from: Date = new Date(this.latestDate);
    const to = new Date();
    if (to.getUTCHours() < 20) {
      to.setDate(to.getDate() - 1);
    }
    const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    // return Math.floor(Math.abs(to.getTime() - from.getTime()) / 1000 * 60 * 60 * 24) > 0;
    console.log(`Calculate days between UTC dates: ${new Date(utc2)} - ${new Date(utc1)}`);
    return Math.floor(Math.abs(utc2 - utc1) / 1000 * 60 * 60 * 24) > 0;
  }

  private showToaster(status: SyncStatus) {
    if (status.code === HttpStatusCode.Ok) {
      this.toastr.success(status.message, 'Sync result');
      this.showSyncButton = false;
      this.onSync.emit(status);
    } else {
      this.toastr.error(status.message, 'Sync result');
    }
  }

  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }
}

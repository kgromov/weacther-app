import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TemperatureService} from "../../services/temperature.service";
import {finalize, Subject} from "rxjs";
import {SyncStatus} from "../../model/weather-data";
import {HttpStatusCode} from "@angular/common/http";
import {mergeMap} from "rxjs/operators";
import {faSpinner, faSync} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'sync-button',
  templateUrl: './sync-button.component.html',
  styleUrls: ['./sync-button.component.css']
})
export class SyncButtonComponent implements OnInit, OnDestroy {
  @Output() public onSync: EventEmitter<SyncStatus> = new EventEmitter();

  showSyncButton: boolean = false;
  disableSyncButton: boolean = false;
  private subject$: Subject<void> = new Subject();

  constructor(private temperatureService: TemperatureService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.temperatureService.isSynced().subscribe(isSynced => this.showSyncButton = !isSynced);
    this.subject$.asObservable()
      .pipe(
        finalize(() => this.disableSyncButton = false),
        mergeMap(() => this.temperatureService.syncTemperature())
      ).subscribe((status: SyncStatus) => {
        this.showToaster(status);
      }, error => {
        this.showToaster({...error.error});
    });
  }

  public onSyncClicked(): void {
    this.disableSyncButton = true;
    this.subject$.next();
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
    this.subject$.complete();
  }

  protected readonly faSpinner = faSpinner;
  protected readonly faSync = faSync;
}

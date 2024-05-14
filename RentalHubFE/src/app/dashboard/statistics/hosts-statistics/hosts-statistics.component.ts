import { Component, OnDestroy } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { yearDataSourceHosts } from '../data';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hosts-statistics',
  templateUrl: './hosts-statistics.component.html',
  styleUrls: ['./hosts-statistics.component.scss'],
})
export class HostsStatisticsComponent implements OnDestroy {
  totalHosts: number = 0;
  multi: any[] | undefined;
  yearDataSourceHosts!: [{ name: string; value: boolean }];
  hostsByStatus: any[] | undefined;
  $destroy: Subject<boolean> = new Subject<boolean>();
  //bar chart
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Tháng';
  showYAxisLabel = true;
  yAxisLabel = 'Host và người dùng mới';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  view: [number, number] = [450, 300];

  //Pie chart
  // options
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  //line chart
  // options
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;

  constructor(
    private statisticsService: StatisticsService,
    private router: Router
  ) {
    Object.assign(this, { yearDataSourceHosts });

    this.view = [450, 300];
    this.yearDataSourceHosts[this.yearDataSourceHosts.length - 1].value = true;
    //Lấy số lượng hosts
    this.statisticsService
      .countAllHosts()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.totalHosts = res.data;
        }
      });

    //Đếm số lượng hosts theo status (Active and Inactive)
    this.statisticsService
      .countHostsByStatus()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.hostsByStatus = res.data;
        }
      });

    //Lấy data hosts and users theo tháng trang một năm
    this.statisticsService
      .countHostsAndUsersByMonthInAYear(
        this.yearDataSourceHosts[this.yearDataSourceHosts.length - 1].name
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.multi = res.data;
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  onSelectPie(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onSelect(event: any) {
    console.log(event);
  }

  onResize(event: any) {
    if (event.target.innerWidth < 768 && event.target.innerWidth > 480) {
      this.view = [event.target.innerWidth / 1.75, 300];
    } else if (event.target.innerWidth > 320 && event.target.innerWidth < 480) {
      this.view = [event.target.innerWidth / 1.35, 300];
    } else {
      {
        this.view = [450, 300];
      }
    }
  }

  checkYear(checked: boolean, yearStamp: string) {
    if (checked) {
      this.yearDataSourceHosts?.forEach((year) => {
        if (year.name !== yearStamp) {
          year.value = !checked;
        }
      });
    }
    this.multi = [];
    if (yearStamp === 'All year') {
      this.xAxisLabel = 'Năm';
      this.statisticsService
        .countHostsAndUsersByYears(yearStamp)
        .subscribe((res) => {
          if (res.data) {
            this.multi = res.data;
          }
        });
    } else {
      this.xAxisLabel = 'Tháng';
      this.statisticsService
        .countHostsAndUsersByMonthInAYear(yearStamp)
        .subscribe((res) => {
          if (res.data) {
            this.multi = res.data;
          }
        });
    }
  }

  toHostMange() {
    this.router.navigate(['dashboard/manage-hosts']);
  }
}

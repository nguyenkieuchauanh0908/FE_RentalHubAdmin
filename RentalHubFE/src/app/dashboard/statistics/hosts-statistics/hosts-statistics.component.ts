import { Component } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { yearDataSourceHosts, hostByStatusDataSource, multi } from '../data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hosts-statistics',
  templateUrl: './hosts-statistics.component.html',
  styleUrls: ['./hosts-statistics.component.scss'],
})
export class HostsStatisticsComponent {
  totalHosts!: number;
  single: any[] | undefined;
  multi: any[] | undefined;
  yearDataSourceHosts!: [{ name: string; value: boolean }];
  hostsByStatus: any[] | undefined;
  //bar chart
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Tháng';
  showYAxisLabel = true;
  yAxisLabel = 'Host mới';

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
    Object.assign(this, { multi });
    this.view = [450, 300];
    this.yearDataSourceHosts[this.yearDataSourceHosts.length - 1].value = true;
    //Lấy số lượng hosts
    this.statisticsService.countAllHosts().subscribe((res) => {
      if (res.data) {
        this.totalHosts = res.data;
      }
    });

    this.statisticsService.countPostsByMonth('2024').subscribe((res) => {
      if (res.data) {
        this.single = res.data;
      }
    });
    //Đếm số lượng posts theo status (Active and Inactive)
    this.statisticsService.countHostsByStatus().subscribe((res) => {
      if (res.data) {
        this.hostsByStatus = res.data;
      }
    });
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
      this.statisticsService.countHostsByYear(yearStamp).subscribe((res) => {
        if (res.data) {
          this.multi = res.data;
        }
      });
    } else {
      this.statisticsService.countHostsByMonth(yearStamp).subscribe((res) => {
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

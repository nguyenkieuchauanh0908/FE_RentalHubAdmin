import { Component } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { multi, yearsDataSourceEmployees } from '../data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees-statistics',
  templateUrl: './employees-statistics.component.html',
  styleUrls: ['./employees-statistics.component.scss'],
})
export class EmployeesStatisticsComponent {
  totalEmployees!: number;
  single: any[] | undefined;
  multi: any[] | undefined;
  yearsDataSourceEmployees!: [{ name: string; value: boolean }];
  employeesByStatus: any[] | undefined;
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

  onSelectPie(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  constructor(
    private statisticsService: StatisticsService,
    private router: Router
  ) {
    Object.assign(this, { yearsDataSourceEmployees });
    Object.assign(this, { multi });
    this.view = [450, 300];
    this.yearsDataSourceEmployees[
      this.yearsDataSourceEmployees.length - 1
    ].value = true;
    //Lấy số lượng employees
    this.statisticsService.countAllEmployees().subscribe((res) => {
      if (res.data) {
        this.totalEmployees = res.data;
      }
    });

    this.statisticsService.countPostsByMonth('2024').subscribe((res) => {
      if (res.data) {
        this.single = res.data;
      }
    });
    //Đếm số lượng employees theo status (Active and Inactive)
    this.statisticsService.countEmployeessByStatus().subscribe((res) => {
      if (res.data) {
        this.employeesByStatus = res.data;
      }
    });
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
      this.yearsDataSourceEmployees?.forEach((year) => {
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

  toEmployeesManage() {
    this.router.navigate(['dashboard/manage-employees']);
  }
}

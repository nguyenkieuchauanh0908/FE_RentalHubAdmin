import { Component } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { yearsDataSourcePosts } from '../data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts-statistics',
  templateUrl: './posts-statistics.component.html',
  styleUrls: ['./posts-statistics.component.scss'],
})
export class PostsStatisticsComponent {
  totalPosts: number = 0;
  single: any[] | undefined;
  yearsDataSourcePosts!: [{ name: string; value: boolean }];
  yearsDataSourceEmployees!: [{ name: string; value: boolean }];
  postByStatusDataSource: any[] | undefined;
  //bar chart
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Tháng';
  showYAxisLabel = true;
  yAxisLabel = 'Bài viết mới';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  view: [number, number] = [450, 300];

  //Pie chart
  // options
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

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
    Object.assign(this, { yearsDataSourcePosts });
    this.view = [450, 300];
    this.yearsDataSourcePosts[this.yearsDataSourcePosts.length - 1].value =
      true;
    this.statisticsService.countAllPosts().subscribe((res) => {
      if (res.data) {
        this.totalPosts = res.data;
      }
    });
    this.statisticsService.countPostsByMonth('2024').subscribe((res) => {
      if (res.data) {
        this.single = res.data;
      }
    });
    this.statisticsService.countPostsByStatus().subscribe((res) => {
      if (res.data) {
        this.postByStatusDataSource = res.data;
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
      this.yearsDataSourcePosts?.forEach((year) => {
        if (year.name !== yearStamp) {
          year.value = !checked;
        }
      });
    }
    this.single = [];

    if (yearStamp === 'All year') {
      this.xAxisLabel = 'Năm';
      this.statisticsService.countPostsByYear(yearStamp).subscribe((res) => {
        if (res.data) {
          this.single = res.data;
        }
      });
    } else {
      this.xAxisLabel = 'Tháng';
      this.statisticsService.countPostsByMonth(yearStamp).subscribe((res) => {
        if (res.data) {
          this.single = res.data;
        }
      });
    }
  }
  toPostManage() {
    this.router.navigate(['dashboard/manage-posts']);
  }
}

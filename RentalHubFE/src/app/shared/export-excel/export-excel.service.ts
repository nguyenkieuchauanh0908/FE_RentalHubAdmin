import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { resDataDTO } from '../resDataDTO';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';
import { handleError } from '../handle-errors';
import { Utils } from '../utils';
export interface ROW_USERS {
  _id: '6576871b6d733a70bbc3170b';
  _email: String;
  _fname: String;
  _lname: String;
  _phone: String;
  _address: String;
  _avatar: String;
  _active: Boolean;
  _isHost: Boolean;
  _role: Number;
  _loginType: String;
}

export interface ROW_INSPECTOR {
  _id: String;
  _email: String;
  _fname: String;
  _lname: String;
  _phone: String;
  _address: String;
  _avatar: String;
  _active: Boolean;
  _isHost: Boolean;
  _role: Number;
  _loginType: String;
}

export interface ROW_HOST {
  _id: String;
  _fname: String;
  _lname: String;
  _email: String;
  _isHost: Boolean;
  _phone: String;
  _addressRental: [String];
  _totalReported: Number;
  _loginType: String;
}

@Injectable({
  providedIn: 'root',
})
export class ExportExcelService {
  constructor(private http: HttpClient) {}

  getInspectorData() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/get-inspector-data')
      .pipe(catchError(handleError));
  }

  getUsersData() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/get-user-data')
      .pipe(catchError(handleError));
  }

  getHostData() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/get-host-data')
      .pipe(catchError(handleError));
  }

  exportExcel(excelData: {
    title: any;
    data: any;
    headers: any;
    sheetTitle: any;
    footerRow: any;
  }) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    let columns = header.length;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(excelData.sheetTitle);

    //Add Row and formatting
    let utils = new Utils();
    let last1 = utils.findCharAfterNColumn('A', columns - 2);
    let start2 = utils.findCharAfterNColumn(last1, 1);
    let last2 = utils.findCharAfterNColumn(start2, columns - (columns - 2));
    console.log(last1, start2, last2);
    worksheet.mergeCells(`'A1': ${last1}2`);
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Date
    worksheet.mergeCells(`${start2}1: ${last2}2`);
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell(`${start2}1`);
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Adding Data
    data.forEach((d: any) => {
      worksheet.addRow(Object.values(d));
    });

    //Footer Row
    let footerRow = worksheet.addRow([excelData.footerRow + ' ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' },
    };

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:${last2}${footerRow.number}`);

    //Autosize
    worksheet.columns.forEach((column) => {
      const lengths = column.values!.map((v) => v!.toString().length);
      const maxLength = Math.max(
        ...lengths.filter((v) => typeof v === 'number')
      );
      if (maxLength < 16) {
        column.width = maxLength;
      } else column.width = 16;
    });

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}

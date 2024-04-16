export interface AddressReqModel {
  _id: string;
  _uId: string;
  _address: string;
  _totalRoom: number;
  _imgLicense: [string];
  _status: number;
  _active: boolean;
  _inspectorId: string;
  _reason: string | null;
}

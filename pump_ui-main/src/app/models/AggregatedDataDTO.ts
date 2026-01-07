export interface AggregatedDataDTO {
  expensesList: any[]; // or a proper typed array if you know the structure
  date: string;
  petrolTotalSum: number;
  petrolTotalTesting: number;
  petrolLtr: number;
  petrolRate: number;
  petrolTotalTotalSell: number;
  dieselTotalSum: number;
  dieselTotalTesting: number;
  dieselLtr: number;
  dieselRate: number;
  dieselTotalTotalSell: number;
  oilTotalPrice: number;
  kharchTotal: number;
  petrolQuantity: number;
  petrolTotal: number;
  petrolVat: number;
  petrolCess: number;
  petrolJtcpercentage: number;
  petrolTotalPurchase: number;
  dieselQuantity: number;
  dieselTotal: number;
  dieselVat: number;
  dieselCess: number;
  dieselJtcpercentage: number;
  dieselTotalPurchase: number;
  oilQuantity: number;
  oilTotal: number;
  oilVat: number;
  oilCess: number;
  oilJtcpercentage: number;
  oilTotalPurchase: number;
  amountTotal: number;
  jamaTotal: number;
  bakiTotal: number;
  xppetrolLtr: number;
  xppetrolTotalSum: number;
  xppetrolTotalTesting: number;
  xppetrolTotalSell: number;

  powerdieselLtr: number;
  powerdieselTotalSum: number;
  powerdieselTotalTesting: number;
  powerdieselTotalSell: number;

  // ✅ New XP Petrol purchase fields
  xppetrolQuantity: number;
  xppetrolTotal: number;
  xppetrolVat: number;
  xppetrolCess: number;
  xppetrolJtcpercentage: number;
  xppetrolTotalPurchase: number;

  // ✅ New Power Diesel purchase fields
  powerdieselQuantity: number;
  powerdieselTotal: number;
  powerdieselVat: number;
  powerdieselCess: number;
  powerdieselJtcpercentage: number;
  powerdieselTotalPurchase: number;


  petrolgatt: number;
  dieselgatt: number;
  xppetrolgatt: number;
  power_dieselgatt: number;

  locl_balance_Total: number;
}
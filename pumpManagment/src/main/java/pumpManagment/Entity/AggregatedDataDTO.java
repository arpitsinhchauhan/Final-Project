package pumpManagment.Entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Dell
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AggregatedDataDTO {

    private String date;
    private Double petrolTotalCloseMeter;
    private Double petrolTotalOpenMeter;
    private Double petrolTotalSum;
    private Double petrolTotalTesting;
    private Double petrolLtr;
    private Double petrolRate;
    private Double petrolTotalTotalSell;
    private Double dieselTotalCloseMeter;
    private Double dieselTotalOpenMeter;
    private Double dieselTotalSum;
    private Double dieselTotalTesting;
    private Double dieselLtr;
    private Double dieselRate;
    private Double dieselTotalTotalSell;
    private Double oilTotalPrice;
    private Double kharchTotal;
    private String pType;
    private Double petrolQuantity;
    private Double petrolTotal;
    private Double petrolVat;
    private Double petrolCess;
    private Double petrolJtcpercentage;
    private Double petrolTotalPurchase;
    private String dType;
    private Double dieselQuantity;
    private Double dieselTotal;
    private Double dieselVat;
    private Double dieselCess;
    private Double dieselJtcpercentage;
    private Double dieselTotalPurchase;
    private Double amountTotal;
    private Double jamaTotal;
    private Double bakiTotal;
    private String user_id;

    private Double xppetrolCloseMeter;
    private Double xppetrolOpenMeter;
    private Double xppetrolLtr;
    private Double xppetrolTotalSum;
    private Double xppetrolRate;
    private Double xppetrolTotalTesting;
    private Double xppetrolTotalSell;

    private Double powerdieselCloseMeter;
    private Double powerdieselOpenMeter;
    private Double powerdieselLtr;
    private Double powerdieselTotalSum;
    private Double powerdieselRate;
    private Double powerdieselTotalTesting;
    private Double powerdieselTotalSell;

    // For XP Petrol Purchases
    private Double xppetrolQuantity;
    private Double xppetrolTotal;
    private Double xppetrolVat;
    private Double xppetrolCess;
    private Double xppetrolJtcpercentage;
    private Double xppetrolTotalPurchase;

    // For Power Diesel Purchases
    private Double powerdieselQuantity;
    private Double powerdieselTotal;
    private Double powerdieselVat;
    private Double powerdieselCess;
    private Double powerdieselJtcpercentage;
    private Double powerdieselTotalPurchase;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Double getPetrolTotalCloseMeter() {
        return petrolTotalCloseMeter;
    }

    public void setPetrolTotalCloseMeter(Double petrolTotalCloseMeter) {
        this.petrolTotalCloseMeter = petrolTotalCloseMeter;
    }

    public Double getPetrolTotalOpenMeter() {
        return petrolTotalOpenMeter;
    }

    public void setPetrolTotalOpenMeter(Double petrolTotalOpenMeter) {
        this.petrolTotalOpenMeter = petrolTotalOpenMeter;
    }

    public Double getPetrolTotalSum() {
        return petrolTotalSum;
    }

    public void setPetrolTotalSum(Double petrolTotalSum) {
        this.petrolTotalSum = petrolTotalSum;
    }

    public Double getPetrolTotalTesting() {
        return petrolTotalTesting;
    }

    public void setPetrolTotalTesting(Double petrolTotalTesting) {
        this.petrolTotalTesting = petrolTotalTesting;
    }

    public Double getPetrolLtr() {
        return petrolLtr;
    }

    public void setPetrolLtr(Double petrolLtr) {
        this.petrolLtr = petrolLtr;
    }

    public Double getPetrolRate() {
        return petrolRate;
    }

    public void setPetrolRate(Double petrolRate) {
        this.petrolRate = petrolRate;
    }

    public Double getPetrolTotalTotalSell() {
        return petrolTotalTotalSell;
    }

    public void setPetrolTotalTotalSell(Double petrolTotalTotalSell) {
        this.petrolTotalTotalSell = petrolTotalTotalSell;
    }

    public Double getDieselTotalCloseMeter() {
        return dieselTotalCloseMeter;
    }

    public void setDieselTotalCloseMeter(Double dieselTotalCloseMeter) {
        this.dieselTotalCloseMeter = dieselTotalCloseMeter;
    }

    public Double getDieselTotalOpenMeter() {
        return dieselTotalOpenMeter;
    }

    public void setDieselTotalOpenMeter(Double dieselTotalOpenMeter) {
        this.dieselTotalOpenMeter = dieselTotalOpenMeter;
    }

    public Double getDieselTotalSum() {
        return dieselTotalSum;
    }

    public void setDieselTotalSum(Double dieselTotalSum) {
        this.dieselTotalSum = dieselTotalSum;
    }

    public Double getDieselTotalTesting() {
        return dieselTotalTesting;
    }

    public void setDieselTotalTesting(Double dieselTotalTesting) {
        this.dieselTotalTesting = dieselTotalTesting;
    }

    public Double getDieselLtr() {
        return dieselLtr;
    }

    public void setDieselLtr(Double dieselLtr) {
        this.dieselLtr = dieselLtr;
    }

    public Double getDieselRate() {
        return dieselRate;
    }

    public void setDieselRate(Double dieselRate) {
        this.dieselRate = dieselRate;
    }

    public Double getDieselTotalTotalSell() {
        return dieselTotalTotalSell;
    }

    public void setDieselTotalTotalSell(Double dieselTotalTotalSell) {
        this.dieselTotalTotalSell = dieselTotalTotalSell;
    }

    public Double getOilTotalPrice() {
        return oilTotalPrice;
    }

    public void setOilTotalPrice(Double oilTotalPrice) {
        this.oilTotalPrice = oilTotalPrice;
    }

    public Double getKharchTotal() {
        return kharchTotal;
    }

    public void setKharchTotal(Double kharchTotal) {
        this.kharchTotal = kharchTotal;
    }

    public String getpType() {
        return pType;
    }

    public void setpType(String pType) {
        this.pType = pType;
    }

    public Double getPetrolQuantity() {
        return petrolQuantity;
    }

    public void setPetrolQuantity(Double petrolQuantity) {
        this.petrolQuantity = petrolQuantity;
    }

    public Double getPetrolTotal() {
        return petrolTotal;
    }

    public void setPetrolTotal(Double petrolTotal) {
        this.petrolTotal = petrolTotal;
    }

    public Double getPetrolVat() {
        return petrolVat;
    }

    public void setPetrolVat(Double petrolVat) {
        this.petrolVat = petrolVat;
    }

    public Double getPetrolCess() {
        return petrolCess;
    }

    public void setPetrolCess(Double petrolCess) {
        this.petrolCess = petrolCess;
    }

    public Double getPetrolJtcpercentage() {
        return petrolJtcpercentage;
    }

    public void setPetrolJtcpercentage(Double petrolJtcpercentage) {
        this.petrolJtcpercentage = petrolJtcpercentage;
    }

    public Double getPetrolTotalPurchase() {
        return petrolTotalPurchase;
    }

    public void setPetrolTotalPurchase(Double petrolTotalPurchase) {
        this.petrolTotalPurchase = petrolTotalPurchase;
    }

    public String getdType() {
        return dType;
    }

    public void setdType(String dType) {
        this.dType = dType;
    }

    public Double getDieselQuantity() {
        return dieselQuantity;
    }

    public void setDieselQuantity(Double dieselQuantity) {
        this.dieselQuantity = dieselQuantity;
    }

    public Double getDieselTotal() {
        return dieselTotal;
    }

    public void setDieselTotal(Double dieselTotal) {
        this.dieselTotal = dieselTotal;
    }

    public Double getDieselVat() {
        return dieselVat;
    }

    public void setDieselVat(Double dieselVat) {
        this.dieselVat = dieselVat;
    }

    public Double getDieselCess() {
        return dieselCess;
    }

    public void setDieselCess(Double dieselCess) {
        this.dieselCess = dieselCess;
    }

    public Double getDieselJtcpercentage() {
        return dieselJtcpercentage;
    }

    public void setDieselJtcpercentage(Double dieselJtcpercentage) {
        this.dieselJtcpercentage = dieselJtcpercentage;
    }

    public Double getDieselTotalPurchase() {
        return dieselTotalPurchase;
    }

    public void setDieselTotalPurchase(Double dieselTotalPurchase) {
        this.dieselTotalPurchase = dieselTotalPurchase;
    }

    public Double getAmountTotal() {
        return amountTotal;
    }

    public void setAmountTotal(Double amountTotal) {
        this.amountTotal = amountTotal;
    }

    public Double getJamaTotal() {
        return jamaTotal;
    }

    public void setJamaTotal(Double jamaTotal) {
        this.jamaTotal = jamaTotal;
    }

    public Double getBakiTotal() {
        return bakiTotal;
    }

    public void setBakiTotal(Double bakiTotal) {
        this.bakiTotal = bakiTotal;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public Double getXppetrolCloseMeter() {
        return xppetrolCloseMeter;
    }

    public void setXppetrolCloseMeter(Double xppetrolCloseMeter) {
        this.xppetrolCloseMeter = xppetrolCloseMeter;
    }

    public Double getXppetrolOpenMeter() {
        return xppetrolOpenMeter;
    }

    public void setXppetrolOpenMeter(Double xppetrolOpenMeter) {
        this.xppetrolOpenMeter = xppetrolOpenMeter;
    }

    public Double getXppetrolLtr() {
        return xppetrolLtr;
    }

    public void setXppetrolLtr(Double xppetrolLtr) {
        this.xppetrolLtr = xppetrolLtr;
    }

    public Double getXppetrolTotalSum() {
        return xppetrolTotalSum;
    }

    public void setXppetrolTotalSum(Double xppetrolTotalSum) {
        this.xppetrolTotalSum = xppetrolTotalSum;
    }

    public Double getXppetrolTotalTesting() {
        return xppetrolTotalTesting;
    }

    public void setXppetrolTotalTesting(Double xppetrolTotalTesting) {
        this.xppetrolTotalTesting = xppetrolTotalTesting;
    }

    public Double getXppetrolTotalSell() {
        return xppetrolTotalSell;
    }

    public void setXppetrolTotalSell(Double xppetrolTotalSell) {
        this.xppetrolTotalSell = xppetrolTotalSell;
    }

    public Double getPowerdieselCloseMeter() {
        return powerdieselCloseMeter;
    }

    public void setPowerdieselCloseMeter(Double powerdieselCloseMeter) {
        this.powerdieselCloseMeter = powerdieselCloseMeter;
    }

    public Double getPowerdieselOpenMeter() {
        return powerdieselOpenMeter;
    }

    public void setPowerdieselOpenMeter(Double powerdieselOpenMeter) {
        this.powerdieselOpenMeter = powerdieselOpenMeter;
    }

    public Double getPowerdieselLtr() {
        return powerdieselLtr;
    }

    public void setPowerdieselLtr(Double powerdieselLtr) {
        this.powerdieselLtr = powerdieselLtr;
    }

    public Double getPowerdieselTotalSum() {
        return powerdieselTotalSum;
    }

    public void setPowerdieselTotalSum(Double powerdieselTotalSum) {
        this.powerdieselTotalSum = powerdieselTotalSum;
    }

    public Double getPowerdieselTotalTesting() {
        return powerdieselTotalTesting;
    }

    public void setPowerdieselTotalTesting(Double powerdieselTotalTesting) {
        this.powerdieselTotalTesting = powerdieselTotalTesting;
    }

    public Double getPowerdieselTotalSell() {
        return powerdieselTotalSell;
    }

    public void setPowerdieselTotalSell(Double powerdieselTotalSell) {
        this.powerdieselTotalSell = powerdieselTotalSell;
    }

    public Double getXppetrolQuantity() {
        return xppetrolQuantity;
    }

    public void setXppetrolQuantity(Double xppetrolQuantity) {
        this.xppetrolQuantity = xppetrolQuantity;
    }

    public Double getXppetrolTotal() {
        return xppetrolTotal;
    }

    public void setXppetrolTotal(Double xppetrolTotal) {
        this.xppetrolTotal = xppetrolTotal;
    }

    public Double getXppetrolVat() {
        return xppetrolVat;
    }

    public void setXppetrolVat(Double xppetrolVat) {
        this.xppetrolVat = xppetrolVat;
    }

    public Double getXppetrolCess() {
        return xppetrolCess;
    }

    public void setXppetrolCess(Double xppetrolCess) {
        this.xppetrolCess = xppetrolCess;
    }

    public Double getXppetrolJtcpercentage() {
        return xppetrolJtcpercentage;
    }

    public void setXppetrolJtcpercentage(Double xppetrolJtcpercentage) {
        this.xppetrolJtcpercentage = xppetrolJtcpercentage;
    }

    public Double getXppetrolTotalPurchase() {
        return xppetrolTotalPurchase;
    }

    public void setXppetrolTotalPurchase(Double xppetrolTotalPurchase) {
        this.xppetrolTotalPurchase = xppetrolTotalPurchase;
    }

    public Double getPowerdieselQuantity() {
        return powerdieselQuantity;
    }

    public void setPowerdieselQuantity(Double powerdieselQuantity) {
        this.powerdieselQuantity = powerdieselQuantity;
    }

    public Double getPowerdieselTotal() {
        return powerdieselTotal;
    }

    public void setPowerdieselTotal(Double powerdieselTotal) {
        this.powerdieselTotal = powerdieselTotal;
    }

    public Double getPowerdieselVat() {
        return powerdieselVat;
    }

    public void setPowerdieselVat(Double powerdieselVat) {
        this.powerdieselVat = powerdieselVat;
    }

    public Double getPowerdieselCess() {
        return powerdieselCess;
    }

    public void setPowerdieselCess(Double powerdieselCess) {
        this.powerdieselCess = powerdieselCess;
    }

    public Double getPowerdieselJtcpercentage() {
        return powerdieselJtcpercentage;
    }

    public void setPowerdieselJtcpercentage(Double powerdieselJtcpercentage) {
        this.powerdieselJtcpercentage = powerdieselJtcpercentage;
    }

    public Double getPowerdieselTotalPurchase() {
        return powerdieselTotalPurchase;
    }

    public void setPowerdieselTotalPurchase(Double powerdieselTotalPurchase) {
        this.powerdieselTotalPurchase = powerdieselTotalPurchase;
    }

    public Double getXppetrolRate() {
        return xppetrolRate;
    }

    public void setXppetrolRate(Double xppetrolRate) {
        this.xppetrolRate = xppetrolRate;
    }

    public Double getPowerdieselRate() {
        return powerdieselRate;
    }

    public void setPowerdieselRate(Double powerdieselRate) {
        this.powerdieselRate = powerdieselRate;
    }
    
    
}

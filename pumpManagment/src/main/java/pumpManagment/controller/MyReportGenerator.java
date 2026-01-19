/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.controller;

import com.lowagie.text.DocumentException;

import java.text.DecimalFormat;
import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pumpManagment.repository.*;
import pumpManagment.service.ProfitLossService;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import java.text.Normalizer;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

/**
 *
 * @author Dell
 */
@Service
public class MyReportGenerator implements ProfitLossService {

    @Autowired
    private DailyskockRepository dailyskockRepository;

    @Autowired
    private DailydieselstockRepository dailydieselstockRepository;

    @Autowired
    private XpdailystockRepository xpdailystockRepository;

    @Autowired
    private PowerdieseldailystockRepository powerdieseldailystockRepository;

    @Autowired
    private PetrolSellRepository petrolSellRepository;

    @Autowired
    private DieselSellRepository dieselSellRepository;

    @Autowired
    private XpPetorlRepository xpPetorlRepository;

    @Autowired
    private powerDieselRepository powerDieselRepository;

    @Autowired
    private kharchrepository kharchrepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private extraPurchaseRepository extraPurchaseRepository;

<<<<<<< HEAD
    @Autowired
    private loclcreditRepository loclcreditRepository;

    @Autowired
    private OilPurchaseRepository oilPurchaseRepository;

    @Autowired
    private OilSellRepository oilSellRepository;

=======
>>>>>>> 2e766fa9188d69cd54c10734dce72d7635fe35a5
    public ResponseEntity<byte[]> generatePdf(String userId, String startDate, String endDate) throws ParseException {
        try {
            double totalPetrolOpenAmount = 0;
            double totalDieselOpenAmount = 0;
            double totalPetrolAmount = 0;
            double totalDieselAmount = 0;

            DecimalFormat df = new DecimalFormat("#,###");

            // ---------- NULL SAFE FETCH ----------
            double petrolStock = Optional.ofNullable(
                    dailyskockRepository.getTotalOpenstockBetweenDates(startDate, endDate, userId)
            ).orElse(0.0);

            double dieselStock = Optional.ofNullable(
                    dailydieselstockRepository.getTotalDieselOpenstockBetweenDates(startDate, endDate, userId)
            ).orElse(0.0);

            double petrolPurchase = Optional.ofNullable(
                    purchaseRepository.findPetrolTotalPurchase(startDate, endDate, userId)
            ).orElse(0.0);

            double dieselPurchase = Optional.ofNullable(
                    purchaseRepository.findDieselTotalPurchase(startDate, endDate, userId)
            ).orElse(0.0);

            double petrolSale = Optional.ofNullable(
                    petrolSellRepository.getTotalPetrolSellBetweenDates(startDate, endDate, userId)
            ).orElse(0.0);

            double dieselSale = Optional.ofNullable(
                    dieselSellRepository.getTotalDieselSellBetweenDates(startDate, endDate, userId)
            ).orElse(0.0);

            double petrolFirstRate = petrolSellRepository
                    .findfirstRateByDateRangeAndUser(startDate, endDate, userId)
                    .orElse(0.0);

            double dieselFirstRate = dieselSellRepository
                    .findfirstRateByDateRangeAndUser(startDate, endDate, userId)
                    .orElse(0.0);

            double petrolLastRate = petrolSellRepository
                    .findLastRateByDateRangeAndUser(startDate, endDate, userId)
                    .orElse(0.0);

            double dieselLastRate = dieselSellRepository
                    .findLastRateByDateRangeAndUser(startDate, endDate, userId)
                    .orElse(0.0);

            double petrolOneDayAgoStock = Optional.ofNullable(
                    dailyskockRepository.findLatestOpenstockInRange(startDate, endDate, userId)
            ).orElse(0.0);

            double dieselOneDayAgoStock = Optional.ofNullable(
                    dailydieselstockRepository.findLatestDieselOpenstockInRange(startDate, endDate, userId)
            ).orElse(0.0);


            double oilPurchase = Optional.ofNullable(
                    oilPurchaseRepository.findOilTotalPurchase(startDate, endDate, userId)
            ).orElse(0.0);

            double oilSell = Optional.ofNullable(
                    oilSellRepository.getTotalOilSellBetweenDates(startDate, endDate, userId)
            ).orElse(0.0);


            // ---------- CALCULATIONS ----------
            totalPetrolAmount = petrolOneDayAgoStock * petrolLastRate;
            totalDieselAmount = dieselOneDayAgoStock * dieselLastRate;

            totalPetrolOpenAmount = petrolStock * petrolFirstRate;
            totalDieselOpenAmount = dieselStock * dieselFirstRate;

            double totalStockAndPurchase =
                    totalPetrolOpenAmount + petrolPurchase + dieselPurchase + totalDieselOpenAmount;

            double totalCloseAndSale =
                    petrolSale + totalPetrolAmount + dieselSale + totalDieselAmount;

            double grossProfit = totalCloseAndSale - totalStockAndPurchase;

            // ---------- EXPENSE ----------
            List<Object[]> kharchList = kharchrepository.getExpenseDetails(startDate, endDate, userId);
            double totalPrice = 0.0;

            for (Object[] row : kharchList) {
                Number price = (Number) row[1];
                if (price != null) {
                    totalPrice += price.doubleValue();
                }
            }

            double totalRs = grossProfit - totalPrice;

            // ---------- THYMELEAF ----------
            Context ctx = new Context();
            ctx.setVariable("petrolStock", df.format(totalPetrolOpenAmount));
            ctx.setVariable("dieselstock", df.format(totalDieselOpenAmount));
            ctx.setVariable("petrolPurchase", df.format(petrolPurchase));
            ctx.setVariable("dieselPurchase", df.format(dieselPurchase));
            ctx.setVariable("totalStockAndPurchase", df.format(totalStockAndPurchase));

            ctx.setVariable("petrolSale", df.format(petrolSale));
            ctx.setVariable("dieselSale", df.format(dieselSale));
            ctx.setVariable("closePetrolMeter", df.format(totalPetrolAmount));
            ctx.setVariable("closedieselMeter", df.format(totalDieselAmount));
            ctx.setVariable("totalCloseAndSale", df.format(totalCloseAndSale));

            ctx.setVariable("grossProfit", df.format(grossProfit));
            ctx.setVariable("kharchList", kharchList);
            ctx.setVariable("totalRs", df.format(totalRs));
<<<<<<< HEAD
            ctx.setVariable("creditBalance", df.format(creditBalance));
            ctx.setVariable("oilPurchase", df.format(oilPurchase));
            ctx.setVariable("oilSell", df.format(oilSell));
=======
>>>>>>> 2e766fa9188d69cd54c10734dce72d7635fe35a5

            // ---------- PDF ----------
            ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
            resolver.setPrefix("templates/");
            resolver.setSuffix(".html");
            resolver.setTemplateMode(TemplateMode.HTML);
            resolver.setCharacterEncoding("UTF-8");

            TemplateEngine templateEngine = new TemplateEngine();
            templateEngine.setTemplateResolver(resolver);
            String html = templateEngine.process("ItReturn", ctx);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(outputStream);

            byte[] pdfBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.add("Content-Disposition", "attachment; filename=Profit&Loss.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception ex) {
            Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


//    @Override
//    public ResponseEntity<byte[]> generatePdf(String userId, String startDate, String endDate) throws ParseException {
//        try {
//            double totalPetrolOpenAmount = 0;
//            double totalDieselOpenAmount = 0;
//
//            double totalPetrolAmount = 0;
//            double totalDieselAmount = 0;
//            DecimalFormat df = new DecimalFormat("#,###");
//
//            Double petrolStock = dailyskockRepository.getTotalOpenstockBetweenDates(startDate, endDate, userId);
//            Double dieselstock=dailydieselstockRepository.getTotalDieselOpenstockBetweenDates(startDate,endDate,userId);
//            Double petrolPurchase=purchaseRepository.findPetrolTotalPurchase(startDate,endDate,userId);
//            Double dieselPurchase=purchaseRepository.findDieselTotalPurchase(startDate,endDate,userId);
//            Optional<Double> petrolfirstRate=petrolSellRepository.findfirstRateByDateRangeAndUser(startDate,endDate,userId);
//            Optional<Double> dieselfirstRate=dieselSellRepository.findfirstRateByDateRangeAndUser(startDate,endDate,userId);
//
//            Double petrolSale = petrolSellRepository.getTotalPetrolSellBetweenDates(startDate, endDate, userId);
//            Double dieselSale = dieselSellRepository.getTotalDieselSellBetweenDates(startDate, endDate, userId);
//            Optional<Double> petrolRate=petrolSellRepository.findLastRateByDateRangeAndUser(startDate,endDate,userId);
//            Optional<Double> dieselRate=dieselSellRepository.findLastRateByDateRangeAndUser(startDate,endDate,userId);
//            Double petrolOneDayAgoStcok=dailyskockRepository.findLatestOpenstockInRange(startDate,endDate,userId);
//            Double dieselOneDayAgoStcok=dailydieselstockRepository.findLatestDieselOpenstockInRange(startDate,endDate,userId);
//
//            List<Object[]> kharchList = kharchrepository.getExpenseDetails(startDate, endDate, userId);
//
//
//            if (petrolRate.isPresent() && petrolOneDayAgoStcok != null) {
//                totalPetrolAmount = petrolOneDayAgoStcok * petrolRate.get();
//            }
//
//            if (dieselRate.isPresent() && dieselOneDayAgoStcok != null) {
//                totalDieselAmount = dieselOneDayAgoStcok * dieselRate.get();
//            }
//
//            if (petrolfirstRate.isPresent() && petrolStock != null) {
//                totalPetrolOpenAmount = petrolStock * petrolfirstRate.get();
//            }
//
//            if (dieselfirstRate.isPresent() && dieselstock != null) {
//                totalDieselOpenAmount = dieselstock * dieselfirstRate.get();
//            }
//
//            Double totalStockAndPurchase = totalPetrolOpenAmount + petrolPurchase + dieselPurchase + totalDieselOpenAmount;
//            Double totalCloseAndSale = petrolSale + totalPetrolAmount + dieselSale + totalDieselAmount;
//            Double grossProfit=totalCloseAndSale-totalStockAndPurchase;
//
//            Double totalPrice = 0.0;
//
//            for (Object[] row : kharchList) {
//                // assuming price is at index 1
//                Number price = (Number) row[1];
//                if (price != null) {
//                    totalPrice += price.doubleValue();
//                }
//            }
//
//            System.out.println("Total Price: " + totalPrice);
//
//            Double totalRs=grossProfit-totalPrice;
//
//            final Context ctx = new Context();
//            ctx.setVariable("petrolStock",df.format(totalPetrolOpenAmount));
//            ctx.setVariable("dieselstock", df.format(totalDieselOpenAmount));
//            ctx.setVariable("petrolPurchase", petrolPurchase);
//            ctx.setVariable("dieselPurchase", dieselPurchase);
//            ctx.setVariable("totalStockAndPurchase",  df.format(totalStockAndPurchase));
//
//            ctx.setVariable("petrolSale", df.format(petrolSale));
//            ctx.setVariable("dieselSale", df.format(dieselSale));
//            ctx.setVariable("closePetrolMeter", df.format(totalPetrolAmount));
//            ctx.setVariable("closedieselMeter",df.format( totalDieselAmount));
//            ctx.setVariable("totalCloseAndSale",  df.format(totalCloseAndSale));
//
//            ctx.setVariable("grossProfit",  df.format(grossProfit));
//
//            ctx.setVariable("kharchList", kharchList);
//
//            ctx.setVariable("totalRs",  df.format(totalRs));
//
//
//            ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
//            resolver.setPrefix("templates/");
//            resolver.setSuffix(".html");
//            resolver.setTemplateMode(TemplateMode.HTML);
//            resolver.setCharacterEncoding("UTF-8");
//
//            // 3. Process template
//            TemplateEngine templateEngine = new TemplateEngine();
//            templateEngine.setTemplateResolver(resolver);
//            String html = templateEngine.process( "ItReturn", ctx);
//
//            // 4. Generate PDF
//            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//            ITextRenderer renderer = new ITextRenderer();
//            renderer.setDocumentFromString(html);
//            renderer.layout();
//
//            renderer.createPDF(outputStream);
//
//            byte[] pdfBytes = outputStream.toByteArray();
//
//            String desktopPath = System.getProperty("user.home") + "/Desktop/Personal/";
//            String fileName = "Profit&Loss"+startDate +"to"+endDate+".pdf";
//            Path outputPath = Paths.get(desktopPath + fileName);
//
//            Files.createDirectories(outputPath.getParent());
//
//                // Write PDF file
//                Files.write(outputPath, pdfBytes);
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.add("Content-Disposition", "attachment; filename=Profit&Loss.pdf");
//            System.out.println("PDF saved to: " + outputPath.toAbsolutePath());
//            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
//        } catch (IOException ex) {
//            Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
//        } catch (DocumentException ex) {
//            Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
//        }
//        return null;
//    }

    @Override
    public ResponseEntity<byte[]> extrageneratePdf(String userId, String startDate, String endDate) throws ParseException {
            try {

                double totalOpenPetrolAmount = 0;
                double totalOpenDieselAmount = 0;
                double totalOpenXpPetrolAmount = 0;
                double totalOpenPowerDieselAmount = 0;

                double totalPetrolAmount = 0;
                double totalDieselAmount = 0;
                double totalXpPetrolAmount = 0;
                double totalPowerDieselAmount = 0;
                DecimalFormat df = new DecimalFormat("#,###");

                Double petrolStock = dailyskockRepository.getTotalOpenstockBetweenDates(startDate, endDate, userId);
                Double dieselstock = dailydieselstockRepository.getTotalDieselOpenstockBetweenDates(startDate, endDate, userId);
                Double petrolPurchase = purchaseRepository.findPetrolTotalPurchase(startDate, endDate, userId);
                Double dieselPurchase = purchaseRepository.findDieselTotalPurchase(startDate, endDate, userId);
                Double xpPetrolStock = xpdailystockRepository.getTotalOpenstockBetweenDates(startDate, endDate, userId);
                Double powerDieselstock = powerdieseldailystockRepository.getTotalOpenstockBetweenDates(startDate, endDate, userId);

                Optional<Double> petrolOpenRate = petrolSellRepository.findfirstRateByDateRangeAndUser(startDate, endDate, userId);
                Optional<Double> dieselOpenRate = dieselSellRepository.findfirstRateByDateRangeAndUser(startDate, endDate, userId);
                Optional<Double> xpPetrolOpenRate = xpPetorlRepository.findfirstRateByDateRangeAndUser(startDate, endDate, userId);
                Optional<Double> powerDieselOpenRate = powerDieselRepository.findfirstRateByDateRangeAndUser(startDate, endDate, userId);

                Double xpPetrolPurchase = extraPurchaseRepository.findXpPetrolTotalPurchase(startDate, endDate, userId);
                Double powerDieselPurchase = extraPurchaseRepository.findPowerDieselTotalPurchase(startDate, endDate, userId);

                Double petrolSale = petrolSellRepository.getTotalPetrolSellBetweenDates(startDate, endDate, userId);
                Double dieselSale = dieselSellRepository.getTotalDieselSellBetweenDates(startDate, endDate, userId);
                Double xpPetrolSale = xpPetorlRepository.getTotalXpPetrolSellBetweenDates(startDate, endDate, userId);
                Double powerDieselSale = powerDieselRepository.getTotalDieselSellBetweenDates(startDate, endDate, userId);

                Optional<Double> petrolRate = petrolSellRepository.findLastRateByDateRangeAndUser(startDate, endDate, userId);
                Optional<Double> dieselRate = dieselSellRepository.findLastRateByDateRangeAndUser(startDate, endDate, userId);
                Double petrolOneDayAgoStcok = dailyskockRepository.findLatestOpenstockInRange(startDate, endDate, userId);
                Double dieselOneDayAgoStcok = dailydieselstockRepository.findLatestDieselOpenstockInRange(startDate, endDate, userId);

                Optional<Double> xpPetrolRate = xpPetorlRepository.findLastRateByDateRangeAndUser(startDate, endDate, userId);
                Optional<Double> powerDieselRate = powerDieselRepository.findLastRateByDateRangeAndUser(startDate, endDate, userId);
                Double xpPetrolOneDayAgoStcok = xpdailystockRepository.findLatestXpUgadtoStockInRange(startDate, endDate, userId);
                Double powerDieselOneDayAgoStcok = powerdieseldailystockRepository.findLatestPowerDieselDailyStockInRange(startDate, endDate, userId);

                List<Object[]> kharchList = kharchrepository.getExpenseDetails(startDate, endDate, userId);
                double oilPurchase = Optional.ofNullable(
                        oilPurchaseRepository.findOilTotalPurchase(startDate, endDate, userId)
                ).orElse(0.0);
                double oilSell = Optional.ofNullable(
                        oilSellRepository.getTotalOilSellBetweenDates(startDate, endDate, userId)
                ).orElse(0.0);

                if (petrolRate.isPresent() && petrolOneDayAgoStcok != null) {
                    totalPetrolAmount = petrolOneDayAgoStcok * petrolRate.get();
                }

                if (dieselRate.isPresent() && dieselOneDayAgoStcok != null) {
                    totalDieselAmount = dieselOneDayAgoStcok * dieselRate.get();
                }

                if (xpPetrolRate.isPresent() && xpPetrolOneDayAgoStcok != null) {
                    totalXpPetrolAmount = xpPetrolOneDayAgoStcok * xpPetrolRate.get();
                }

                if (powerDieselRate.isPresent() && powerDieselstock != null) {
                    totalPowerDieselAmount = powerDieselstock * powerDieselRate.get();
                }


                if (petrolOpenRate.isPresent() && petrolStock != null) {
                    totalOpenPetrolAmount = petrolStock * petrolOpenRate.get();
                }

                if (dieselOpenRate.isPresent() && dieselstock != null) {
                    totalOpenDieselAmount = dieselstock * dieselOpenRate.get();
                }

                if (xpPetrolOpenRate.isPresent() && xpPetrolStock != null) {
                    totalOpenXpPetrolAmount = xpPetrolStock * xpPetrolOpenRate.get();
                }

                if (powerDieselOpenRate.isPresent() && powerDieselOneDayAgoStcok != null) {
                    totalOpenPowerDieselAmount = powerDieselOneDayAgoStcok * powerDieselOpenRate.get();
                }

                Double totalStockAndPurchase = totalOpenPetrolAmount + petrolPurchase + dieselPurchase + totalOpenDieselAmount +totalOpenXpPetrolAmount + xpPetrolPurchase + powerDieselPurchase + totalOpenPowerDieselAmount;
                Double totalCloseAndSale = petrolSale + totalPetrolAmount + dieselSale + totalDieselAmount +
                        xpPetrolSale + totalXpPetrolAmount + powerDieselSale + totalPowerDieselAmount;
                Double grossProfit = totalCloseAndSale - totalStockAndPurchase;

                Double totalPrice = 0.0;

                for (Object[] row : kharchList) {
                    // assuming price is at index 1
                    Number price = (Number) row[1];
                    if (price != null) {
                        totalPrice += price.doubleValue();
                    }
                }

                System.out.println("Total Price: " + totalPrice);

                Double totalRs = grossProfit - totalPrice;

                final Context ctx = new Context();
                ctx.setVariable("petrolStock", df.format(totalOpenPetrolAmount));
                ctx.setVariable("dieselstock", df.format(totalOpenDieselAmount));
                ctx.setVariable("petrolPurchase", petrolPurchase);
                ctx.setVariable("dieselPurchase", dieselPurchase);
                ctx.setVariable("xpPetrolStock", totalOpenXpPetrolAmount);
                ctx.setVariable("powerDieselstock", df.format(totalOpenPowerDieselAmount));
                ctx.setVariable("xpPetrolPurchase", xpPetrolPurchase);
                ctx.setVariable("powerDieselPurchase", powerDieselPurchase);
                ctx.setVariable("totalStockAndPurchase", df.format(totalStockAndPurchase));

                ctx.setVariable("petrolSale", df.format(petrolSale));
                ctx.setVariable("dieselSale", df.format(dieselSale));
                ctx.setVariable("xpPetrolSale", df.format(xpPetrolSale));
                ctx.setVariable("powerDieselSale", powerDieselSale);
                ctx.setVariable("closePetrolMeter", df.format(totalPetrolAmount));
                ctx.setVariable("closedieselMeter", df.format(totalDieselAmount));
                ctx.setVariable("closeXpPetrolAmount", df.format(totalXpPetrolAmount));
                ctx.setVariable("closePowerDieselAmount", df.format(totalPowerDieselAmount));
                ctx.setVariable("totalCloseAndSale", df.format(totalCloseAndSale));
                ctx.setVariable("oilSell", df.format(oilSell));

                ctx.setVariable("grossProfit", df.format(grossProfit));

                ctx.setVariable("kharchList", kharchList);
<<<<<<< HEAD
                ctx.setVariable("creditBalance", df.format(creditBalance));
                ctx.setVariable("oilPurchase", df.format(oilPurchase));
=======

>>>>>>> 2e766fa9188d69cd54c10734dce72d7635fe35a5
                ctx.setVariable("totalRs", df.format(totalRs));

                ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
                resolver.setPrefix("templates/");
                resolver.setSuffix(".html");
                resolver.setTemplateMode(TemplateMode.HTML);
                resolver.setCharacterEncoding("UTF-8");

                // 3. Process template
                TemplateEngine templateEngine = new TemplateEngine();
                templateEngine.setTemplateResolver(resolver);
                String html = templateEngine.process("extraItReturn", ctx);

                // 4. Generate PDF
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ITextRenderer renderer = new ITextRenderer();
                renderer.setDocumentFromString(html);
                renderer.layout();

                renderer.createPDF(outputStream);

                byte[] pdfBytes = outputStream.toByteArray();

                String desktopPath = System.getProperty("user.home") + "/Desktop/Personal/";
                String fileName = "Extra_Profit&Loss" + startDate + "to" + endDate + ".pdf";
                Path outputPath = Paths.get(desktopPath + fileName);

                Files.createDirectories(outputPath.getParent());

                    // Write PDF file
                    Files.write(outputPath, pdfBytes);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.add("Content-Disposition", "attachment; filename=Extra_Profit&Loss.pdf");
                System.out.println("PDF saved to: " + outputPath.toAbsolutePath());
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            } catch (IOException ex) {
                Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
            } catch (DocumentException ex) {
                Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
            }
            return null;
        }
    }

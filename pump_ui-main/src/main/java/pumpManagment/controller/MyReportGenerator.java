/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.controller;

import java.util.List;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import pumpManagment.Entity.PetrolSell;

/**
 *
 * @author Dell
 */
public class MyReportGenerator {

    public static byte[] generateReport(List<PetrolSell> data) throws JRException {
        // Compile JRXML template.
        String templatePath = "D:/report1.jasper";
        JasperCompileManager.compileReportToFile(templatePath);

        // Populate JasperPrint with data.
        JasperPrint jasperPrint = JasperFillManager.fillReport(templatePath, null, new JRBeanCollectionDataSource(data));

        // Export to PDF.
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}

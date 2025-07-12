package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.PetrolSell;

@Repository
public interface PetrolSellRepository extends JpaRepository<PetrolSell, Integer> {

    List<PetrolSell> findByUserId(String userId);

    @Query(value = "SELECT p.date, SUM(p.close_meter) AS total_close_meter, SUM(p.open_meter) AS total_open_meter, "
            + "SUM(p.total) AS total_sum, SUM(p.testing) AS total_testing, SUM(p.petrol_ltr) AS petrol_ltr, "
            + "p.rate, SUM(p.total_sell) AS total_total_sell "
            + "FROM PetrolSell p "
            + "WHERE p.date BETWEEN :startDate AND :endDate "
            + "GROUP BY p.date", nativeQuery = true)
    List<Object[]> findPetrolSellSummaryBetweenDates(@Param("startDate") String startDate,
            @Param("endDate") String endDate);

    Optional<PetrolSell> findByDateAndPump(String date, String pump);

    @Query("SELECT SUM(ps.total_sell) FROM PetrolSell ps WHERE ps.date = CURRENT_DATE")
    List<Object[]> findTotalPetrolSellForToday();

//    @Query(value = "SELECT p.date, "
//            + "p.total_close_meter AS petrol_total_close_meter, "
//            + "p.total_open_meter AS petrol_total_open_meter, "
//            + "p.total_sum AS petrol_total_sum, "
//            + "p.total_testing AS petrol_total_testing, "
//            + "p.petrol_ltr, "
//            + "p.rate AS petrol_rate, "
//            + "p.total_total_sell AS petrol_total_total_sell, "
//            + "d.total_close_meter AS diesel_total_close_meter, "
//            + "d.total_open_meter AS diesel_total_open_meter, "
//            + "d.total_sum AS diesel_total_sum, "
//            + "d.total_testing AS diesel_total_testing, "
//            + "d.diesel_ltr, "
//            + "d.rate AS diesel_rate, "
//            + "d.total_total_sell AS diesel_total_total_sell, "
//            + "o.total_price AS oil_total_price, "
//            + "k.Kharch_Total AS Kharch_Total, "
//            + "pp.type AS PType, "
//            + "pp.petrol_quantity, "
//            + "pp.petrol_total, "
//            + "pp.petrol_vat, "
//            + "pp.petrol_cess, "
//            + "pp.petrol_jtcpercentage, "
//            + "pp.petrol_total_purchase, "
//            + "dp.type AS DType, "
//            + "dp.diesel_quantity, "
//            + "dp.diesel_total, "
//            + "dp.diesel_vat, "
//            + "dp.diesel_cess, "
//            + "dp.diesel_jtcpercentage, "
//            + "dp.diesel_total_purchase, "
//            + "t.Amount_Total "
//            + "FROM "
//            + "(SELECT p.date, SUM(p.close_meter) AS total_close_meter, "
//            + "SUM(p.open_meter) AS total_open_meter, "
//            + "SUM(p.total) AS total_sum, "
//            + "SUM(p.testing) AS total_testing, "
//            + "SUM(p.petrol_ltr) AS petrol_ltr, rate, "
//            + "SUM(p.total_sell) AS total_total_sell "
//            + "FROM PetrolSell p "
//            + "WHERE p.date BETWEEN :startDate AND :endDate "
//            + "GROUP BY p.date, p.rate) p "
//            + "JOIN (SELECT d.date, SUM(d.close_meter) AS total_close_meter, "
//            + "SUM(d.open_meter) AS total_open_meter, "
//            + "SUM(d.total) AS total_sum, "
//            + "SUM(d.testing) AS total_testing, "
//            + "SUM(d.diesel_ltr) AS diesel_ltr, rate, "
//            + "SUM(d.total_sell) AS total_total_sell "
//            + "FROM Dieselsell d "
//            + "WHERE d.date BETWEEN :startDate AND :endDate "
//            + "GROUP BY d.date, d.rate) d ON p.date = d.date "
//            + "JOIN (SELECT o.date, SUM(o.price) AS total_price "
//            + "FROM OilSell o "
//            + "WHERE o.date BETWEEN :startDate AND :endDate "
//            + "GROUP BY o.date) o ON p.date = o.date "
//            + "JOIN (SELECT k.date, SUM(k.price) AS Kharch_Total "
//            + "FROM kharch k "
//            + "WHERE k.date BETWEEN :startDate AND :endDate "
//            + "GROUP BY k.date) k ON p.date = k.date "
//            + "LEFT JOIN (SELECT pp.date, pp.type, pp.quantity AS petrol_quantity, "
//            + "pp.total AS petrol_total, pp.vat AS petrol_vat, "
//            + "pp.cess AS petrol_cess, pp.jtcpercentage AS petrol_jtcpercentage, "
//            + "pp.total_purchase AS petrol_total_purchase "
//            + "FROM Purchase pp WHERE pp.type = 'petrol') pp ON p.date = pp.date "
//            + "LEFT JOIN (SELECT t.date, SUM(t.amount) AS Amount_Total "
//            + "FROM transaction t WHERE t.date BETWEEN :startDate AND :endDate "
//            + "GROUP BY t.date) t ON p.date = t.date "
//            + "LEFT JOIN (SELECT dp.date, dp.type, dp.quantity AS diesel_quantity, "
//            + "dp.total AS diesel_total, dp.vat AS diesel_vat, "
//            + "dp.cess AS diesel_cess, dp.jtcpercentage AS diesel_jtcpercentage, "
//            + "dp.total_purchase AS diesel_total_purchase "
//            + "FROM Purchase dp WHERE dp.type = 'diesel') dp ON d.date = dp.date "
//            + "ORDER BY p.date", nativeQuery = true)
//    List<AggregatedDataDTO> findAggregatedData(
//            @Param("startDate") String startDate,
//            @Param("endDate") String endDate);
//    @Query("SELECT "
//            + "p.date AS date, "
//            + "p.total_close_meter AS petrolTotalCloseMeter, "
//            + "p.total_open_meter AS petrolTotalOpenMeter, "
//            + "p.total_sum AS petrolTotalSum, "
//            + "p.total_testing AS petrolTotalTesting, "
//            + "p.petrol_ltr AS petrolLtr, "
//            + "p.rate AS petrolRate, "
//            + "p.total_total_sell AS petrolTotalTotalSell, "
//            + "d.total_close_meter AS dieselTotalCloseMeter, "
//            + "d.total_open_meter AS dieselTotalOpenMeter, "
//            + "d.total_sum AS dieselTotalSum, "
//            + "d.total_testing AS dieselTotalTesting, "
//            + "d.diesel_ltr AS dieselLtr, "
//            + "d.rate AS dieselRate, "
//            + "d.total_total_sell AS dieselTotalTotalSell, "
//            + "o.total_price AS oilTotalPrice, "
//            + "k.Kharch_Total AS kharchTotal, "
//            + "pp.type AS PType, "
//            + "pp.petrol_quantity AS petrolQuantity, "
//            + "pp.petrol_total AS petrolTotal, "
//            + "pp.petrol_vat AS petrolVat, "
//            + "pp.petrol_cess AS petrolCess, "
//            + "pp.petrol_jtcpercentage AS petrolJtcpercentage, "
//            + "pp.petrol_total_purchase AS petrolTotalPurchase, "
//            + "dp.type AS DType, "
//            + "dp.diesel_quantity AS dieselQuantity, "
//            + "dp.diesel_total AS dieselTotal, "
//            + "dp.diesel_vat AS dieselVat, "
//            + "dp.diesel_cess AS dieselCess, "
//            + "dp.diesel_jtcpercentage AS dieselJtcpercentage, "
//            + "dp.diesel_total_purchase AS dieselTotalPurchase, "
//            + "t.Amount_Total AS amountTotal "
//            + "FROM "
//            + "(SELECT date, SUM(close_meter) AS total_close_meter, SUM(open_meter) AS total_open_meter, "
//            + "SUM(total) AS total_sum, SUM(testing) AS total_testing, SUM(petrol_ltr) AS petrol_ltr, rate, "
//            + "SUM(total_sell) AS total_total_sell "
//            + "FROM Petrolsell "
//            + "WHERE date BETWEEN :startDate AND :endDate "
//            + "GROUP BY date, rate) p "
//            + "JOIN "
//            + "(SELECT date, SUM(close_meter) AS total_close_meter, SUM(open_meter) AS total_open_meter, "
//            + "SUM(total) AS total_sum, SUM(testing) AS total_testing, SUM(diesel_ltr) AS diesel_ltr, rate, "
//            + "SUM(total_sell) AS total_total_sell "
//            + "FROM Dieselsell "
//            + "WHERE date BETWEEN :startDate AND :endDate "
//            + "GROUP BY date, rate) d ON p.date = d.date "
//            + "JOIN "
//            + "(SELECT date, SUM(price) AS total_price "
//            + "FROM OilSell "
//            + "WHERE date BETWEEN :startDate AND :endDate "
//            + "GROUP BY date) o ON p.date = o.date "
//            + "JOIN "
//            + "(SELECT date, SUM(price) AS Kharch_Total "
//            + "FROM kharch "
//            + "WHERE date BETWEEN :startDate AND :endDate "
//            + "GROUP BY date) k ON p.date = k.date "
//            + "LEFT JOIN "
//            + "(SELECT date, type, quantity AS petrol_quantity, total AS petrol_total, vat AS petrol_vat, "
//            + "cess AS petrol_cess, jtcpercentage AS petrol_jtcpercentage, total_purchase AS petrol_total_purchase "
//            + "FROM Purchase "
//            + "WHERE type = 'petrol') pp ON p.date = pp.date "
//            + "LEFT JOIN "
//            + "(SELECT date, SUM(amount) AS Amount_Total "
//            + "FROM transaction "
//            + "WHERE date BETWEEN :startDate AND :endDate "
//            + "GROUP BY date) t ON p.date = t.date "
//            + "LEFT JOIN "
//            + "(SELECT date, type, quantity AS diesel_quantity, total AS diesel_total, vat AS diesel_vat, "
//            + "cess AS diesel_cess, jtcpercentage AS diesel_jtcpercentage, total_purchase AS diesel_total_purchase "
//            + "FROM Purchase "
//            + "WHERE type = 'diesel') dp ON d.date = dp.date "
//            + "ORDER BY p.date")
//    List<AggregatedDataDTO> findAggregatedData(String startDate, String endDate);
//   @Query(value = """
//    SELECT 
//        p.date,
//        p.PetrolSell_Total AS petrolSellTotal,
//        d.DieselSell_Total AS dieselSellTotal,
//        o.OilSell_Total AS oilSellTotal,
//        k.Kharch_Total AS kharchTotal,
//        t.Atm_total AS atmTotal,
//        purchase.total_petrol_purchase AS totalPetrolPurchase,
//        purchase.total_diesel_purchase AS totalDieselPurchase
//    FROM
//        (SELECT date, SUM(total_sell) AS PetrolSell_Total FROM Petrolsell WHERE date = :currentDate GROUP BY date) p
//    JOIN
//        (SELECT date, SUM(total_sell) AS DieselSell_Total FROM Dieselsell WHERE date = :currentDate GROUP BY date) d ON p.date = d.date
//    JOIN
//        (SELECT date, SUM(price) AS OilSell_Total FROM Oilsell WHERE date = :currentDate GROUP BY date) o ON p.date = o.date
//    JOIN
//        (SELECT date, SUM(price) AS Kharch_Total FROM Kharch WHERE date = :currentDate GROUP BY date) k ON p.date = k.date
//    JOIN
//        (SELECT date, SUM(amount) AS Atm_total FROM transaction WHERE date = :currentDate GROUP BY date) t ON p.date = t.date
//    LEFT JOIN
//        (SELECT 
//            date,
//            SUM(CASE WHEN type = 'petrol' THEN total_purchase ELSE 0 END) AS total_petrol_purchase,
//            SUM(CASE WHEN type = 'diesel' THEN total_purchase ELSE 0 END) AS total_diesel_purchase
//         FROM 
//            Purchase
//         WHERE 
//            date = :currentDate
//         GROUP BY 
//            date
//        ) purchase ON p.date = purchase.date
//    """, nativeQuery = true)
//Optional<DailySalesSummaryDTO> findDailySalesSummary(@Param("currentDate") String currentDate);
    @Query("SELECT SUM(p.petrol_ltr) FROM PetrolSell p WHERE YEAR(p.date) = YEAR(CURDATE()) AND p.userId = :userId")
    Double findTotalPetrolLtrForCurrentYear(@Param("userId") String userId);

    @Query("SELECT "
            + "COALESCE(p.close_meter, '0'), "
            + "COALESCE(p.open_meter, '0'), "
            + "COALESCE(p.petrol_ltr, '0'), "
            + "COALESCE(p.pump, '0'), "
            + "COALESCE(p.rate, '0'), "
            + "COALESCE(p.testing, '0'), "
            + "COALESCE(p.total, '0'), "
            + "COALESCE(p.total_sell, '0') "
            + "FROM PetrolSell p "
            + "WHERE p.userId = :userId AND p.date = :date")
    List<Object[]> getPetrolDataOnDate(@Param("date") String date, @Param("userId") String userId);

    List<PetrolSell> findByDateAndUserId(String date, String userId);

    boolean existsByDateAndUserId(String date, String userId);

    Optional<PetrolSell> findByDateAndPumpAndUserId(String date, String pump, String userId);

}

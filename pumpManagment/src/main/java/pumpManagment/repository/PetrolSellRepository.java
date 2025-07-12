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

    @Query(value = "SELECT CONVERT(SUM(total_sell), CHAR) FROM PetrolSell WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
    Double getTotalPetrolSellBetweenDates(@Param("startDate") String startDate,
                                          @Param("endDate") String endDate,
                                          @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM PetrolSell p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date DESC LIMIT 1", nativeQuery = true)
    Optional<Double> findLastRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM PetrolSell p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date ASC LIMIT 1", nativeQuery = true)
    Optional<Double> findfirstRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);

}

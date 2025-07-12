/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.powerDiesel;

/**
 *
 * @author Arpitsinh Chauhan
 */
@Repository
public interface powerDieselRepository extends JpaRepository<powerDiesel, Integer>{
     
    Optional<powerDiesel> findByDateAndPump(String date, String pump);
    
    List<powerDiesel> findByUserId(String userId);
    
     List<powerDiesel> findByDateAndUserId(String date, String userId);
     
     Optional<powerDiesel> findByDateAndPumpAndUserId(String date, String pump, String userId);

    @Query(value = "SELECT COALESCE(SUM(total_sell), 0) FROM powerdiesel WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
    Double getTotalDieselSellBetweenDates(@Param("startDate") String startDate,
                                          @Param("endDate") String endDate,
                                          @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM powerdiesel p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date DESC LIMIT 1", nativeQuery = true)
    Optional<Double> findLastRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM powerdiesel p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date ASC LIMIT 1", nativeQuery = true)
    Optional<Double> findfirstRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);
}

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
import pumpManagment.Entity.Dieselsell;
import pumpManagment.Entity.xpPetrol;

/**
 *
 * @author Arpitsinh Chauhan
 */
@Repository
public interface XpPetorlRepository extends JpaRepository<xpPetrol, Integer>{
    
    Optional<xpPetrol> findByDateAndPump(String date, String pump);
    
    List<xpPetrol> findByUserId(String userId);
    
    List<xpPetrol> findByDateAndUserId(String date, String userId);
    
    Optional<xpPetrol> findByDateAndPumpAndUserId(String date, String pump, String userId);
    
    @Query(value = "SELECT SUM(p.xppetrol_ltr) FROM xppetrol p WHERE YEAR(p.date) = YEAR(CURDATE()) AND p.user_id = :userId", nativeQuery = true)
    Double findTotalXPPetrolLtrForCurrentYear(@Param("userId") String userId);

    @Query(value = "SELECT CONVERT(SUM(total_sell), CHAR) FROM xppetrol WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
    Double getTotalXpPetrolSellBetweenDates(@Param("startDate") String startDate,
                                          @Param("endDate") String endDate,
                                          @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM xppetrol p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date DESC LIMIT 1", nativeQuery = true)
    Optional<Double> findLastRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM xppetrol p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date ASC LIMIT 1", nativeQuery = true)
    Optional<Double> findfirstRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);
    
}

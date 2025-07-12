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
import pumpManagment.Entity.jamabaki;

/**
 *
 * @author Dell
 */
@Repository
public interface jamabakiRepository extends JpaRepository<jamabaki, Integer> {

    List<jamabaki> findByUserId(String userId);

//    @Query("SELECT j.date, SUM(j.amount) FROM jamabaki j WHERE j.sender LIKE %:sender% GROUP BY j.date")
//    List<Object[]> sumAmountAndDateBySenderContainingIgnoreCase(@Param("sender") String sender);
//
//    @Query("SELECT j.date, SUM(j.amount) FROM jamabaki j WHERE j.receiver LIKE %:receiver% GROUP BY j.date")
//    List<Object[]> sumAmountAndDateByReceiverContainingIgnoreCase(@Param("receiver") String receiver);
//
//    List<jamabaki> findBySenderOrReceiver(String sender, String receiver);
    @Query("SELECT  SUM(j.jama) AS jama FROM jamabaki j WHERE j.date = :date GROUP BY j.date")
    List<Object[]> findJamaSumByDate(@Param("date") String date);

    @Query("SELECT SUM(j.jama) FROM jamabaki j WHERE j.date = :date AND j.userId = :userId")
    List<Double> findJamaSumByDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT SUM(j.baki) FROM jamabaki j WHERE j.date = :date AND j.userId = :userId GROUP BY j.date")
    List<Double> findBakiSumByDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT  SUM(j.baki) AS jama FROM jamabaki j WHERE j.date = :date GROUP BY j.date")
    List<Object[]> findBakiSumByDate(@Param("date") String date);
//    @Query("SELECT j.date, j.name, j.jama, j.baki FROM jamabaki j WHERE j.name LIKE %:name%")
//    List<Object[]> findByNameLike(@Param("name") String name);

    @Query("SELECT j.date, j.name, j.jama, j.baki FROM jamabaki j WHERE j.name LIKE %:name%")
    List<Object[]> findReportsByName(@Param("name") String name);

//        @Query(value = "SELECT j.date, SUM(j.jama) AS jama, SUM(j.baki) AS baki "
//            + "FROM jamabaki j "
//            + "WHERE j.date BETWEEN :startDate AND :endDate "
//            + "GROUP BY j.date", nativeQuery = true)
//    List<Object[]> findJamaBakiSummaryBetweenDates(@Param("startDate") String startDate,
//            @Param("endDate") String endDate);
    @Query(value = "SELECT j.date, SUM(j.jama) AS jama, SUM(j.baki) AS baki "
            + "FROM jamabaki j "
            + "WHERE j.date BETWEEN :startDate AND :endDate "
            + "GROUP BY j.date", nativeQuery = true)
    List<Object[]> findJamaBakiSummaryBetweenDates(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);

//    @Query("SELECT j.name, j.baki FROM jamabaki j WHERE j.date = :date AND j.baki > 0")
//    List<Object[]> findByDateAndBakiGreaterThan(@Param("date") String date);
//
//    @Query("SELECT j.name, j.jama FROM jamabaki j WHERE j.date = :date AND j.jama > 0")
//    List<Object[]> findByDateAndJamaGreaterThan(@Param("date") String date);
//    @Query("SELECT j.name, j.baki FROM jamabaki j WHERE j.date = :date AND j.baki > 0 AND j.userId = :userId")
//    List<Object[]> findByDateAndBakiGreaterThan(@Param("date") String date, @Param("userId") String userId);
    @Query("SELECT j.name, j.baki FROM jamabaki j WHERE j.date = :date AND j.baki > 0 AND j.userId = :userId")
    List<Object[]> findByDateAndBakiGreaterThan(
            @Param("date") String date,
            @Param("userId") String userId
    );

    @Query("SELECT j.name, j.jama FROM jamabaki j WHERE j.date = :date AND j.jama > 0 AND j.userId = :userId")
    List<Object[]> findByDateAndJamaGreaterThan(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT SUM(j.jama), SUM(j.baki) FROM jamabaki j WHERE j.date = CURRENT_DATE")
    List<Object[]> findTotalJamaAndBakiForToday();

    @Query("SELECT j FROM jamabaki j WHERE j.date BETWEEN :startDate AND :endDate AND j.name LIKE %:name% AND j.userId = :userId")
    List<jamabaki> findByDateBetweenAndNameLikeAndUserId(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("name") String name,
            @Param("userId") String userId
    );

    @Query("SELECT SUM(j.jama) - SUM(j.baki) AS JamaBakiDifference "
            + "FROM jamabaki j "
            + "WHERE YEAR(j.date) = YEAR(CURRENT_DATE()) AND j.userId = :userId")
    Double findJamaBakiDifferenceForCurrentYear(@Param("userId") String userId);

    @Query("SELECT j.jama, j.baki FROM jamabaki j WHERE j.date = :date AND j.userId = :userId")
    List<Object[]> getjamaBakiDataOnDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT SUM(j.jama), SUM(j.baki) FROM jamabaki j WHERE j.date = :date AND j.userId = :userId")
    List<jamabaki> getjamabaki(@Param("date") String date, @Param("userId") String userId);

}

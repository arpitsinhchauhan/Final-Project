/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Dailystock;

/**
 *
 * @author Dell
 */
@Repository
public interface DailyskockRepository extends JpaRepository<Dailystock, Integer> {

//    @Transactional
//    @Modifying
//    @Query(value = "INSERT INTO dailystock (date, openstock) VALUES (CAST(:date AS DATE), :openStock)", nativeQuery = true)
//    void insertDailyStock(String date, String openStock);
//    @Query(value = "SELECT COUNT(*) FROM dailystock WHERE date = CAST(:date AS DATE)", nativeQuery = true)
//    int countByDate(String date);
//    @Transactional
//    @Modifying
//    @Query(value = "INSERT INTO dailystock (date, openStock) VALUES (CAST(:date AS DATE), :openStock)", nativeQuery = true)
//    void insertDailyStock(String date, Double openStock);
    @Query(value = "SELECT COUNT(*) FROM dailystock WHERE date = CAST(:date AS DATE) AND (:user_id IS NULL OR user_id = :user_id)", nativeQuery = true)
    int countByDate(@Param("date") String date, @Param("user_id") String userId);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO dailystock (date, openStock, user_id) VALUES (CAST(:date AS DATE), :openStock, :userId)", nativeQuery = true)
    void insertDailyStock(@Param("date") String date, @Param("openStock") Double openStock, @Param("userId") String userId);

//    List<Dailystock> findByDate(String date);
//    @Query(value = "SELECT * FROM dailystock WHERE date = DATE_SUB(?1, INTERVAL 1 DAY)", nativeQuery = true)
//    List<Dailystock> findDataForOneDayAgo(String date);
    @Query(value = "SELECT * FROM dailystock WHERE date = DATE_SUB(:date, INTERVAL 1 DAY) AND (:user_id IS NULL OR user_id = :user_id)", nativeQuery = true)
    List<Dailystock> findDataForOneDayAgo(@Param("date") String date, @Param("user_id") String userId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE dailystock SET openstock = :openstock WHERE date = :date AND user_id = :userId", nativeQuery = true)
    void updateDailyStock(@Param("date") String date,
                          @Param("openstock") double openstock,
                          @Param("userId") String userId);

}

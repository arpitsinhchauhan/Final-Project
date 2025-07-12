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
import pumpManagment.Entity.dailydieselstock;

/**
 *
 * @author Dell
 */
@Repository
public interface DailydieselstockRepository extends JpaRepository<dailydieselstock, Integer> {

//    @Transactional
//    @Modifying
//    @Query(value = "INSERT INTO dailydieselstock (date, dieselopenstock) VALUES (CAST(:date AS DATE), :dieselopenstock)", nativeQuery = true)
//    void insertDailydieselstock(String date, Double dieselopenstock);
//
//    @Query(value = "SELECT * FROM dailydieselstock WHERE date = DATE_SUB(?1, INTERVAL 1 DAY)", nativeQuery = true)
//    List<dailydieselstock> findDataForOneDayAgo(String date);
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO dailydieselstock (date, dieselopenstock, user_id) VALUES (CAST(:date AS DATE), :dieselopenstock, :userId)", nativeQuery = true)
    void insertDailydieselstock(String date, Double dieselopenstock, String userId);

    @Query(value = "SELECT * FROM dailydieselstock WHERE date = DATE_SUB(?1, INTERVAL 1 DAY) AND user_id = ?2", nativeQuery = true)
    List<dailydieselstock> findDataForOneDayAgo(String date, String userId);

//    @Query(value = "SELECT COUNT(*) FROM dailydieselstock WHERE date = CAST(:date AS DATE)", nativeQuery = true)
//    int countByDate(String date);
    @Query(value = "SELECT COUNT(*) FROM dailydieselstock WHERE date = CAST(:date AS DATE) AND (:user_id IS NULL OR user_id = :user_id)", nativeQuery = true)
    int countByDate(@Param("date") String date, @Param("user_id") String userId);

    @Modifying
    @Transactional
    @Query("UPDATE dailydieselstock d SET d.dieselopenstock = :dieselopenstock WHERE d.date = :date AND d.user_id = :userId")
    void updateDailydieselstock(@Param("date") String date,
                                @Param("dieselopenstock") double dieselopenstock,
                                @Param("userId") String userId);

}

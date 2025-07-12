/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.model.DAOUser;

/**
 *
 * @author Dell
 */
@Repository
public interface UserRepository extends JpaRepository<DAOUser, Long> {

    DAOUser findByUsername(String username);

    @Query("SELECT u.firstName FROM DAOUser u WHERE u.id = :userId")
    String getUserDataForDate(@Param("userId") Long userId);

    void deleteById(Long id);

//    @Query("SELECT u.petrol_nozzle,u.diesel_nozzle,u.xp_petrol_nozzle,u.powe_diesel_nozzle FROM DAOUser u WHERE u.id = :userId")
//    String getUserPump(@Param("userId") Long userId);
    @Query("SELECT u.petrol_nozzle, u.diesel_nozzle, u.xp_petrol_nozzle, u.powe_diesel_nozzle FROM DAOUser u WHERE u.id = :userId")
    Object[] getUserPump(@Param("userId") Long userId);

//    @Query(value = "SELECT u.petrol_nozzle, u.diesel_nozzle, u.xp_petrol_nozzle, u.powe_diesel_nozzle FROM DAOUser u WHERE id = :userId", nativeQuery = true)
//    Map<String, Object> getUserPump(@Param("userId") Long userId);
}

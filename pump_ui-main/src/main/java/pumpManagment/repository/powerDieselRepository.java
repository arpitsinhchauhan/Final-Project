/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

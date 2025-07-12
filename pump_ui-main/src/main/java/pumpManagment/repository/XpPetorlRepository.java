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
    
}

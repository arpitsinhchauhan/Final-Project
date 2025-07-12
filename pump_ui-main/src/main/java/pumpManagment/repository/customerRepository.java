/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.customer;

import java.util.List;
import java.util.Optional;

/**
 *
 * @author Dell
 */
@Repository
public interface customerRepository extends JpaRepository<customer, Integer> {

    List<customer> findByUserId(String userId);

    Optional<customer> findByName(String name);

}

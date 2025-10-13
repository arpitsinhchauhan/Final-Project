package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.OilsellList;

@Repository
public interface  OilsellListRepository extends JpaRepository<OilsellList, Integer> {
}

package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pumpManagment.Entity.Oilpurchase;
import pumpManagment.Entity.Purchase;

import java.util.List;
import java.util.Optional;

public interface OilPurchaseRepository extends JpaRepository<Oilpurchase, Integer> {

    @Query("SELECT t1.Quantity,t1.type FROM Oilpurchase t1 WHERE t1.date = :date AND t1.userId = :userId")
    List<Oilpurchase> getOilPurchase(@Param("date") String date, @Param("userId") String userId);

    List<Oilpurchase> findByUserId(String userId);

    Optional<Oilpurchase> findByDateAndTypeAndUserId(String date, String type, String userId);

}

package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Expenses;

@Repository
public interface ExpensesRepository extends JpaRepository<Expenses, Integer> {
}

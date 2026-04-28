package com.algoarena.backend.repository;

import com.algoarena.backend.model.RaceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RaceResultRepository extends JpaRepository<RaceResult, Long> {

    List<RaceResult> findTop50ByUsernameOrderByTimestampDesc(String username);

    @Query("""
           select upper(r.winnerAlgorithm), count(r)
           from RaceResult r
           where r.winnerAlgorithm is not null and trim(r.winnerAlgorithm) <> ''
           group by upper(r.winnerAlgorithm)
           order by count(r) desc
           """)
    List<Object[]> findGlobalWinCounts();
}

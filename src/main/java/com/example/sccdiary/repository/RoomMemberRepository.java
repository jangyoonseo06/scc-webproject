package com.example.sccdiary.repository;

import com.example.sccdiary.entity.RoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {

    List<RoomMember> findByRoomId(Long roomId);

    boolean existsByRoomIdAndUserId(Long roomId, Long userId);

    @Query("""
        select case when count(a) > 0 then true else false end
        from RoomMember a, RoomMember b
        where a.roomId = b.roomId
          and a.userId = :userA
          and b.userId = :userB
        """)
    boolean existsSharedRoom(@Param("userA") Long userA, @Param("userB") Long userB);
}

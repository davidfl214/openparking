package org.example.openparkingbackendauth.repository;

import org.example.openparkingbackendauth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar usuario por email
    Optional<User> findByEmail(String email);

    // Saber si un usuario ya existe por email
    boolean existsByEmail(String email);
}

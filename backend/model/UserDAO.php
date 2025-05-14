<?php

require_once '../bd/database.php';
require_once '../model/entidades/User.php';

class UserDAO {
    private $pdo;

    public function __construct() {
        try {
            $this->pdo = Database::connect();
        } catch (Exception $ex) {
            die($ex->getMessage());
        }
    }

    public function listar() {
        try {
            $stm = $this->pdo->prepare("SELECT * FROM users");
            $stm->execute();
            return $stm->fetchAll(PDO::FETCH_CLASS, "User");
        } catch (Exception $ex) {
            die($ex->getMessage());
        }
    }

    public function obtener($id) {
        try {
            $stm = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stm->execute([$id]);
            return $stm->fetchObject("User");
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function registrar(User $user) {
        try {
            $sql = "INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
            $this->pdo->prepare($sql)->execute([
                $user->getNombre(),
                $user->getEmail(),
                $user->getPassword(),
                $user->getRol()
            ]);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function actualizar(User $user) {
        try {
            $sql = "UPDATE users SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?";
            $this->pdo->prepare($sql)->execute([
                $user->getNombre(),
                $user->getEmail(),
                $user->getPassword(),
                $user->getRol(),
                $user->getId()
            ]);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function eliminar($id) {
        try {
            $stm = $this->pdo->prepare("DELETE FROM users WHERE id = ?");
            $stm->execute([$id]);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function getByEmail($email) {
    $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        $user = new User();
        $user->setId($data['id']);
        $user->setNombre($data['nombre']);
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);
        $user->setRol($data['rol']);
        return $user;
    }

    return null;
}

}

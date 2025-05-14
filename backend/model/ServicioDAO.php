<?php

require_once '../bd/database.php';
require_once '../model/Servicio.php';

class ServicioDAO {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function listar() {
        $stm = $this->pdo->prepare("SELECT * FROM servicios");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_CLASS, "Servicio");
    }

    public function registrar(Servicio $servicio) {
        $sql = "INSERT INTO servicios (nombre, duracion, precio) VALUES (?, ?, ?)";
        $this->pdo->prepare($sql)->execute([
            $servicio->getNombre(),
            $servicio->getDuracion(),
            $servicio->getPrecio()
        ]);
    }

    public function actualizar(Servicio $servicio) {
        $sql = "UPDATE servicios SET nombre = ?, duracion = ?, precio = ? WHERE id = ?";
        $this->pdo->prepare($sql)->execute([
            $servicio->getNombre(),
            $servicio->getDuracion(),
            $servicio->getPrecio(),
            $servicio->getId()
        ]);
    }

    public function eliminar($id) {
        $stm = $this->pdo->prepare("DELETE FROM servicios WHERE id = ?");
        $stm->execute([$id]);
    }

    public function obtener($id) {
        $stm = $this->pdo->prepare("SELECT * FROM servicios WHERE id = ?");
        $stm->execute([$id]);
        return $stm->fetchObject("Servicio");
    }
}

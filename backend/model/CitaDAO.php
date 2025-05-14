<?php

require_once '../bd/database.php';
require_once '../model/Cita.php';

class CitaDAO {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function listar() {
        $stm = $this->pdo->prepare("SELECT * FROM citas");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_CLASS, "Cita");
    }

    public function obtener($id) {
        $stm = $this->pdo->prepare("SELECT * FROM citas WHERE id = ?");
        $stm->execute([$id]);
        return $stm->fetchObject("Cita");
    }

    public function registrar(Cita $cita) {
        $sql = "INSERT INTO citas (user_id, servicio_id, personal_id, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?)";
        $this->pdo->prepare($sql)->execute([
            $cita->getUserId(),
            $cita->getServicioId(),
            $cita->getPersonalId(),
            $cita->getFecha(),
            $cita->getHora(),
            $cita->getEstado()
        ]);
    }

    public function actualizar(Cita $cita) {
        $sql = "UPDATE citas SET user_id = ?, servicio_id = ?, personal_id = ?, fecha = ?, hora = ?, estado = ? WHERE id = ?";
        $this->pdo->prepare($sql)->execute([
            $cita->getUserId(),
            $cita->getServicioId(),
            $cita->getPersonalId(),
            $cita->getFecha(),
            $cita->getHora(),
            $cita->getEstado(),
            $cita->getId()
        ]);
    }

    public function eliminar($id) {
        $stm = $this->pdo->prepare("DELETE FROM citas WHERE id = ?");
        $stm->execute([$id]);
    }

    public function actualizarEstado($id, $estado)
{
    try {
        $sql = "UPDATE citas SET estado = ? WHERE id = ?";
        $this->pdo->prepare($sql)
                  ->execute([$estado, $id]);
    } catch (Exception $e) {
        die($e->getMessage());
    }
}

}

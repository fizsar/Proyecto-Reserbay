<?php

require_once '../bd/database.php';
require_once '../model/entidades/Horario.php';

class HorarioDAO {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function listar() {
        $stm = $this->pdo->prepare("SELECT * FROM horarios");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_CLASS, "Horario");
    }

    public function registrar(Horario $horario) {
        $sql = "INSERT INTO horarios (user_id, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)";
        $this->pdo->prepare($sql)->execute([
            $horario->getUserId(),
            $horario->getFecha(),
            $horario->getHoraInicio(),
            $horario->getHoraFin()
        ]);
    }

    public function obtener($id) {
        $stm = $this->pdo->prepare("SELECT * FROM horarios WHERE id = ?");
        $stm->execute([$id]);
        return $stm->fetchObject("Horario");
    }

    public function eliminar($id) {
        $stm = $this->pdo->prepare("DELETE FROM horarios WHERE id = ?");
        $stm->execute([$id]);
    }

    public function actualizar(Horario $horario) {
        $sql = "UPDATE horarios SET user_id = ?, fecha = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?";
        $this->pdo->prepare($sql)->execute([
            $horario->getUserId(),
            $horario->getFecha(),
            $horario->getHoraInicio(),
            $horario->getHoraFin(),
            $horario->getId()
        ]);
    }

    public function obtenerPorEmpleadoYDia($empleadoId, $fecha) {
        $sql = "SELECT hora_inicio, hora_fin FROM horarios 
                WHERE user_id = ? AND fecha = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$empleadoId, $fecha]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function existeHorario($user_id, $fecha, $hora_inicio) {
    $sql = "SELECT COUNT(*) FROM horarios WHERE user_id = ? AND fecha = ? AND hora_inicio = ?";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([$user_id, $fecha, $hora_inicio]);
    $count = $stmt->fetchColumn();
    return $count > 0;
}

}

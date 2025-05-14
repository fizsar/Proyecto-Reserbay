<?php

require_once '../bd/database.php';
require_once '../model/Horario.php';

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
        $sql = "INSERT INTO horarios (user_id, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)";
        $this->pdo->prepare($sql)->execute([
            $horario->getUserId(),
            $horario->getDiaSemana(),
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
}

<?php
require_once '../model/HorarioDAO.php';
require_once '../model/entidades/Horario.php';

class HorarioController {
    private $model;

    public function __construct() {
        $this->model = new HorarioDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $horario = new Horario();
        $horario->setId($_REQUEST['id'] ?? 0);
        $horario->setUserId($_REQUEST['user_id']);
        $horario->setDiaSemana($_REQUEST['dia_semana']);
        $horario->setHoraInicio($_REQUEST['hora_inicio']);
        $horario->setHoraFin($_REQUEST['hora_fin']);

        $horario->getId() > 0 
            ? $this->model->actualizar($horario)
            : $this->model->registrar($horario);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function obtener() {
        $horario = $this->model->obtener($_REQUEST['id']);
        echo json_encode($horario);
    }
}

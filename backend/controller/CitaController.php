<?php
require_once '../model/CitaDAO.php';
require_once '../model/entidades/Cita.php';

class CitaController {
    private $model;

    public function __construct() {
        $this->model = new CitaDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $cita = new Cita();
        $cita->setId($_REQUEST['id'] ?? 0);
        $cita->setUserId($_REQUEST['user_id']);
        $cita->setServicioId($_REQUEST['servicio_id']);
        $cita->setPersonalId($_REQUEST['personal_id']);
        $cita->setFecha($_REQUEST['fecha']);
        $cita->setHora($_REQUEST['hora']);
        $cita->setEstado($_REQUEST['estado'] ?? 'pendiente');

        $cita->getId() > 0 
            ? $this->model->actualizar($cita)
            : $this->model->registrar($cita);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function cambiarEstado() {
        $id = $_REQUEST['id'];
        $estado = $_REQUEST['estado'];
        $this->model->actualizarEstado($id, $estado);
        echo json_encode(["status" => "updated"]);
    }

    public function obtener() {
        $cita = $this->model->obtener($_REQUEST['id']);
        echo json_encode($cita);
    }
}

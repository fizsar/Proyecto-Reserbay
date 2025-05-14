<?php
require_once '../model/ServicioDAO.php';
require_once '../model/entidades/Servicio.php';

class ServicioController {
    private $model;

    public function __construct() {
        $this->model = new ServicioDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $servicio = new Servicio();
        $servicio->setId($_REQUEST['id'] ?? 0);
        $servicio->setNombre($_REQUEST['nombre']);
        $servicio->setDuracion($_REQUEST['duracion']);
        $servicio->setPrecio($_REQUEST['precio']);

        $servicio->getId() > 0 
            ? $this->model->actualizar($servicio)
            : $this->model->registrar($servicio);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function obtener() {
        $servicio = $this->model->obtener($_REQUEST['id']);
        echo json_encode($servicio);
    }
}

<?php
require_once '../model/UserDAO.php';
require_once '../model/entidades/User.php';

class UserController {
    private $model;

    public function __construct() {
        $this->model = new UserDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $user = new User();
        $user->setId($_REQUEST['id'] ?? 0);
        $user->setNombre($_REQUEST['nombre']);
        $user->setEmail($_REQUEST['email']);
        $user->setPassword(password_hash($_REQUEST['password'], PASSWORD_DEFAULT));
        $user->setRol($_REQUEST['rol']);

        $user->getId() > 0 
            ? $this->model->actualizar($user)
            : $this->model->registrar($user);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function obtener() {
        $user = $this->model->obtener($_REQUEST['id']);
        echo json_encode($user);
    }
}

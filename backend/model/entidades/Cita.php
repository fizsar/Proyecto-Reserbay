<?php
class Cita {
    private $id;
    private $user_id;
    private $servicio_id;
    private $personal_id;
    private $fecha;
    private $hora;
    private $estado;

    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getUserId() { return $this->user_id; }
    public function setUserId($user_id) { $this->user_id = $user_id; }

    public function getServicioId() { return $this->servicio_id; }
    public function setServicioId($servicio_id) { $this->servicio_id = $servicio_id; }

    public function getPersonalId() { return $this->personal_id; }
    public function setPersonalId($personal_id) { $this->personal_id = $personal_id; }

    public function getFecha() { return $this->fecha; }
    public function setFecha($fecha) { $this->fecha = $fecha; }

    public function getHora() { return $this->hora; }
    public function setHora($hora) { $this->hora = $hora; }

    public function getEstado() { return $this->estado; }
    public function setEstado($estado) { $this->estado = $estado; }
}

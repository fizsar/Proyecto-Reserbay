<?php
class Horario {
    private $id;
    private $user_id;
    private $dia_semana;
    private $hora_inicio;
    private $hora_fin;

    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getUserId() { return $this->user_id; }
    public function setUserId($user_id) { $this->user_id = $user_id; }

    public function getDiaSemana() { return $this->dia_semana; }
    public function setDiaSemana($dia_semana) { $this->dia_semana = $dia_semana; }

    public function getHoraInicio() { return $this->hora_inicio; }
    public function setHoraInicio($hora_inicio) { $this->hora_inicio = $hora_inicio; }

    public function getHoraFin() { return $this->hora_fin; }
    public function setHoraFin($hora_fin) { $this->hora_fin = $hora_fin; }
}

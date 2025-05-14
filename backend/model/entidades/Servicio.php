<?php
class Servicio {
    private $id;
    private $nombre;
    private $duracion;
    private $precio;

    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getNombre() { return $this->nombre; }
    public function setNombre($nombre) { $this->nombre = $nombre; }

    public function getDuracion() { return $this->duracion; }
    public function setDuracion($duracion) { $this->duracion = $duracion; }

    public function getPrecio() { return $this->precio; }
    public function setPrecio($precio) { $this->precio = $precio; }
}

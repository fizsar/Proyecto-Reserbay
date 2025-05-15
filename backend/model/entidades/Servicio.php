<?php
class Servicio {
    public $id;
    public $nombre;
    public $duracion;
    public $precio;
    public $created_at;  // ✅ necesario para que PDO no lance warning
    public $updated_at;  // ✅ necesario también

    // Métodos getter y setter opcionales
    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getNombre() { return $this->nombre; }
    public function setNombre($nombre) { $this->nombre = $nombre; }

    public function getDuracion() { return $this->duracion; }
    public function setDuracion($duracion) { $this->duracion = $duracion; }

    public function getPrecio() { return $this->precio; }
    public function setPrecio($precio) { $this->precio = $precio; }
}


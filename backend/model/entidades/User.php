<?php

class User
{
    private $id;
    private $email;
    private $password;
    private $nombre;
    private $rol;

    // Getters y Setters
    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getEmail() { return $this->email; }
    public function setEmail($email) { $this->email = $email; }

    public function getPassword() { return $this->password; }
    public function setPassword($password) { $this->password = $password; }

    public function getNombre() { return $this->nombre; }
    public function setNombre($nombre) { $this->nombre = $nombre; }

    public function getRol() { return $this->rol; }
    public function setRol($rol) { $this->rol = $rol; }
}

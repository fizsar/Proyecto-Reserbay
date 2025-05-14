<?php

class Database
{
    private static ?PDO $connection = null;

    /**
     * Conecta a la base de datos y devuelve una instancia PDO.
     */
    public static function connect(): PDO
    {
        if (self::$connection === null) {
            try {
                self::$connection = new PDO('mysql:host=localhost;dbname=reserbay_db;charset=utf8', 'root', '');
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                die("Error de conexión: " . $e->getMessage());
            }
        }

        return self::$connection;
    }

    /**
     * Cierra la conexión a la base de datos.
     */
    public static function disconnect(): void
    {
        self::$connection = null;
    }

    /**
     * Ejecuta una consulta SQL directa (sin parámetros).
     */
    public static function query(string $sql): array|false
    {
        $stmt = self::connect()->query($sql);
        return $stmt ? $stmt->fetchAll() : false;
    }

    /**
     * Ejecuta una consulta preparada con parámetros.
     */
    public static function prepare(string $sql, array $params = []): array|false
    {
        $stmt = self::connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}

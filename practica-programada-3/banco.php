<?php

$transacciones = [
    [
        "id" => 1,
        "descripcion" => "Netflix",
        "valor" => 12685
    ],
    [
        "id" => 2,
        "descripcion" => "Pollo Campero",
        "valor" => 5600
    ],
    [
        "id" => 3,
        "descripcion" => "Uber",
        "valor" => 6.85
    ]
];

function registrarTransaccion($descripcion, $valor) {
    global $transacciones;

    $id = count($transacciones) + 1;


    $nuevaTransaccion = [
        "id" => $id,
        "descripcion" => $descripcion,
        "valor" => $valor
    ];
    
    array_push($transacciones, $nuevaTransaccion);
}

function generarEstadoDeCuenta() {
    global $transacciones;

    $cashback = 0;
    $total = 0;
    $totalConIntereses = 0;
    
    foreach ($transacciones as $transaccion) {
        $total += $transaccion['valor'];
    }

    $totalConIntereses = $total * (1 + 2.6 / 100);

    $cashback = $total * (0.1 / 100);

    echo "Estado de Cuenta:"; echo '<br>';
    echo "**********************************";
    foreach ($transacciones as $transaccion) {
        echo '<br>';
        echo "ID: " . $transaccion['id'] . PHP_EOL; echo '<br>';
        echo "Descripción: " . $transaccion['descripcion'] . PHP_EOL; echo '<br>';
        echo "Monto: ₡" . number_format($transaccion['valor'], 2) . PHP_EOL; echo '<br>';
        echo "**********************************";
    }

    echo '<br>';
    echo '<br>';
    echo "Monto Total (sin intereses): ₡" . number_format($total, 2) . PHP_EOL;echo '<br>';
    echo "Monto Total con Intereses (2.6%): ₡" . number_format($totalConIntereses, 2) . PHP_EOL;echo '<br>';
    echo "Cashback: ₡" . number_format($cashback, 2) . PHP_EOL;echo '<br>';
    echo "Monto Final a Pagar: ₡" . number_format($totalConIntereses - $cashback, 2) . PHP_EOL;echo '<br>';
    echo "**********************************";
}



registrarTransaccion("Parqueo", 2400);
registrarTransaccion("Pull & Bear", 63500);
registrarTransaccion("Combo McDonalds", 4600);
registrarTransaccion("Antiguedades Mistery", 42958);
registrarTransaccion("Transferencia sinpe", 10000);

generarEstadoDeCuenta();

?>


<?php
require_once __DIR__ . '/../../RootConfig.php';
$cyp = 'aes-128-gcm';
$p = gmp_intval(gmp_nextprime(random_int(100, 1000)));
$g = gmp_intval(gmp_nextprime(random_int(10, 50)));
$chunkSize = 48;
$a = [];
for ($i = 0; $i < $chunkSize; $i++) {
    $a[] = random_int($p / random_int(1, 10), $p);
}
file_put_contents(\R\Dirs::StorageDir . '/keys.json', json_encode([$p, $g, $a]));

$Keys = [
    $p, $g, []
];
foreach ($a as $value) {
    $Keys[2][] = bcmod(bcpow($g, $value), $p);
}
echo json_encode($Keys);
exit;

// $EK = bin2hex(implode('', $Keys[2]));
// $len = strlen($EK);
// $tag = '';

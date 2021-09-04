<?php
require_once __DIR__ . '/../../RootConfig.php';
$cyp = 'aes-128-gcm';
$fk = json_decode(file_get_contents(\R\Dirs::StorageDir . '/keys.json'), true);
$p = $fk[0];
$a = $fk[2];
$BK = json_decode(\Lib\Utilities::ReadPostInput(), true);
$Keys = [];
foreach ($BK as $key => $value) {
    $Keys[] = bcmod(bcpow($value, $a[$key]), $p);
}

echo implode('', $Keys);
exit;
// $EK = bin2hex(implode('', $Keys));
// $len = strlen($EK);
// $tag = '';
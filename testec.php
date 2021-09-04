<?php

require_once __DIR__ . '/../../RootConfig.php';

class ElepticCurve
{
    function __construct(private float $a, private float $b, private Point $generator, private int $Mod)
    {
    }

    function SetGenerator(Point $g)
    {
        $this->generator = $g;
    }

    public function SlopeAtGenerator()
    {
        return bcmod(bcmul(
            bcmod(bcadd(bcmul(3, bcpow($this->generator->X, 2)), $this->a), $this->Mod),
            (int)gmp_invert(bcmul($this->generator->Y, 2), $this->Mod)
        ), $this->Mod);
    }

    public function PointDouble(): Point
    {
        $slope = $this->SlopeAtGenerator();
        $p = new Point(
            bcmod(bcsub(bcpow($slope, 2), bcmul(2, $this->generator->X)), $this->Mod),
            0
        );
        $p->Y = bcsub(bcmul($slope, bcsub($this->generator->X, $p->X)), $this->generator->Y);
        $p->Y = gmp_strval(gmp_mod((string)$p->Y, (string)$this->Mod));
        $this->generator = $p;
        return $p;
    }

    public function PointAdd(Point $currentPoint): Point
    {
        $n = bcmod(bcsub($currentPoint->Y, $this->generator->Y), $this->Mod);
        $d = bcsub($currentPoint->X, $this->generator->X);
        if ($d == 0) {
            return new Point(0, 0, true);
        }
        $lamb = bcdiv($n, $d);
        $p = new Point(
            (int)gmp_mod(bcsub(bcsub(bcpow($lamb, 2), $this->generator->X), $currentPoint->X), $this->Mod),
            0
        );

        $p->Y = gmp_strval(gmp_mod((string)bcsub(bcmul($lamb, bcsub($this->generator->X, $p->X)), (string)$this->generator->Y), $this->Mod));
        $this->generator = $p;
        return $p;
    }
}
class Point
{
    public function __construct(public int $X, public int $Y, public bool $Infinity = false)
    {
    }
}


$a = 2;
$b = 2;

$n = 9;
// $a = 486662;
// $b = 1;
$Initial = new Point(5, 1);

$ec = new ElepticCurve($a, $b, $Initial, 17);
$g = null;
if ($n % 2 === 0) {
    $n = floor($n / 2);
    for ($i = 0; $i < $n; $i++) {
        $g = $ec->PointDouble();
    }
} else {
    $n = floor($n / 2);
    for ($i = 0; $i < $n; $i++) {
        $g = $ec->PointDouble();
    }
    $g = $ec->PointAdd($Initial);
}

function PrintPoint(Point $p)
{
    echo $p->X . ' - ' . $p->Y . PHP_EOL;
}

// No JS
// Very slow Sass generation so getting CodePen timeouts. I compiled it locally. Here is the original code:
/*

html, body { height: 100%; }
body
{
	background: #000020;
	font-size: 15px;
	overflow: hidden;
}

// The element is always over the shadow (even with a transparent background), so we move it away by this offset
$offset: 30em;
// Number of "frames"
$precision: 100;

$points: ();
// Radius
$rad: 8em;
$corners-offset: 6em;
// Keep this between 0 and 1
$offset-unphasing: .5;
// Number of dots per half side (= (number of dots per side - 1) / 2)
$half-side: 2;
@for $k from -($half-side) through $half-side
{
	@for $j from -($half-side) through $half-side
	{
		@for $i from -($half-side) through $half-side
		{
			$x: $i / $half-side; $y: $j / $half-side; $z: $k / $half-side;
			$x2: $x * $x; $y2: $y * $y; $z2: $z * $z;
			$sx: $x * sqrt(1 - $y2 / 2 - $z2 / 2 + $y2 * $z2 / 3);
			$sy: $y * sqrt(1 - $z2 / 2 - $x2 / 2 + $z2 * $x2 / 3);
			$sz: $z * sqrt(1 - $x2 / 2 - $y2 / 2 + $x2 * $y2 / 3);
			$size: if(($i + $j + $k) % 2 == 0, 0em, -.25em);
			$ori-dist: ($x2 + $y2 + $z2) / 3;
			$points: append($points, ($rad * $sx) ($rad * $sy) ($rad * $sz) $size $ori-dist, comma);
		}
	}
}

// Below functions assuming every lengths are in em
@function atan2($y, $x)
{
	@if $y == 0em
	{
		@return if($x < 0, 180deg, 0deg);
	}
	$sign: if($y > 0, 1, -1);
	@if $x == 0em
	{
		@return 90deg * $sign;
	}
	$a: 180deg * atan(abs($y / $x)) / pi();
	@return if($x > 0, $a * $sign, (180deg - $a) * $sign);
}
@function rotateX($p, $a)
{
	$x: nth($p, 1); $y: nth($p, 2); $z: nth($p, 3);
	$d: sqrt($z * $z + $y * $y) / 1em;
	$na: atan2($y, $z) + $a;
	@return ($x ($d * sin($na)) ($d * cos($na)) nth($p, 4) nth($p, 5));
}
@function rotateY($p, $a)
{
	$x: nth($p, 1); $y: nth($p, 2); $z: nth($p, 3);
	$d: sqrt($z * $z + $x * $x) / 1em;
	$na: atan2($z, $x) + $a;
	@return (($d * cos($na)) $y ($d * sin($na)) nth($p, 4) nth($p, 5));
}
@function rotateZ($p, $a)
{
	$x: nth($p, 1); $y: nth($p, 2); $z: nth($p, 3);
	$d: sqrt($y * $y + $x * $x) / 1em;
	$na: atan2($y, $x) + $a;
	@return (($d * cos($na)) ($d * sin($na)) $z nth($p, 4) nth($p, 5));
}

// Sorting things. Based on https://github.com/HugoGiraudel/SassySort/blob/master/stylesheets/algorithms/_quick-sort.scss
@function sort-z($list)
{
	$less:  ();
	$equal: ();
	$large: ();
	@if length($list) > 1
	{
		$seed: nth(nth($list, ceil(length($list) / 2)), 3);
		@each $item in $list
		{
			$val: nth($item, 3);
			@if $val == $seed
			{
				$equal: append($equal, $item, list-separator($list));
			}
			@else if $val < $seed
			{
				$less: append($less, $item, list-separator($list));
			}
			@else
			{
				$large: append($large, $item, list-separator($list));
			}
		}
		@return join(join(sort-z($less), $equal), sort-z($large));
	}
	@return $list;
}

@keyframes full
{
	@for $i from 0 through $precision
	{
		$p: $i / $precision;
		$kf: 100% * $p;
		$trans-points: ();
		@for $j from 1 through length($points)
		{
			$trans-point: nth($points, $j);
			$x: nth($trans-point, 1); $y: nth($trans-point, 2); $z: nth($trans-point, 3); $od: nth($trans-point, 5);
			$dist: sqrt($x * $x + $y * $y + $z * $z) / (1em * 1em);
			$theta: if($dist == 0em, 0, acos($z / $dist) / 1em);
			$phi: atan2($y, $x);
			
			$offset: (sin(360deg * ($p - sqrt($od) * $offset-unphasing)) + 1) / 2;
			$dist: $dist + $od * $od * $offset * $corners-offset;
			
			$x: $dist * sin($theta) * cos($phi);
			$y: $dist * sin($theta) * sin($phi);
			$z: $dist * cos($theta);
			
			$trans-point: ($x $y $z nth($trans-point, 4) $od);
			$trans-point: rotateX(rotateY($trans-point, -45deg + $p * -90deg), -35deg);
			$trans-points: append($trans-points, append($trans-point, hsl(330 * $dist / ($rad + $corners-offset), 100%, 50%), space), comma);
		}
		$trans-points: sort-z($trans-points);
		$shadow: ();
		@for $j from 1 through length($trans-points)
		{
			$p: nth($trans-points, $j);
			$size: if(nth($p, 4) == 0em, (), 0 nth($p, 4));
			$shadow: append($shadow, ($offset + nth($p, 1)) ($offset + nth($p, 2)) $size nth($p, length($p)), comma);
		}
		#{$kf}
		{
			box-shadow: $shadow;
		}
	}
}

.thing
{
	position: absolute;
	top: 50%; left: 50%;
	width: 1em; height: 1em;
	margin: (-1 * $offset - .5em) 0 0 (-1 * $offset - .5em);
	border-radius: 50%;
	animation: full 2s steps(1) infinite;
}

*/

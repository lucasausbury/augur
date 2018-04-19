<?php
	set_time_limit(600);
	error_reporting(-1);
	ini_set('display_errors', 'On');
	$host = 'localhost';
	$user = 'augur';
	$pass = 'augur123';
	$data = 'augur';

	$mysqli = new mysqli($host, $user, $pass, $data);
	$cats = isset($_REQUEST['categories']) ? $_REQUEST['categories'] : array('Books');
	$salesRank = isset($_REQUEST['salesRank']) ? $_REQUEST['salesRank'] : 1;
	$filename = implode('>',$cats) . ">{$salesRank}.html";

	if( file_exists(__DIR__."/cache/{$filename}") ) {
		header('Content-type:text/html');
		echo file_get_contents(__DIR__."/cache/{$filename}");
		die();
	}
	
	$ids = array();
	switch( count($cats) ) {
		case 0:
			$stmt0 = $mysqli->prepare("SELECT DISTINCT id FROM categories");
			break;
		case 1:
			$stmt0 = $mysqli->prepare("SELECT DISTINCT id FROM categories WHERE c0=?;");
			$stmt0->bind_param("i", $cats[0]);
			break;
		case 2:
			$stmt0 = $mysqli->prepare("SELECT DISTINCT id FROM categories WHERE c0=? AND c1=?;");
			$stmt0->bind_param("ii", $cats[0], $cats[1]);
			break;
		case 3:
			$stmt0 = $mysqli->prepare("SELECT DISTINCT id FROM categories WHERE c0=? AND c1=? AND c2=?;");
			$stmt0->bind_param("iii", $cats[0], $cats[1], $cats[2]);
			break;
		case 4:
			$stmt0 = $mysqli->prepare("SELECT DISTINCT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=?;");
			$stmt0->bind_param("iiii", $cats[0], $cats[1], $cats[2], $cats[3]);
			break;
		case 5:
			$stmt0 = $mysqli->prepare("SELECT DISTINCT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=? AND c4=?;");
			$stmt0->bind_param("iiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4]);
			break;
		
	}
	$stmt0->execute();
	$stmt0->store_result();
	$stmt0->bind_result($id);
	while($stmt0->fetch())
		$ids[] = $id;

	$in = "(".implode(',', $ids).")";
	$stmt1 = $mysqli->prepare("SELECT a.asin, a.title, a.description, a.imURL, a.price, a.salesRank FROM books a, book_categories b
		WHERE a.salesRank=? AND b.book=a.id AND b.category IN {$in} LIMIT 1");
	$stmt1->bind_param("i", $salesRank);
	$stmt1->execute();
	$stmt1->store_result();
	$stmt1->bind_result($asin, $title, $desc, $imURL, $price, $rank);
	$stmt1->fetch();

	$out = "<div class=\"modal-header\">
				<h5 class=\"modal-title\">{$title}</h5>
				<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">
					<span aria-hidden=\"true\">&times;</span>
				</button>
			</div><div class=\"modal-body\">
				<div class=\"row\">
					<div class=\"col-3\">
						<img src=\"{$imURL}\" class=\"img-thumbnail\" style=\"max-width:100%;\" />
					</div><div class=\"col-9\">
						<p class=\"lead\">ASIN: {$asin}<br />Price: $".$price."<br />Sales rank: {$rank}</p>
					</div>
				</div>
				<p>{$desc}</p>
			</div><div class=\"modal-footer\">
				<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>
			</div>";

	$file = fopen(__DIR__."/cache/{$filename}", 'w+');
	fwrite($file, $out);
	fclose($file);

	header('Content-type:text/html');
	echo $out;

	$stmt1->close();
	$stmt0->close();
?>
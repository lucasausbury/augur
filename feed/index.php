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
	$filename = implode('>',$cats) . ".json";

	if( file_exists(__DIR__."/cache/{$filename}") ) {
		header('Content-type:application/json');
		echo file_get_contents(__DIR__."/cache/{$filename}");
		die();
	}

	$ids = array();
	$out = new StdClass();
	$out->books = array();

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
	$stmt1 = $mysqli->prepare("SELECT a.price, a.salesRank FROM books a, book_categories b 
		WHERE a.id=b.book AND RAND()<=0.0006 AND b.category IN {$in} GROUP BY price, salesRank LIMIT 10000");
	$stmt1->execute();
	$stmt1->store_result();
	$stmt1->bind_result($price, $rank);

	while($stmt1->fetch())
		$out->books[] = array($price, $rank);

	$json = json_encode($out);
	$file = fopen(__DIR__."/cache/{$filename}", 'w+');
	fwrite($file, $json);
	fclose($file);

	header('Content-type:application/json');
	echo $json;

	$stmt1->close();
	$stmt0->close();
?>
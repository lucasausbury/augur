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
	$out->categories = array();

	switch( count($cats) ) {
		case 0:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories");
			$stmt1 = $mysqli->prepare("SELECT b.c0, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0!='' AND c.category=b.id AND a.id=c.book GROUP BY b.c0");
			break;
		case 1:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c1, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1!='' AND c.category=b.id AND a.id=c.book GROUP BY b.c1");

			$stmt0->bind_param("i", $cats[0]);
			$stmt1->bind_param("i", $cats[0]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 2:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c2, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2!='' AND c.category=b.id AND a.id=c.book GROUP BY b.c2");

			$stmt0->bind_param("ii", $cats[0], $cats[1]);
			$stmt1->bind_param("ii", $cats[0], $cats[1]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 3:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c3, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2=? AND b.c3!='' AND c.category=b.id AND a.id=c.book GROUP BY b.c3");

			$stmt0->bind_param("iii", $cats[0], $cats[1], $cats[2]);
			$stmt1->bind_param("iii", $cats[0], $cats[1], $cats[2]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 4:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c4, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2=? AND b.c3=? AND b.c4!='' AND c.category=b.id AND a.id=c.book GROUP BY b.c4");

			$stmt0->bind_param("iiii", $cats[0], $cats[1], $cats[2], $cats[3]);
			$stmt1->bind_param("iiii", $cats[0], $cats[1], $cats[2], $cats[3]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 5:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=? AND c4=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c5, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2=? AND b.c3=? AND b.c4=? AND b.c5!='' AND c.category=b.id AND a.id=c.book GROUP BY b.c5");

			$stmt0->bind_param("iiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4]);
			$stmt1->bind_param("iiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 6:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=? AND c4=? AND c5=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c6, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2=? AND b.c3=? AND b.c4=? AND b.c5=? AND b.c6!='' AND c.category=b.id AND a.id=c.book GROUP BY b.c6");

			$stmt0->bind_param("iiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5]);
			$stmt1->bind_param("iiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 7:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=? AND c4=? AND c5=? AND c6=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c7, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2=? AND b.c3=? AND b.c4=? AND b.c5=? AND b.c6=? AND b.c7!='' c.category=b.id AND a.id=c.book GROUP BY b.c7");

			$stmt0->bind_param("iiiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5], $cats[6]);
			$stmt1->bind_param("iiiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5], $cats[6]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 8:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=? AND c4=? AND c5=? AND c6=? AND c7=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c8, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2=? AND b.c3=? AND b.c4=? AND b.c5=? AND b.c6=? AND b.c7=? AND b.c8!='' 
					AND c.category=b.id AND a.id=c.book GROUP BY b.c8");

			$stmt0->bind_param("iiiiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5], $cats[6], $cats[7]);
			$stmt1->bind_param("iiiiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5], $cats[6], $cats[7]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 9:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=? AND c4=? AND c5=? AND c6=? AND c7=? AND c8=?;");
			$stmt1 = $mysqli->prepare("SELECT b.c9, COUNT(c.book) FROM books a, categories b, book_categories c 
				WHERE b.c0=? AND b.c1=? AND b.c2=? AND b.c3=? AND b.c4=? AND b.c5=? AND b.c6=? AND b.c7=? AND b.c8=? AND b.c9!=''
					AND c.category=b.id AND a.id=c.book GROUP BY b.c9");

			$stmt0->bind_param("iiiiiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5], $cats[6], $cats[7], $cats[8]);
			$stmt1->bind_param("iiiiiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5], $cats[6], $cats[7], $cats[8]);
			$stmt1->execute();
			$stmt1->store_result();
			$stmt1->bind_result($cat, $bks);
			while( $stmt1->fetch() ) 
				$out->categories[] = array("category"=>$cat, "books"=>$bks);
			break;
		case 10:
			$stmt0 = $mysqli->prepare("SELECT id FROM categories WHERE c0=? AND c1=? AND c2=? AND c3=? AND c4=? AND c5=? AND c6=? AND c7=? AND c8=? AND c9=?;");
			$stmt0->bind_param("iiiiiiiiii", $cats[0], $cats[1], $cats[2], $cats[3], $cats[4], $cats[5], $cats[6], $cats[7], $cats[8], $cats[9]);
			break;
	}
	$stmt0->execute();
	$stmt0->store_result();
	$stmt0->bind_result($id);
	while($stmt0->fetch())
		$ids[] = $id;

	$in = "(".implode(',', $ids).")";
	$stmt2 = $mysqli->prepare("SELECT a.price, a.salesRank FROM books a, book_categories b 
		WHERE a.id=b.book AND RAND()<=0.0006 AND b.category IN {$in} GROUP BY price, salesRank LIMIT 10000");
	$stmt2->execute();
	$stmt2->store_result();
	$stmt2->bind_result($price, $rank);

	while($stmt2->fetch())
		$out->books[] = array($price, $rank);

	$json = json_encode($out);
	$file = fopen(__DIR__."/cache/{$filename}", 'w+');
	fwrite($file, $json);
	fclose($file);

	header('Content-type:application/json');
	echo $json;

	$stmt2->close();
	$stmt1->close();
	$stmt0->close();
?>
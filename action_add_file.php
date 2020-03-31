<?php
include_once('common_bo.php');

$res = array(
    'success' => false,
);

$file = $_REQUEST['file'];
$od = new Cetera\ObjectDefinition($_REQUEST['mat_type']);

$application->getConn()->insert($od->alias, array(
	'dat' => new \DateTime(),
	'dat_update' => new \DateTime(),
	'name' => basename($file),
	'idcat' => CATALOG_VIRTUAL_HIDDEN,
	'alias' => 'hidden',
	'type' => MATH_ADDED | MATH_PUBLISHED,
	'tag' => 0,
	'autor' => $user->id,
	'file' => $file
), array('datetime','datetime'));
	
$res['id'] = $application->getConn()->lastInsertId();
$res['file']['file'] = $file;
$res['file']['name'] = basename($file);
$res['success'] = true;

echo json_encode($res);
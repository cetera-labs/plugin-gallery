<?php
namespace Gallery;

class Widget extends \Cetera\Widget\Templateable
{
	use \Cetera\Widget\Traits\Material; 
	
    protected $_params = array(
		'material_id'    => null,
		'catalog'        => null,
		'material_alias' => null,
		'material_type'  => 'gallery',
		'material_field' => 'pictures',
		'css_class'      => '',
		'template'       => 'default.twig',
    );

	public function getChildren()
	{
		$m = $this->getMaterial();
		if (!$m) return false;
		return $m->getDynamicField( $this->getParam('material_field') );
	}

}
<?php
define('PSEUDO_FIELD_GALLERY', 1100);
define('EDITOR_MATSET_GALLERY', 100);
define('GROUP_GALLERY', -104);

$t = $this->getTranslator();
$t->addTranslation(__DIR__.'/lang');

$this->registerWidget(array(
    'name'    => 'Gallery',
    'class'   => '\\Gallery\\Widget',
    'describ' => $t->_('Фотогалерея'),
    'icon'    => 'gallery.gif',
    'ui'      => 'Plugin.gallery.Widget',
));

$this->addUserGroup(array(
    'id'      => GROUP_GALLERY,
    'name'    => $t->_('Редакторы фотогалерей'),
    'describ' => '',
));

if ($this->getBo())
{

    $this->getBo()->addEditor(array(
         'id'    => EDITOR_MATSET_GALLERY,
         'alias' => 'editor_matset_gallery',
         'name'  => $t->_('Редактор фотогалереи')
    ));

    $this->getBo()->addPseudoField(array(
         'id'       => PSEUDO_FIELD_GALLERY,
         'original' => FIELD_MATSET,
         'len'      => 'gallery_picture',
         'name'     => $t->_('Фотогалерея')
    ));
    
    $this->getBo()->addFieldEditor(PSEUDO_FIELD_GALLERY, EDITOR_MATSET_GALLERY);
 
    include_once( __DIR__.'/editor_matset_gallery.php' );   
	
	if ($this->getUser() && $this->getUser()->hasRight(GROUP_GALLERY) )
	{
		$this->getBo()->addModule(array(
				'id'	   => 'gallery',
				'position' => MENU_SITE,
				'name' 	   => $t->_('Фотогалереи'),
				'icon'     => '/cms/plugins/gallery/images/gallery.gif',
                'iconCls'  => 'x-fa fa-images',
				'class'    => 'Plugin.gallery.Panel'
		));

	}	
}
Ext.require('Cetera.field.WidgetTemplate');
Ext.require('Cetera.field.Folder');

// Панелька виджета
Ext.define('Plugin.gallery.Widget', {
    extend: 'Cetera.widget.Widget',
    
    saveButton: true,
    
    formfields :  [
	        {
                fieldLabel: _('Галерея'),
                xtype: 'folderfield',
                name: 'material_id',
				materials: 1,
				nocatselect : 1,
				mat_type: 'gallery',
                allowBlank: false
            },		
			{
				xtype: 'widgettemplate',
				widget: 'Gallery'
			}
	]
    
});
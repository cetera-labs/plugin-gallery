Ext.define('Plugin.gallery.Field', {

    extend: 'Cetera.field.RichMatSet',
	
	requires: 'Cetera.Ajax',
	
	uploadPath: '/uploads/',
	
	queue: [],
	activeUploads: 0,
    
    getPanel : function() {
    
        var panel = this.callParent();
        var tb = panel.getDockedComponent( 0 );
		
        this.btnUpload = Ext.create('Ext.form.field.File',{
			buttonOnly: true,
			style: {
				overflow: 'hidden'
			},		
			buttonConfig: {
				iconCls:'icon-upload',
				text: _('Загрузить изображения')
			},
            listeners: {
				afterrender: function(el) {
					el.fileInputEl.set({ multiple: 'multiple' });					
				},
				change: function(el, value) {										
					var input = el.fileInputEl.dom;	
					for(var i=0;i<input.files.length;i++) {
						
						var d = input.files[i].name.split('.');
						var ext = d.pop().toLowerCase();
						if (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif') {
							
							var progress = Ext.create('Ext.ProgressBar', {
								bodyCls: 'x-window-body-default',        
								cls: 'x-window-body-default',
								text: _('Загрузка')+': '+input.files[i].name + ' - ' + _('ожидание'),
								margin: 3
							});	
							this.uploadPanel.insert(0,progress);							
							input.files[i].progress = progress;
							
							this.queue.push(input.files[i]);
						}						
					}	
					this.uploadQueue();
				},
				scope: this
			}
        });		
		
        tb.add('-');
		
        tb.add(this.btnUpload);		
		
		tb.add('-');
		
        tb.add({
            tooltip: _('Загрузить из ZIP'),
            icon: '/cms/plugins/gallery/images/icon-zip.png',
            handler: this.onArchive,
            scope: this
        });
		
		this.uploadPanel = Ext.create('Ext.Panel');
		
		panel.insertDocked('top', this.uploadPanel);
		
        Ext.Ajax.request({
            url: '/cms/include/action_files.php',
            params: {action: 'upload_path'},
            scope: this,
            success: function(resp) {
                var obj = Ext.decode(resp.responseText);
                if (obj.path) this.uploadPath = obj.path;
            }
        });		
		
        return panel;
    },
	
	uploadQueue: function() {
		var me = this;
		if (me.activeUploads >= 3) return;
		if (this.queue == 0) return;
		me.uploadFile(this.queue.pop());
		me.uploadQueue();
	},
	
	uploadFile: function(file) {
		
		var me = this;
		var formData = new FormData();
		formData.append('file', file); 
		
		var prefix = _('Загрузка')+': '+file.name;

		var progress = file.progress;
		me.activeUploads++;
		
		Cetera.Ajax.request({
			url: '/cms/include/action_files.php?action=upload&path='+this.uploadPath,
			timeout: 1000000,
			method: 'POST',
			rawData: formData,
			ignoreHeaders: true,
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				if (obj.success) {								
					
					Ext.Ajax.request({
						url: '/plugins/gallery/action_add_file.php',
						params: { file: obj.path+ obj.file, mat_type: this.mat_type },
						scope: this,
						success: function(resp) {

							var obj = Ext.decode(resp.responseText);
								
							var item = Ext.create('Cetera.RichMatsetMaterial' + this.mat_type);
							item.material_id = obj.id;
							item.getForm().setValues(obj.file);
							this.panel.add(item);                            

						}
					});
					
				}
				setTimeout(function(){
					me.uploadPanel.remove(progress, true);
				},500);	
				me.activeUploads--;
				me.uploadQueue();				
			},
			failure: function(resp) {
				
				setTimeout(function(){
					me.uploadPanel.remove(progress, true);
				},5000);
				
				var msg = _('Ошибка!');
				var o = Ext.decode(resp.responseText);
				if (o.message) msg += ' '+o.message;				
				progress.updateProgress( 0, prefix + ' - ' + msg );
				
				me.activeUploads--;
				me.uploadQueue();
			},
			uploadProgress: function(e) {
				progress.updateProgress( e.loaded/e.total, prefix + ' - ' + parseInt(e.loaded*100/e.total)+'%' );
			},
			scope: me
		});		
	
	},
    
    onArchive: function() {
        if (!this.uploadWindow) {
        
            this.uploadWindow = Ext.create('Cetera.window.Upload', { 
                showPath: false,
                path: '/uploads/' 
            });
            
            this.uploadWindow.on('successUpload', function(info) {
                var file = info.path + info.file;

                Ext.Ajax.request({
                    url: '/plugins/gallery/action_unzip.php',
                    params: { file: file, mat_type: this.mat_type },
                    scope: this,
                    success: function(resp) {

                        var obj = Ext.decode(resp.responseText);
                        for (var i=0; i<obj.files.length; i++) { 
                            
                            var item = Ext.create('Cetera.RichMatsetMaterial' + this.mat_type);
                            item.material_id = obj.files[i].id;
                            item.getForm().setValues(obj.files[i]);
                            this.panel.add(item);                            
                            
                        }

                    }
                });

            }, this);            
            
        }
        this.uploadWindow.show();
    }          
    
});
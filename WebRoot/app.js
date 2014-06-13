Ext.define('SSPApp.main.TopPanel', {
	extend: 'Ext.panel.Panel',
	border: false,
	height: 30,
	html: '<div style="margin-top:5px;font-weight: bold;font-size: 20px;margin-left: 10px;color: #333333;vertical-align: center;">SSP 管理系统<div>'
});

Ext.define('SSPApp.main.BottomPanel', {
	extend: 'Ext.panel.Panel',
	border: true,
	height: 20,
	html: '<div style="margin-top:5px;font-weight: bold;font-size: 15px;margin-left: 10px;color: #333333;vertical-align: center;">1.0<div>'
});

Ext.define('SSPApp.main.NavigationPanel', {
	extend: 'Ext.panel.Panel',
	border: true,
	width: 200,
	layout: 'accordion',
	
	createNV: function(menuData) {
		var me = this;
		for(var i = 0; i < menuData.ModuleTree.length; i++) {
			this.add({
				title: menuData.ModuleTree[i].text,
				xtype: 'treepanel',
				rootVisible: false,
				store: Ext.create('Ext.data.TreeStore', {
					root: {
						expanded: true,
				        children: menuData.ModuleTree[i].children
					}
				}),
				listeners: {
					itemclick: function(tree, record, item, index, e, eOpts ) {
						me.onTreeClick(record);
					}
				}
			})
		}
	},
	
	onTreeClick: function(record) {
		this.fireEvent('menuClick', record.data);
	},
	
	initComponent: function() {
		this.items = [];
		this.callParent();
	}
});

Ext.define('SSPApp.main.MainTab', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Ext.ux.TabReorderer'
    ],
    border: false,
    plugins: 'tabreorderer',
    layout: 'hbox',
    defaults: {
        bodyPadding: 10,
        autoScroll: true,
        closable: true,
        border: false
    },
    items: [{
        title: 'Home',
        closable: false,
        html: '首页'
    }]
});

Ext.application({
    name   : 'SSPApp',
    launch : function() {
    	var mainTab = Ext.create('SSPApp.main.MainTab', {
    		region: 'center',
    		defaults: {
		        bodyPadding: 1,
		        autoScroll: true
		    }
    	});
    	
    	var top = Ext.create('SSPApp.main.TopPanel',{
    		region: 'north'
    	})
    	var south = Ext.create('SSPApp.main.BottomPanel',{
    		region: 'south'
    	})
    	
    	var nv = Ext.create('SSPApp.main.NavigationPanel',{
    		region: 'west',
    		listeners: {
    			menuClick: function(d) {
    				var tabItem = mainTab.getComponent(d.id);
    				if(tabItem) {
    					mainTab.setActiveTab(tabItem);
    				}
    				else {
    					Ext.require(d.className, function() {
	    					var p = Ext.create(d.className,{id:d.id,closable: true, border: false});
						    mainTab.add(p).show();
						    p.updateLayout();
						});
    				}
    			}
    		}
    	})
    	
    	Ext.getBody().mask('正在加载用户信息...');
    	Ext.Ajax.request({
		    url: 'menu.json',
		    success: function(response){
		    	Ext.getBody().unmask();
		        var menuData = Ext.JSON.decode(response.responseText);
		        nv.createNV(menuData);
		        Ext.create('Ext.container.Viewport', {
		    		layout: 'border',
		    		items:[mainTab,top,nv,south]
		    	});
		    }
		});
    }
});
Ext.define('User', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: ['id','name', 'email', 'phone']
});

Ext.define('basic.UserAddWin', {
	extend: 'Ext.window.Window',
	height: 300,
    width: 400,
    title: '新建用户',
    autoScroll: true,
    bodyPadding: 10,
    modal: true,
    frame: true,
    layout: 'form',
    
    initComponent: function() {
    	
    	this.items = [
    		{xtype: 'textfield',fieldLabel: '用户名', name: 'first'},
			{xtype: 'textfield',fieldLabel: '真实姓名', name: 'first'}
    	];
    	
    	this.buttons = [
	    	{text: '保存'},
	    	{text: '取消', scope: this, handler: this.onCancel}
	    ]
	    this.callParent();
    },
    
    onCancel: function() {
    	this.close();
    }
});

Ext.define('basic.UserPanel', {
	extend: 'Ext.panel.Panel',
	title: '用户管理',
	border: false,
	layout: 'fit',
	
	requires: [
        'Ext.layout.container.Border',
        'Ext.ux.ProgressBarPager',
        'Ext.selection.CheckboxModel'
    ],
    
	initComponent: function() {
		var me = this;
		var userSearchStore = Ext.create('Ext.data.JsonStore', {
			storeId:'simpsonsStore',
		    model: 'User',
		    data:{
		    	'invdata':[
			        {'id': 1,  'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
			        {'id': 2,  'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
			        {'id': 3,  'name': 'Homer', "email":"homer@simpsons.com",  "phone":"555-222-1244"  },
			        {'id': 4,  'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
		    	]
		    },
		    proxy: {
		        type: 'memory',//OR ajax
		        reader: {type: 'json',rootProperty: 'invdata'}
		    }
		});
		
		this.items = [
			{
				layout: 'border',
				items:[
					{
						xtype: 'form',
						region: 'north',
						height: 40,
						frame: true,
						layout: 'hbox',
						defaults: {margin: 5},
						fieldDefaults: {
					        labelAlign: 'right',
					        labelWidth: 70
					    },
						items: [
							{xtype: 'textfield',fieldLabel: '用户名', name: 'first'},
							{xtype: 'textfield',fieldLabel: '真实姓名', name: 'first'},
					        {xtype: 'button',text: '查询'},
					        {xtype: 'button',text: '清空'}
						]
					},
					{
						xtype: 'panel',
						layout: 'fit',
						region: 'center',
						bodyPadding: 1,
						items:[
							{
								xtype: 'grid',
								mask: true,
								border: false,
								store: userSearchStore,
								reference : 'searchGrid',
								selModel:new Ext.selection.CheckboxModel({mode: 'SINGLE'}),
								columns: [
							        { text: 'Name',  dataIndex: 'name' },
							        { text: 'Email', dataIndex: 'email', width: 200},
							        { text: 'Phone', dataIndex: 'phone' , width: 150}
							    ],
							    tbar: [
							    	{text: '新建', scope: this, handler: this.onAddClick},
							    	{text: '修改', scope: this, handler: this.onModifyClick},
							    	{text: '删除', scope: this, handler: this.onDelClick}
							    ],
							    bbar: {
					                xtype: 'pagingtoolbar',
					                pageSize: 10,
					                store: userSearchStore,
					                displayInfo: true,
					                plugins: new Ext.ux.ProgressBarPager()
					            }
							}
						]
					}
				]
			}
		];
		this.callParent();
	},
	
	onAddClick: function() {
		Ext.create('basic.UserAddWin', {}).show();
	},
	
	onModifyClick: function() {
		var so = this.down('grid').getSelectionModel().getSelection();
		if(so.length != 1) {
			Ext.Msg.show({title:'提示',message: '请选择一条记录',buttons: Ext.Msg.YES,icon: Ext.Msg.WARNING});
			return;
		}
		
		Ext.create('basic.UserAddWin', {}).show();
	},
	
	onDelClick: function() {
		var so = this.down('grid').getSelectionModel().getSelection();
		if(so.length != 1) {
			Ext.Msg.show({title:'提示',message: '请选择一条记录',buttons: Ext.Msg.YES,icon: Ext.Msg.WARNING});
			return;
		}
		
		Ext.Msg.show({
		    title:'提示信息',
		    message: '确定删除?',
		    buttons: Ext.Msg.YESNOCANCEL,
		    icon: Ext.Msg.QUESTION,
		    fn: function(btn) {
		        if (btn === 'yes') {
		        	alert('yes');
		        } else if (btn === 'no') {
		            alert('no');
		        } else {
		            alert('Cancel');
		        } 
		    }
		});
	}
});
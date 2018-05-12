$(function(){

	var typeMap = {
		"Windows 7 (64-bit)":"windows7_64",
		"Windows 8 (64-bit)":"windows8_64",
		"Ubuntu (64-bit)":"Ubuntu_64",
		"Red Hat (64-bit)":"RedHat_64"
	}

	var typeObj = {
		windows:[
			{
				val:"windows7_64",
				name:"Windows 7 (64-bit)"
			},
			{
				val:"windows8_64",
				name:"Windows 8 (64-bit)"
			},
		],
		liunx:[
			{
				val:"Ubuntu_64",
				name:"Ubuntu (64-bit)"
			},
			{
				val:"RedHat_64",
				name:"Red Hat (64-bit)"
			},
		]
	}

	var alertCreat = {
        onleOne:true,
        alertObj:null,
        domStr:"",
        tplDom:[
            '<div class="alert-create">',
            	'<div class="col-md-12 margin-top">',
            		'<div class="form-group">',
            			'<label for="name">名称</label>',
            			'<input type="text" class="form-control" name="name" id="name" placeholder="请输入名称">',
            		'</div>',
            		'<div class="form-group">',
            			'<label for="nickname">类型</label>',
            			'<div class="self-select">',
            				'<select id="type" class="selectpicker">',
            					'<option value="windows">windows</option>',
            					'<option value="liunx">linux</option>',
            				'</select>',
            			'</div>',
            		'</div>',
            		'<div class="form-group">',
            			'<label for="nickname">版本</label>',
            			'<div class="self-select">',
            				'<select id="version" class="selectpicker">',
            				'</select>',
            			'</div>',
            		'</div>',
            		'<div class="form-group">',
            			'<label for="internalSize">内存大小</label>',
            			'<div class="input-group">',
	            			'<input type="text" class="form-control" name="internalSize" id="internalSize" placeholder="请输入内存大小" value="1024">',
	            			'<span class="input-group-addon">MB</span>',
            			'</div>',
            		'</div>',
            		// '<div class="form-group">',
            		// 	'<label for="memorySize">显存大小</label>',
            		// 	'<input type="text" class="form-control" name="memorySize" id="memorySize" placeholder="请输入显存大小">',
            		// '</div>',
            		'<button type="button" class="btn btn-primary  jSubmit disabled">创建</button>',
            	'</div>',
            '</div>',
        ].join(""),
        init:function(obj){
            this.renderData(obj);
            if(this.alertObj){
                
            }else{
                // 初始化弹窗
                this.getObj();
                start.funcs.initSelect("windows")
            }
            this.alertObj.show();
            if(this.onleOne){
                this.addEvents();
                this.onleOne = false;
            }
        },
        renderData:function(obj){
        	var _self = this;
            contentHtml = _self._render(_self.tplDom,obj);
            _self.domStr = contentHtml;
        },
        getObj:function(){
            var _self = this;
            _self.alertObj = wfe.init("alert",{
                data:{
                    center:true,
                    back_hide:true,
                    className:""
                },
                content:_self.domStr
            },$("body")[0]);
        },
        addEvents:function(){
            var _self = this;
            $('#type').selectpicker({});
			$('#version').selectpicker({});

			$("#type").on("changed.bs.select",function(){
				var val = $("#type").selectpicker("val")
				console.log(val)
				start.funcs.initSelect(val)
			})

			$("#name").on("input propertychange",function(){
				var $Dom = $(".jSubmit")
				var val = $("#name").val()
				if(val.length > 0){
					$Dom.removeClass("disabled")
				}else{
					$Dom.addClass("disabled")
				}
			})

			// 提交
			$(document).on("click",".jSubmit",function(){
				_self.eventsHandles.submit($(this));
			})
        },
        eventsHandles:{
			submit:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				currentItem.addClass("disabled")
				var name = $("#name").val();
				var version = $("#version").selectpicker("val");
				var internalSize = $("#internalSize").val();
				// var memorySize = $("#memorySize").val();
				var postData = {
					name:name,
					version:version,
					internalSize:internalSize,
					// memorySize:memorySize
				}
				console.log(postData)
				var url = "ajax_createVm";
				start.funcs._ajax(postData,url,function(data){
					if(data.status == 1){
						location.href = "/vmlist"
					}
				})
			}
		},
        // 模板渲染方法 
        /**
        * tpl: 模板
        * data: 数据
        * 返回字符串
        */
        _render:function(tpl,data){
            var render = template.compile(tpl);
            var html = render(data);
            return html;
        },
        _ajax: function(data, urls, cb, fb) {
            var ajax = {
                url: urls,
                type: 'GET',
                dataType: 'json',
                cache: false,
                traditional: true,
                data: data,
                success: function(json, statusText) {
                    // if(json.status == 1 || json.Status == true){      
                    cb && cb(json);
                    // }else{  
                    //  if(json == 1) return; 
                    //  fb&&fb(json);
                    //  gd.tipF.show_success(json.errorMsg);
                    // }
                },
                error: function(json) {
                    // console.error(json)
                }
            }
            $.ajax(ajax);
        },
    }

    var alertClone = {
        onleOne:true,
        alertObj:null,
        domStr:"",
        initObj:{
        	adrs:"",
        	version:""
        },
        tplDom:[
            '<div class="alert-clone">',
            	'<div class="col-md-12 margin-top">',
            		'<div class="form-group">',
            			'<label for="name">名称</label>',
            			'<input type="text" class="form-control" name="name" id="name" placeholder="请输入拷贝后虚拟机的名称">',
            		'</div>',
            		'<button type="button" class="btn btn-primary  jSubmitClone disabled">提交</button>',
            	'</div>',
            '</div>',
        ].join(""),
        init:function(obj){
        	this.initObj.adrs = obj.adrs;
        	this.initObj.version = obj.version;
            this.renderData(obj);
            if(this.alertObj){
                
            }else{
                // 初始化弹窗
                this.getObj();
                start.funcs.initSelect("windows")
            }
            this.alertObj.show();
                this.addEvents();
            if(this.onleOne){
                this.onleOne = false;
            }
        },
        renderData:function(obj){
        	var _self = this;
            contentHtml = _self._render(_self.tplDom,obj);
            _self.domStr = contentHtml;
        },
        getObj:function(){
            var _self = this;
            _self.alertObj = wfe.init("alert",{
                data:{
                    center:true,
                    back_hide:true,
                    className:""
                },
                content:_self.domStr
            },$("body")[0]);
        },
        addEvents:function(){
            var _self = this;

			$("#name").on("input propertychange",function(){
				var $Dom = $(".jSubmitClone")
				var val = $("#name").val()
				if(val.length > 0){
					$Dom.removeClass("disabled")
				}else{
					$Dom.addClass("disabled")
				}
			})

			// 提交
			$(document).on("click",".jSubmitClone",function(){
				_self.eventsHandles.submit($(this));
			})
        },
        eventsHandles:{
			submit:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				currentItem.addClass("disabled")
				var name = $("#name").val();
				var version = alertClone.initObj.version;
				var adrs = alertClone.initObj.adrs.slice(1,-1);
				var postData = {
					name:name,
					version:version,
					adrs:adrs
				}
				var url = "ajax_cloneVm";
				console.log(postData)
				start.funcs._ajax(postData,url,function(data){
					console.log(data)
					if(data.status == 1){
						location.href = "/vmlist"
					}
				})
			}
		},
        // 模板渲染方法 
        /**
        * tpl: 模板
        * data: 数据
        * 返回字符串
        */
        _render:function(tpl,data){
            var render = template.compile(tpl);
            var html = render(data);
            return html;
        },
        _ajax: function(data, urls, cb, fb) {
            var ajax = {
                url: urls,
                type: 'GET',
                dataType: 'json',
                cache: false,
                traditional: true,
                data: data,
                success: function(json, statusText) {
                    // if(json.status == 1 || json.Status == true){      
                    cb && cb(json);
                    // }else{  
                    //  if(json == 1) return; 
                    //  fb&&fb(json);
                    //  gd.tipF.show_success(json.errorMsg);
                    // }
                },
                error: function(json) {
                    // console.error(json)
                }
            }
            $.ajax(ajax);
        },
    }

	var start = {
		init:function(){
			this.addEvents();
		},
		addEvents:function(){
			var _self = this;
			$(document).on("click",".jBtnClose",function(){
				_self.eventsHandles.close($(this));
			})
			$(document).on("click",".jBtnBegin",function(){
				_self.eventsHandles.begin($(this));
			})
			$(document).on("click",".jBtnDel",function(){
				_self.eventsHandles.del($(this));
			})
			$(document).on("click",".jBtnPause",function(){
				_self.eventsHandles.pause($(this));
			})
			$(document).on("click",".jBtnResume",function(){
				_self.eventsHandles.resume($(this));
			})
			$(document).on("click",".jBtnReset",function(){
				_self.eventsHandles.reset($(this));
			})
			$(document).on("click",".jBtnCreate",function(){
				_self.eventsHandles.create();
			})
			$(document).on("click",".jBtnClone",function(){
				_self.eventsHandles.clone($(this));
			})
		},
		eventsHandles:{
			close:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				currentItem.addClass("disabled")
				var parTr = currentItem.parents("tr");
				var name = parTr.data("name"),
					uuid = parTr.data("uuid");
				var postData = {
					name:name,
					uuid:uuid,
					contF:"4"
				}
				start.funcs.controlVm(postData,function(data){
					if(data.status == 1){
						location.reload(true)
					}
				})
			},
			begin:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				currentItem.addClass("disabled")
				var parTr = currentItem.parents("tr");
				var name = parTr.data("name"),
					uuid = parTr.data("uuid");
				var postData = {
					name:name,
					uuid:uuid
				}
				var url = "ajax_startVm";
				start.funcs._ajax(postData,url,function(data){
					if(data.status == 1){
						location.reload(true)
					}
				})
			},
			del:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				currentItem.addClass("disabled")
				var parTr = currentItem.parents("tr");
				var name = parTr.data("name"),
					uuid = parTr.data("uuid");
				var postData = {
					name:name,
					uuid:uuid
				}
				var url = "ajax_delVm";
				start.funcs._ajax(postData,url,function(data){
					if(data.status == 1){
						location.reload(true)
					}
				})
			},
			pause:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				currentItem.addClass("disabled")
				var parTr = currentItem.parents("tr");
				var name = parTr.data("name"),
					uuid = parTr.data("uuid");
				var postData = {
					name:name,
					uuid:uuid,
					contF:"1"
				}
				start.funcs.controlVm(postData,function(data){
					if(data.status == 1){
						currentItem.text("恢复")
						currentItem.removeClass("jBtnPause").addClass("jBtnResume")
						currentItem.removeClass("disabled")
					}
				})
			},
			resume:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				currentItem.addClass("disabled")
				var parTr = currentItem.parents("tr");
				var name = parTr.data("name"),
					uuid = parTr.data("uuid");
				var postData = {
					name:name,
					uuid:uuid,
					contF:"2"
				}
				start.funcs.controlVm(postData,function(data){
					if(data.status == 1){
						currentItem.text("暂停")
						currentItem.removeClass("jBtnResume").addClass("jBtnPause")
						currentItem.removeClass("disabled")
					}
				})
			},
			reset:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				var parTr = currentItem.parents("tr");
				var name = parTr.data("name"),
					uuid = parTr.data("uuid");
				var postData = {
					name:name,
					uuid:uuid,
					contF:"3"
				}
				start.funcs.controlVm(postData,function(data){
					console.log(data)
				})
			},
			create:function(){
				alertCreat.init();
			},
			clone:function(currentItem){
				if(currentItem.hasClass("disabled")){
					return
				}
				var parTr = currentItem.parents("tr");
				var adrs = parTr.data("adrs"),
					ostype = parTr.data("ostype").slice(1,-1);
				console.log(ostype)
				var obj = {
					adrs:adrs,
					version:typeMap[ostype]
				}
				console.log(obj)
				alertClone.init(obj)
			}
		},
		funcs:{
			controlVm:function(obj,cb){
				var postData = obj;
				var url = "ajax_controlVm"
				start.funcs._ajax(postData,url,function(data){
					cb && cb(data);
				})
			},
			initSelect:function(type){
				var arr = typeObj[type];
				var html = "";
				for(var i=0;i<arr.length;i++){
					var baseHtml = '<option value="'+arr[i].val+'">'+arr[i].name+'</option>'
					html += baseHtml
				}
				$("#version").html(html);
				$("#version").selectpicker('refresh');
			},
			// 模板渲染方法 
            /**
            * tpl: 模板
            * data: 数据
            * 返回字符串
            */
            _render:function(tpl,data){
                var render = template.compile(tpl);
                var html = render(data);
                return html;
            },
            _ajax : function(data, urls, cb, fb){
                var ajax = { 
                    url: urls,
                    type: 'GET',
                    dataType: 'json', 
                    cache: false, 
                    traditional: true,
                    data: data,  
                    success: function(json, statusText) {   
                        cb&&cb(json); 
                    },
                    error:function(json){
                        
                    }
                }
                $.ajax(ajax); 
            },
		}
	}

	start.init()
})
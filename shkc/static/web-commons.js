/*
//复选框反选
 */
(function($){

	$.fn.check_against = function(boxname,trig) {  
		$(this).click(function(){
			var checkboxs=$("input[type='checkbox'][name='"+boxname+"']");
			$.each(checkboxs,function(){
				//if(trig==true) $(this).trigger('click',"trigger");
				  this.checked = !this.checked;			
			});
			return false;
		});
	};  
	$.fn.check_against2 = function(boxname,callback) {  
		$(this).click(function(){
			var checkboxs=$("input[type='checkbox'][name='"+boxname+"']");
			$.each(checkboxs,function(){
				this.checked = !this.checked;
				//alert(callback);
				if(callback!=undefined) callback($(this));					
			});
			return false;
		});
	};  
 
/*设置ifram 根据内容自动调整高度，ifram 内必须有body，本方法是在ifram所在页面调用*/	
	$.fn.framAutoHeight=function(){
			return this.each(function(){
				$(this).load(function(){
						var main=$(window.parent.document).find("iframe.auto");
						main.each(function(){
							if(this.contentWindow==window){
								$(this).height(0);
								var thisheight = $(document).height();						
								$(this).height(thisheight);
							}
						});
				});
			});
	};
	/**自动调整ifram高度，本方法可以写在被ifram包含的页面，实现对父页面的ifram进行设置*/
	$.webCommons={
		setframAuto:function(){
			var ifrm=$(window.parent.document).find("iframe.auto");
			ifrm.each(function(){
				$(this).load(function(){
						var main=$(window.parent.document).find("iframe.auto");
						main.each(function(){
							if(this.contentWindow==window){
								$(this).height(0);
								var thisheight = $(document).height();						
								$(this).height(thisheight);
							}
						});
				});
			});
		}
	}
})(jQuery);
/*增加自动传递表单标题功能*/
  $(document.body).ready(function(){
		var ph=$(".headline:first");
		if(ph!=null&& $("#message_pagetitle").length==0) $("form:first").append("<input type='hidden' id ='message_pagetitle' name='message_pagetitle' value='"+$.trim(ph.text())+"' >");

});

/*
//��ѡ��ѡ
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
 
/*����ifram ���������Զ������߶ȣ�ifram �ڱ�����body������������ifram����ҳ�����*/	
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
	/**�Զ�����ifram�߶ȣ�����������д�ڱ�ifram������ҳ�棬ʵ�ֶԸ�ҳ���ifram��������*/
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
/*�����Զ����ݱ����⹦��*/
  $(document.body).ready(function(){
		var ph=$(".headline:first");
		if(ph!=null&& $("#message_pagetitle").length==0) $("form:first").append("<input type='hidden' id ='message_pagetitle' name='message_pagetitle' value='"+$.trim(ph.text())+"' >");

});

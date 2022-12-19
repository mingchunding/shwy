/*
 *描 述:web-ui组件文件，包括：
 *	1.数据表格组件:名称：datagrid，用法：$('.yourclassname').datagrid()；
 *	2.按钮工具条:BtnToolBar,用法：var bar=$('.btn_toolbar').BtnToolBar()；
 *  3.渐变图片按钮组件：名称：PicButton，用法：$('.btn').PicButton()；
 *  4.窗体遮罩组件,setmask,unmask.$("body").setmask('wait message...',点击元素);
 *  5.表单验证
 *  6.前端分页
 *  7.多级折叠式菜单
 *  8.日历框
 *  9.其他WEB UI控件等等......
 *版本：v1.3.015  build  base on  jQuery -  v1.7.x
 *创建时间: 2011-8-15
 *by 张传生 mail:zchuansheng@gmail.com;mail2:zchuansheng@163.com
 */
(function(a) {
	a.createGrid = function(b, d) {
		if (b.grid) {
			return false
		}
		d = a.extend({
			width : "100%",
			height : 500,
			striped : true,
			defaultSel : true,
			trselect : true,
			onSelect : false,
			onAddRow : false,
			toolbar : null,
			btnCondClass : "btn_condition",
			fixhead : false,
			hashead : true,
			sortable : false,
			filterable : false,
			idCol : null,
			idStart : 1,
			print : "print",
			headclass : "gridheadclass",
			trclass : null,
			tdclass : null,
			thresPage : 1000,
			defSizePage : 15,
			colspan : null,
			rowspan : null,
			nowrap : true
		}, d);
		if (d.print == "preview") {
			d.fixhead = false;
			d.trselect = false;
			d.onSelect = false;
			d.striped = false;
			d.headclass = "gridheadclassprint";
			a(b).addClass("print_class");
			a(">tbody>tr", b).each(
					function() {
						a(this).addClass(
								d.trclass == null ? "print_tr_class"
										: d.trclass);
						a(">td", a(this)).addClass(
								d.tdclass == null ? "print_td_class"
										: d.tdclass)
					});
			a(">thead>tr", b).each(
					function() {
						a(this).addClass(
								d.trclass == null ? "print_tr_class"
										: d.trclass);
						a(">td,>th", a(this)).addClass(
								d.tdclass == null ? "print_td_class"
										: d.tdclass)
					})
		} else {
			if (d.print == "preview") {
				d.fixhead = false
			}
		}
		var c = {
			initHead : function(h) {
				var g = a(">thead ", h);
				var f = a("tr:first", h);
				if (g.length == 0) {
					g = a("<thead></thead>");
					g.append(f);
					a(h).prepend(g)
				}
				var i = a(">tr th", g);
				if (i.length <= 0) {
					a(">td", f).each(function() {
						var j = document.createElement("th");
						j.innerHTML = this.innerHTML;
						a(j).attr("width", a(this).attr("width"));
						a(j).attr("class", a(this).attr("class"));
						a(j).attr("rowspan", a(this).attr("rowspan"));
						a(j).attr("sortable", a(this).attr("sortable"));
						a(j).attr("filterable", a(this).attr("filterable"));
						a(j).attr("colspan", a(this).attr("colspan"));
						a(j).addClass(d.headclass);
						a(this).replaceWith(j)
					})
				} else {
					i.each(function() {
						i.addClass(d.headclass)
					})
				}
				a(h).attr("width", d.width)
			},
			setBar : function(f) {
				d.toolbar = f;
				a(">tbody tr:first", b).trigger("click")
			},
			initBody : function(g) {
				var f = a(">tbody ", g);
				if (f.length > 0) {
				} else {
					var f = document.createElement("tbody");
					a("tr ", g).each(function() {
						a(f).append(this)
					})
				}
			},
			addcol : function(g, i) {
				if (i == null) {
					i = {}
				}
				var h = a("thead>tr", c.top);
				if (i.ipos == null) {
					i.ipos = a(">th,>td", h).length - 1
				}
				h.each(function() {
					var k = a(">td:eq(" + i.ipos + "),>th:eq(" + i.ipos + ")",
							this);
					var j = a('<th class="' + d.headclass + '" >'
							+ (i.title == null ? "新增" : i.title) + "</th>");
					if (i.width != null) {
						j.attr("width", i.width)
					}
					k.after(j)
				});
				var f = a(">tbody>tr", c.top);
				f.each(function() {
					var j = a(">td:eq(" + i.ipos + ")", this);
					j.after(a("<td></td>").append(g))
				});
				if (d.fixhead) {
					c.fixhead.adjustWidth()
				}
			},
			appendElements : function(i, k) {
				if (k == null) {
					k = {}
				}
				var j = (k.irow != null && (/^\d+$/.test(k.irow)));
				var g = (k.tohead == true) ? (j ? "thead.hashead>tr:eq("
						+ k.irow + ")" : "thead.hashead>tr")
						: (j ? ">tbody>tr:eq(" + k.irow + ")" : ">tbody>tr");
				var h = (k.icol != null && (/^\d+$/.test(k.icol))) ? ">td:eq("
						+ k.icol + "),>th:eq(" + k.icol + ")" : " >td, >th";
				var f = a(g, c.top);
				f.each(function() {
					var l = a(h, this);
					var n = null;
					if (k.linkid != null) {
						if (/^\d+$/.test(k.linkid)) {
							n = a(">td:eq(" + k.linkid + ")", this).text()
						} else {
							n = a("#" + k.linkid, this).text()
						}
					}
					var m = a(i);
					if (n != null) {
						m.val(n)
					}
					if (k.clear == true) {
						l.empty()
					}
					l.append(m)
				});
				if (d.fixhead) {
					c.fixhead.adjustWidth()
				}
			},
			formatgrid : function(h, g) {
				var f = (g == null) ? a(">tbody>tr ", h) : a(g, h);
				f.each(function(i, k) {
					var j = a(this);
					if (d.idCol != null) {
						if ((i >= (d.idStart - 1))) {
							if (!isNaN(d.idCol) && d.idCol > 0) {
								a(">td:eq(" + (d.idCol - 1) + ")", j).text(
										(i + 1 - d.idStart) + 1)
							} else {
								a("." + d.idCol, j).text(
										(i + 1 - d.idStart) + 1)
							}
						}
					}
					if (d.trselect) {
						j.unbind("click").click(function() {
							a(".trSelected", h).removeClass("trSelected");
							j.toggleClass("trSelected");
							var l = a("td:first", this).attr("btn_condition");
							if (d.toolbar != null) {
								d.toolbar.refreshbyName(l)
							}
							c.currIndex = i;
							c.selrow = j;
							if (d.onSelect) {
								d.onSelect(c.currIndex, this)
							}
						})
					}
					if (d.striped) {
						if (i % 2 != 0) {
							j.removeClass("erow").addClass("orow")
						} else {
							j.removeClass("orow").addClass("erow")
						}
					}
				});
				if (d.trselect) {
					a(h).bind("keydown", {
						target : c
					}, function(j) {
						var i = j.data.target.selrow;
						if (j.keyCode == 38) {
							i.prev().trigger("click");
							return false
						} else {
							if (j.keyCode == 40) {
								i.next().trigger("click");
								return false
							}
						}
					})
				}
			},
			setSortable : function(g) {
				var f = null;
				if (d.sortable) {
					f = a(">thead th." + d.headclass, g);
					f.attr("sortable")
				} else {
					f = a(">thead th." + d.headclass + "[sortable]", g)
				}
				f.each(function() {
					var h = a(this);
					h.append(a('<div class="sortby" title="双击排序"></div>'));
					var i = "sasc,sdesc".split(",");
					h.hover(function() {
						var k = a(this);
						var l = a("div.sortby", k);
						var j = l.data("sortedby");
						k.addClass("thOver");
						var m = (j == i[0]) ? i[1] : (j == i[1] ? i[0] : i[0]);
						l.removeClass(i[0]).removeClass(i[1]).addClass(m);
						l.css({
							left : k.offset().left,
							bottom : k.offset().bottom,
							width : k.width()
						})
					}, function() {
						var k = a(this);
						var l = a("div.sortby", k);
						var j = l.data("sortedby");
						k.removeClass("thOver");
						l.removeClass(i[0]).removeClass(i[1]).addClass(j)
					}).dblclick(function() {
						var j = a(this);
						var k = a("div.sortby", j);
						var l = k.data("sortedby") == i[0] ? i[1] : i[0];
						c.updateSortHeadCss(j, l, i);
						c.startSort(g, j.index(), l)
					})
				})
			},
			startSort : function(i, h, l) {
				var g = a(">tbody>tr", i);
				var j = a(">tbody>tr>td:nth-child(" + (h + 1) + ")", i);
				var f = true;
				j.each(function() {
					var m = j.text();
					f = /^[-+]?\d*$/.test(a.trim(m.replace(/[,.']/g, "")));
					if (f == false) {
						return false
					}
				});
				g.sort(function(o, m) {
					var p = a("td:eq(" + h + ")", o).text();
					var n = a("td:eq(" + h + ")", m).text();
					if (f == true) {
						return l == "sasc" ? p - n : n - p
					} else {
						return l == "sasc" ? p.localeCompare(n) : -(p
								.localeCompare(n))
					}
				});
				var k = a(">tbody", i)[0];
				g.each(function() {
					k.appendChild(this)
				})
			},
			updateSortHeadCss : function(h, j, k) {
				var f = h;
				var g = a("div.sortby", f);
				g.data("sortedby", j);
				f.addClass("sorted");
				if (j == k[1]) {
					g.addClass(k[1]).removeClass(k[0])
				} else {
					g.addClass(k[0]).removeClass(k[1])
				}
				var i = f.siblings(".sorted");
				i.removeClass("sorted");
				a("div.sortby", i).removeClass(k[0]).removeClass(k[1]).data(
						"sortedby", null)
			},
			setFilterable : function(g) {
				var f = null;
				if (d.filterable) {
					f = a(">thead>tr>th." + d.headclass, g);
					f.attr("filterable")
				} else {
					f = a(">thead>tr>th." + d.headclass + "[filterable]", g)
				}
				f
						.each(function() {
							var k = a(this);
							var i = a('<div class="filterdiv nofiltered" style="display:none;" title="设置条件过滤"><div></div></div>');
							var j = a('<div class="filters"  style="display:none;"></div>');
							var h = a('<div class="filtertb" cellspacing="0" cellpadding="0"></div>');
							k.append(i);
							k.append(j);
							j.append(h);
							var m = [];
							a(
									">tbody>tr>td:nth-child(" + (k.index() + 1)
											+ ")", g).each(function() {
								m.push(a.trim(a(this).text()))
							});
							m = a.unique(m);
							m.sort(function(o, n) {
								return o.localeCompare(n)
							});
							var l = [];
							a
									.each(
											m,
											function() {
												l.push('<div class="afilter">');
												l
														.push('<div class="divkey"><input type="checkbox"   checked="checked" value="');
												l.push(this);
												l
														.push('"  ></div> <div class="divval">');
												l.push(this);
												l.push("</div></div>")
											});
							h.append(l.join("").toString());
							a(":checkbox", h)
									.bind(
											"click",
											{
												colid : k.index()
											},
											function(o) {
												var n = a(this);
												a(g).setGridDisplayRow({
													index : o.data.colid,
													text : n.val(),
													rowfilter : null,
													tohide : !n.is(":checked")
												});
												if (a(
														":checkbox:not(:checked)",
														h).length > 0) {
													i.removeClass("nofiltered")
															.addClass(
																	"filtered")
												} else {
													i
															.removeClass(
																	"filtered")
															.addClass(
																	"nofiltered")
												}
											}).dblclick(function() {
										return false
									});
							a("div", h).dblclick(function() {
								return false
							});
							k.hover(function() {
								var o = a(this);
								var n = a(">div.filterdiv", o);
								n.css({
									left : o.offset().left,
									top : o.offset().top
								});
								n.show();
								a(">div.filterdiv", o.siblings(".thOver"))
										.hide().siblings(".filters").hide()
							}, function() {
								var o = a(this);
								var n = a(">div.filterdiv", o);
								n.hide().siblings(".filters").hide();
								a(">div.filterdiv.filtered", o).show()
							});
							i.toggle(function() {
								var o = a(this);
								var n = o.siblings(".filters");
								n.css({
									left : o.offset().left,
									top : o.offset().bottom
								}).show();
								return false
							}, function() {
								var o = a(this);
								var n = o.siblings(".filters");
								n.hide();
								return false
							})
						})
			}
		};
		a(b).hide();
		var e = a(b);
		e.addClass("datagrid_gridtb");
		c.top = e;
		if (d.hashead) {
			c.initHead(b)
		}
		a("thead", e).addClass(d.hashead ? "hashead" : "nohead");
		c.initBody(b);
		if (e.attr("tabindex") == undefined) {
			e.attr("tabindex", 1)
		}
		if (a(">tbody>tr", b).length >= d.thresPage) {
			c.page = a.gridPaginate(b, {
				sizeofPage : d.defSizePage
			})
		}
		c.formatgrid(b);
		e.show().attr({
			cellPadding : 0,
			cellSpacing : 0,
			border : 0
		});
		b.p = d;
		b.grid = c;
		if (d.hashead && d.fixhead) {
			c.fixhead = a.gridFixedHead(b);
			c.top = c.fixhead.tdiv
		}
		if (d.defaultSel) {
			a(">tbody tr:first", b).trigger("click")
		}
		e.bind("onAddRow", function(g, f) {
			c.formatgrid(this);
			if (b.p.onAddRow) {
				b.p.onAddRow(f)
			}
		});
		e.bind("onDelRow", function(f) {
			c.formatgrid(this)
		});
		e.bind("onReFormat", function(g, f) {
			c.formatgrid(this, f)
		});
		c.setSortable(b);
		c.setFilterable(b);
		if (d.colspan) {
			a.each(d.colspan, function() {
				a.webUtil.tableSpanSame(b, this, "colspan")
			})
		}
		if (d.rowspan) {
			a.each(d.rowspan, function() {
				a.webUtil.tableSpanSame(b, this, "rowspan")
			})
		}
		return b
	};
	a.fn.datagrid = function(b) {
		return this.each(function() {
			a.createGrid(this, b)
		})
	};
	a.fn.setGridDisplayRow = function(c) {
		var e = {
			index : -1,
			text : null,
			rowfilter : null,
			btn_condition : null,
			tohide : true
		};
		if (c == null) {
			return
		}
		c = a.extend(e, c);
		var b = a(">tbody>tr", this);
		if (c.index >= 0) {
			var d = a(">tbody>tr>td:nth-child(" + (c.index + 1) + ")", this);
			d.each(function(h) {
				var j = a(this);
				if (a.trim(j.text()) == c.text) {
					var i = a(b[h]);
					c.tohide ? i.hide() : i.show()
				}
			})
		} else {
			if (c.rowfilter != null) {
				var b = a(c.rowfilter, this);
				c.tohide ? b.hide() : b.show()
			} else {
				if (c.btn_condition != null) {
					var f = a(">tbody>tr", this);
					if (c.btn_condition == "") {
						f.show()
					} else {
						f.hide();
						var g = a('>tbody>tr>td[btn_condition="'
								+ c.btn_condition + '"]', this);
						g.each(function() {
							var h = a(this).closest("tr");
							h.show()
						})
					}
				}
			}
		}
		a(this).trigger("onReFormat", ">tbody>tr:visible")
	};
	a.fn.addrow = function(d, c, b) {
		return this.each(function() {
			var f = a(">tbody", this);
			var e = a(">tr:last", f);
			if (b != null) {
				e = a(">tr:eq(" + (b - 1) + ")", f)
			}
			var g = (d != null) ? d : a("<tr>" + e.html() + "</tr>");
			if (c != undefined) {
				a(">tr:eq(" + (c - 1) + ")", f).after(g)
			} else {
				f.append(g)
			}
			a(this).trigger("onAddRow", g)
		})
	};
	a.fn.delrow = function(b) {
		return this.each(function() {
			if (a(">tbody>tr:visible", this).length < 1) {
				return
			}
			var c = a(">tbody>tr:last", this);
			if (b != null) {
				c = a(">tbody>tr:eq(" + (b - 1) + ")", this)
			}
			c.remove();
			a(this).trigger("onDelRow")
		})
	};
	a.fn.delrow = function(b, c) {
		return this.each(function() {
			if (a(">tbody>tr:visible", this).length < (c + 1)) {
				return
			}
			var d = a(">tbody>tr:last", this);
			if (b != null) {
				d = a(">tbody>tr:eq(" + (b - 1) + ")", this)
			}
			d.remove();
			a(this).trigger("onDelRow")
		})
	};
	a.fn.getCurrIndex = function() {
		if (a(this).get(0).grid == null) {
			return undefined
		}
		return a(this).get(0).grid.currIndex
	};
	a.fn.addcol = function(b, c) {
		return this.each(function() {
			a(this).get(0).grid.addcol(b, c)
		})
	};
	a.fn.appendElements = function(b, c) {
		if (c == null) {
			c = {}
		}
		return this.each(function() {
			a(this).get(0).grid.appendElements(b, c)
		})
	};
	a.fn.gridRowspan = function(b) {
		a.webUtil.tableSpanSame(t, b, "rowspan")
	};
	a.fn.gridColspan = function(b) {
		a.webUtil.tableSpanSame(t, b, "colspan")
	};
	a.gridPaginate = function(l, b) {
		var m = "gridPaginate_navigator";
		var f = "gridPaginate_paging_info";
		var j = "gridPaginate_firstpage";
		var e = "gridPaginate_prevpage";
		var g = "gridPaginate_nextpage";
		var k = "gridPaginate_endpage";
		var c = "gridPaginate_sizePerPage";
		var i = "gridPaginate_jumper";
		var d = {
			sizeofPage : 20,
			currPage : 1,
			sizesofPage : [ 5, 10, 25, 50, 100, 500, 1000 ],
			ignoreRows : []
		};
		b = a.extend(d, b);
		var h = {
			op : null,
			numRows : 0,
			totalPages : 0,
			currPage : 1,
			tb : null,
			divNav : null,
			allRows : null,
			initPage : function(n, o) {
				this.tb = n;
				this.op = o;
				this.allRows = a(">tbody > tr", this.tb);
				this.numRows = this.allRows.length;
				this.divNav = a("<div id='" + m + "' class='" + m
						+ "' align='right' ></div>");
				a(this.tb).after(this.divNav);
				this.showPage(1)
			},
			showPage : function(s) {
				var r = this.getNavigationHtml(s);
				if (s > this.totalPages) {
					s = this.totalPages
				}
				if (s == 0) {
					return
				}
				var q = (s - 1) * this.op.sizeofPage;
				var p = (q + this.op.sizeofPage - 1);
				for ( var o = 0; o < this.allRows.length; o++) {
					if (o >= q && o <= p) {
						a(this.allRows[o]).show()
					} else {
						a(this.allRows[o]).hide()
					}
				}
				this.divNav.empty();
				this.divNav.append(r)
			},
			indexofPage : function(q) {
				var p = q.closest("tr").index() + 1;
				var o = Math.round(p / this.op.sizeofPage);
				var n = (o * this.op.sizeofPage < p) ? o + 1 : o;
				return n
			},
			getNavigationHtml : function(w) {
				var v = this.numRows;
				var u = Math.round(v / this.op.sizeofPage);
				var s = (u * this.op.sizeofPage < v) ? u + 1 : u;
				this.totalPages = s;
				if (w > this.totalPages) {
					w = this.totalPages
				}
				this.currPage = w;
				var n = [];
				n.push("<div>");
				n.push("<span id='" + f + "'>");
				if (this.totalPages > 1) {
					n.push("&nbsp;&nbsp;")
				}
				n.push("第" + w + "页/共" + s + "页&nbsp;&nbsp;总计" + v
						+ "条记录&nbsp;&nbsp;");
				n.push("</span>");
				n.push("<span >");
				n.push("页大小:");
				n.push("<select id='" + c + "'>");
				if (a.inArray(this.op.sizeofPage, this.op.sizesofPage) < 0) {
					this.op.sizesofPage.push(this.op.sizeofPage);
					this.op.sizesofPage.sort(function(y, x) {
						return y - x
					})
				}
				for ( var r = 0; r < this.op.sizesofPage.length; r++) {
					var o = (this.op.sizeofPage == this.op.sizesofPage[r]) ? "selected"
							: "";
					n.push("<option value='" + this.op.sizesofPage[r] + "' "
							+ o + ">" + this.op.sizesofPage[r] + "</option>")
				}
				n.push("</select>");
				n.push("</span>");
				n.push("<span id='gridPaginate_navigate'>");
				n.push("<a id='" + j + "' href='#'>首页</a>&nbsp;");
				if (w <= 1) {
					n.push("上一页&nbsp;")
				} else {
					n.push("<a id='" + e + "'  href='#'>上一页</a>&nbsp;")
				}
				if (w >= this.totalPages) {
					n.push("下一页&nbsp;")
				} else {
					n.push("<a id='" + g + "'  href='#'>下一页</a>&nbsp;")
				}
				n.push("<a id='" + k + "'  href='#'>末页</a>&nbsp;");
				n.push("</span>");
				if (this.totalPages > 2) {
					n.push("跳至:<input type='text' id='" + i + "' name='" + i
							+ "' size='3' value='" + w + "'/> ")
				}
				n.push("</div>");
				var q = a(n.join("").toString());
				var p = "#";
				a(p + j, q).click(function() {
					h.showPage(1)
				});
				a(p + e, q).click(function() {
					h.showPage(parseInt(h.currPage) - 1)
				});
				a(p + g, q).click(function() {
					h.showPage(parseInt(h.currPage) + 1)
				});
				a(p + k, q).click(function() {
					h.showPage(h.totalPages)
				});
				a(p + c, q).change(function() {
					h.op.sizeofPage = parseInt(a(this).val());
					h.showPage(h.currPage)
				});
				a(p + i, q).keydown(function(y) {
					var x = y.which ? y.which : y.keyCode;
					if (y.keyCode == 13) {
						var z = parseInt(a(this).val());
						h.showPage(z)
					}
				});
				return q
			}
		};
		h.initPage(l, b);
		return h
	};
	a.gridFixedHead = function(d) {
		var g = "fixhead_hdiv";
		var e = "fixhead_bdiv";
		var f = "fixhead_headtb";
		var c = "fixhead_bodytb";
		var h = "datagrid_gridtb";
		var b = {
			tb : null,
			tdiv : null,
			hdiv : null,
			bdiv : null,
			fixhead : function(j, i) {
				this.tb = a(j);
				this.tdiv = a("<div class='" + h + "'><div class='" + g
						+ "'></div><div class='" + e + "'></div></div>");
				this.hdiv = a("." + g, this.tdiv);
				this.bdiv = a("." + e, this.tdiv);
				this.tb.before(this.tdiv);
				var l = document.createElement("table");
				a(l).addClass(f).attr("width", "100%").attr({
					cellPadding : 0,
					cellSpacing : 0,
					border : 0
				});
				var k = a("thead:first", this.tb);
				this.hdiv.append(a(l).append(k));
				this.tb.removeClass(h).addClass(c).attr({
					width : "100%"
				});
				this.bdiv.append(this.tb);
				this.bdiv
						.css(
								{
									height : a(this.tb).attr("height") != null ? this.tb
											.attr("height")
											: this.tb[0].p.height,
									"overflow-x" : "hidden",
									"overflow-y" : "auto"
								}).hover(function() {
							b.adjustWidth()
						});
				this.tb.removeAttr("height");
				a(window).resize(function() {
					this.adjustWidth()
				});
				this.adjustWidth()
			},
			adjustWidth : function() {
				if (!this.tb[0].p.fixhead) {
					return
				}
				var r = this.tdiv;
				var j = this.tb[0].p;
				var n = 0;
				var k = 0;
				var o = ".";
				var q = a(o + e, r).get(0);
				var l = parseInt(a(q).css("borderLeftWidth"));
				var m = (isNaN(l) ? 0 : l);
				l = parseInt(a(q).css("borderRightWidth"));
				m += (isNaN(l) ? 0 : l);
				var s = q.offsetWidth - m - q.clientWidth;
				if (a.browser.msie && a.browser.version <= 7) {
					s = 0
				}
				var i = a(o + e + " tbody:first tr:first td", r);
				i.each(function(p, u) {
					var v = a(
							o + g + " thead:first tr ." + j.headclass + ":eq("
									+ p + ")", r).get(0);
					if (v != null) {
						var w = parseInt(v.clientWidth);
						if (p < i.length - 1) {
							a(this).attr("width", w)
						} else {
							a(this).attr("width", w - s)
						}
						n += w;
						k += parseInt(a(v).css("borderWidth"))
					}
				});
				if (a.browser.msie && a.browser.version <= 7) {
					a(o + e, r).css("width", n + k + s)
				}
			}
		};
		b.fixhead(d);
		return b
	}
})(jQuery);
(function(a) {
	a.fn.extend({
		PicButton : function(b) {
			var c = function() {
				var e = {
					btn_href : null,
					istip : false,
					issubmit : true,
					ischeck : true,
					popup : false,
					force : false,
					formobj : null,
					maskobj : null,
					ismask : true,
					btn_class : "web-ui-btn",
					btn_left : "web-ui-btnleft",
					btn_right : "web-ui-btnright",
					btn_left_hover : "web-ui-btnlefthover",
					btn_right_hover : "web-ui-btnrighthover"
				};
				return e
			};
			var d = a(this);
			d.each(function() {
				var f = c();
				var h = a(this);
				if (h.hasClass(f.btn_class) == true) {
					return h
				}
				if (h.attr("btn_href") !== undefined) {
					f.btn_href = h.attr("btn_href")
				}
				if (h.attr("force") !== undefined) {
					f.force = true
				}
				if (h.attr("istip") !== undefined) {
					f.istip = h.attr("istip") == "1" ? true : false
				}
				if (h.attr("issubmit") !== undefined) {
					f.issubmit = h.attr("issubmit") == "1" ? true : false
				}
				if (h.attr("ischeck") != undefined) {
					f.ischeck = h.attr("ischeck") == "1" ? true : false
				}
				if (h.attr("ismask") != undefined) {
					f.ismask = h.attr("ismask") == "1" ? true : false
				}
				if (h.attr("popup") !== undefined) {
					f.popup = true
				}
				if (f.formobj == null) {
					f.formobj = a(a("form")[0])
				}
				if (f.maskobj == null) {
					f.maskobj = a("body")
				}
				var j = {};
				a.extend(true, j, f, b || {});
				h.data("btn_setting", j);
				var g = a("<div>");
				var i = a("<span>").append(h.html());
				h.empty();
				var e = a(g).addClass(f.btn_left).append(
						a(i).addClass(f.btn_right));
				h.append(e).addClass(f.btn_class);
				h.hover(function() {
					a("." + f.btn_left, this).addClass(f.btn_left_hover);
					a("." + f.btn_right, this).addClass(f.btn_right_hover)
				}, function() {
					a("." + f.btn_left, this).removeClass(f.btn_left_hover);
					a("." + f.btn_right, this).removeClass(f.btn_right_hover)
				});
				h.bind("click", function(l) {
					var k = a(this).data("btn_setting");
					if (k != null && k.btn_href != null) {
						if (k.issubmit == true) {
							a.webUtil.submitByButton({
								button : h,
								url : k.btn_href,
								target : k.popup ? "_blank" : ""
							})
						} else {
							if (k.popup) {
								a.webUtil.open(k.btn_href, {
									widths : null,
									heights : null,
									popup : true
								})
							} else {
								l.preventDefault();
								a.webUtil.gotoPage(k.btn_href)
							}
						}
					}
				})
			});
			return d
		},
		BtnToolBar : function(g) {
			g = a.extend({
				hasborder : false,
				bcls : "web-ui-btn_toolbar"
			}, g);
			var f = a(this);
			if (f.hasClass(g.bcls) == true) {
				return
			}
			f.addClass(g.bcls);
			var d = a("button", f).PicButton();
			var c = {
				refreshbyName : function(e) {
					var b = "";
					if (this.btnCond != null) {
						b = a("#" + e, this.btnCond).text()
					} else {
						b = a(".btns_info", this).text()
					}
					if (b == null) {
						b = ""
					}
					b = b.split(",");
					a(this.btns).each(function() {
						if (a(this).attr("force") !== undefined) {
							return
						}
						if (a.inArray(a.trim(a(this).text()), b) >= 0) {
							a(this).show()
						} else {
							a(this).hide()
						}
					})
				},
				btns : d
			};
			c.btnCond = a(".btn_condition", f);
			c.refreshbyName("condition_null");
			f.show();
			return c
		}
	})
})(jQuery);
(function(a) {
	a.fn
			.extend({
				WebTabpanel : function(b) {
					var c = {
						tabpath : "/div/div div",
						ttCls : "webtab_title_container/webtab_titles_panel/webtab_titles/webtab_atitle/webtab_title",
						ccCls : "webtab_acontent/webtab_content"
					};
					if (b) {
						jQuery.extend(c, b)
					}
					a(this)
							.each(
									function() {
										var h = c.tabpath.split("/");
										var m = c.ttCls.split("/");
										var g = c.ccCls.split("/");
										a(h).each(function(o) {
											h[o] = this.split(/\s+/)
										});
										var n = 1;
										var d = a(this);
										d.addClass("webtabpanel");
										if (c.width != null) {
											d.width(c.width)
										}
										if (c.height != null) {
											d.height(c.height)
										}
										var l = d.find(">" + h[n][0]);
										l.hide();
										var i = l.find(
												">" + h[n + 1][0] + ":eq(0)")
												.addClass(m[4]);
										var j = l.find(
												">" + h[n + 1][1] + ":eq(1)")
												.addClass(g[1]);
										var e = a("<div ></div>")
												.addClass(m[0]);
										var k = "tab_content";
										var f = {
											showTab : function(o) {
												var r = e.find(".active");
												if (r.length > 0) {
													r.removeClass("active");
													r.data(k).parent().hide()
												}
												var q = e.find("." + m[3]
														+ ":eq(" + o + ")");
												q.addClass("active");
												var p = q.data(k);
												p.parent().show()
											},
											initTitle : function(o) {
												var q = a("<div ></div>")
														.addClass(m[1]);
												var p = a("<ul ></ul>")
														.addClass(m[2]);
												o.each(function(s) {
													var r = a("<li></li>")
															.addClass(m[3]);
													r.append(a(this));
													p.append(r);
													r.data(k, a(j[s]))
												});
												q.append(p);
												e
														.append(q)
														.append(
																"<div class='cleanfloat'></div><div class='webtab_spacer '></div>");
												d.prepend(e);
												l.addClass(g[0]);
												f.showTab(0);
												e.delegate("." + m[3], "click",
														function() {
															f.showTab(a(this)
																	.index())
														})
											}
										};
										f.initTitle(i)
									});
					return a(this)
				}
			})
})(jQuery);
(function(a) {
	a.fn.setmask = function(b) {
		var c = {
			msg : null,
			zindex : parseInt(new Date().getTime() / 1000)
		};
		a(this)
				.each(
						function() {
							var k = a.extend(c, b);
							var i = a(this);
							if (i.isMasked()) {
								return
							}
							i.addClass("ismasked");
							i.data("ismasked", true);
							var h = a('<div class="ui-mask"></div>');
							var e = i[0].tagName != null ? i[0].tagName
									.toLowerCase() : null;
							if (e != null && e != "body") {
								var f = i.height()
										+ a.webUtil.getElCss(i, "padding-top")
										+ a.webUtil.getElCss(i,
												"padding-bottom");
								h.css({
									height : f,
									width : i.width(),
									top : i.offset().top,
									left : i.offset().left,
									"z-index" : k.zindex
								})
							}
							a("body").append(h);
							if (k.msg != null) {
								var g = a('<div class="ui-mask-msg" style="display:none;"><div>'
										+ k.msg + "</div></div>");
								a("body").append(g);
								g.show();
								var j = k.caller != null ? a(k.caller).offset().top
										: h.height() / 2 - g.height() / 2;
								var d = k.caller != null ? a(k.caller).offset().left
										: h.width() / 2 - g.width() / 2;
								g.css({
									top : h.offset().top + j,
									left : h.offset().left + d,
									"z-index" : k.zindex
								})
							}
							i.data("ui_mask_div", h);
							i.data("ui-mask-msg_div", g)
						})
	};
	a.fn.unmask = function() {
		a(this).each(function() {
			var b = a(this);
			var d = b.data("ui_mask_div");
			if (d == null) {
				d = b.find(".ui-mask")
			}
			d.remove();
			var c = b.data("ui-mask-msg_div");
			if (c == null) {
				c = b.find(".ui-mask-msg")
			}
			c.remove();
			b.removeClass("masked-relative");
			b.removeClass("ismasked");
			b.data("ismasked", false)
		})
	};
	a.fn.isMasked = function() {
		return this.data("ismasked")
	}
})(jQuery);
(function(a) {
	a.fn
			.extend({
				AccordionMuti : function(e) {
					var m = {
						hpath : "/h3 div/h3 div/p",
						hClass : "/multi-accordion-head1 multi-accordion-level1/multi-accordion-head2  multi-accordion-level2/multi-accordion-head3",
						pClass : "/multi-accordion-padding1/multi-accordion-padding2/multi-accordion-padding3",
						aClass : "/multi-accordion-active/multi-accordion-active/multi-accordion-active3",
						target : "_blank",
						icons : {
							header : "multi-accordion-icon-circle-arrow-e",
							headerSelected : "multi-accordion-icon-circle-arrow-s"
						}
					};
					if (e) {
						jQuery.extend(m, e)
					}
					var u = m.hpath.split("/");
					var l = m.pClass.split("/");
					var k = m.hClass.split("/");
					var p = m.aClass.split("/");
					a(u).each(function(i) {
						u[i] = this.split(/\s+/)
					});
					a(k).each(function(i) {
						k[i] = this.split(/\s+/)
					});
					var o = a(this);
					o.addClass("multi-accordion");
					var h = o;
					var b = u.length;
					function n(i) {
						a(this).removeClass(k[i.data.level][0]).addClass(
								"multi-accordion-active")
					}
					function j(i) {
						a(this).removeClass("multi-accordion-active").addClass(
								k[i.data.level][0])
					}
					for ( var r = 1; r < b; r++) {
						var g = h.find(">" + u[r][0]);
						g.addClass(k[r][0]);
						g.bind("mouseover", {
							level : r
						}, n);
						g.bind("mouseout", {
							level : r
						}, j);
						g.addClass(l[r]);
						if (r + 1 < b) {
							var q = h.find(">" + u[r][1]);
							q.addClass(k[r][1]);
							q.hide();
							c(g, u[r][1]);
							d(g);
							h = q
						} else {
							var f = g.find(" > a").attr("target", m.target);
							g.click(function() {
								a(this).siblings("." + p[3]).removeClass(p[3]);
								a(this).addClass(p[3])
							})
						}
					}
					var w = o.closest("form");
					if (w.length > 0) {
						a("p", o).click(function() {
							var i = a("a", a(this)).attr("href");
							w.attr("target", m.target);
							w.attr("action", i);
							w.submit();
							return false
						})
					}
					var v = a("[def_expanded]", o);
					v.closest(u[1][1]).prev(u[1][0]).trigger("click");
					v.trigger("click");
					function c(s, i) {
						s.click(function() {
							var y = (a(this).next(i).index()) - 1;
							a(this).siblings(i + ":not(:eq(" + y + "))")
									.slideUp();
							a(this).siblings().children(
									"." + m.icons.headerSelected).removeClass(
									m.icons.headerSelected);
							var x = a(this).next();
							x.slideToggle(300);
							a(this).children(".multi-accordion-icon")
									.toggleClass(m.icons.headerSelected)
						})
					}
					function d(s) {
						var i = m;
						if (i.icons) {
							a("<span>&nbsp;&nbsp;&nbsp;</span>").addClass(
									"multi-accordion-icon " + i.icons.header)
									.prependTo(s)
						}
					}
				}
			})
})(jQuery);
(function(a) {
	a.webValidator = {
		opName : "valid_options",
		defaults : {
			type : "text",
			empty : true,
			min : 0,
			max : 999999,
			onErrMsg : "",
			onShowMsg : "",
			regExp : "",
			group : null,
			ischeck : true,
			maincheck : true,
			linkbox : null,
			wideWord : true
		},
		onError : function(c, f, g) {
			if (!c.is(":disabled")) {
				c.focus()
			}
			var b = c.attr("title");
			var d = g.onErrMsg == "" ? f : g.onErrMsg;
			if (b != null) {
				d = "[" + b + "]&nbsp;" + d
			}
			a.webValidator.tipTool.showMessage(c, d, "icon_no");
			return false
		},
		validSize : function(b, c) {
			if (typeof (c.min) != "undefined" && b.length < c.min) {
				return false
			}
			if (typeof (c.min) != "undefined" && b.length > c.max) {
				return false
			}
			return true
		},
		validType : function(d, e) {
			var b = a.webValidator.dataType[e.type];
			if (b == undefined) {
				return false
			}
			var c = (b.regex == undefined || b.regex == "") ? e.regExp
					: b.regex;
			if (c == undefined || c == "") {
				return false
			}
			return (new RegExp(c, "i")).test(d)
		},
		validValue : function(e, g) {
			var c = true;
			var b = g.type;
			switch (b) {
			case "date":
			case "datetime":
				c = isDate(e);
				e = new Date(Date.parse(e.replace(/-/g, "/")));
				var f = g.min, d = g.max;
				if (c && isDate(f)) {
					f = new Date(Date.parse(f.replace(/-/g, "/")))
				}
				if (c && isDate(d)) {
					d = new Date(Date.parse(d.replace(/-/g, "/")))
				}
				if ((typeof (f) == "object") && e < f) {
					c = false
				}
				if ((typeof (d) == "object") && e > d) {
					c = false
				}
				break;
			case "number":
				e = (new Number(e)).valueOf();
				c = !isNaN(e)
			}
			return c
		},
		checkValid : function(b) {
			var c = a.webValidator.getOption(b);
			if (c == null) {
				alert("无法取得元素的验证配置信息！");
				return false
			}
			return a.webValidator.checkValidBy(b, c)
		},
		checkValidBy : function(g, i) {
			var l = g[0];
			var b = l.type;
			if (i.linkbox != null) {
				var h = a(':checkbox[name="' + i.linkbox + '"]', g
						.closest("tr"));
				if (h != null && h.length > 0) {
					i.ischeck = h[0].checked == true ? true : false
				}
			}
			var f = i.ischeck;
			if (f == false || i.type == null || i.type == ""
					|| i.maincheck == false) {
				return true
			}
			var j = i.empty;
			var d = (g.attr("value") == i.onShowMsg) ? "" : g.attr("value");
			var m = a.webValidator.dataType[i.type];
			if (m == undefined) {
				alert("not support datatype 不支持的数据类型检查,type=" + i.type);
				return false
			}
			var k = 0;
			switch (b) {
			case "text":
			case "hidden":
			case "password":
			case "textarea":
			case "file":
				if (j && (d == null || d == "")) {
					if (g.attr("value") == i.onShowMsg) {
						g.val("")
					}
					return true
				}
				if (!this.validSize(d, i) && m != "date") {
					return this.onError(g,
							"输入长度错误，有效长度:" + i.min + "～" + i.max, i)
				}
				if (!this.validType(d, i)) {
					return this.onError(g, "输入内容类型错误，请输入:" + m.title, i)
				}
				if (!this.validValue(d, i)) {
					return this.onError(g, "输入的值错误，正确的值为:" + i.min + "～"
							+ i.max, i)
				}
				break;
			case "checkbox":
			case "radio":
				if (j) {
					return true
				}
				if (i.maincheck == null || i.maincheck == false) {
					return true
				}
				var c = i.group != null ? "[v_group='" + i.group + "']"
						: "[name='" + g.attr("name") + "']:not('[v_group]')";
				a("input[type='" + b + "']" + c).each(function(e, n) {
					if (n != l) {
						a.webValidator.setOption(a(this), {
							maincheck : false
						})
					}
					if (n.checked == true) {
						k += 1
					}
				});
				if (k < i.min) {
					return this.onError(g, "请至少选择:" + i.min + "项", i)
				}
				if (k > i.max) {
					return this.onError(g, "请最多选择:" + i.max + "项", i)
				}
				break;
			case "select-one":
				if (j) {
					return true
				}
				if (l.options[l.options.selectedIndex].value.length < 1) {
					return this.onError(g, "请至少选择1项", i)
				}
				break;
			case "select-multiple":
				if (j) {
					return true
				}
				k = a("select[name=" + l.name + "] option:selected").length;
				if (k < i.min) {
					return this.onError(g, "请至少选择:" + i.min + "项", i)
				}
				if (k > i.max) {
					return this.onError(g, "请最多选择:" + i.max + "项", i)
				}
				break;
			default:
				return this.onError(g, "未取到元素类型，请检查元素标签", i)
			}
			return true
		},
		setOption : function(f, e) {
			var g = a.webValidator.getOption(f);
			if (g == null) {
				return null
			}
			a.extend(g, e);
			if (g.empty != null && g.empty == false && g.min == 0) {
				g.min = 1
			}
			f.data(a.webValidator.opName, g);
			var d = f[0];
			var b = d.tagName.toLowerCase();
			var c = g.onShowMsg;
			if ((c != null && c != "") && (b == "input" || b == "textarea")) {
				a.webValidator.tipTool.showTipInContent(f, c)
			}
			if (g.type == "date") {
				f.webDatepicker()
			}
			return g
		},
		getOption : function(e) {
			if (e == null || e.length == 0) {
				return null
			}
			var f = e.data(a.webValidator.opName);
			if (f == null) {
				f = {};
				a.extend(f, a.webValidator.defaults);
				var d = e.attr("v_type");
				if (d != null) {
					f.type = d
				}
				if (f.type == "date") {
					f.min = "不限";
					f.max = "不限"
				}
				var c = e.attr("v_ischeck");
				if (c != null) {
					f.ischeck = ((c == "0") ? false : true)
				}
				var g = e.attr("v_empty");
				if (g != null) {
					f.empty = ((g == "1") ? true : false)
				}
				var j = e.attr("v_min");
				if (j != null) {
					f.min = j
				}
				var i = e.attr("v_max");
				if (i != null) {
					f.max = i
				}
				var h = e.attr("v_onShowMsg");
				if (h != null) {
					f.onShowMsg = h
				}
				var g = e.attr("v_onErrMsg");
				if (g != null) {
					f.onErrMsg = g
				}
				var k = e.attr("v_group");
				if (k != null) {
					f.group = k
				}
				if (f.empty == false && f.min == 0) {
					f.min = 1
				}
				var b = e.attr("v_linkbox");
				if (b != null) {
					f.linkbox = b
				}
			}
			return f
		},
		getFormElements : function(j) {
			var b = null;
			var i = j.find(":checkbox");
			var h = j.find(":radio");
			var g = j.find(":text");
			var f = j.find(":password");
			var e = j.find(":file");
			var d = j.find("select");
			var c = j.find("textarea");
			if (g.length < 500 && c.length < 500) {
				return j
						.find(":text,:checkbox,:radio,:password,:file,select,textarea")
			}
			var b = a.merge(i, h);
			b = a.merge(b, g);
			b = a.merge(b, f);
			b = a.merge(b, e);
			b = a.merge(b, d);
			b = a.merge(b, c);
			return b
		}
	};
	a.fn.setValidator = function(b) {
		return this.each(function(g) {
			var c = a(this).get(0).tagName;
			var f = null;
			if (c == "FORM") {
				f = a(this)
			} else {
				f = a(this).closest("form")
			}
			if (f == null) {
				alert("未找到对应的form对象")
			}
			if (c == "FORM") {
				var d = a.webValidator.getFormElements(f);
				a.each(d, function() {
					a.webValidator.setOption(a(this), b)
				})
			} else {
				a.webValidator.setOption(a(this), b)
			}
		})
	};
	a.fn.formIsValid = function() {
		var c = a(this);
		var d = true;
		var b = a.webValidator.getFormElements(c);
		a.each(b, function() {
			var e = a(this);
			var f = a.webValidator.getOption(e);
			d = a.webValidator.checkValidBy(e, f);
			return d
		});
		return d
	};
	a.fn.checkDataValid = function() {
		var c = a(this);
		var d = true;
		var b = a.webValidator.getFormElements(c);
		a.each(b, function() {
			var e = a(this);
			var f = a.webValidator.getOption(e);
			d = a.webValidator.checkValidBy(e, f);
			return d
		});
		return d
	};
	a.webValidator.getMousePosition = function(c) {
		c = c || window.event;
		var b = c.pageX
				|| (c.clientX ? c.clientX + document.body.scrollLeft : 0);
		var d = c.pageY
				|| (c.clientY ? c.clientY + document.body.scrollTop : 0);
		return {
			x : b,
			y : d
		}
	};
	a.webUtil = {
		submitByButton : function(d) {
			var f = {
				button : null,
				target : null,
				url : null
			};
			var e = a.extend(f, d);
			var c = e.button.data("btn_setting");
			var b = "您确定要'" + e.button.text() + "'吗？";
			var g = {
				url : e.url,
				frm : c.formobj,
				tipmsg : c.istip ? b : null,
				ismask : c.ismask,
				mask : c.maskobj,
				btn : e.button,
				trgt : e.target,
				ischeck : c.ischeck
			};
			a.webUtil.submit(g.url, g)
		},
		submitOnBtn : function(e, f, b) {
			var d = f.data("btn_setting");
			var c = "您确定要'" + f.text() + "'吗？";
			var g = {
				frm : d.formobj,
				tipmsg : d.istip ? c : null,
				ismask : d.ismask,
				mask : d.maskobj,
				btn : f,
				trgt : b,
				ischeck : d.ischeck
			};
			a.webUtil.submit(e, g)
		},
		ajaxSubmit : function(e) {
			if (e.btn) {
				var c = e.btn.data("btn_setting");
				var b = "您确定要'" + e.btn.text() + "'吗？";
				var d = {
					frm : c.formobj,
					tipmsg : c.istip ? b : null,
					mask : c.maskobj,
					btn : e.btn,
					trgt : e.trgt,
					ajax : e
				};
				a.webUtil.submit(e.url, d)
			} else {
				a.webUtil.submit(e.url, {
					ajax : e
				})
			}
		},
		submit : function(e, f) {
			f = a.extend({
				ischeck : true,
				ismask : true
			}, f);
			f.mask = (f.mask == null) ? a(document) : f.mask;
			var c = (f.frm == null) ? a("[name='form1']") : f.frm;
			if (c.length == 0) {
				alert("找不到表单对象！请检查代码是否正确！");
				return
			}
			var b = c.data("submitting");
			if (b == true) {
				return
			}
			var d = setTimeout(function() {
				a.webUtil.toSubmit(c, e, f);
				d = null
			}, 50);
			if (f.ismask) {
				a(f.mask).setmask({
					msg : "系统正在处理数据，请等待...",
					caller : f.btn
				})
			}
		},
		toSubmit : function(b, c, g) {
			if (b.data("submitting")) {
				return false
			}
			b.data("submitting", true);
			var e = a(g.mask);
			if (g.ismask) {
				e.setmask({
					msg : "系统正在处理数据，请等待... ...",
					caller : g.btn
				})
			}
			if (g.ischeck && (!b.formIsValid())) {
				b.data("submitting", false);
				if (g.ismask) {
					e.unmask()
				}
				return false
			}
			if (g.tipmsg != null) {
				if (!confirm(g.tipmsg)) {
					b.data("submitting", false);
					if (g.ismask) {
						e.unmask()
					}
					return false
				}
			}
			if (g.trgt != null) {
				b.attr("target", g.trgt)
			}
			if (g.trgt != null && g.trgt != "") {
				b.data("submitting", false);
				if (g.ismask) {
					e.unmask()
				}
			}
			if (g.ajax == null) {
				b.attr("action", c);
				b.submit()
			} else {
				if (g.ajax.url == null) {
					g.ajax.url = c
				}
				var d = g.ajax.success;
				g.ajax.success = function(h) {
					b.data("submitting", false);
					if (jQuery.isFunction(d)) {
						d.call(a, h)
					}
					if (g.ismask) {
						e.unmask()
					}
				};
				var f = g.ajax.complete;
				g.ajax.complete = function(i, h) {
					b.data("submitting", false);
					if (jQuery.isFunction(f)) {
						f.call(a, i, h)
					}
					if (g.ismask) {
						e.unmask()
					}
				};
				a.webUtil.submitByAjax(g.ajax)
			}
			return true
		},
		submitByAjax : function(h) {
			var b = (h.frm == null) ? a("[name='form1']") : h.frm;
			var g = b.attr("method");
			var f = b.attr("action");
			var d = (typeof f === "string") ? a.trim(f) : "";
			d = d || window.location.href || "";
			if (d) {
				d = (d.match(/^([^#]+)/) || [])[1]
			}
			if (typeof h == "function") {
				h = {
					success : h
				}
			}
			h = a
					.extend(true,
							{
								url : d,
								success : a.ajaxSettings.success,
								type : g || "POST",
								iframeSrc : /^https/i.test(window.location.href
										|| "") ? "javascript:false"
										: "about:blank"
							}, h);
			var e = (h.data == null) ? null : h.data;
			var c = null;
			if (h.isformdata == null || h.isformdata == true) {
				c = b.serialize()
			}
			if (e != null && c != null) {
				e = c + "&" + e
			} else {
				e = (e == null) ? c : e
			}
			if (h.type.toUpperCase() == "GET") {
				h.url += (h.url.indexOf("?") >= 0 ? "&" : "?") + e;
				h.data = null
			} else {
				h.data = e
			}
			a.ajax(h)
		},
		gotoPage : function(b) {
			window.location.href = b
		},
		open : function(d, g) {
			g = a.extend({}, g);
			var e = g.widths, f = g.heights;
			var b = g.popup;
			if (e == null || "" == e) {
				e = "800"
			}
			if (f == null || "" == f) {
				f = "680"
			}
			var c = "height="
					+ f
					+ ", width="
					+ e
					+ ",toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=yes";
			if (g.option != null) {
				c = g.option
			}
			window.open(d, (b == true) ? "" : "popup", c)
		},
		openWindow : function(b) {
			a("body").WebDialog(b)
		},
		alert : function(e, b) {
			var c = function(f) {
				a(".header .closer", f.data.target).trigger("click");
				if (b != null) {
					b()
				}
			};
			var d = a('<div class="webdialog_message"></div>').append(e);
			a.webUtil.openWindow({
				title : "消息提示",
				width : 300,
				height : 150,
				content : d,
				ismodel : true,
				buttons : [ {
					btn : "<button>OK</button>",
					onclick : c
				} ]
			})
		},
		confirm : function(g, c, e) {
			var b = function(h) {
				a(h.data.target).closeWebDialog();
				if (c != null) {
					c()
				}
			};
			var d = function(h) {
				a(h.data.target).closeWebDialog();
				if (e != null) {
					e()
				}
			};
			var f = a('<div class="webdialog_message"></div>').append(g);
			a.webUtil.openWindow({
				title : "确认提示",
				width : 300,
				height : 170,
				content : f,
				ismodel : true,
				buttons : [ {
					btn : "<button>确认</button>",
					onclick : b
				}, {
					btn : "<button >取消</button>",
					onclick : d
				} ]
			})
		},
		onKeyDownEnter : function(c, d, b) {
			if (b == null) {
				b = "click"
			}
			c.each(function() {
				a(this).bind("keydown", function(g) {
					var f = g.which ? g.which : g.keyCode;
					if (f == 13) {
						d.trigger(b)
					}
				})
			});
			return false
		},
		getElCss : function(c, b) {
			var d = parseInt(c.css(b));
			return isNaN(d) ? 0 : d
		},
		tableSpanSame : function(f, c, g) {
			var d = a(f);
			var b = null;
			var h = 1;
			var e = null;
			if (g == "rowspan") {
				e = d.find(">tbody>tr td:nth-child(" + c + ")")
			} else {
				e = d.find(">tbody>tr:nth-child(" + c + ") >td ")
			}
			e.each(function(i) {
				var j = a(this);
				if (i == 0) {
					b = j;
					return
				}
				if (j.text() == b.text()) {
					j.hide();
					h++
				} else {
					if (h > 1) {
						b.attr(g, h)
					}
					b = j;
					h = 1
				}
			});
			if (h > 1) {
				b.attr(g, h)
			}
		}
	};
	a.webTipTool = {
		s : {
			tip_div : "validator_msg_div",
			tip_top : "vmsg_tips_top",
			tip_btm : "vmsg_tips_bottom",
			displaySpeed : 20,
			displayTime : 2500
		},
		showTipInContent : function(b, c) {
			if (c != "" && b.val() == "") {
				b.val(c);
				b.css("color", "#999999")
			}
			b.focus(function() {
				var d = b.val();
				if (c == d) {
					this.value = "";
					a(this).css("color", "#000000")
				}
			}).blur(function() {
				if (this.value == "" && c != "") {
					this.value = c
				}
				if (this.value == c) {
					a(this).css("color", "#999999")
				}
			})
		},
		getTipTool : function() {
			if (this.tool !== undefined) {
				return this.tool
			}
			var b = a("#" + this.s.tip_div);
			if (b.length == 0) {
				b = a("<div id='"
						+ this.s.tip_div
						+ "' style='display:none;position:absolute;z-index:78000'></div>");
				var c = a("<span class='vmsg_tips' style='display:block'></span>");
				c
						.append(a("<span class='vmsg_tips_top'  style='display:block'></span>"));
				c
						.append(a("<b class='vmsg_tips_bottom' style='display:block' />"));
				c.css({
					filter : "alpha(opacity:90)",
					KHTMLOpacity : "0.90",
					MozOpacity : "0.90",
					opacity : "0.90"
				});
				b.append(c);
				a("body").append(b)
			}
			this.tool = b;
			return this.tool
		},
		setTipMessage : function(b, d) {
			var e = this.getTipTool();
			var f = b;
			if (d !== undefined) {
				f = '<div class="' + d
						+ '">&nbsp;&nbsp;&nbsp;&nbsp;</div>&nbsp;&nbsp;' + f
			}
			a("." + this.s.tip_top, e).html(f)
		},
		moveTipTool : function(d, c) {
			var b = this.getTipTool();
			b.css({
				top : (c + 2) + "px",
				left : (d - 40) + "px"
			})
		},
		bindShowMessage : function(c, d) {
			var b = a.webTipTool;
			c.bind({
				mouseover : function(f) {
					b.getTipTool().show();
					b.setTipMessage(d, "icon_warning");
					var g = a.webValidator.getMousePosition(f);
					b.moveTipTool(g.x, g.y)
				},
				mouseout : function() {
					a.webTipTool.getTipTool().hide()
				},
				mousemove : function(g) {
					var f = a.webTipTool;
					f.getTipTool().show();
					f.setTipMessage(d, "icon_warning");
					var h = a.webValidator.getMousePosition(g);
					f.moveTipTool(h.x, h.y)
				}
			})
		},
		showMessage : function(f, d, c) {
			var m = a.webValidator.tipTool;
			var b = a(f);
			var g = b.is(":visible");
			if (!g) {
				
				var k = b.closest(".datagrid_gridtb")
				/*
				 *  此判断用于解决962121网站房地产管理企业注册、物业管理企业注册页面
				 *  对于隐藏元素，无法进行校验的问题，切勿删除。
				 *  Added by xuwei 2015/12/30
				 */
				if (k != null && k[0] == undefined) {
					k = b.closest(".special_css");
				}
				
				if (k != null && k[0].grid != null && k[0].grid.page != null) {
					var e = k[0].grid.page.indexofPage(b);
					if (e > 0 && e <= k[0].grid.page.totalPages) {
						k[0].grid.page.showPage(e)
					}
				}
			}
			var j = m.getTipTool();
			var h = b.closest(".webdialog_body");
			if (h.length > 0) {
				if (a("#" + this.s.tip_div, h).length > 0) {
					return
				}
				h.append(m.tool)
			}
			var i = b;
			if (!g) {
				i = b.closest(":visible")
			}
			m.moveTipTool(i.position().left + i.width() / 2, i.position().top
					+ i.height() / 2);
			var l = parseInt(new Date().getTime() / 1000);
			j.css({
				"z-index" : l
			});
			m.setTipMessage(d, c);
			j.show();
			j.fadeIn(this.s.displaySpeed).delay(this.s.displayTime);
			j.fadeOut(this.s.displaySpeed, function() {
				j.hide();
				if (h.length > 0) {
					a("body").append(m.tool)
				}
			});
			b.focus()
		},
		showTipMessage : function(g) {
			var g = a.extend({
				target : null,
				msg : "",
				icon : "no",
				container : "body"
			}, g);
			var d = a.webTipTool;
			var f = a(obj);
			if (!f.is(":visible")) {
				var e = f.closest(".datagrid_gridtb");
				if (e != null && e[0].grid != null && e[0].grid.page != null) {
					var b = e[0].grid.page.indexofPage(f);
					if (b > 0 && b <= e[0].grid.page.totalPages) {
						e[0].grid.page.showPage(b)
					}
				}
			}
			var c = d.getTipTool();
			if (g.container != null) {
				a(g.container).append(d.tool)
			}
			d.moveTipTool(f.position().left + f.width() / 2, f.position().top
					+ f.height() / 2);
			d.setTipMessage(msg, ic);
			d.getTipTool().show();
			c.fadeIn(this.s.displaySpeed).delay(this.s.displayTime);
			c.fadeOut(this.s.displaySpeed, function() {
				d.getTipTool().hide()
			});
			f.focus()
		}
	};
	a.webValidator.tipTool = a.webTipTool;
	a.fn.setTipMessage = function(b) {
		return this.each(function() {
			var c = a(this);
			this.tipmsg = b;
			a.webTipTool.bindShowMessage(c, this.tipmsg)
		})
	}
})(jQuery);
$.webValidator.dataType = {
	text : {
		regex : "([\\s\\S]*)",
		title : "文本"
	},
	number : {
		regex : "^([+-]?)\\d*\\.?\\d+$",
		title : "数值"
	},
	integer0 : {
		regex : "^-?[1-9]\\d*$",
		title : "整数"
	},
	integer1 : {
		regex : "^[1-9]\\d*$",
		title : "正整数"
	},
	integer2 : {
		regex : "^-[1-9]\\d*$",
		title : "负整数"
	},
	num : {
		regex : "^([+-]?)\\d*\\.?\\d+$",
		title : "数字"
	},
	num1 : {
		regex : "^[1-9]\\d*$|0",
		title : "正数（正整数 + 0）"
	},
	num2 : {
		regex : "^-[1-9]\\d*$|0",
		title : "负数（负整数 + 0）"
	},
	decimal1 : {
		regex : "^([+-]?)\\d*\\.\\d+$",
		title : "浮点数"
	},
	decimal2 : {
		regex : "^[0-9]\\d*\\.\\d{0,2}$",
		title : "两位小数的浮点数"
	},
	decimal3 : {
		regex : "^(([0-9]+[.]?[0-9]+)|[0-9])$",
		title : "非负浮点数或整数（正浮点数或整数 + 0）"
	},
	decimal4 : {
		regex : "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$",
		title : "负浮点数"
	},
	decimal5 : {
		regex : "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$",
		title : "浮点数"
	},
	decimal6 : {
		regex : "^(([0-9]+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*))$",
		title : "正浮点数"
	},
	decimal7 : {
		regex : "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",
		title : "非正浮点数（负浮点数 + 0）"
	},
	email : {
		regex : "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",
		title : "邮件"
	},
	color : {
		regex : "^[a-fA-F0-9]{6}$",
		title : "颜色"
	},
	url : {
		regex : "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",
		title : "url"
	},
	chinese : {
		regex : "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",
		title : "仅中文"
	},
	ascii : {
		regex : "^[\\x00-\\xFF]+$",
		title : "仅ACSII字符"
	},
	zipcode : {
		regex : "^\\d{6}$",
		title : "邮编"
	},
	mobile : {
		regex : "^13[0-9]{9}|15[012356789][0-9]{8}|18[0256789][0-9]{8}|147[0-9]{8}$",
		title : "手机"
	},
	ip4 : {
		regex : "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",
		title : "ip地址"
	},
	notempty : {
		regex : "^\\S+$",
		title : "非空"
	},
	picture : {
		regex : "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",
		title : "图片"
	},
	rar : {
		regex : "(.*)\\.(rar|zip|7zip|tgz)$",
		title : "压缩文件"
	},
	date : {
		regex : "^\\d{4}(\\-|\\/|.)\\d{1,2}\\1\\d{1,2}$",
		title : "日期"
	},
	qq : {
		regex : "^[1-9]*[1-9][0-9]*$",
		title : "QQ号码"
	},
	tel : {
		regex : "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$",
		title : "电话号码"
	},
	
	/**
	 * 提供同时校验手机号与座机号功能
	 * Added by xuwei 2016/1/8
	 */
	mobileOrTel : {
		regex : "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$|^13[0-9]{9}|15[012356789][0-9]{8}|18[0256789][0-9]{8}|147[0-9]{8}$",
		title : "手机号码或固定电话"
	},
	
	username : {
		regex : "^\\w+$",
		title : "用户由数字、26个英文字母或者下划线组成的字符串"
	},
	letter : {
		regex : "^[A-Za-z]+$",
		title : "字母"
	},
	letter_u : {
		regex : "^[A-Z]+$",
		title : "大写字母"
	},
	letter_l : {
		regex : "^[a-z]+$",
		title : "小写字母"
	},
	idcard : {
		regex : "^[1-9]([0-9]{14}|[0-9]{17})$",
		title : "身份证"
	}
};
var aCity = {
	11 : "北京",
	12 : "天津",
	13 : "河北",
	14 : "山西",
	15 : "内蒙古",
	21 : "辽宁",
	22 : "吉林",
	23 : "黑龙江",
	31 : "上海",
	32 : "江苏",
	33 : "浙江",
	34 : "安徽",
	35 : "福建",
	36 : "江西",
	37 : "山东",
	41 : "河南",
	42 : "湖北",
	43 : "湖南",
	44 : "广东",
	45 : "广西",
	46 : "海南",
	50 : "重庆",
	51 : "四川",
	52 : "贵州",
	53 : "云南",
	54 : "西藏",
	61 : "陕西",
	62 : "甘肃",
	63 : "青海",
	64 : "宁夏",
	65 : "新疆",
	71 : "台湾",
	81 : "香港",
	82 : "澳门",
	91 : "国外"
};
function isCardID(a) {
	var c = 0;
	var e = "";
	if (!/^\d{17}(\d|x)$/i.test(a)) {
		return "身份证长度或格式错误"
	}
	a = a.replace(/x$/i, "a");
	if (aCity[parseInt(a.substr(0, 2))] == null) {
		return "身份证地区非法"
	}
	sBirthday = a.substr(6, 4) + "-" + Number(a.substr(10, 2)) + "-"
			+ Number(a.substr(12, 2));
	var f = new Date(sBirthday.replace(/-/g, "/"));
	if (sBirthday != (f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f
			.getDate())) {
		return "身份证上的出生日期非法"
	}
	for ( var b = 17; b >= 0; b--) {
		c += (Math.pow(2, b) % 11) * parseInt(a.charAt(17 - b), 11)
	}
	if (c % 11 != 1) {
		return "身份证号非法"
	}
	return true
}
function isTime(c) {
	var b = c.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
	if (b == null) {
		return false
	}
	if (b[1] > 24 || b[3] > 60 || b[4] > 60) {
		return false
	}
	return true
}
function isDate(c) {
	if (typeof (c) != "string") {
		return false
	}
	var a = c.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if (a == null) {
		return false
	}
	var b = new Date(a[1], a[3] - 1, a[4]);
	return (b.getFullYear() == a[1] && (b.getMonth() + 1) == a[3] && b
			.getDate() == a[4])
}
function isDateTime(e) {
	var a = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var b = e.match(a);
	if (b == null) {
		return false
	}
	var c = new Date(b[1], b[3] - 1, b[4], b[5], b[6], b[7]);
	return (c.getFullYear() == b[1] && (c.getMonth() + 1) == b[3]
			&& c.getDate() == b[4] && c.getHours() == b[5]
			&& c.getMinutes() == b[6] && c.getSeconds() == b[7])
}
(function(e) {
	var c = new Date();
	var b = "1,2,3,4,5,6,7,8,9,10,11,12".split(",");
	var f = "31,28,31,30,31,30,31,31,30,31,30,31".split(",");
	var d = /^\d{2}|\d{4}-\d{1,2}-\d{1,2}$/;
	var a = /^\d{4,4}$/;
	e.fn.webDatepicker = function(h) {
		var j = e.extend({}, e.fn.webDatepicker.defaults, h);
		j.hasday = (j.fmt.indexOf("dd") >= 0) ? true : false;
		l();
		function l() {
			var o, n;
			if (j.startdate.constructor == Date) {
				o = j.startdate.getFullYear()
			} else {
				if (!j.startdate) {
					o = c.getFullYear()
				} else {
					if (a.test(j.startdate)) {
						o = j.startdate
					} else {
						var p = d.test(j.startdate);
						if (p) {
							j.startdate = new Date(j.startdate)
						}
						o = (p) ? j.startdate.getFullYear() : c.getFullYear()
					}
				}
			}
			o -= j.downYears;
			j.startyear = o;
			if (j.enddate.constructor == Date) {
				n = j.enddate.getFullYear()
			} else {
				if (!j.enddate) {
					n = c.getFullYear()
				} else {
					if (a.test(j.enddate)) {
						n = j.enddate
					} else {
						var p = d.test(j.enddate);
						if (p) {
							j.enddate = new Date(j.enddate)
						}
						n = (p) ? j.enddate.getFullYear() : c.getFullYear()
					}
				}
			}
			n += j.upYears;
			j.endyear = n
		}
		if (h != null && h.startyear != null) {
			j.startyear = h.startyear
		}
		if (h != null && h.endyear != null) {
			j.endyear = h.endyear
		}
		function i() {
			var p = [];
			for ( var o = 0; o <= j.endyear - j.startyear; o++) {
				p[o] = j.startyear + o
			}
			var q = e('<table class="webdatepickercss" tabIndex="0" cellpadding="0" cellspacing="0"></table>');
			q.append("<thead></thead>");
			q.append("<tfoot></tfoot>");
			q.append("<tbody></tbody>");
			var n = '<select name="month" class="month">';
			for ( var o in b) {
				n += '<option value="' + o + '">' + b[o] + "</option>"
			}
			n += "</select>";
			var r = '<select name="year">';
			for ( var o in p) {
				r += "<option>" + p[o] + "</option>"
			}
			r += "</select>";
			e("thead", q)
					.append(
							'<tr class="controls"><th colspan="7" ><span class="prevYear" >&laquo;</span>&nbsp;<span class="prevMonth" >&lsaquo;&nbsp;</span>&nbsp;'
									+ r
									+ n
									+ '&nbsp;<span class="nextMonth" >&nbsp;&rsaquo;</span>&nbsp;<span class="nextYear" >&raquo;</span></th></tr>');
			if (j.hasday) {
				e("thead", q)
						.append(
								'<tr class="days"><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>')
			}
			e("tfoot", q)
					.append(
							'<tr><td ><span class="prevMonth" >&nbsp;&lsaquo;&nbsp;&nbsp;</span></td><td  class="td_today" ><span class="today">选今天</span>&nbsp;<span class="clear" >清空</span>&nbsp;<span class="close" >关闭</span></td><td ><span class="nextMonth" >&nbsp;&nbsp;&rsaquo;&nbsp;</span></td></tr>');
			if (!j.hasday) {
				e("span.today", q).after('&nbsp;<span class="ok" >确定</span>')
			}
			for ( var o = 0; j.hasday && o < 6; o++) {
				e("tbody", q)
						.append(
								"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
			}
			return q
		}
		function g(n) {
			var o = curtop = 0;
			if (!n.offsetParent) {
				return false
			}
			do {
				o += n.offsetLeft;
				curtop += n.offsetTop
			} while (n = n.offsetParent);
			return [ o, curtop ]
		}
		function k(K, o, B, A) {
			var x = e("select[name=month]", B);
			var v = e("select[name=year]", B);
			var w = e("span.prevMonth", B);
			var z = e("span.nextMonth", B);
			var E = x.get(0).selectedIndex;
			var G = v.get(0).selectedIndex;
			var r = e("select[name=year] option", B).get().length;
			if (K && e(K.target).hasClass("prevMonth")) {
				if (0 == E && G) {
					G -= 1;
					E = 11;
					x.get(0).selectedIndex = 11;
					v.get(0).selectedIndex = G
				} else {
					E -= 1;
					x.get(0).selectedIndex = E
				}
			} else {
				if (K && e(K.target).hasClass("nextMonth")) {
					if (11 == E && G + 1 < r) {
						G += 1;
						E = 0;
						x.get(0).selectedIndex = 0;
						v.get(0).selectedIndex = G
					} else {
						E += 1;
						x.get(0).selectedIndex = E
					}
				} else {
					if (K && e(K.target).hasClass("prevYear")) {
						if (G) {
							G -= 1;
							v.get(0).selectedIndex = G
						}
					} else {
						if (K && e(K.target).hasClass("nextYear")) {
							if (G + 1 < r) {
								G += 1;
								v.get(0).selectedIndex = G
							}
						}
					}
				}
			}
			if (0 == E && !G) {
				w.hide()
			} else {
				w.show()
			}
			if (G + 1 == r && 11 == E) {
				z.hide()
			} else {
				z.show()
			}
			if (!j.hasday) {
				w.hide();
				z.hide();
				e("select.month", B).change(function() {
					m(o, B, new Date(v.val(), x.val(), 1))
				});
				return
			}
			e(".td_today", B).attr("colspan", 5);
			var q = e("tbody td", B).unbind().empty().removeClass("date");
			var C = x.val();
			var u = v.val();
			var L = new Date(u, C, 1);
			var N = L.getDay();
			var I = f[C];
			if (1 == C) {
				I = ((u % 4 == 0 && u % 100 != 0) || u % 400 == 0) ? 29 : 28;
				f[C] = I
			}
			if (j.startdate.constructor == Date) {
				var J = j.startdate.getMonth();
				var p = j.startdate.getDate()
			}
			if (j.enddate.constructor == Date) {
				var D = j.enddate.getMonth();
				var H = j.enddate.getDate()
			}
			for ( var M = 0; M < N; M++) {
				e(q.get(M)).text((f[C - 1 <= 0 ? 11 : C - 1] - N + 1) + M)
						.addClass("othermonth")
			}
			for ( var F = 0; F < I; F++) {
				var n = e(q.get(F + N)).removeClass("chosen").removeClass(
						"othermonth").removeClass("today");
				if ((G || ((!p && !J) || ((F + 1 >= p && E == J) || E > J)))
						&& (G + 1 < r || ((!H && !D) || ((F + 1 <= H && E == D) || E < D)))) {
					n.text(F + 1).addClass("date").hover(function() {
						e(this).addClass("over")
					}, function() {
						e(this).removeClass("over")
					}).click(function() {
						var y = new Date(v.val(), x.val(), e(this).text());
						m(o, B, y)
					});
					if (F + 1 == A.getDate() && C == A.getMonth()
							&& u == A.getFullYear()) {
						n.addClass("chosen")
					}
					if (F + 1 == c.getDate() && C == c.getMonth()
							&& u == c.getFullYear()) {
						n.addClass("today")
					}
				}
			}
			for ( var s = 0; s < (6 * 7 - (M + F)); s++) {
				e(q.get(s + M + F)).text(s + 1).addClass("othermonth")
			}
		}
		function m(o, p, n) {
			if (n && n.constructor == Date) {
				o.val(e.fn.webDatepicker.formatOutput(n, j.fmt))
			}
			p.remove();
			p = null;
			e.data(o.get(0), "webDatepicker", {
				hasDatepicker : false
			})
		}
		return this
				.each(function() {
					var n = e(this);
					if (n.is("input") && "text" == n.attr("type")) {
						var o;
						n.data("webDatepicker", {
							hasDatepicker : false
						});
						n
								.click(function(s) {
									e("span.close", e(document)).trigger(
											"click");
									var r = e(s.target);
									if (false == r.data("webDatepicker").hasDatepicker) {
										r.data("webDatepicker", {
											hasDatepicker : true
										});
										var u = r.val();
										if (u && d.test(u)) {
											var w = e.fn.webDatepicker
													.parseDate(u, j.fmt)
										} else {
											var w = (j.chosendate.constructor == Date) ? j.chosendate
													: (j.chosendate) ? new Date(
															j.chosendate)
															: c
										}
										o = i();
										e("body").prepend(o);
										var q = g(r.get(0));
										var p = (parseInt(j.x) ? parseInt(j.x)
												: 0)
												+ q[0];
										var v = (parseInt(j.y) ? parseInt(j.y)
												: 0)
												+ q[1];
										e(o).css({
											position : "absolute",
											left : p,
											top : v
										});
										e("span", o).css("cursor", "pointer");
										e("select", o).bind("change",
												function() {
													k(null, r, o, w)
												});
										e("span.prevMonth", o).attr("title",
												"前翻1月\n快捷键：←").click(
												function(x) {
													k(x, r, o, w);
													return false
												});
										e("span.nextMonth", o).attr("title",
												"向后翻 1 月\n快捷键：→").click(
												function(x) {
													k(x, r, o, w);
													return false
												});
										e("span.prevYear", o).attr("title",
												"向前翻 1 年\n快捷键：↑").click(
												function(x) {
													k(x, r, o, w);
													return false
												});
										e("span.nextYear", o).attr("title",
												"向后翻 1 年\n快捷键：↓").click(
												function(x) {
													k(x, r, o, w);
													return false
												});
										e("span.today", o).attr("title",
												"选择今天\n快捷键：T").click(
												function() {
													m(r, o, new Date());
													return false
												});
										e("span.close", o).attr("title",
												"关闭的快捷键：[Esc]").click(
												function() {
													m(r, o)
												});
										e("span.clear", o).attr("title",
												"清空的快捷键：[C]").click(function() {
											m(r, o);
											n.val("")
										});
										e("span.ok", o)
												.click(
														function() {
															m(
																	r,
																	o,
																	new Date(
																			e(
																					'[name="year"]',
																					o)
																					.val(),
																			e(
																					'[name="month"]',
																					o)
																					.val(),
																			1));
															return false
														});
										e(o).focus();
										e(o)
												.keydown(
														function(y) {
															var x = y.which ? y.which
																	: y.keyCode;
															switch (x) {
															case 27:
																e("span.close",
																		o)
																		.trigger(
																				"click");
																break;
															case 37:
																e(
																		e(
																				"span.prevMonth",
																				o)
																				.get(
																						0))
																		.trigger(
																				"click");
																break;
															case 38:
																e(
																		"span.prevYear",
																		o)
																		.trigger(
																				"click");
																break;
															case 39:
																e(
																		e(
																				"span.nextMonth",
																				o)
																				.get(
																						0))
																		.trigger(
																				"click");
																break;
															case 40:
																e(
																		"span.nextYear",
																		o)
																		.trigger(
																				"click");
																break;
															case 84:
																e("span.today",
																		o)
																		.trigger(
																				"click");
																break;
															case 67:
																e("span.clear",
																		o)
																		.trigger(
																				"click");
																break
															}
															return false
														});
										e("select[name=month]", o).get(0).selectedIndex = w
												.getMonth();
										e("select[name=year]", o).get(0).selectedIndex = Math
												.max(0, w.getFullYear()
														- j.startyear);
										k(null, r, o, w);
										e(o)
												.css(
														"z-index",
														parseInt(new Date()
																.getTime() / 1000))
									}
									return false
								});
						n.focus(function() {
							n.blur()
						});
						e(document)
								.click(
										function(p) {
											if (n.data("webDatepicker") != null
													&& n.data("webDatepicker").hasDatepicker
													&& p.target != n
													&& e(p.target)
															.closest(
																	".webdatepickercss").length <= 0) {
												e("span.close", o).trigger(
														"click")
											}
										})
					}
				})
	};
	e.fn.webDatepicker.formatOutput = function(h, g) {
		var m = h.getMonth() + 1;
		var o = h.getDate();
		var l = "", n = "";
		if (g == undefined) {
			g = "yyyy-mm-dd"
		}
		for ( var j = 0; j < g.length; j++) {
			var k = g.charAt(j);
			l += k;
			switch (l) {
			case "dd":
				n += (String(o).length === 1) ? ("0" + o) : o;
				l = "";
				break;
			case "mm":
				n += (String(m).length === 1) ? (m = "0" + m) : m;
				l = "";
				break;
			case "yyyy":
				n += h.getFullYear();
				l = "";
				break;
			default:
				if (l.length === 2 && l.indexOf("y") !== 0) {
					n += l.substring(0, 1);
					l = l.substring(1, 2)
				} else {
					if ((l.length === 3 && l.indexOf("yyy") === -1)) {
						l = ""
					}
				}
			}
		}
		return n
	};
	e.fn.webDatepicker.parseDate = function(h, g) {
		var l = 1, m = 1, n = 0, k = "";
		if (g == undefined) {
			g = "yyyy-mm-dd"
		}
		for ( var j = 0; j < g.length; j++) {
			k += g.charAt(j);
			switch (k) {
			case "dd":
				m = h.substring(j - 1, j + 1);
				k = "";
				break;
			case "mm":
				l = h.substring(j - 1, j + 1);
				k = "";
				break;
			case "yyyy":
				n = h.substring(j - 4, j + 1);
				k = "";
				break;
			default:
				if (k.indexOf("y") === -1 && k.indexOf("m") === -1
						&& k.indexOf("d") === -1) {
					k = ""
				}
			}
		}
		return new Date(parseInt(n, 10), parseInt(l - 1, 10), parseInt(m, 10))
	};
	e.fn.webDatepicker.defaults = {
		chosendate : c,
		fmt : "yyyy-mm-dd",
		startdate : c.getFullYear(),
		enddate : c.getFullYear() + 1,
		downYears : 20,
		upYears : 20,
		x : 18,
		y : 18
	}
})(jQuery);
(function(a) {
	a.webDropdragUtil = {
		startMove : false,
		updatePosition : function(f) {
			var b = f.data;
			var d = a(b.target);
			var h = a.webValidator.getMousePosition(f);
			var g = b.oldLeft + (h.x - b.oldMouseX);
			var c = b.oldTop + (h.y - b.oldMouseY);
			if ((g < 0) || (c < 0)) {
				return
			}
			d.css("top", c);
			d.css("left", g);
			if (b.ops.onMove != null) {
				b.ops.onMove(d)
			}
		},
		mouseDown : function(b) {
			return false
		},
		mouseMove : function(b) {
			if (b.data.target != null) {
				if (a.webDropdragUtil.startMove) {
					a.webDropdragUtil.updatePosition(b)
				}
			}
			return false
		},
		mouseUp : function(b) {
			a.webDropdragUtil.startMove = false;
			a(b.data.target).fadeTo(0, 1);
			a(document).unbind(".webdropdrag");
			b.data.handler.css("cursor", "");
			return false
		}
	};
	a.fn.webDropdrag = function(b) {
		var c = {
			handler : null,
			onMove : null,
			opacity : 0.5
		};
		return this.each(function() {
			var f = a.extend(c, b);
			var e = a(this);
			if (e.hasClass("webDropdrag")) {
				return
			} else {
				e.addClass("webDropdrag")
			}
			var d = a(f.handler, e);
			if (d.length < 1) {
				d = e
			}
			d.bind(
					"mousedown.webdropdrag",
					{
						target : this
					},
					function(h) {
						a(this).css("cursor", "move");
						e.css("position", "absolute").css("z-index",
								parseInt(new Date().getTime() / 1000));
						var i = a.webValidator.getMousePosition(h);
						var g = {
							target : h.data.target,
							handler : d,
							ops : f,
							oldMouseX : i.x,
							oldMouseY : i.y,
							oldTop : h.data.target.offsetTop,
							oldLeft : h.data.target.offsetLeft
						};
						a.webDropdragUtil.startMove = true;
						a(h.data.target).fadeTo(0, f.opacity);
						if (g.handler != null) {
							g.handler.css("cursor", "move")
						}
						a(document).bind("mousemove.webdropdrag", g,
								a.webDropdragUtil.mouseMove);
						a(document).bind("mouseup.webdropdrag", g,
								a.webDropdragUtil.mouseUp)
					}).bind("mousemove.webdropdrag", {
				target : this
			}, function(g) {
			}).bind("mouseup.webdropdrag", {
				target : this
			}, function(g) {
				a.webDropdragUtil.startMove = false;
				a(g.data.target).fadeTo(0, 1);
				a(document).unbind(".webdropdrag");
				a(this).css("cursor", "")
			})
		})
	};
	a.webResizableUtil = {
		modifySize : function(r) {
			var s = r.data;
			var j = s.ops.minWidth;
			var p = s.ops.maxWidth;
			var c = s.ops.minHeight;
			var l = s.ops.maxHeight;
			var o, u, b, q;
			var k, d, f, m;
			o = s.startLeft;
			u = s.startTop;
			b = s.startWidth;
			q = s.startHeight;
			var i = s.startX;
			var h = s.startY;
			var g = a(s.target);
			var n = s.moveMode;
			if (n.indexOf("e") != -1) {
				f = Math.min(Math.max((b + r.pageX - i), j), p)
			}
			if (n.indexOf("s") != -1) {
				m = Math.min(Math.max((q + r.pageY - h), c), l)
			}
			if (n.indexOf("w") != -1) {
				f = b - r.pageX + i;
				if (f <= p && f >= j) {
					k = o + r.pageX - i
				}
			}
			if (n.indexOf("n") != -1) {
				m = q - r.pageY + h;
				if (m <= l && m >= c) {
					d = u + r.pageY - h
				}
			}
			if (f <= p && f >= j) {
				g.css({
					left : k
				});
				g.width(f)
			}
			if (m <= l && m >= c) {
				g.css({
					top : d
				});
				g.height(m)
			}
			if (s.ops.onResize != null) {
				s.ops.onResize(g)
			}
		},
		mouseDown : function(b) {
			return false
		},
		mouseMove : function(b) {
			if (a.webResizableUtil.startResize) {
				a.webResizableUtil.modifySize(b)
			}
			return false
		},
		mouseUp : function(b) {
			a(document).unbind(".webresizable");
			a.webResizableUtil.startResize = false;
			a(b.data.target).fadeTo(0, 1);
			a("body").css("cursor", "");
			return false
		},
		mModes : "n, e, s, w, ne, se, sw, nw, all".split(","),
		startResize : false,
		getMoveMode : function(h) {
			var j = a(h.data.target);
			var f = j.offset();
			var b = j.outerWidth();
			var l = j.outerHeight();
			var c = 7;
			var d = "";
			if (h.pageY > f.top && h.pageY < f.top + c) {
				d += "n"
			} else {
				if (h.pageY < f.top + l && h.pageY > f.top + l - c) {
					d += "s"
				}
			}
			if (h.pageX > f.left && h.pageX < f.left + c) {
				d += "w"
			} else {
				if (h.pageX < f.left + b && h.pageX > f.left + b - c) {
					d += "e"
				}
			}
			for ( var g = 0; g < this.mModes.length; g++) {
				var k = this.mModes[g].replace(/(^\s*)|(\s*$)/g, "");
				if (k == "all" || k == d) {
					return d
				}
			}
			return ""
		},
		getElCss : function(c, b) {
			var d = parseInt(c.css(b));
			return isNaN(d) ? 0 : d
		}
	};
	a.fn.webResizable = function(b) {
		var c = {
			onResize : null,
			opacity : 0.5,
			minWidth : 50,
			maxWidth : 800,
			minHeight : 50,
			maxHeight : 600
		};
		return this.each(function() {
			var e = a.extend(c, b);
			var d = a(this);
			if (d.hasClass("webResizable")) {
				return
			} else {
				d.addClass("webResizable")
			}
			d.bind(
					"mousedown.webResizable",
					{
						target : this
					},
					function(h) {
						var i = a.webResizableUtil.getMoveMode(h);
						if (i == "") {
							return
						}
						var g = a(h.data.target);
						var f = {
							target : h.data.target,
							ops : e,
							moveMode : a.webResizableUtil.getMoveMode(h),
							startLeft : a.webResizableUtil.getElCss(g, "left"),
							startTop : a.webResizableUtil.getElCss(g, "top"),
							startX : h.pageX,
							startY : h.pageY,
							startWidth : g.outerWidth(),
							startHeight : g.outerHeight()
						};
						a.webResizableUtil.startResize = true;
						g.fadeTo(0, e.opacity);
						a(document).bind("mousedown.webresizable", f,
								a.webResizableUtil.mouseDown);
						a(document).bind("mousemove.webresizable", f,
								a.webResizableUtil.mouseMove);
						a(document).bind("mouseup.webresizable", f,
								a.webResizableUtil.mouseUp);
						a("body").css("cursor", f.moveMode + "-resize")
					}).bind("mousemove.webresizable", {
				target : this
			}, function(f) {
				if (a.webResizableUtil.startResize) {
					return
				}
				var g = a.webResizableUtil.getMoveMode(f);
				if (g == "") {
					a(f.data.target).css("cursor", "")
				} else {
					a(f.data.target).css("cursor", g + "-resize")
				}
			}).bind("mouseleave.webresizable", {
				target : this
			}, function(f) {
				a(f.data.target).fadeTo(0, 1);
				a(f.data.target).css("cursor", "")
			})
		})
	}
})(jQuery);
(function(a) {
	a.webDialogUtil = {
		openedCount : 0,
		createDlg : function(g) {
			var k = a("<div class='webdialog' style:'display:none'></div>");
			var e = a("<div class='header'></div>");
			var f = a("<div class='title'></div");
			var h = a("<div class='webdialog_tools'><a class='closer' href='javascript:void(0)' ></a></div");
			var l = a("<div class='webdialog_body'></div>");
			f.append(g.title);
			e.append(f).append(h);
			k.append(e).append(l);
			l.append(g.content);
			if (g.url != null) {
				var c = a('<iframe src="'
						+ g.url
						+ '" width="100%" height="100%" scrolling="auto" frameborder="2" marginheight="10" marginwidth="10" ></iframe>');
				l.append(c)
			}
			if (g.buttons != null && g.buttons.length > 0) {
				var m = a('<div class="webdialog_buttons"></div>');
				for ( var d = 0; d < g.buttons.length; d++) {
					if (g.buttons[d].btn != null) {
						var b = a(g.buttons[d].btn);
						var j = b.PicButton();
						if (g.buttons[d].onclick != null) {
							j.bind("click", {
								target : k
							}, g.buttons[d].onclick)
						}
						m.append(j)
					} else {
						m.append(g.buttons[d])
					}
				}
				l.append(m)
			}
			k.css({
				top : (a(window).height() - parseInt(g.top)) / 2,
				left : (a(window).width() - parseInt(g.left)) / 2,
				width : Math.min(Math.max(g.width, g.minWidth), g.maxWidth),
				height : Math.min(Math.max(g.height, g.minHeight), g.maxHeight)
			});
			return k
		}
	};
	a.fn.WebDialog = function(b) {
		var c = {
			onResize : null,
			onClose : null,
			width : 400,
			height : 170,
			top : 0,
			left : 0,
			title : "&nbsp;",
			ismodel : false,
			url : null,
			handle : null,
			applyTo : null,
			checkOnClose : false,
			content : null,
			opacity : 0.5,
			minWidth : 50,
			maxWidth : 1024,
			minHeight : 50,
			maxHeight : 768,
			animate : 300,
			event : null,
			startPos : {
				x : 0,
				y : 0
			}
		};
		return this.each(function() {
			var e = a.extend(c, b);
			e.handle = a(this);
			var d = {
				dlg : null,
				applyVisible : true,
				open : function(k) {
					this.dlg = a.webDialogUtil.createDlg(k);
					if (k.applyTo != null) {
						if (k.applyTo.hasClass("webDialog_apply")) {
							this.dlg.empty();
							return
						} else {
							k.applyTo.addClass("webDialog_apply")
						}
						k.applyTo.after(this.dlg);
						a(".webdialog_body", this.dlg).append(k.applyTo);
						this.applyVisible = k.applyTo.is(":visible");
						if (!this.applyVisible) {
							k.applyTo.show()
						}
					} else {
						k.handle.append(this.dlg)
					}
					var j = a(".header", this.dlg);
					var f = j.outerHeight();
					var g = a(".webdialog_body", this.dlg);
					var h = parseInt(g.css("padding-top"))
							+ parseInt(g.css("padding-bottom")) + 11;
					g.css("height", this.dlg.innerHeight() - f - h);
					this.dlg.webDropdrag({
						handler : ".header",
						opacity : k.opacity
					});
					var i = {
						onResize : function(l) {
							a(".webdialog_body", l).css("height",
									l.innerHeight() - f - h)
						}
					};
					k = a.extend(k, i);
					this.dlg.webResizable(k);
					a(".closer", j).bind("click", {
						target : this.dlg
					}, function(l) {
						d.closeDlg(l)
					})
				},
				show : function(h) {
					var n = parseInt(new Date().getTime() / 1000);
					if (h.ismodel) {
						a("body").setmask({
							zindex : n
						})
					}
					var m = parseInt(this.dlg.width());
					var j = parseInt(this.dlg.height());
					var i = (a(window).width() - m) / 2;
					var l = (a(window).height() - j) / 3
							+ a.webDialogUtil.openedCount * 30;
					var k = 0;
					var f = 0;
					if (h.animate >= 1) {
						if (h.event != null) {
							var g = a.webValidator.getMousePosition(h.event);
							h.startPos = g;
							k = g.y;
							f = g.x
						}
						this.dlg.css({
							left : f,
							top : k,
							width : 0,
							height : 0,
							opacity : 0.5
						});
						this.dlg.animate({
							left : i,
							top : l,
							width : m,
							height : j,
							opacity : 1
						}, {
							duration : 300
						})
					}
					this.dlg.css({
						left : i,
						top : l,
						opacity : 1,
						"z-index" : n + 1
					})
				},
				hide : function() {
					this.dlg.hide()
				},
				close : function() {
					a(".header .closer", this.dlg).trigger("click")
				},
				closeDlg : function(h) {
					var g = true;
					var f = h.data.target;
					if (e.checkOnClose) {
						g = f.checkDataValid()
					}
					if (e.onClose != null) {
						g = e.onClose(h, e)
					}
					if (g == false) {
						return
					}
					if (e.applyTo != null) {
						f.before(e.applyTo);
						if (!d.applyVisible) {
							e.applyTo.hide()
						}
						e.applyTo.removeClass("webDialog_apply")
					}
					if (e.animate >= 1) {
						f.animate({
							left : e.startPos.x,
							top : e.startPos.y,
							width : 0,
							height : 0
						}, {
							duration : e.animate,
							complete : function() {
								a(this).remove()
							}
						})
					} else {
						f.remove()
					}
					a.webDialogUtil.openedCount--;
					if (e.ismodel) {
						a("body").unmask()
					}
				}
			};
			d.open(e);
			d.show(e);
			a.webDialogUtil.openedCount++;
			this.dialog = d
		})
	};
	a.fn.closeWebDialog = function() {
		return this.each(function() {
			a(".header .closer", this.dlg).trigger("click")
		})
	}
})(jQuery);
document
		.write("<div class='ui-mask' ></div><div class='ui-mask-msg'  ><div style='z-index: 100;'>页面正在加载......</div></div>");
$(window).load(function() {
	$(document).unmask()
});
if ($.browser.msie) {
	window.onbeforeprint = function() {
		$(document).unmask()
	}
};

function match_proj_detail(div, idx, what) {
	tab = div.getElementsByTagName("table")[0]
	td = tab.querySelectorAll("td")
	if (idx > -1) {
		v = td[idx].innerText
		if (!v.match(RegExp(what)))
			return
	} else {
		matched = false
		range = [4, 22, 24, 28]
		range.forEach(function(x) {
			if (td[x].innerText.match(RegExp(what)))
				matched = true
		})
		if (!matched)
			return
	}

	div.hidden = false

	$("table.tableorg")[0].querySelectorAll("tr[id]").forEach(function(e) {
		if (e.values[5][0] != td[2].innerText)
			return
		amount += parseFloat(e.values[1][0])
		cnt++
		e.hidden = false
	})
}

function group_by_row(r, c, t) {
	if (r > 0 && c > 0)
		return eval('$("#details-list .m-account-detail tr:nth-child(' +
					r + ') td:nth-child(' + c + '):contains(' + t + ')")')
	else
		return document.querySelectorAll("#details-list .m-account-detail td:not(.name)")
}

function sum_by_project(sum, t) {
	td=t.querySelectorAll("td:not(.name)")
	if (undefined == t.v || !Array.isArray(t.v)) {
		t.v = Array()
		t.v[0] = td[0].innerText
		t.v[4] = parseFloat(td[4].innerText.match(/[\d\.]+/)[0])
		t.v[5] = parseFloat(td[5].innerText.match(/[\d\.]+/)[0])
		t.v[8] = td[8].innerText
		t.v[13] = td[13].innerText.replace(/\n+/, '')
		for (var i=14; i<18; i++)
			t.v[i] = parseFloat(td[i].innerText.match(/[\d\.]+/)[0])
	}

	try {
		t.g.constructor
	} catch (e) {
		t.g = parse_location(td[10].innerText.replace(/ +/g,''))
		t.g.k = function() {
			return this.constructor.keys(this)
		}
	}

    sum[0].push(t.v[0])
    sum[2] += t.v[14]
    sum[3] += t.v[5]
    var s = t.v[13]
    if (!sum[4].includes(s))
        sum[4].push(s)
    sum[6] += t.v[4]
    // 个人查询表格计算个人扣款
    try {
        t.perfee.forEach(function(r){
            sum[1] += r.fee
            sum[5].push(r.code)
        })
    } catch (e) {
        var perfee = Array()
        td[0].querySelectorAll('a').forEach(function(x) {
			var code = x.getAttribute('zqcode')
            var r = document.querySelector('#zq_' + code).parentElement.parentElement
			var f = {code: code}
            try {
                f.fee = parseFloat(r.values[1][0])
            } catch(e) {
                f.fee = parseFloat(r.children[1].innerText.match(/[\d\.]+/)[0])
            }
            sum[1] += f.fee
            sum[5].push(f.code)
            perfee.push(f)
        })
        t.perfee = perfee
    }
}

function sum_of(n, t) {
	var sum = Array(Array(), 0, 0, 0, Array(), Array(), 0)
	var r = 0, c = 0
	var tname=document.querySelectorAll("#details-list .account-content:first-child td.name")
	for (var i=0; i<tname.length; i++) {
		if (tname[i].innerText.match(RegExp(n))) break
	}
	if (i<tname.length) {
		c = $(tname[i]).index() + 2
		r = $(tname[i].parentElement).index() + 1
	}
	sum.push(r)

	var startDate = document.querySelector("#startDate").earliestValue
	var endDate = document.querySelector("#endDate").value
	if (document.querySelector("#startDate").defaultValue !=
		document.querySelector("#startDate").value)
		startDate = document.querySelector("#startDate").value

	if (typeof(t) != 'number' || !isNaN(t)) {
		document.querySelectorAll("#details-list table").forEach(function(e){
			// the project not related to me
			if (document.onlymine && e.querySelectorAll("td")[2].childElementCount==0) return

			if (n != '实施时间') {
				var d = e.querySelectorAll("td:not(.name)")[8].innerText
				if (d < startDate || d > endDate) return
			}

			if (n.match(/建立日期/) && 'object' === typeof(window.shkc.pjlist)) {
				var d = window.shkc.pjlist[e.v[0]][0]
				if (!d.match(RegExp(t))) return
			} else try {
				var m = t.match(/^`(.+)`$/)[1]
				if (!eval(m)) return
			} catch (err) {
				if (r > 0) {
					var td=e.getElementsByTagName("tr")[r-1].children[c-1]
					if (!td.innerText.match(RegExp(t))) return
				} else {
					var td=e.querySelectorAll("td:not(.name)")
					var matched=false
					td.forEach(function(e){
						if (e.innerText.match(RegExp(t))) matched=true
					})
					if (!matched) return
				}
			}

			sum_by_project(sum, e)
		})
	} else if (!n.match(/建立日期/)) {
		document.querySelectorAll("#details-list table").forEach(function(e){
			var td=e.querySelectorAll("td:not(.name)")
			if (td[8].innerText.length > 0) return
			sum_by_project(sum, e)
		})
	}

	return sum
}

function fill_statistics_row(tr) {
	sum = tr.statistics

	for (i = 0; i < 5; i++) {
		if (typeof(sum[i]) == 'object')
			tr.children[i + 1].innerText = sum[i].length
		else
			tr.children[i + 1].innerText = sum[i].toFixed(2)
	}
	if (sum[sum.length-1] < 1) return

	tr.parentElement.parentElement.querySelector("thead tr").lastElementChild.innerText = '涉及施工施工管理单位'
	if (sum[4].length > 1) {
		select = document.createElement("select")
		tr.lastChild.appendChild(select)
		sum[4].forEach(function(e) {
			opt = document.createElement("option")
			opt.innerText = e
			select.appendChild(opt)
		})
	} else if (sum[4].length > 0) {
		tr.lastChild.innerText = sum[4][0]
	}
}

function click_event_statistics_item(obj) {
	obj.show = !obj.show
	if (obj.show) {
		obj.classList.add('show')
	} else {
		obj.classList.remove('show')
	}
	setTimeout(hidden_by_dom, 100, obj)

	var title = document.querySelectorAll("p.title")[1]
	try {
		title.lastElementChild.remove()
	} catch(err) { console.log(err) }

	var stat=Array()
	document.querySelectorAll(".details-statistics tbody td:first-child").forEach(function(e){
		if (!e.show) return
		stat.push(e.innerText)
	})
	if (stat.length > 0) {
		title.appendChild(document.createElement("span"))
		title.lastElementChild.innerText = stat.join("、")
	}

	var tr = document.querySelector("tbody tr:last-child")
	tr.children[0].classList.add('counting')
	tr.children[1].classList.add('counting')
}

function add_statistics(tbody, rname, key) {
	var sname = tbody.parentElement.parentElement.previousElementSibling.querySelector(".title").firstChild.data
	var tr = document.createElement("tr")
	for (i = 0; i < 7; i++) {
		tr.appendChild(document.createElement("td"))
	}
	tr.firstChild.innerText = rname
	tr.children[1].innerHTML='<img>'
	tr.children[2].innerHTML='<img>'
	tr.children[3].innerHTML='<img>'
	tr.children[4].innerHTML='<img>'
	tr.children[5].innerHTML='<img>'
	if (tbody.querySelector("tr:last-child input")) {
		tbody.insertBefore(tr, tbody.lastElementChild)
	} else {
		tbody.appendChild(tr)
	}
	tr.firstChild.addEventListener('click', function(e) {
		click_event_statistics_item(this)
	})
	tr.lastElementChild.addEventListener('click', function(e) {
		if (e.target.localName!='td') return
		console.log(e)
		if (!confirm('确定要删除【' + sname + '】中的统计项：【' + rname + '】吗？')) { return }
		this.parentElement.remove()
	})

	setTimeout(function(){
		var sum = sum_of(sname, key)
		if (0==sum[0].length) {
			tr.remove()
			return
		}
		tr.statistics = sum
		fill_statistics_row(tr)
	}, 10)
}

function cal_statistics(tab, r) {
	r.forEach(function(t){
		if (typeof(t) == 'object') {
			t.constructor.keys(t).forEach(function(k){
//				console.log(t[k], t[k].match(/^eval\((.+)\)$/))
				add_statistics(tab, k, t[k])
			})
		} else {
			add_statistics(tab, t, t)
		}
	})
}

function do_group_statistics(n, r) {
	var dlist = document.getElementById("details-list")
	if (null == dlist)
		return

	var div = document.createElement("div")
	var container = document.getElementById("statistics")
	if (container) {
		container.appendChild(div)
	} else {
		document.body.insertBefore(div, dlist)
	}
	div.classList = "details-statistics m-collect-info m-account-detail"

	div.innerHTML = '\
		<div class="account-title"><p class="title"></p></div>\
		<div class="collect-info" hidden>\
		<table class="tableorg">\
		<thead><tr>\
				<th></th>\
				<th>工程数量</th>\
				<th>个人扣款</th>\
				<th>已支取金额</th>\
				<th>决算金额</th>\
				<th>施工管理单位</th>\
				<th>备注：工程名、实施范围、维护原因</th>\
			</tr>\
		</thead>\
		<tbody>\
		</tbody>\
		</table>\
		</div>'

	var title = div.getElementsByClassName("title")[0]
	var subtitle = document.createElement("span")
	div.getElementsByClassName("title")[0].innerText = n
	title.appendChild(subtitle)
	div.getElementsByTagName("th")[0].innerText = n
	var tab = div.querySelector("tbody")

	if ('function' == typeof(r)) {
		var g = r()
	} else {
		var g = r
	}

	title.addEventListener("click", function(e){
		sibling=this.parentElement.nextElementSibling

		if ('function' == typeof(r)) {
			var g = r()
		} else {
			var g = r
		}

		if (sibling && sibling.querySelectorAll("tbody tr").length > 0) {

		} else if (n.match(/实施时间/)) {
			subtitle.innerText = document.querySelector("#startDate").defaultValue +
						' 至 ' + document.querySelector("#endDate").defaultValue
			setTimeout(cal_statistics, 100, tab, g)
		} else {
			subtitle.innerText = document.querySelector("#startDate").value +
						' 至 ' + document.querySelector("#endDate").value
			setTimeout(cal_statistics, 100, tab, g)
		}
		this.setAttribute('show', sibling.hidden)
		sibling.hidden=!sibling.hidden
	})

	if (g.length > 0 && g[g.length-1] == '+') {
		g.pop(g.length-1)
		var tr=document.createElement("tr")
		tab.parentElement.appendChild(document.createElement('tfoot'))
		tft = tab.parentElement.querySelector('tfoot')
		tft.appendChild(tr)
		for (var i=0; i<tab.previousElementSibling.querySelectorAll("th").length; i++) {
			tr.appendChild(document.createElement("td"))
		}
		tr.firstElementChild.appendChild(document.createElement("input"))
		tr.lastElementChild.appendChild(document.createElement("input"))
		var bt = document.createElement('button')
		tr.lastElementChild.previousElementSibling.appendChild(bt)
		bt.innerText='新增条目'
		tr.lastElementChild.setAttribute('colspan', '4')
		tr.classList.add('searchbox')
		bt.addEventListener('click', function(e){
			var s=tr.querySelectorAll("input")[0].value
			var k=tr.querySelectorAll("input")[1].value
			if (k.length < 1) return
			if (s.length < 1) s=k
			add_statistics(tab, s, k)
		})
	}
}

function statistics() {
	$(".details-statistics").remove()
	if (document.querySelectorAll('#details-list .account-content').length < 1) return false

	var dlist = document.getElementById("details-list")
	if (!dlist) return
	if (dlist.children.length < 1) return

	document.querySelector("#startDate").earliestValue = document.querySelector("#startDate").value
	type_of_projs  = ['绿化', '补种', '水景', '道路', '花坛', '路灯', '消防', '监控',
					  {
						  电梯维护: '电梯',
						  电梯更换:'电梯更换$'
					  },
					  '控制柜', '井', '控制板', '+']
	range_of_projs = [{
			康城道: '`e.g.k().includes("康城道")`',
			山林道: '`e.g.k().includes("山林道")`',
			维园道: '`e.g.k().includes("维园道")`',
			江山道: '`e.g.k().includes("江山道")`',
			大浪湾道: '`e.g.k().includes("大浪湾道")`',
			瀑布湾道: '`e.g.k().includes("瀑布湾道")`',
			小区门: '(南|北|西|旋转)大?门'
		}, '+']

	return setTimeout(function() {
		do_group_statistics("是否审价", ['是', '否'])
		do_group_statistics("支取状况", [{
			已完成支取: '`e.v[15]==0`',
			未完成支取: '`e.v[15]>0`',
			未开始支取: '`e.v[14]==0`',
			有冲正支取: '`e.v[16]>0`'}, '+'])
		do_group_statistics("工程类别", type_of_projs)
		do_group_statistics("实施范围", range_of_projs)
		do_group_statistics("施工管理单位", companies)
		do_group_statistics("实施时间", years)
		if (window.shkc && window.shkc.pjlist) {
			do_group_statistics("建立日期", years)
		}
	}, 10)
}

function parse_location(c) {
	var all_roads = ['大浪湾道', '江山道', '康城道', '瀑布湾道', '山林道', '维园道']
	var addr = {o: c}
	c = c.replace(/[号室#][\-至]/g,'-')
	var s = c.match(/[大浪湾江山康城瀑布湾山林维园道]{0,4}[\d\-]+[号室楼#]?/g)
	var n=''
	if (Array.isArray(s) && s.length > 1) for (var i=0; i<s.length; i++) {
		if (s[i].match(/\d+$/)) s[i] = s[i] + '号'
		try {
			n=s[i].match(/^[^\d]+/)[0]
			all_roads.forEach(function(m){
				if (m[0] != n) return
				s[i] = s[i].replace(RegExp(n), m)
				n = m
			})
			if (!addr.constructor.keys(addr).includes(n)) addr[n] = Array()
			addr[n].push(s[i].match(/[\d\-]+[室#]?/)[0])
			continue
		} catch(e) { }
		if (n.length < 1) continue
		if (s[i].match(/^\d+号?$/)) s[i] = n + s[i]
		if (!addr.constructor.keys(addr).includes(n)) addr[n] = Array()
		addr[n].push(s[i].match(/[\d\-]+[室#]?/)[0])
	} else {
		try {
			re = '(' + all_roads.join('|') + ')([\\d\\-]+)'
			s = c.match(RegExp(re))
			road = s[1]
			addr[road] = Array(s[2])
		} catch(e) { }
	}

	return addr
}

class PROJ_LOCATION {
	constructor(s) {
		this.origin = s
	}
	parseJSON() {
		var c = this.origin
		var s = c.match(/[大浪湾江山康城瀑布湾山林维园道]{0,4}[\-\d]+[号室楼#]?/g)
		var n=''
		var addr = {}
		if (Array.isArray(s) && s.length > 1) for (var i=0; i<s.length; i++) {
			if (s[i].match(/\d+$/)) s[i] = s[i] + '号'
			try {
				n=s[i].match(/^[^\d]+/)[0]
				all_roads.forEach(function(m){
					if (m[0] != n) return
					s[i] = s[i].replace(RegExp(n), m)
					n = m
				})
				if (!addr.constructor.keys(addr).includes(n)) addr[n] = Array()
				addr[n].push(s[i].match(/[\d\-]+[室#]?/)[0])
				continue
			} catch(e) { }
			if (n.length < 1) continue
			if (s[i].match(/^\d+号?$/)) s[i] = n + s[i]
			if (!addr.constructor.keys(addr).includes(n)) addr[n] = Array()
			addr[n].push(s[i].match(/[\d\-]+[室#]?/)[0])
		} else {
			s = Array(c)
		}

		this.addr = addr
	}
}

function hidden_by_dom(td) {
	var container = document.querySelectorAll("#details-list .m-account-detail")
	if (!container || container.length < 2) return
	var all_roads = ['大浪湾道', '江山道', '康城道', '瀑布湾道', '山林道', '维园道']

	td.parentElement.statistics[0].forEach(function(e) {
		if (!td.show) {
			try {
				p = container[0].querySelector('div[id="' + e + '"]')
				container[1].appendChild(p)
			} catch (e) { return }
		} else {
			try {
				p = container[1].querySelector('div[id="' + e + '"]')
				container[0].appendChild(p)
			} catch (e) { return }
			p.hidden = false
//			s=p.querySelector("tr:nth-child(8) td:nth-child(2)").innerText.replace(/[\.,， \n]+/g,',').replace(/,$/,'')
//			s.replace('/瀑\d+', '瀑布湾道')
//			console.log(e, s.split(','))
			var t = p.querySelector('table')
			try {
				t.g.constructor
			} catch (e) {
				c = t.querySelector("tr:nth-child(8) td:nth-child(2)").innerText.replace(/ +/g,'')
				t.g = parse_location(c)
				t.g.k = function() {return this.constructor.keys(this)}
			}
			console.log(e, t.g)
		}

		p.querySelectorAll('tr a').forEach(function(a){
			var r = document.getElementById('zq_' + a.getAttribute('zqcode')).parentElement.parentElement
			r.hidden=!td.show
		})
	})

	setTimeout(function() {
		var sum = 0

		document.querySelectorAll("form .m-collect-info.index_owner_zq tbody tr:not([hidden])").forEach(function(r) {
			sum += parseFloat(r.children[2].innerText.match(/[\d\.]+/)[0])
		})

		var tr = document.querySelector("form tbody tr:last-child")
		per_sum = tr.children[0]
		per_sum.innerHTML = per_sum.innerHTML.replace(/ *\/ *\d.+$/, "") +
			" / " + sum.toFixed(2) + "元"

		per_num = tr.children[1]
		try {
			var cnt0 = document.querySelectorAll("form .m-collect-info.index_owner_zq tbody tr:not([hidden])").length
			var cnt1 = document.querySelectorAll("form .m-collect-info.index_owner_zq tbody tr").length
		} catch(e) {
			var cnt0 = 0
			var cnt1 = 0
		}
		per_num.innerHTML = per_num.innerHTML.replace(/\d+.*$/, "") + cnt1 + " / " + cnt0

		per_sum.removeAttribute('class')
		per_num.removeAttribute('class')

	}, 100)
}

function hidden_by_grp(grp, hidden) {
	eval('$("#details-list .account-content::contains(\'' +
		 grp + '\')")').each(function(i, e) {
		e.hidden = hidden
		eval('$("form .m-account-detail .m-collect-info tr:contains(' +
			 e.id + ')")').each(function(i, e) {
			e.hidden = hidden
		})
	})
}

function years() {
	var yrs = Array()
	document.querySelectorAll("#details-list tr:nth-child(7) td:nth-child(2)").forEach(function(e) {
		if (e.innerText.match(/\d{4}-\d{2}-\d{2}/) &&
			document.querySelector("#startDate").earliestValue > e.innerText) {
			document.querySelector("#startDate").earliestValue = e.innerText
		}
		y = parseInt(e.innerText)
		if (!yrs.includes(y))
			yrs.push(y)
	})

	yrs.sort()
	yrs.pop()
	yrs.reverse()
	yrs.push(NaN)
	return yrs
}

function companies() {
	company_short  = ['外高桥物业', '盛孚物业', '业委会', '向生实业', '奥的斯机电', '重庆华安楼宇',
					 '上海曼霖绿化', '上海源青绿化', '上海霸尔园林', '上海巧马建设', '上海朱林装潢',
					 '上海良相智能', '上海匡陇建筑', '上海磊正机电', '上海楚冠装饰', '上海慧菱机电',
					 '上海光大科技', '上海三菱电梯', '上海跃菱电梯', '上海木竑实业', '上海佳猛建筑',
					 '上海屹宏电梯', '上海奔硕建筑']
	var c = Array()
	document.querySelectorAll("#details-list tr:nth-child(11) td:nth-child(2)").forEach(function(e) {
		s = e.innerText.replace(/\n+/, '')
		if (s.length < 0)
			return
		var newone = true
		company_short.forEach(function(x) {
			if (!s.match(RegExp(x)))
				return
			newone = false
			if (!c.includes(x))
				c.push(x)
		})
		if (newone && !c.includes(s))
			c.push(s)
	})
	return c
}

//console.clear()

function create_title_click_event() {
		document.querySelectorAll("form p.title").forEach(function(e){
		e.addEventListener('click',function(event){
			//console.log(parentElement.nextElementSibling)
			this.parentElement.nextElementSibling.hidden = !this.parentElement.nextElementSibling.hidden
			//console.log(this)
		})
	})
}

function create_projects_achor(){
	document.querySelectorAll("form .m-collect-info a").forEach(function(l){
		l.removeAttribute('onclick')
		l.href = "#proj_" + l.innerText.match(/\d+/)[0]
		if (l.parentElement.nextElementSibling != null) return
		l.id = 'zq_' + l.parentElement.parentElement.firstElementChild.innerText.match(/\d+/)[0]
	})

	document.querySelectorAll("#details-list .m-account-detail").forEach(function(p){
		var anchor = document.createElement("a")
		p.querySelector("div.account-title").appendChild(anchor)
		anchor.id="proj_" + p.querySelector("td:not(.name)").innerText

		var fee = p.querySelector("table").perfee
		var pname = p.querySelector("td.name")
		for (var i=0; i<fee.length; i++) {
			var anchor = document.createElement("a")
			pname.appendChild(anchor)
			anchor.innerText = fee[i].code
			anchor.href = '#zq_' + fee[i].code
		}
	})
}

function valid_address () {
	document.querySelectorAll("#details-list tr:nth-child(8) td:nth-child(2)").forEach(function(c){
		s=c.innerText.replace(/[\.,， \n]+/g,',').replace(/,$/,'')
		s.replace('/瀑\d+', '瀑布湾道')
		console.log(s.split(','))
	})
}

function flag_statistics_item() {
	document.querySelectorAll(".details-statistics tbody").forEach(function(b){
		if (!b.querySelector('input')) return
		b.querySelectorAll("td:first-child").forEach(function(c){
			if (c.querySelector('input')) return
			c.setAttribute('flag', 'none')
		})
	})
}

window.chart = {
	colors: {
		DarkGreen: 'rgb(0, 100, 0)',
		LimeGreen: 'rgb(50, 205, 50)',
		LightGreen: 'rgb(144, 238, 144)',
		SpringGreen: 'rgb(0, 255, 127)',
		PaleGreen: 'rgb(152, 251, 152)',
		LightCoral: 'rgb(240, 128,128)',
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	},
	parser: {
		WeiXiuZhiChuMingXi: function (src, chartData) {
			console.log(this)
			var data = {}
			var labels = Array()
			var rtable = src.querySelectorAll("table.colwidth")
			var title = Array()
			title.push(rtable[0].querySelector("table.tab1 tr.tab_unit > td").innerText.match(/上海市.+业主大会/)[0])
			title.push(rtable[0].querySelectorAll("table td.TopTitle")[1].innerText.replace(/表$/,''))
			for (var i=0; i<rtable.length; i++) {
				chartData.labels.push(rtable[i].querySelector("tbody > tr > td.fubold").innerText.match(/\d+年\d+月/g)[1])
				rtable[i].querySelector("table.tab2").querySelectorAll("tr:not([class])").forEach(function(r){
					item = r.children[1].innerText.replace(/[ \t]+/g,'')
					if (data[item] == undefined || !Array.isArray(data[item])) data[item] = Array()
					data[item].push(r.children[2].innerText)
				})
			}

			ids = data.constructor.keys(data)
			color = data.constructor.keys(window.chart.colors)
			for (var i=0; i<ids.length; i++) {
				chartData.datasets.push({
					label: ids[i],
					data: data[ids[i]],
					backgroundColor: window.chart.colors[color[i]],
					stack: ids[i].match(/其他/) != null ? 'stack 1' : 'stack 0'
				})
			}

			return title
		},
		ShouZhiHuiZong: function (src, chartData) {
			console.log(this)
			var fund_sum = Array(Array(),Array(),Array(),Array(),Array(),Array(),Array(),Array(),Array(),Array())
			var repair_fund_earning = Array(Array(),Array(),Array(),Array())
			var labels = Array()
			var rtable = src.querySelectorAll("table.colwidth")
			var title = Array()
			title.push(rtable[0].querySelector("table.tab1 tr.tab_unit > td").innerText.match(/上海市.+业主大会/)[0])
			title.push(rtable[0].querySelectorAll("table td.TopTitle")[1].innerText.replace(/表$/,''))
			for (var i=0; i<rtable.length; i++) {
				td = rtable[i].querySelectorAll("table.tab3 > tbody > tr > td.tab_money")
				fund_sum[0].push(parseFloat(td[0].innerText))
				fund_sum[1].push(parseFloat(td[2].innerText))
				fund_sum[2].push(0 - parseFloat(td[3].innerText))
				fund_sum[3].push(parseFloat(td[4].innerText))
				fund_sum[4].push(parseFloat(rtable[i].querySelector("table.tab3 > tbody > tr:nth-child(5) table tr:last-child td").innerText.match(/[\d\.]{2,}/)[0]))
				fund_sum[5].push(0 - parseFloat(rtable[i].querySelector("table.tab3 > tbody > tr:nth-child(6) table tr:last-child td").innerText.match(/[\d\.]{2,}/)[0]))
				fund_sum[6].push(parseFloat(td[6].innerText))
				fund_sum[7].push(parseFloat(td[8].innerText))
				chartData.labels.push(rtable[i].querySelector("tbody > tr > td.fubold").innerText.match(/\d+年\d+月/g)[1])
				var c = rtable[i].querySelectorAll("table.tab3 > tbody > tr:nth-child(5) table td")
				for (var j=0; j<4; j++) {
					repair_fund_earning[j].push(c[j].innerText.match(/[\d\.]{2,}/)[0])
				}
				var spending = rtable[i].querySelector("table.tab3 > tbody > tr:nth-child(6) table tr:last-child td").innerText.match(/[\d\.]{2,}/)
				fund_sum[8].push(parseFloat(c[1].innerText.match(/[\d\.]{2,}/)[0] - td[9].innerText).toFixed(2))
				fund_sum[9].push(0 - parseFloat(c[1].innerText.match(/[\d\.]{2,}/)[0]))
			}

			chartData.datasets.push({
						label: '总账户期初余额',
						backgroundColor: window.chart.colors.purple,
						stack: 'Stack 0',
						data: fund_sum[0],
						hidden: true
			})
			chartData.datasets.push({
						label: '总账户收入',
						backgroundColor: window.chart.colors.red,
						stack: 'Stack 0',
						data: fund_sum[1],
						hidden: true
			})
			chartData.datasets.push({
						label: '总账户支出',
						backgroundColor: window.chart.colors.green,
						stack: 'Stack 0',
						data: fund_sum[2],
						hidden: true
			})
			chartData.datasets.push({
						label: '维修资金期初余额',
						backgroundColor: window.chart.colors.DarkGreen,
						stack: 'Stack 1',
						data: fund_sum[3],
						hidden: true
			}) /*{
						label: '维修资金收入',
						backgroundColor: window.chartColors.red,
						stack: 'Stack 1',
						data: fund_sum[4],
						hidden: true
			},*/
			chartData.datasets.push({
						label: '维修基金交款',
						backgroundColor: window.chart.colors.LimeGreen,
						stack: 'Stack 1',
						data: repair_fund_earning[0],
						hidden: true
			})
			chartData.datasets.push({
						label: '公共收益补充',
						backgroundColor: window.chart.colors.LightGreen,
						stack: 'Stack 1',
						data: repair_fund_earning[1],
						hidden: true
			})
			chartData.datasets.push({
						label: '存款利息',
						backgroundColor: window.chart.colors.SpringGreen,
						stack: 'Stack 1',
						data: repair_fund_earning[2],
						hidden: true
			})
			chartData.datasets.push({
						label: '其它收入',
						backgroundColor: window.chart.colors.PaleGreen,
						stack: 'Stack 1',
						data: repair_fund_earning[3],
						hidden: true
			})
			chartData.datasets.push({
						label: '维修资金支出',
						backgroundColor: window.chart.colors.green,
						stack: 'Stack 1',
						data: fund_sum[5],
						hidden: true
			})
			chartData.datasets.push({
						label: '公共收益期初余额',
						backgroundColor: window.chart.colors.orange,
						stack: 'Stack 1',
						data: fund_sum[6]
			})
			chartData.datasets.push({
						label: '公共收益收入',
						backgroundColor: window.chart.colors.red,
						stack: 'Stack 1',
						data: fund_sum[7]
			})
			chartData.datasets.push({
						label: '转入维修资金',
						backgroundColor: window.chart.colors.purple,
						stack: 'Stack 1',
						data: fund_sum[9]
			})
			chartData.datasets.push({
						label: '公共收益支出',
						backgroundColor: window.chart.colors.green,
						stack: 'Stack 1',
						data: fund_sum[8]
			})

			return title
		}
	}
}

function chart_of_report(func) {
	var source = document.querySelector(".collect-info[func='" + func + ".do']")
	if (!source) return

	var div = document.getElementById(func)
	if (!div) {
		var div = document.createElement('div')
		div.id = func
		div.classList.add('chart')
		div.hidden = true
		div.appendChild(document.createElement('span'))
		div.appendChild(document.createElement('canvas'))
		div.firstElementChild.innerText = 'X'
		div.lastElementChild.id = 'canvas'
		try {
			var container = document.querySelector("#reports .m-account-detail")
			container.insertBefore(div, container.querySelector('div.collect-info[func="'+func+'.do"]').previousElementSibling)
		} catch (e) {
			document.body.appendChild(div)
		}
	} else {
		div.querySelector('canvas').removeAttribute('style')
		div.querySelector('canvas').removeAttribute('width')
		div.querySelector('canvas').removeAttribute('height')
		div.removeAttribute('hidden')
	}
	var indicator = source.previousElementSibling.querySelector("p.title")
	var s = indicator.querySelector('span')
	if (!s) {
		s = document.createElement('span')
		indicator.appendChild(s)
		s.classList.add('chart')
		s.innerText = '数据图'
		s.setAttribute('target', func)
	}

	div.firstElementChild.addEventListener('click',function(e){
		if (e.target.localName != 'span') return
		this.parentElement.hidden = 'true'
	})

	var ctx = div.querySelector('canvas').getContext('2d')

	var chartData = {
		labels: [],
		datasets: []
	}

	var title = window.chart.parser[func](source, chartData)

	div.chart = new Chart(ctx, {
		type: 'bar',
		data: chartData,
		options: {
			plugins: {
				title: {
					fontSize: 20,
					display: true,
					text: title[0]
				},
				subtitle: {
					display: true,
					text: title[1]
				}
			},
			interaction: {
				mode: 'index',
				intersect: false
			},
			scales: {
				x: {
					//max: '2014年12月',
					stacked: true,
					reverse: true
				},
				y: {
					stacked: true
				}
			}
		}
	})
}

function projects_per_building_on_road(n, i, c) {
	if (i > c) return false
	add_statistics(document.querySelectorAll('.details-statistics tbody')[3], n[0] + i, '`e.g["' + n + '"].includes("' + i + '")`')
	setTimeout(building_of_road, 10, n, i+1, c)
}
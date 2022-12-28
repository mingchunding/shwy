
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
	if (undefined == t.values || Array.isArray(t.values)) {
	    td=t.querySelectorAll("td")
		t.values = Array()
		t.values[2] = td[2].innerText
		t.values[30] = parseFloat(td[30].innerText.match(/[\d\.]+/)[0])
		t.values[12] = parseFloat(td[12].innerText.match(/[\d\.]+/)[0])
		t.values[28] = td[28].innerText.replace(/\n+/, '')
		t.values[10] = parseFloat(td[10].innerText.match(/[\d\.]+/)[0])
	}

    sum[0].push(t.values[2])
    sum[2] += t.values[30]
    sum[3] += t.values[12]
    var s = t.values[28]
    if (!sum[4].includes(s))
        sum[4].push(s)
    sum[6] += t.values[10]
    // 个人查询表格计算个人扣款
    try {
        t.perfee.forEach(function(r){
            sum[1] += r.fee
            sum[5].push(r.code)
        })
    } catch (e) {
        var perfee = Array()
        document.querySelectorAll("form .m-collect-info.index_owner_zq td:last-child").forEach(function(x) {
            if (!x.innerText.match(RegExp(t.values[2]))) return
            var r = x.parentElement
            try {
                var f = {
                    fee: parseFloat(r.values[1][0]),
                    code: r.values[0][0]
                }
            } catch(e) {
                var f = {
                    fee: parseFloat(r.children[1].innerText.match(/[\d\.]+/)[0]),
                    code: r.children[0].innerText.match(/\d+/)[0]
                }
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

	if (typeof(t) != 'number' || !isNaN(t)) {
		document.querySelectorAll("#details-list table").forEach(function(e){
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
			if (n != '实施时间') {
				var startDate = document.querySelector("#startDate").earliestValue
				var endDate = document.querySelector("#endDate").value
				if (document.querySelector("#startDate").defaultValue !=
				    document.querySelector("#startDate").value)
					startDate = document.querySelector("#startDate").value
				var d = e.querySelectorAll("td:not(.name)")[8].innerText
				if (d < startDate || d > endDate) return
			}
			sum_by_project(sum, e)
		})
	} else {
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
		if (e.path[0].localName!='td') return
		if (!confirm('确定要删除【' + sname + '】中的统计项：【' + rname + '】吗？')) { return }
		this.parentElement.remove()
	})

	setTimeout(function(){
		var sum = sum_of(sname, key)
		tr.statistics = sum
		fill_statistics_row(tr)
	}, 10)
}

function cal_statistics(tab, r) {
	r.forEach(function(t){
		add_statistics(tab, t, t)
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

		if (!sibling || sibling.querySelectorAll("tbody tr").length < g.length) {
			subtitle.innerText = document.querySelector("#startDate").earliestValue +
						' 至 ' + document.querySelector("#endDate").value
			cal_statistics(tab, g)
		}
		this.setAttribute('show', sibling.hidden)
		sibling.hidden=!sibling.hidden
	})

	if (g.length > 0 && g[g.length-1] == '+') {
		g.pop(g.length-1)
		var tr=document.createElement("tr")
		tab.appendChild(tr)
		for (var i=0; i<tab.previousElementSibling.querySelectorAll("th").length; i++) {
			tr.appendChild(document.createElement("td"))
		}
		tr.firstElementChild.appendChild(document.createElement("input"))
		tr.lastElementChild.appendChild(document.createElement("input"))
		tr.classList.add('searchbox')
		tr.lastElementChild.addEventListener('click', function(e){
			if (e.path[0].localName!='td') return
			console.log(e)
			var s=this.parentElement.querySelectorAll("input")[0].value
			var k=this.parentElement.querySelectorAll("input")[1].value
			if (k.length < 1) return
			if (s.length < 1) s=k
			console.log(e)
			add_statistics(tab, s, k)
		})
	}
}

function statistics() {
	$(".details-statistics").remove()
	var dlist = document.getElementById("details-list")
	if (!dlist) return
	if (dlist.children.length < 1) return

	document.querySelector("#startDate").earliestValue = document.querySelector("#startDate").value
	type_of_projs  = ['绿化', '补种', '水景', '道路', '花坛', '路灯', '消防', '监控', '电梯', '电梯更换', '控制柜', '井', '控制板', '+']
	range_of_projs = ["康城道", "山林道", "维园道", "江山道", "大浪湾道", "瀑布湾道", "门", "全区"]

	setTimeout(function() {
//		do_group_statistics("是否审价", ['是'])
		do_group_statistics("是否审价", ['是', '否'])
		do_group_statistics("工程类别", type_of_projs)
		do_group_statistics("施工范围", range_of_projs)
		do_group_statistics("施工管理单位", companies)
		do_group_statistics("实施时间", years)
	}, 10)
}

function hidden_by_dom(td) {
	var container = document.querySelectorAll("#details-list .m-account-detail")
	if (!container || container.length < 2) return

	td.parentElement.statistics[0].forEach(function(e) {
		var p = document.getElementById(e)
		if (!td.show) {
			container[1].appendChild(p)
		} else {
			container[0].appendChild(p)
			p.hidden = false
			s=p.querySelector("tr:nth-child(8) td:nth-child(2)").innerText.replace(/[\.,， \n]+/g,',').replace(/,$/,'')
			s.replace('/瀑\d+', '瀑布湾道')
			console.log(e, s.split(','))
		}

		document.querySelectorAll("form .m-collect-info.index_owner_zq td:last-child").forEach(function(x) {
			if (!x.innerText.match(RegExp(e))) return
			var r = x.parentElement
			r.hidden=!td.show
		})
	})

	setTimeout(function() {
		var sum = 0

		document.querySelectorAll("form .m-collect-info.index_owner_zq tbody tr:not([hidden])").forEach(function(r) {
			sum += parseFloat(r.children[2].innerText.match(/[\d\.]+/)[0])
		})

		var tr = document.querySelector("tbody tr:last-child")
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

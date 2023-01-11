document.body.removeAttribute('style')
document.body.style.backgroundColor='rgb(255,255,255)'
document.body.style.paddingTop='15px'
document.querySelectorAll("form table").forEach(function(e){
	e.removeAttribute('style')
	e.removeAttribute('width')
	e.removeAttribute('border')
	e.removeAttribute('cellpadding')
	e.removeAttribute('cellspacing')
})
document.querySelectorAll(".details-statistics table").forEach(function(e){
	e.removeAttribute('style')
	e.removeAttribute('width')
	e.removeAttribute('border')
	e.removeAttribute('cellpadding')
	e.removeAttribute('cellspacing')
})
document.querySelectorAll("div").forEach(function(e){
	e.removeAttribute('style')
})

function link_project_to_withdraw() {
	document.querySelectorAll("form .m-collect-info tbody tr").forEach(function(zr){
		var id = zr.lastElementChild.innerText.match(/\d+/)
		if (!id) return
		id = id[0]
		var proj = document.getElementById(id)
		if (!proj) return
		if (proj.firstElementChild.classList.contains(id)) return
		proj.firstElementChild.classList.add(zr.firstElementChild.innerText.match(/\d+/)[0])
	})
}

var cssl=document.styleSheets
for (var i=0; i<cssl.length; i++) {
	try {
		var r=cssl[i].rules
	} catch (e) { continue }
	for (var j=0; j<r.length; j++) {
		if (r[j].cssText.match(/grayscale\(\d+\)/)) {
			cssl[i].removeRule(j)
		}
	}
}

function do_filter_row(r, f, s) {
	var j
	var v=Array()

//	if (type)
	for (j = 0; j < r.children.length; j++) {
		c = r.children[j]
		v[j] = c.innerText.match(/[\d\.\-]+/g)
	}
	if (!e.hasAttribute("id")) {
		r.id = r.sectionRowIndex
	}
	r.values = v

	var hidden = false
	if (f[0].value.length && null == v[0][0].match(RegExp(f[0].value))) {
		hidden = true
	}

	for (j = 1; j < 4; j++) {
		if (isNaN(f[j].value))
			continue
		if (parseFloat(v[j][0]) < parseFloat(f[j].value)) {
			hidden = true
		}
	}

	if (r.children.length > 5) {
		if (f[5].value.length && null == v[5][0].match(RegExp(f[5].value))) {
			hidden = true
		}
		detail = document.getElementById(v[5][0])
	}

	r.hidden = hidden
	if (detail) detail.hidden = r.hidden
	if (r.hidden) return hidden

	cnt++

	for (j = 0; j < r.children.length; j++) {
		if (isNaN(s[j])) {
			s[j].push(v[j][0])
			continue
		}
		s[j] += parseFloat(v[j][0])
		s[j].toFixed(2)
	}

	return hidden
}

function do_filter() {
	var tbody = document.querySelector("form .m-collect-info tbody")
	var r = tbody.children

	var l = r.length
	var cnt = 0
	var sum = Array(Array(0), 1e-6, 1e-6, 1e-6, Array(0), Array(0))
	var filter = tbody.parentElement.querySelectorAll(".tass")

	for (i = 0; i < l; i++) {
		e = r[i]
		cols = e.children.length
		var col = Array(0)
		var year = Array(0)

		e.hidden = false

		if (typeof(e.values) == 'undefined') {
			for (j = 0; j < cols; j++) {
				c = e.children[j]
				col[j] = c.innerText.match(/[\d\.\-]+/g)
			}
			if (!e.hasAttribute("id")) {
				e.id = i
			}
			e.values = col
		} else {
			col = e.values
		}

		if (filter[0].value.length && null == col[0][0].match(RegExp(filter[0].value))) {
			e.hidden = true
		}

		for (j = 1; j < 4; j++) {
			if (isNaN(filter[j].value))
				continue
			if (parseFloat(col[j][0]) < parseFloat(filter[j].value)) {
				e.hidden = true
			}
		}

		try {
			if (filter[5].value.length && null == e.children[5].innerText.match(RegExp(filter[5].value))) {
				e.hidden = true
			}
			detail = document.getElementById(col[5][0])
			if (detail) detail.hidden = e.hidden
		} catch (e) { }

		if (e.hidden) continue

		cnt++

		for (j = 0; j < cols; j++) {
			if (typeof(sum[j])!='number') {
				s=col[j][0].match(/\d+/)
				if (s && s.length > 0) s=s[0]
				else s=col[j][0]
				if (!sum[j].includes(s)) sum[j].push(s)
				continue
			}
			sum[j] += parseFloat(col[j][0])
		}
	}

	try {
		var tr = document.querySelector("form tbody tr:last-child")
		per_num = tr.children[1]
		per_num.innerHTML = per_num.innerHTML.replace(/\d+[ \/\d]*$/, "") + l + " / " + cnt
		per_sum = tr.children[0]
		per_sum.innerHTML = per_sum.innerHTML.replace(/ *\/ *\d.+$/, "") + " / " + sum[1].toFixed(2) + "元"
		t[1].sum = sum
	} catch (e) { console.log(e) }

	console.log("Filter done.")
}

function pick_the_one(r, idx, desc, indicator, next) {
	if (!r) {
		return setTimeout(function(e, v){
			e.removeAttribute('sorting')
			e.setAttribute('desc', v)
		}, 100, indicator, desc)
	}

	if (next) {
		var i = r.sectionRowIndex
		var c = r.parentElement.children.length
		indicator.setAttribute('sorting', parseInt( (i + 1) * 100 / c ))
	}
//	if (r.hidden) {
//		return setTimeout(pick_the_one, 1, r.nextElementSibling, idx, desc, indicator, next)
//	}

	try {
		sv = r.values[idx][0]
	} catch(err) {
		try {
			sv = r.children[idx].innerText
			sv = sv.match(/[\d\.\-]+/g)[0]
		} catch (err) { }
	}
	var x = undefined

	for (t=r.nextElementSibling; t; t=t.nextElementSibling) {
//		if (t.hidden) continue

		try {
			tv = t.values[idx][0]
		} catch(err) {
			try {
				tv = t.children[idx].innerText
				tv = tv.match(/[\d\.\-]+/g)[0]
			} catch (err) { }
		}
		if (isNaN(sv) || isNaN(tv)) {
			if (desc && sv >= tv) {
				continue
			}
			if (!desc && sv <= tv) {
				continue
			}
		} else {
			if (desc && parseFloat(sv) >= parseFloat(tv)) {
				continue
			}
			if (!desc && parseFloat(sv) <= parseFloat(tv)) {
				continue
			}
		}
		sv = tv
		var x = t.previousElementSibling
		r = r.parentElement.insertBefore(t, r)
		t = x
	}

	if (next) setTimeout(pick_the_one, 1, r.nextElementSibling, idx, desc, indicator, next)
}

function sortByChild2(e, idx, desc) {
	if (e == null) return
	c = e.children.length
	if (c < 2) return

	var indicator=e.parentElement.querySelector('thead').children[0].children[idx]

	pick_the_one(e.firstElementChild, idx, desc, indicator, true)
}

function sortByChild(e, idx, desc) {
	if (e == null) return
	c = e.children.length
	if (c < 2) return

	thread_sort(e.firstElementChild, idx, desc, 500)
}

function thread_sort(r, idx, desc, interval) {
	var indicator=r.parentElement.parentElement.querySelector('thead').children[0].children[idx]
	r.parentElement.sorting = true

	setTimeout(function(e){
		e.sorting = false
	}, interval, r.parentElement)

	for (; r && r.parentElement.sorting; r=r.nextElementSibling) {
		pick_the_one(r, idx, desc, indicator, false)
	}

	if (r) {
		var i = r.sectionRowIndex
		var c = r.parentElement.children.length
		indicator.setAttribute('sorting', parseInt( (i + 1) * 100 / c ))
		setTimeout(thread_sort, 1, r.nextElementSibling, idx, desc)
	}
}

function addEvents(type) {
	try {
		var hdr = document.querySelector("form .m-collect-info thead")
		hdr.sortBy = function(idx, desc) {
			this.children[0].children[idx].setAttribute('sorting', '0')
			sortByChild2(this.parentElement.querySelector("tbody"), idx, desc)
		}

		hdr.children[0].addEventListener(type, function(e) {
			var c = e.target
			if (c.localName != 'th') return

			if (3 == c.cellIndex) {
				hidden = this.nextElementSibling.hidden;
				this.nextElementSibling.hidden = !hidden
				return
			}

			var desc = false
			try {
				if (c.getAttribute('desc') == 'true') desc = true
			} catch(e) {}
			c.parentElement.querySelectorAll(c.localName).forEach(function(s){
				s.removeAttribute('sorting')
				s.removeAttribute('desc')
			})
			c.setAttribute('desc', !desc)
			return c.parentElement.parentElement.sortBy(c.cellIndex, !desc)
		})
	} catch (e) { console.log(e) }

	var t = document.querySelectorAll("form .m-collect-info thead")
	for (var j=1; j<t.length; j++) {
		t[j].sortBy = function(idx, desc) {
			this.children[0].children[idx].setAttribute('sorting', '0')
			sortByChild2(this.parentElement.querySelector("tbody"), idx, desc)
		}
		t[j].children[0].addEventListener(type, function(e){
			var c = e.target
			if (c.localName != 'th') return
			var desc = false
			try {
				if (c.getAttribute('desc') == 'true') desc = true
			} catch(e) {}
			c.parentElement.querySelectorAll(c.localName).forEach(function(s){
				s.removeAttribute('sorting')
				s.removeAttribute('desc')
			})
			c.setAttribute('desc', !desc)
			return c.parentElement.parentElement.sortBy(c.cellIndex, !desc)
		})
	}

	document.querySelectorAll("form .account-title p.title").forEach(function(x){
		var p=x.parentElement
		var s=p.innerHTML
		x.remove()
		p.innerHTML = s
		setTimeout(function(p, x, s){
			var x = p.querySelector("p.title")
			x.setAttribute('show', 'false')
			x.addEventListener("click", function(e){
				if (e.target.localName=='a') {
					var thread=10 /*prompt('并发下载数，建议不超过10，否则会造成网络卡顿', '10')*/
					if (thread < 1) return
					var progress = document.createElement('span')
					progress.classList.add('status')
					progress.setAttribute('pre1', '下载第')
					progress.setAttribute('pre2', '项，剩余')
					progress.setAttribute('done', thread)
					e.target.parentElement.appendChild(progress)
					e.target.remove()
					get_details(thread)
					return
				}
				var target = this.parentElement.nextElementSibling
				this.setAttribute('show', !!target.hidden)
				setTimeout(function(){
					target.hidden=!target.hidden
				}, 10)
			})
		}, 1000, p, x, s)
	})
}

function connect_item_and_project(container, item, id) {
	var proj = document.getElementById(id)
	var a = item.querySelector('a[href]')
	var p = a.parentElement;
	a.removeAttribute('onclick')
	a.href = "#proj_" + proj.id
	a.removeAttribute('style')
	a.removeAttribute('onclick')
	var s = p.innerHTML
	a.remove()
	p.innerHTML = s

	if (container.classList.contains('index_owner')) {
		try {
			item.children[3].innerText = proj.querySelectorAll("td:not(.name)")[8].innerText
		} catch(e) { console.log('fail to get data from project #' + proj.id, e) }
		var tab = item.parentElement.parentElement
		var title = tab.parentElement.parentElement.querySelector(".account-title p.title")
		title.innerHTML = title.innerHTML.replace(/\d+ \/ \d+/,
			tab.querySelectorAll("tbody tr:not([hidden])").length + ' / ' +
			tab.querySelectorAll("tbody tr").length)
	} else {
		var zqcode = item.firstElementChild.innerText.match(/\d+/)[0]
		item.querySelector('a[href]').id = 'zq_' + zqcode
		var anchor = document.createElement('a')
		try {
			anchor.setAttribute('zqcode', zqcode)
			anchor.href = '#zq_' + zqcode
			proj.querySelector("td:not(.name)").appendChild(anchor)
			if (undefined == proj.querySelector('table').perfee) proj.querySelector('table').perfee = Array()
			proj.querySelector('table').perfee.push({code: zqcode, fee: parseFloat(item.children[1].innerText.match(/[\d\.]+/)[0])})
		} catch(e) { console.log(proj.id, e) }
	}
}

function pull_project(div, item, next) {
	if (null == item) {
		setTimeout(statistics, 1000)
		console.log("Done pulling project detail, statistics will be started in one second.")
		return false
	}

	try {
		var container = item.parentElement.parentElement.parentElement.parentElement
		var progress = container.querySelector("p.title span")
		progress.setAttribute('done', item.sectionRowIndex + 1)
		progress.setAttribute('todo', item.parentElement.children.length - item.sectionRowIndex - 1)
	} catch(e) { }

//	if (item.hidden) {
//		if (!item.nextElementSibling && progress) progress.remove()
//		if (next) setTimeout(pull_project, 10, div, item.nextElementSibling, next)
//		return false
//	}
	try {
		var id = item.values[5][0].match(/\d+/)[0]
	} catch (e) {
		try {
			var id = item.querySelector("a[href]").href.match(/\d+$/)[0]
		} catch(e) {
			if (next) setTimeout(pull_project, 10, div, item.nextElementSibling, next)
			return false
		}
	}

	var proj = document.getElementById(id)
	if (proj) {
		if (container.classList.contains('index_owner')) item.hidden = true
		setTimeout(connect_item_and_project, 10000, container, item, id)

		if (!item.nextElementSibling && progress) progress.remove()
		if (next) setTimeout(pull_project, 10, div, item.nextElementSibling, next)
		return false
	}

	var doc_container = document.createElement("div")
	doc_container.id = id
	div.appendChild(doc_container)
	$.get('/wyweb/web/wyfeemp/wxzjquery/getWsInfo.do?mpro_id=' + id, {},
	function(data, status){
		if (status != 'success') {
			console.log('Fail to get data for project id: ' + id, 'try it 10s later')
			setTimeout(pull_project, 10000, div, item, false)
			doc_container.remove()
			return false
		}
		var doc = new DOMParser().parseFromString(data.replace(/.*<body[^>]*>|<\/body>.*/g, ''), 'text/html')
		var e = doc.querySelector(".account-content")
		if (!e) return
		e.querySelectorAll("p").forEach(function(p){p.remove()})
		e.removeAttribute('style')
		var t=e.querySelector("table")
		t.removeAttribute('style')
		t.removeAttribute('border')
		t.removeAttribute('cellpadding')
		t.removeAttribute('cellspacing')

		e.querySelectorAll("td").forEach(function(t){
			t.removeAttribute('height')
		})
		e.id = id
		div.appendChild(e)
		doc_container.remove()

		var anchor = document.createElement("a")
		e.insertBefore(anchor, e.firstElementChild)
		anchor.id="proj_" + id //e.querySelector("td:not(.name)").innerText

		connect_item_and_project(container, item, id)

		if (!item.nextElementSibling && progress) progress.remove()
		if (next) pull_project(div, item.nextElementSibling, next)
	})

	return true
}

function pull_project_multi(div, item, cnt) {
	try {
		var container = item.parentElement.parentElement.parentElement.parentElement
		var progress = container.querySelector("p.title span")
	} catch(e) { }

	var c = cnt
	for (; item; item=item.nextElementSibling) {
		if (!pull_project(div, item, false)) continue
		if (--c==0) break;
	}
	if (c > 0 || !item) {
		console.log('Done parellel fetching projects detail, statistics will be started in ' + (200 * cnt) + 's.')
		if (progress) progress.remove()
		return setTimeout(statistics, 200 * cnt)
	}

	if (item) setTimeout(pull_project_multi, cnt*200, div, item, cnt)
}

function create_details_container() {
	var container = document.getElementById("details-list")
	if (null == container) {
		container = document.createElement("div")
		container.id = "details-list"
		container.classList.add("m-account-detail")
		document.body.appendChild(container)
		container.appendChild(document.createElement("div"))
		container.appendChild(document.createElement("div"))
		container.appendChild(document.createElement("div"))
		container.children[0].appendChild(document.createElement("p"))
		container.children[0].children[0].classList.add("title")
		container.children[0].children[0].innerText = '大修工程详情数据'
		container.children[0].classList.add('account-title')
		container.children[0].children[0].setAttribute('show', 'true')
		container.children[1].classList.add('m-account-detail')
		container.children[2].classList.add('m-account-detail')
		container.children[2].hidden = true
	}

	return container
}

function get_details(cnt=1) {
	var container = document.getElementById("details-list")
	if (!container) return

	var div = container.querySelector(".m-account-detail:last-child")
	if (null == div) {
		div = document.createElement("div")
		div.hidden = true
		div.classList.add('.m-account-detail')
		container.appendChild(div)
	}

	var item = document.querySelector("form .m-collect-info tbody").firstElementChild

	if (cnt > 1)
		pull_project_multi(div, item, cnt)
	else
		pull_project(div, item, true)
}

function createSearchBox() {
	var tab = document.querySelector("form .m-collect-info table")
	var th = tab.querySelector("thead")
	if (!th) {
		th = document.createElement("thead")
		tab.appendChild(th)
	}
	tab.querySelectorAll("tbody th:first-child").forEach(function(h){
		th.appendChild(h.parentElement)
	})

	var title = document.querySelectorAll("p.title")[1]
	title.appendChild(document.createElement("a"))

	var searchBoxCell = th.querySelector("tr th input")
	if (searchBoxCell) {
		searchBoxCell.parentElement.parentElement.remove()
	}

	searchBoxRow = document.createElement("tr")
	filter_values = [".*", "0", "0", "0", "0", "--"]
	filter_names = ["reqcode", "amount", "perfee", "remain", "tstp", "procode"]
	for (i = 0; i < th.firstElementChild.children.length; i++) {
		t = document.createElement("input")
		t.classList = "tass"
		t.type = "text"
		t.id = filter_names[i]
		t.name = filter_names[i]
		t.value = filter_values[i]
		col = document.createElement("th")
		if (i==4) col.appendChild(document.createElement('span'))
		col.appendChild(t)
		searchBoxRow.appendChild(col)
	}

	searchBoxRow.children[4].firstElementChild.innerText =
				document.querySelector("input[name=startDate]").value +
		' - ' + document.querySelector("input[name=endDate").value + ' '
	searchBoxRow.children[4].lastElementChild.id = "filtergo"
	searchBoxRow.children[4].lastElementChild.type = "button"
	searchBoxRow.children[4].lastElementChild.value = "GO"
	searchBoxRow.children[4].lastElementChild.classList = "tass btn"
	searchBoxRow.children[4].lastElementChild.disabled = true

	searchBoxRow.children[0].lastChild.addEventListener("change", function(event) {
		var btn = document.querySelector("input#filtergo")
		btn.disabled = false
		btn.style.cursor = "pointer"
	});
	searchBoxRow.children[1].lastChild.addEventListener("change", function(event) {
		var btn = document.querySelector("input#filtergo")
		btn.disabled = false
		btn.style.cursor = "pointer"
	});
	searchBoxRow.children[2].lastChild.addEventListener("change", function(event) {
		var btn = document.querySelector("input#filtergo")
		btn.disabled = false
		btn.style.cursor = "pointer"
	});
	searchBoxRow.children[3].lastChild.addEventListener("change", function(event) {
		var btn = document.querySelector("input#filtergo")
		btn.disabled = false
		btn.style.cursor = "pointer"
	});
	searchBoxRow.children[5].lastChild.addEventListener("change", function(event) {
		var btn = document.querySelector("input#filtergo")
		btn.disabled = false
		btn.style.cursor = "pointer"
	});
	searchBoxRow.children[4].lastChild.addEventListener("click", function(event) {
		this.disabled = true
		this.style.cursor = ""
		setTimeout(do_filter, 10)
	});

	searchBoxRow.hidden = true
	th.appendChild(searchBoxRow)
	setTimeout(do_filter, 1000)
}

if (window.location.href.match(/wxzjquery\/index_owner_zq.do$/)) {
	document.querySelector("form .m-collect-info").classList.add('index_owner_zq')
	if (document.querySelector("form .m-collect-info tbody").children.length > 1) {
		createSearchBox()
//		if (false) {
//		if (document.querySelector("form input[func='index_owner_sy']").checked)
			setTimeout(query_by_url, 100,
					   '/wyweb/web/wyfeemp/wxzjquery/index_owner_sy.do')
//		if (document.querySelector("form input[func='waterOfOwner']").checked)
			setTimeout(query_by_url, 100,
					   '/wyweb/web/wyfeemp/wxzjquery/waterOfOwner.do',
					  post_query_account_balance)
//		if (document.querySelector("form input[func='drawOfOwner']").checked)
			setTimeout(query_by_url, 100,
					   '/wyweb/web/wyfeemp/wxzjquery/drawOfOwner.do')
//		if (document.querySelector("form input[func='index_owner']").checked)
			setTimeout(query_by_url, 100,
					   '/wyweb/web/wyfeemp/ownerpact/index_owner.do',
					   post_query_projects_list)
//		}
	}
	create_details_container()
	create_reports_container()
}

if (window.location.href.match(/wxzjquery\/ownMain.do$/)) {
	window.localStorage.user=document.querySelector("input[name=App_user]").value
	window.localStorage.addr=document.querySelector("p.user").innerText.split(" ")[0]
	link = document.querySelector('a[href$="wxzjquery/index_owner_zq.do"]')
	if (link) link.target='_blank'
	link = document.querySelector('a[href$="ownerpact/index_owner.do"]')
//	if (link) link.target='_blank'
} else if (window.location.href.match(/(wxzjquery\/index_owner_zq.do$|shwy\/shkc)/)) {
	var cssl = document.styleSheets

	for (var i=0; i<cssl.length; i++) {
		if (!cssl[i].href) continue
		if (cssl[i].href.match(/tass.css$/)) break
	}

	if (i < cssl.length) {
		tasscss = cssl[i]
	} else {
		tasscss = document.getElementById("tasscss")
	}

	var styleSheets = ['printzhgbstyle.css', 'tass.css']
	if (null == tasscss) {
		styleSheets.forEach(function(css){
			tasscss = document.createElement("link")
			tasscss.href = 'https://mingchunding.github.io/shwy/shkc/static/' + css
			tasscss.rel = 'stylesheet'
			tasscss.type = 'text/css;charset=UTF-8'
			document.head.appendChild(tasscss)
		})
	}

	try {
		document.user=JSON.parse(window.localStorage.hou)
		document.addr=window.localStorage.addr.split(' ')[0].split('：')[1]
		var t=document.querySelector(".title")
		t.append(document.createElement("span"))
		t.children[0].innerText=document.addr
	} catch(e) { console.log(e) }

	var sbar = document.querySelector("form .m-account-search.nobdr")
	if (sbar.children.length < 3) {
		sbar.appendChild(document.createElement("div"))
		sbar.appendChild(document.createElement("div"))
		sbar.appendChild(document.createElement("div"))
		sbar.children[1].classList.add('f-clearfix')
		sbar.children[2].classList.add('f-clearfix')
		sbar.children[1].appendChild(sbar.firstElementChild.children[2])
		sbar.children[1].appendChild(sbar.firstElementChild.children[2])
		sbar.children[2].appendChild(sbar.firstElementChild.children[2])
		sbar.children[3].classList.add('f-search-content')
	}
	var scfg = sbar.children[3]
	scfg.innerText = ''
	var cfgs = ['支取明细', '收入明细', '收支列表', '支取列表', '工程列表', '工程统计', '工程详情', '财务报表', '浮动工具']
	for (var i=0; i<cfgs.length; i++) {
		scfg.appendChild(document.createElement("span"))
		scfg.children[i].innerText = cfgs[i]
		scfg.children[i].insertBefore(document.createElement("input"), scfg.children[i].firstChild)
		scfg.children[i].firstElementChild.type = 'checkbox'
		scfg.children[i].firstElementChild.checked = true
	}
	scfg.firstElementChild.children[0].disabled = true

	setTimeout(function(){
		try {
			scfg.querySelectorAll("input")[0].setAttribute('func', 'index_owner_zq')
			scfg.querySelectorAll("input")[1].setAttribute('func', 'index_owner_sy')
			scfg.querySelectorAll("input")[2].setAttribute('func', 'waterOfOwner')
			scfg.querySelectorAll("input")[3].setAttribute('func', 'drawOfOwner')
			scfg.querySelectorAll("input")[4].setAttribute('func', 'index_owner')
			scfg.querySelectorAll("input")[5].setAttribute('func', 'details-statistics')
			scfg.querySelectorAll("input")[6].setAttribute('func', 'details-list')
			scfg.querySelectorAll("input")[7].setAttribute('func', 'reports')
			scfg.querySelectorAll("input")[8].setAttribute('func', 'floatbar')
			scfg.querySelectorAll("input")[8].checked = false
		} catch(e) { }
		document.querySelectorAll("form .m-collect-info:not([hidden])").forEach(function(q){
			q.classList.forEach(function(c){
				try {
					document.querySelector('form .f-search-content input[func="' + c + '"]').checked = true
				} catch(e) { }
			})
		})

		scfg.querySelectorAll("input").forEach(function(c){
			c.addEventListener('change', function(event){
				func=this.getAttribute('func')
				if ('details-statistics' == func) {
					var self = this
					document.querySelectorAll(".m-collect-info." + func).forEach(function(e){
						e.hidden = !self.checked
					})
				} else if ('details-list' == func || 'reports' == func) {
					document.getElementById(func).hidden = !this.checked
				} else if ('floatbar' == func) {
					var b = document.querySelector('form .f-search-content')
					if (!this.checked) {
						b.classList.remove('fixed')
						b.removeAttribute('style')
						return
					}
					b.classList.add('fixed')
					b.style.left = (window.innerWidth - b.clientWidth) / 2
				}else try {
					document.querySelector("form .m-collect-info." + func).hidden = !this.checked
				} catch (e) {
					this.disabled = true
					console.log(e)
				}
			})
		})
		document.querySelectorAll("#details-list p.title").forEach(function(e){
			e.addEventListener('click', function(e){
				this.setAttribute('show', !!this.parentElement.nextElementSibling.hidden)
				this.parentElement.nextElementSibling.hidden = !this.parentElement.nextElementSibling.hidden
			})
		})
		if (!document.querySelector("#reports > .account-title p.title a")) {
			document.querySelectorAll("#reports p.title").forEach(function(e){
				e.addEventListener('click', function(e){
					if (e.target.localName=='span' && e.target.classList.contains('chart')) {
						var chart = document.getElementById(e.target.getAttribute('target'))
						document.querySelectorAll("div.chart").forEach(function(c){
							if (c === chart) chart.removeAttribute('hidden')
							else c.hidden = true
						})
						return chart.chart.resize()
					}
					this.setAttribute('show', !!this.parentElement.nextElementSibling.hidden)
					this.parentElement.nextElementSibling.hidden = !this.parentElement.nextElementSibling.hidden
				})
			})
		}
		addEvents("click")
	}, 100)
}

function query_by_url(url, handler=null){
	$.post(url, {startDate: document.querySelector("input#startDate").value,
				endDate: document.querySelector("input#endDate").value},
	function(data, status) {
		if (status != 'success') {
			console.log('fail to get data for project id: ' + id)
			return
		}
		var doc = new DOMParser().parseFromString(data.replace(/.*<body[^>]*>|<\/body>.*/g, ''), 'text/html')
		var e = doc.querySelector(".m-collect-info")
		e.classList.add(url.match(/\w+.do$/)[0].split('.')[0])
		e.children[1].hidden = true
		document.querySelector("form .m-account-detail").appendChild(e)
		setTimeout(convert_iframe_project_list, 100, e, handler)
	})
}

function do_click_submit(iframe) {
	try {
		var clkbtn = iframe.contentDocument.querySelector("input.btn")
	} catch(e) {console.log(e); return}

	if (!clkbtn) {
		console.log("查询页面未加载")
		return
	}

	clkbtn.click()
}

function post_query_account_balance(container) {
	container.querySelectorAll("tr td:first-child").forEach(function(c){
		var tds = document.querySelectorAll("form .m-collect-info.index_owner_zq tbody td:first-child")
		for (var i=0; i<tds.length; i++) {
			if (tds[i].innerText == c.innerText) {
				c.parentElement.hidden=true
				return
			}
		}
	})
}

function post_query_projects_list(container) {
	var e = container
	thd = e.querySelector("thead")
	thd.children[0].insertBefore(document.createElement("th"),thd.children[0].children[3])
	thd.children[0].children[3].innerText = '实施时间'

	e.querySelectorAll("tbody tr").forEach(function(r){
		r.insertBefore(document.createElement("td"), r.children[3])
		r.children[3].appendChild(document.createElement("img"))
	})

	var projs_link = e.querySelectorAll("tbody a")
	projs_link.forEach(function(e){
		if (document.getElementById(e.href.match(/\d+$/)[0])) e.parentElement.parentElement.hidden=true
	})

	var title = e.querySelector(".account-title p.title")
	title.appendChild(document.createElement("a"))
}

function convert_iframe_project_list(e, f=null) {
	e.querySelectorAll("th").forEach(function(e){
		e.removeAttribute('height')
		e.removeAttribute('width')
		e.removeAttribute('align')
	})
	e.querySelectorAll("td").forEach(function(e){
		e.removeAttribute('height')
		e.removeAttribute('width')
		e.removeAttribute('align')
	})
	var tab = e.querySelector("table")

	if (!tab.querySelector("thead")) {
		tab.insertBefore(document.createElement("thead"), tab.firstElementChild)
	}

	var ths = e.querySelectorAll("table th:first-child")
	thd = e.querySelector("thead")
	ths.forEach(function(t){ thd.appendChild(t.parentElement) })

	e.querySelector(".account-title p.title").addEventListener("click", function(event){
		if (event.target.localName=='a') {
			var thread=10 /*prompt("总共需下载 " +
						 this.parentElement.nextElementSibling.querySelectorAll("tbody tr").length +
						 " 项工程详情数据，下载结束所有统计将被重置!\n设置并发下载数，建议不超过10，否则会造成网络卡顿", "10") */
			if (thread < 1) return
			var title = e.querySelector(".account-title p.title")
			title.lastElementChild.remove()
			title.innerText += '【' +
				tab.querySelectorAll("tbody tr:not([hidden])").length + ' / ' +
				tab.querySelectorAll("tbody tr").length + '】'
			var progress = document.createElement('span')
			progress.classList.add('status')
			progress.setAttribute('pre1', '下载第')
			progress.setAttribute('pre2', '项，剩余')
			progress.setAttribute('done', thread)
			title.appendChild(progress)
			return pull_project_multi(document.querySelector("#details-list .m-account-detail:last-child"),
						 e.querySelector("tbody tr"), thread)
		}
		this.setAttribute('show', !!this.parentElement.nextElementSibling.hidden)
		this.parentElement.nextElementSibling.hidden=!this.parentElement.nextElementSibling.hidden
	})

	if ('function' == typeof(f)) {
		f(e)
	}
}

function page_zq(page, n){
	trs=document.querySelectorAll("tr[id]:not([hidden])")
	m = n * (page + 1)
	n = n * page
	for (i=0; i<trs.length; i++) { trs[i].removeAttribute('style'); if (i<n || i>m) trs[i].style.display='none'}
}

function create_reports_container() {
	var container = document.getElementById("reports")
	if (null == container) {
		container = document.createElement("div")
		container.id = "reports"
		container.classList.add("m-account-detail")
		document.body.appendChild(container)
		container.appendChild(document.createElement("div"))
		container.appendChild(document.createElement("div"))
		container.children[0].appendChild(document.createElement("p"))
		container.children[0].children[0].classList.add("title")
		container.children[0].children[0].innerText = '财务公开报表'
		container.children[0].children[0].appendChild(document.createElement("a"))
		container.children[0].classList.add('account-title')
		container.children[0].setAttribute('show', 'true')
		container.children[1].classList.add('m-account-detail')
		container.children[0].addEventListener('click', function(e){
			if (e.target.localName == 'a') {
				e.target.parentElement.appendChild(document.createElement("span"))
				e.target.remove()
				setTimeout(fetch_reports_list, 10, this.nextElementSibling)
				return
			}
			this.setAttribute('show', !!this.nextElementSibling.hidden)
			this.nextElementSibling.hidden = !this.nextElementSibling.hidden
		})
	}

	return container
}

function fetch_reports_list(container) {
	var iframe=document.createElement("iframe")
	var url_report_list = 'https://962121.fgj.sh.gov.cn/wyweb/web/hmfmsweb/biz/hocacctreport/getSection.do'
	iframe.src = url_report_list
	iframe.height = '50%'
	iframe.width = '50%'
	iframe.style.left = '25%'
	iframe.style.position = 'relative'
	container.reports = Array()
	iframe.hidden = true
	iframe.addEventListener('error', function(event){
		console.log('fail to fetch data from ' + this.src + ', retry again 1s later.')
		setTimeout(function(){
			this.src = url_report_list
		}, 1000)
	})
	iframe.addEventListener("load", function(event) {
		var progress = container.previousElementSibling.querySelector(".title span")
		try {
			var func = this.contentDocument.location.href.match(/[^\/]+\.do/)[0]
		} catch(e) {
			console.log("Fail to parse url " + this.contentDocument.location.href + ', will reload and try again 5s later.')
			setTimeout(function(){
				iframe.src = url_report_list
			}, 5000)
			return
		}

		if (container.reports.length < 1) {
			try {
				container.reports = JSON.parse(window.localStorage.reports_link)
//				document.unit_fund = container.reports[2].unit_fund
			} catch (e) {
				container.reports = Array()
//				console.log(e)
			}
		}
		if (undefined == document.unit_fund) {
//			progress.innerText = '获取报表地址'
			fetch_reports_link(func, container, this.contentDocument, progress)
			return
		} else try {
			window.localStorage.reports_link = JSON.stringify(container.reports)
			JSON.parse(window.localStorage.reports_link)
		} catch(e) {
			//window.localStorage.reports_link = JSON.stringify(container.reports)
			console.log(container.reports)
		}
//		console.log(container.reports)

		var tab = this.contentDocument.querySelector("table.datagrid_gridtb")
		tab.querySelector("thead").remove()
		tab.querySelectorAll("td:first-child").forEach(function(c){
			c.hidden = true
			var s=c.parentElement.lastElementChild.innerText.replaceAll(/日|－－－/g, '')
			s = s.replaceAll(/年|月/g, '-')
			c.parentElement.lastElementChild.innerText = s
		})
		var attrs = ['style', 'border', 'cellpadding', 'cellspacing', 'align', 'tabindex', 'width']
		attrs.forEach(function(attr){tab.removeAttribute(attr)})
		tab.style.display = 'none'
		document.body.append(tab)
		this.remove()
		if (progress) progress.remove()

		var tr = tab.querySelector("tbody tr:last-child")

		container.reports.forEach(function(r){
			var box = create_box_of_report(container, r, tr)
			if (!r.origin) {
				var tab = document.createElement("table")
				tab.innerHTML="<tbody></tbody>"
				tab.classList.add('merged')
				box.appendChild(tab)
			}
		})
	})

	document.body.appendChild(iframe)
}

function fetch_reports_link(func, container, doc, progress) {
	var idx = container.reports.length

	if (func == 'getReportList.do') {
		var trs = doc.querySelectorAll("table.grid1 tbody tr")
		if (idx < trs.length) {
			progress.innerText = '获取报表地址：第 ' + (idx + 1) + ' 项，剩余：' + (trs.length - idx - 1)
			var tr = trs[idx]
			func_param = tr.querySelector("a").getAttribute('onclick').match(/\d+/g)
			var s = tr.querySelector("td").innerText.replace(/^[\t\n  ]+|[\t\n ]+$/g,'')
			console.log(s)
			try {
				switch (idx) {
					case 0:
						s = s.match(/业主大会账户收支汇总表$/)[0]
						break;
					case 1:
						s = s.match(/业主大会维修资金支出明细表$/)[0]
						break;
					case 2:
						s = s.match(/门牌幢收支汇总表$/)[0]
						break;
					default:
				}
			} catch(e) {console.log('Report name #' + idx + ' mismatched, fullname will be shown')}
			container.reports.push({name: s, type: func_param[0]})
			if (func_param.length > 1) {
				container.reports[idx].unit_fund = func_param[1]
			}
			setTimeout(function(a){a.click()}, 100, trs[idx].querySelector('a'))
			return false
		}
		document.unit_fund = trs[2].querySelector('a').getAttribute('onclick').match(/\d+/g)[1]
	} else if (func != 'getSection.do') {
		container.reports[idx-1].func = func.replace(/^get/,'')
		switch (parseInt(container.reports[idx-1].type)) {
			case 5:
			case 9:
				container.reports[idx-1].origin = false
				break;
			default:
				container.reports[idx-1].origin = true
				break;
		}
	}

	setTimeout(function(button){button.click()}, 100, doc.querySelector(".btn"))
	return true
}

function fetch_report_data(box, tr, uri='https://962121.fgj.sh.gov.cn/wyweb/web/hmfmsweb/biz/hocacctreport/get') {
	if (!tr) return

	try {
		var progress = box.previousElementSibling.querySelector("p.title span")
		progress.setAttribute('todo', tr.sectionRowIndex)
		progress.setAttribute('done', tr.parentElement.children.length - tr.sectionRowIndex)
	} catch (e) { }

	if (box.querySelector('table[date="' + tr.lastElementChild.innerText + '"')) {
		/* data already exist */
		if (/*tr.sectionRowIndex + 2 > tr.parentElement.children.length &&*/
			tr.sectionRowIndex > 0) {
			setTimeout(fetch_report_data, 10, box, tr.previousElementSibling, uri)
		} else {
			box.setAttribute('startDate', document.querySelector("#startDate").value)
			box.setAttribute('endDate', document.querySelector("#endDate").value)
			setTimeout(function(){
				if (progress) progress.remove()
			}, 1000)
		}
		return false
	}

	var rawDate = (box.getAttribute('rawDate') == 'false' ? false : true)
	var hap_id = tr.querySelector("input[name='hap_id_arr'").value
	var url = uri + box.getAttribute('func') + '?hap_id=' + hap_id + '&repo_type=' + box.getAttribute('type') + '&unit_fund='
	if (box.getAttribute('type') == 4) url += document.unit_fund
	$.get(url, {}, function(data, status) {
		var doc = new DOMParser().parseFromString(data.replace(/.*<body[^>]*>|<\/body>.*/g, ''), 'text/html')
		rtype = parseInt(box.getAttribute("type"))
		unhide_reports(rtype, doc)
		if (rtype == 1 || rtype == 2 || rtype == 4 || rtype == 11) {
			var tab = doc.querySelector("table.colwidth")
			tab.removeAttribute('background')
			tab.querySelector("tbody").children[0].hidden = true
			tab.querySelector("tbody").children[1].hidden = true
			//tab.querySelector("tbody").children[2].hidden = true
			tab.querySelector("tbody").children[6].hidden = true
			if (rtype == 2) tab.querySelector("tbody").children[9].hidden = true
			tab.setAttribute('date', tr.lastElementChild.innerText)
			box.appendChild(tab)
		} else if (rawDate) {
			var tabs = doc.querySelectorAll("table[align='center']:not([class])")
			for (var i=0; i<tabs.length; i++) {
				rtab = tabs[i].parentElement.parentElement.parentElement.parentElement
				rtab.classList.add('report_tab_top')
				rtab.setAttribute('align', 'center')
				rtab.setAttribute('date', tr.lastElementChild.innerText)
				rtab.firstElementChild.firstElementChild.remove()
				rtab.querySelector("table[align=center] td[colspan='5'").parentElement.remove()
				box.appendChild(rtab)
			}
		} else {
			var title = doc.querySelectorAll("td.TopTitle")[1].innerText
			var tsrange = doc.querySelector("td.fubold").innerText
			var items = doc.querySelectorAll("td.tab_td:first-child:not([colspan])")
			if (items.length > 0) {
				var tab = box.querySelector('table')
				var thead = tab.querySelector("thead")
				if (!thead) {
					tab.insertBefore(document.createElement("thead"), tab.firstElementChild)
					thead = tab.querySelector("thead")
					thead.appendChild(items[0].parentElement.previousElementSibling)
				}
				var tbody = tab.querySelector("tbody")
				items.forEach(function(c){
					tbody.appendChild(c.parentElement)
				})
			}
		}
//		doc.remove()

		if (/*tr.sectionRowIndex + 2 > tr.parentElement.children.length &&*/
			tr.sectionRowIndex > 0) {
			setTimeout(fetch_report_data, 10, box, tr.previousElementSibling, uri)
		} else {
			box.setAttribute('startDate', document.querySelector("#startDate").value)
			box.setAttribute('endDate', document.querySelector("#endDate").value)
			setTimeout(function(){
				if (progress) progress.remove()
			}, 1000)

			switch (rtype) {
				case 1:
				case 2:
					setTimeout(chart_of_report, 1000, box.getAttribute('func').replace(/\.do$/, ''))
					break
				default:
					break
			}
		}
	})

	return true
}

function add_title_click_event(e, f=null) {
	e.addEventListener('click', function(event){
		if (f && 'function' == typeof(f) && f(event.target)) {
			return
		} else if (event.target.localName=='span' && event.target.classList.contains('chart')) {
			var chart = document.getElementById(event.target.getAttribute('target'))
			document.querySelectorAll("div.chart").forEach(function(c){
				if (c === chart) chart.removeAttribute('hidden')
				else c.hidden = true
			})
			return chart.chart.resize()
		}
		this.setAttribute('show', !!this.nextElementSibling.hidden)
		this.nextElementSibling.hidden = !this.nextElementSibling.hidden
	})
}

function create_box_of_report(container, report, row, base='https://962121.fgj.sh.gov.cn/wyweb/web/hmfmsweb/biz/hocacctreport/get') {
	var box = document.createElement("div")
	box.classList.add('collect-info')
	box.setAttribute('func', report.func)
	box.setAttribute('type', report.type)
	box.setAttribute('rawDate', report.origin)
	box.setAttribute('startDate', document.querySelector("#startDate").value)
	box.setAttribute('endDate', document.querySelector("#endDate").value)
	var title = document.createElement("div")
	title.classList.add("account-title")
	title.innerHTML = '<p class="title">' + report.name + '<a></a></p>'
	title.setAttribute('show', 'true')
	add_title_click_event(title, function(e){
		if (!title.querySelector("a") &&
				(document.querySelector("#startDate").value < box.getAttribute('startDate') ||
				box.getAttribute('endDate') < document.querySelector("#endDate").value)) {
			e.querySelector("p").appendChild(document.createElement("a"))
			return true
		}
		if (e.localName=='a') {
			var progress = document.createElement("span")
			progress.classList.add('status')
			progress.setAttribute('pre1', '下载第')
			progress.setAttribute('pre2', '项，剩余')
			progress.setAttribute('done', 1)
			progress.setAttribute('todo', row.parentElement.children.length - 1)
			e.parentElement.appendChild(progress)
			setTimeout(fetch_report_data, 10, box, row, base)
			e.remove()
			return true
		}
		return false
	})

	container.appendChild(title)
	container.appendChild(box)

	return box
}

function biga_total_report_unhide() {
	document.querySelectorAll("#reports div[type='1'] table.tab3").forEach(function(t){
		t.children[0].children[0].lastElementChild.setAttribute('rowspan', "2")
		t.children[0].children[0].lastElementChild.removeAttribute('colspan')
		t.children[0].children[2].children[0].setAttribute('colspan', "6")
		t.children[0].children[4].children[1].setAttribute('colspan', "4")
		t.children[0].children[5].children[1].setAttribute('colspan', "4")
		t.querySelectorAll("td[colspan='4']")[0].children[0].removeAttribute('width')
		t.querySelectorAll("td[colspan='4']")[0].children[0].removeAttribute('border')
		t.querySelectorAll("td[colspan='4']")[1].children[0].removeAttribute('border')
	})
}

function restore_title_click_event() {
	document.querySelectorAll(".title").forEach(function(t){
		t.addEventListener('click', function(event){
			t.setAttribute('show', !!t.parentElement.nextElementSibling.hidden)
			t.parentElement.setAttribute('show', !!t.parentElement.nextElementSibling.hidden)
			t.parentElement.nextElementSibling.hidden=!t.parentElement.nextElementSibling.hidden
		})
	})
}

function unhide_reports(type, doc) {
	switch (type) {
	case 1:
		var t=doc.querySelector("table.tab3").firstElementChild
		var s = t.firstElementChild.innerHTML.replace(/\n\t*(<!--|-->)\t*/g,'\n')
		t.firstElementChild.innerHTML = s
		t.firstElementChild.children[1].hidden = true
		t.firstElementChild.children[2].hidden = true
		t.firstElementChild.lastElementChild.removeAttribute('colspan')
		s = t.firstElementChild.lastElementChild.innerHTML.replace(/\(|\)/g, '').replace(':','<br>')
		t.firstElementChild.lastElementChild.innerHTML = s
		t.firstElementChild.lastElementChild.setAttribute('align', 'right')
		t.firstElementChild.lastElementChild.setAttribute('rowspan', '2')
		t.children[2].firstElementChild.setAttribute('colspan', '6')
		s = t.children[5].children[1].innerHTML.replace(/\n\t*<!--\t*|\t*-->\t*\n/g,'\n')
		t.children[5].children[1].innerHTML = s
		t.children[5].children[1].setAttribute('colspan', "4")
		t.children[4].children[1].setAttribute('colspan', "4")
		t.children[3].appendChild(document.createElement('td'))
		t.children[6].appendChild(document.createElement('td'))
		t.children[6].lastElementChild.setAttribute('rowspan', '4')
		break
	case 2:
		var t = doc.querySelector("table.tab2")
		var r = t.querySelectorAll("tr")
		if (r.length < 1) break
		var sum=Array(0,0)
		for (var i=0; i<r.length-1; i++){
			var s=r[i].innerHTML.replace(/(\n\t*)?(<!-- *| *-->)\t*/g,'')
			r[i].innerHTML = s
			if (i>0) try {
				for (; r[i].children.length < r[0].children.length; )
					r[i].appendChild(document.createElement("td"))
				sum[0] += parseFloat(r[i].children[3].innerText.match(/[\d\.]+/)[0])
				sum[1] += parseFloat(r[i].children[4].innerText.match(/[\d\.]+/)[0])
			} catch (e) { }
		}
		for (; t.querySelector("tr:last-child").children.length + 1 < r[0].children.length; ) {
			t.querySelector("tr:last-child").appendChild(document.createElement("td"))
		}
		r[0].children[1].setAttribute('width', '20%')
		r[0].children[2].setAttribute('width', '18%')
		r[0].children[3].setAttribute('width', '18%')
		r[0].children[4].setAttribute('width', '18%')
		t.querySelector("tr:last-child").children[2].innerText = sum[0].toFixed(2)
		t.querySelector("tr:last-child").children[3].innerText = sum[1].toFixed(2)
		t.querySelector("tr:last-child").children[3].classList.add('tab_money')
		break
	case 6:
		doc.querySelectorAll("table.tab2").forEach(function(t){
			t.querySelectorAll("tr").forEach(function(r){
				s=r.innerHTML.replace(/<!-- *| *-->/g,'')
				r.innerHTML = s
			})
			t.querySelector("tr:last-child").firstElementChild.setAttribute('colspan', '3')
			var c = t.querySelectorAll("tr:first-child td")
			c[0].setAttribute('width', '8%')
			c[1].setAttribute('width', '15%')
			c[2].setAttribute('width', '32%')
			c[3].setAttribute('width', '15%')
		})
		break
	default:
		break
	}
}

function chart_shouzhihuizong() {
	chart_of_report('ShouZhiHuiZong')
}

function mask(msg) {
	div = document.createElement('div')
	div.classList.add('ui-mask')
	document.body.appendChild(div)

	div = document.createElement('div')
	div.classList.add('ui-mask-msg')
	div.appendChild(document.createElement('div'))
	div.children[0].innerText = msg
	document.body.appendChild(div)
	div.style.top = (window.innerHeight - div.clientHeight) / 2
	div.style.left = (window.innerWidth - div.clientWidth) / 2
	console.log(div.clientWidth, div.clientHeight)
}

function unmask() {
	document.querySelectorAll('div.ui-mask-msg').forEach(function(e){
		e.remove()
	})
	document.querySelectorAll('div.ui-mask').forEach(function(e){
		e.remove()
	})
}
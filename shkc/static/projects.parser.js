window.restore_projects_list = function (shkc, s, l) {
	var id = shkc.pjlist.constructor.keys(shkc.pjlist)
	for (var j=0; j<id.length; j++) {
		if (document.querySelector(".index_owner tbody tr a[href='#proj_" + id[j] + "']")) continue
		r = document.createElement('tr')
		for (var i=0; i<7; i++) r.appendChild(document.createElement('td'))
		r.children[0].innerText = j + 1
		r.children[1].appendChild(document.createElement('a'))
		r.children[1].children[0].innerText = id[j]
		r.children[1].children[0].href = '#proj_' + id[j]
		for (var i=2; i<7; i++)	r.children[i].innerText = shkc.pjlist[id[j]][i-2]
		document.querySelector(".index_owner tbody").appendChild(r)
	}
}

var template_project_detail = [
'		<a></a>',
'		<table width="80%" align="center">',
'		<tbody>',
'			<tr>',
'				<td colspan="4" align="center" class="name">工程信息查询</td>',
'			</tr><tr>',
'				<td class="name">工程编号</td>',
'				<td colspan="3" align="left"></td>',
'			</tr><tr>',
'				<td class="name">工程名称</td>',
'				<td colspan="3" align="left"></td>',
'			</tr><tr>',
'				<td class="name">签定施工合同</td>',
'				<td align="left"></td>',
'				<td class="name">是否审价</td>',
'				<td></td>',
'			</tr><tr>',
'				<td class="name">预案金额</td>',
'				<td align="left"></td>',
'				<td class="name">决案金额</td>',
'				<td></td>',
'			</tr><tr>',
'				<td class="name">施工单位选择</td>',
'				<td align="left"></td>',
'				<td class="name">工程阶段</td>',
'				<td></td>',
'			</tr><tr>',
'				<td class="name">实施时间</td>',
'				<td align="left"></td>',
'				<td class="name">项目性质</td>',
'				<td></td>',
'			</tr><tr>',
'				<td class="name">实施范围</td>',
'				<td colspan="3"></td>',
'			</tr><tr>',
'				<td class="name">维修原因</td>',
'				<td colspan="3" align="left">/td>',
'			</tr><tr>',
'				<td class="name">银行开户名称</td>',
'				<td colspan="3" align="left"></td>',
'			</tr><tr>',
'				<td class="name">施工管理单位</td>',
'				<td colspan="3" align="left"></td>',
'			</tr><tr>',
'				<td class="name">已支取金额</td>',
'				<td align="left"></td>',
'				<td class="name">可支取金额</td>',
'				<td></td>',
'			</tr><tr>',
'				<td class="name">已冲正金额</td>',
'				<td align="left"></td>',
'				<td class="name">已冲正次数</td>',
'				<td>0</td>',
'			</tr><tr>',
'				<td class="name">完工日期</td>',
'				<td colspan="3" align="left"></td>',
'			</tr>',
'		</tbody>',
'		</table>'
]

function gen_project_detail_tab(shkc, id) {
	if (document.getElementById(id)) return

	domProject = document.createElement('div')
	domProject.innerHTML = '\n' + template_project_detail.join('\n') + '\n'
	domProject.classList.add('account-content')
	domProject.id = id
	domProject.querySelector('a').id = 'proj_' + id
	document.querySelectorAll('#details-list .m-account-detail')[1].appendChild(domProject)
	var c = domProject.querySelectorAll('td:not(.name)')
	c[0].innerText = id

	for (var i=0; i<shkc.detail[id].length; i++) {
		c[i+1].innerText = shkc.detail[id][i]
	}
	var values = Array()
	values[0] = id
	values[4] = parseFloat(shkc.detail[id][3])
	values[5] = parseFloat(shkc.detail[id][4])
	values[8] = shkc.detail[id][7]
	values[13] = shkc.detail[id][12]
	for (var i=14; i<18; i++)
		values[i] = parseFloat(shkc.detail[id][i-1])
	domProject.querySelector('table').v = values
}

window.restore_projects_detail = function (shkc, s=0, l=10, progress=null) {
	var idt = shkc.detail.constructor.keys(shkc.detail)
//	console.log('prepare parsing projects: ', s, ' - ', s+l > idt.length ? idt.length : s+l)
	if (l < 0) l = idt.length
	if (0==s) {
		unmask()
		mask("分析工程数据......")
	}
	for (var i=s; i<s+l; i++) {
		if (i >= idt.length) return false
		gen_project_detail_tab(shkc, idt[i])
	}

	setTimeout(() => {
		try {
			progress.setAttribute('done', i)
			progress.setAttribute('todo', idt.length - i)
		} catch(e) { }

		if (window.restore_projects_detail(shkc, i, l, progress)) return true

		if (progress) progress.remove()
		console.log("Done parsing all " + i + " projects in " + ((performance.now() - window.st) / 1000) + " seconds.")
		try {
			document.querySelector('form .index_owner_zq .title a').click()
		} catch(e) { }
		unmask()
	}, 10)

	return true
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
//	div.style.top = (window.innerHeight - div.clientHeight) / 2
//	div.style.left = (window.innerWidth - div.clientWidth) / 2
//	console.log(div.clientWidth, div.clientHeight)
}

function unmask() {
	document.querySelectorAll('div.ui-mask-msg').forEach(function(e){
		e.remove()
	})
	document.querySelectorAll('div.ui-mask').forEach(function(e){
		e.remove()
	})
}
//setTimeout(window.restore_projects_list, 100, window.shkc, 0, 10)
mask("下载工程数据......")

document.querySelectorAll(".index_owner_zq tbody td:last-child").forEach((c)=>{
	c.innerHTML = c.innerHTML.replace(/支取/g,'')
})

document.querySelectorAll(".index_owner_zq td:last-child a").forEach((a)=>{
	a.innerText = a.innerText.match(/\d+/)
})
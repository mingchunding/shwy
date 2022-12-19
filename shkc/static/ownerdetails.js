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

//    if (type)
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
    r = document.querySelector("form .m-collect-info tbody").children

    var l = r.length
    var cnt = 0
    var sum = Array(Array(0), 1e-6, 1e-6, 1e-6, Array(0), Array(0))
    var filter = document.querySelectorAll(".tass")

    for (i = 0; i < l; i++) {
        e = r[i]
        cols = e.children.length
        var col = Array(0)
        var year = Array(0)

        e.hidden = false

        for (j = 0; j < cols; j++) {
            c = e.children[j]
            col[j] = c.innerText.match(/[\d\.\-]+/g)
        }
        if (!e.hasAttribute("id")) {
            e.id = i
        }
        e.values = col

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
            if (filter[5].value.length && null == col[5][0].match(RegExp(filter[5].value))) {
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
        var tr = document.querySelector("tbody tr:last-child")
        per_num = tr.children[1]
        per_num.innerHTML = per_num.innerHTML.replace(/\d+[ \/\d]*$/, "") + l + " / " + cnt
        per_sum = tr.children[0]
        per_sum.innerHTML = per_sum.innerHTML.replace(/ *\/ *\d.+$/, "") + " / " + sum[1].toFixed(2) + "元"
        t[1].sum = sum
    } catch (e) { console.log(e) }

//    setTimeout(get_details, 10, 10)
    console.log("Done.")
}

function sortByChild(e, idx, desc) {
    if (e == null) return
    c = e.children.length
    if (c < 2) return

    var e = document.querySelector("form .m-collect-info tbody")
    var dtcnt = 0
    for (var i = 0; i < c; i++) {
        s = e.children[i]

        for (var j = i + 1; j < c; j++) {
            t = e.children[j]
            if (isNaN(s.values[idx][0]) || isNaN(t.values[idx][0])) {
                if (desc && s.values[idx][0] >= t.values[idx][0]) {
                    continue
                }
                if (!desc && s.values[idx][0] <= t.values[idx][0]) {
                    continue
                }
            } else {
                if (desc && parseFloat(s.values[idx][0]) >= parseFloat(t.values[idx][0])) {
                    continue
                }
                if (!desc && parseFloat(s.values[idx][0]) <= parseFloat(t.values[idx][0])) {
                    continue
                }
            }
            s = e.insertBefore(t, s)
        }

        if (isNaN(s.values[5][0]))
            continue
        dt = document.getElementById(s.values[5][0])
        if (null == dt)
            continue
        if (dt.parentElement.children.length < $(dt).index() + dtcnt)
            continue
        dt.parentElement.appendChild(dt)
        dtcnt++
    }
}

function addEvents(type) {
    searchResult = document.querySelector("form .m-collect-info thead")
    searchResult.sortBy = (function(idx, desc) {
        return sortByChild(this.previousElementSibling, idx, desc)
    })
    searchResult.sort = Array(0)

    for (i = 0; i < searchResult.children[0].children.length; i++) {
        searchResult.sort[i] = 0
        var c=searchResult.children[0].children[i]
        if (3 == i) {
            c.addEventListener(type, function(e) {
                hidden = this.parentElement.nextElementSibling.hidden;
                this.parentElement.nextElementSibling.hidden = !hidden
            })
            continue
        }
        c.addEventListener(type, function(e) {
            idx = this.cellIndex
            searchResult.sort[idx] = !searchResult.sort[idx]
            return searchResult.sortBy(idx, searchResult.sort[idx])
        })
    }

    document.querySelectorAll(".account-title p.title").forEach(function(x){
        x.setAttribute('show', 'true')
        x.addEventListener("click", function(e){
            if (event.path[0].localName=='a') {
                var thread=prompt('并发下载数，建议不超过10，否则会造成网络卡顿')
                if (thread < 1) return
                event.path[0].remove()
                get_details(thread)
                return
            }
            this.setAttribute('show', !!this.parentElement.nextElementSibling.hidden)
            this.parentElement.nextElementSibling.hidden=!this.parentElement.nextElementSibling.hidden
        })
    })
}

function pull_project(div, item, next) {
    if (null == item) {
        setTimeout(statistics, 1000)
        console.log("Done pulling project detail, statistics will be started in one second.")
        return
    }

    var container = item.parentElement.parentElement.parentElement.parentElement
    if (container.previousElementSibling.classList.contains(container.className)) {
        /* not the first search table */
        var progress = container.querySelector(".title span")
        progress.innerText = '下载第 ' + (item.sectionRowIndex + 1) + ' 项，剩余 ' +
            (item.parentElement.children.length - item.sectionRowIndex - 1)
    } else {
        var progress = null
    }

    if (item.hidden) {
        if (progress && !item.nextElementSibling) progress.remove()
        if (next) setTimeout(pull_project, 10, div, item.nextElementSibling, next)
        return
    }
    try {
        var id = item.values[5][0].match(/\d+/)[0]
    } catch (e) {
        try {
            var id = item.querySelector("a[href]").href.match(/\d+$/)[0]
        } catch(e) {
            if (next) setTimeout(pull_project, 10, div, item.nextElementSibling, next)
            return
        }
    }

    var proj = document.getElementById(id)
    if (proj) {
        var a = item.querySelector('a')
		a.removeAttribute('onclick')
		a.href = "#proj_" + id
        a.removeAttribute('style')
        a.removeAttribute('onclick')
        if (progress) {
            item.hidden = true
            item.children[3].innerText = proj.querySelectorAll("td:not(.name)")[8].innerText
            var tab = item.parentElement.parentElement
            var title = tab.parentElement.parentElement.querySelector(".account-title p.title")
            title.innerText.replace(/\d+ \/ \d+/,
                tab.querySelectorAll("tbody tr:not([hidden])").length + ' / ' +
                tab.querySelectorAll("tbody tr").length)
            if (!item.nextElementSibling) progress.remove()
        } else {
            a.id = 'zq_' + item.firstElementChild.innerText.match(/\d+/)[0]
        }

        if (next) setTimeout(pull_project, 10, div, item.nextElementSibling, next)
        return
    }

    var proj = document.createElement("iframe")
    proj.id = id
    proj.src = "/wyweb/web/wyfeemp/wxzjquery/getWsInfo.do?mpro_id=" + id
    proj.addEventListener("load", function(event) {
        var e = this.contentDocument.querySelector(".account-content")
        if (!e) return
        e.querySelectorAll("p").forEach(function(p){p.remove()})
        e.removeAttribute('style')
        e.id = this.id
        var t=e.querySelector("table")
        t.removeAttribute('style')
        t.removeAttribute('border')
        t.removeAttribute('cellpadding')
        t.removeAttribute('cellspacing')

        e.querySelectorAll("td").forEach(function(t){
            t.removeAttribute('height')
        })
        this.parentElement.appendChild(e)
        this.remove()

        var anchor = document.createElement("a")
        e.appendChild(anchor)
        anchor.id="proj_" + e.querySelector("td:not(.name)").innerText

        var a = item.querySelector('a')
		a.removeAttribute('onclick')
		a.href = "#proj_" + a.innerText.match(/\d+/)[0]
        a.removeAttribute('style')
        a.removeAttribute('onclick')
        if (progress) {
            if (!item.nextElementSibling) progress.remove()
            item.children[3].innerText = e.querySelectorAll("td:not(.name)")[8].innerText
        } else {
            a.id = 'zq_' + item.firstElementChild.innerText.match(/\d+/)[0]
        }

        if (next) pull_project(div, item.nextElementSibling, next)
    })

    div.appendChild(proj)
}

function pull_project_multi(div, item, cnt) {
    var c = cnt
    for (; item; item=item.nextElementSibling) {
        pull_project(div, item, false)
        if (--c==0) break;
    }
    if (c > 0 || !item) {
        console.log('Done parellel fetching projects detail, statistics will be started in 10s.')
        return setTimeout(statistics, 10000)
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
        container.children[0].children[0].addEventListener('click', function(e){
            this.setAttribute('show', !!this.parentElement.nextElementSibling.hidden)
            this.parentElement.nextElementSibling.hidden = !this.parentElement.nextElementSibling.hidden
        })
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
    tab.firstElementChild.querySelectorAll("th:first-child").forEach(function(h){
        th.appendChild(h.parentElement)
    })

    var cssl = document.styleSheets

    for (var i=0; i<cssl.length; i++) {
        if (!cssl[i].href) continue
        if (cssl[i].href.match(/tass.css$/)) break
    }

    if (i < cssl.length) {
        tasscss = cssl[i]
        addEvents("click")
    } else {
        tasscss = document.getElementById("tasscss")
    }

    var styleSheets = ['printzhgbstyle.css', 'tass.css']
    if (null == tasscss) {
        styleSheets.forEach(function(css){
            tasscss = document.createElement("link")
            tasscss.href = 'http://localhost/' + css
            tasscss.rel = 'stylesheet'
            tasscss.type = 'text/css;charset=UTF-8'
            document.head.appendChild(tasscss)
        })

        addEvents("click")
    }

	var title = document.querySelectorAll("p.title")[1]
	title.appendChild(document.createElement("a"))

    var searchBoxCell = th.querySelector("tr th input")
    if (searchBoxCell) {
        searchBoxCell.parentElement.parentElement.remove()
    }

    searchBoxRow = document.createElement("tr")
    filter_values = [".*", "0", "0", "0", "0", ".*"]
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

function do_mobile(hidden){
    document.querySelector("form table.tableorg tr").forEach(function(e){
        e.children[2].hidden=hidden
        e.children[3].hidden=hidden
    })

    document.querySelector(".details-statistics tr").forEach(function(e){
        e.lastElementChild.hidden=hidden
    })
}

if (window.location.href.match(/wxzjquery\/ownMain.do$/)) {
    window.localStorage.user=document.querySelector("input[name=App_user]").value
    window.localStorage.addr=document.querySelector("p.user").innerText.split(" ")[0]
    link = document.querySelector('a[href$="wxzjquery/index_owner_zq.do"]')
    if (link) link.target='_blank'
    link = document.querySelector('a[href$="ownerpact/index_owner.do"]')
    if (link) link.target='_blank'
} else if (window.location.href.match(/wxzjquery\/index_owner_zq.do$/)) {
    document.user=$.parseJSON(window.localStorage.hou)
    document.addr=window.localStorage.addr.split(' ')[0].split('：')[1]
    var t=document.querySelector(".title")
    t.append(document.createElement("span"))
    t.children[0].innerText=document.addr
    if (document.querySelector("form .m-collect-info tbody").children.length > 1) {
        createSearchBox()
        setTimeout(query_by_url, 100,
                   'https://962121.fgj.sh.gov.cn/wyweb/web/wyfeemp/ownerpact/index_owner.do',
                   post_query_projects_list)
        if (false) {
        setTimeout(query_by_url, 100,
                   'https://962121.fgj.sh.gov.cn/wyweb/web/wyfeemp/wxzjquery/waterOfOwner.do',
                  post_query_account_balance)
        setTimeout(query_by_url, 100,
                   'https://962121.fgj.sh.gov.cn/wyweb/web/wyfeemp/wxzjquery/drawOfOwner.do')
        setTimeout(query_by_url, 100,
                   'https://962121.fgj.sh.gov.cn/wyweb/web/wyfeemp/wxzjquery/index_owner_sy.do')
        }
        create_details_container()
        create_reports_container()
    }
}

function query_by_url(url, handler=null){
    var container = document.getElementById("details-list")
    if (!container) return
    var iframe=document.createElement("iframe")
    iframe.src = url
    iframe.height = '50%'
    iframe.width = '50%'
    iframe.style.left = '25%'
    iframe.style.position = 'relative'
    iframe.step = 0
    iframe.hidden = true
    iframe.addEventListener("load", function(event) {
        console.log(this.step, "start to query all projects list.")
        this.contentDocument.querySelector("input#startDate").value=document.querySelector("input#startDate").value
        this.contentDocument.querySelector("input#endDate").value=document.querySelector("input#endDate").value
        if (this.step == 0) {
            setTimeout(do_click_submit, 100, iframe)
        } else {
            setTimeout(convert_iframe_project_list, 100, iframe, handler)
        }
        this.step++
    })

    container.appendChild(iframe)
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
        var tds = document.querySelectorAll("form .m-collect-info:nth-child(3) tbody td:first-child")
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

function convert_iframe_project_list(iframe, f=null) {
    var div = document.querySelector("form .m-account-detail")
    var e = iframe.contentDocument.querySelector(".m-collect-info")
    e.children[1].hidden = true
    div.appendChild(e)
    iframe.remove()

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
        if (event.path[0].localName=='a') {
            if (!confirm("总共需下载 " +
                         this.parentElement.nextElementSibling.querySelectorAll("tbody tr").length +
                         " 项工程详情数据，下载结束所有统计将被重置!"))
                return
            var title = e.querySelector(".account-title p.title")
            title.lastElementChild.remove()
            title.innerText += '【本户无关】( ' +
                tab.querySelectorAll("tbody tr:not([hidden])").length + ' / ' +
                tab.querySelectorAll("tbody tr").length + ' )'
            title.appendChild(document.createElement("span"))
            return pull_project(document.querySelector("#details-list .m-account-detail:last-child"),
                         e.querySelector("tbody tr"), true)
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

function fetch_query_by_url(url, startDate, endDate) {

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
            if (event.path[0].localName == 'a') {
                event.path[0].remove()
                event.path[1].appendChild(document.createElement("span"))
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
    iframe.src = 'https://962121.fgj.sh.gov.cn/wyweb/web/hmfmsweb/biz/hocacctreport/getSection.do'
    iframe.height = '50%'
    iframe.width = '50%'
    iframe.style.left = '25%'
    iframe.style.position = 'relative'
    container.reports = Array()
    iframe.hidden = true
    iframe.addEventListener("load", function(event) {
        var progress = container.previousElementSibling.querySelector(".title span")

        if (undefined == document.unit_fund) {
            var func = this.contentDocument.location.href.match(/[^\/]+\.do/)[0]
            var idx = container.reports.length

            if (func == 'getReportList.do') {
                var trs = this.contentDocument.querySelectorAll("table.grid1 tbody tr")
                if (idx < trs.length) {
                    progress.innerText = '获取报表地址：第 ' + (idx + 1) + ' 项，剩余：' + (trs.length - idx - 1)
                    var tr = trs[idx]
                    func_param = tr.querySelector("a").getAttribute('onclick').match(/\d+/g)
                    s = tr.querySelector("td").innerText
                    s = s.replace(/上海市闵行区上海康城业主大会|莘松路958弄维园道43号|[\n\t ]*/g, '')
                    container.reports.push({name: s, type: func_param[0]})
                    if (func_param.length > 1) {
                        container.reports[idx].unit_fund = func_param[1]
                    }
                    setTimeout(function(a){a.click()}, 100, trs[idx].querySelector('a'))
                    return
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

            setTimeout(function(button){button.click()}, 100, this.contentDocument.querySelector(".btn"))
            return
        }

        console.log(container.reports)

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

function fetch_report_data(box, tr, uri='https://962121.fgj.sh.gov.cn/wyweb/web/hmfmsweb/biz/hocacctreport/get') {
    if (!tr) return

    var progress = box.previousElementSibling.querySelector("p.title span")
    if (progress) progress.innerText = '下载第 ' +
                (tr.parentElement.children.length - tr.sectionRowIndex) +
                ' 项, 剩余：' + tr.sectionRowIndex
    if (box.querySelector('table[date="' + tr.lastElementChild.innerText + '"')) {
        /* data already exist */
        if (/*tr.sectionRowIndex + 6 > tr.parentElement.children.length &&*/
            tr.sectionRowIndex > 0) {
            setTimeout(fetch_report_data, 1000, box, tr.previousElementSibling, uri)
        } else {
            box.setAttribute('startDate', document.querySelector("#startDate").value)
            box.setAttribute('endDate', document.querySelector("#endDate").value)
            setTimeout(function(){
                if (progress) progress.remove()
            }, 1000)
        }
        return
    }

    var rawDate = (box.getAttribute('rawDate') == 'false' ? false : true)
    var hap_id = tr.querySelector("input[name='hap_id_arr'").value
    var iframe=document.createElement("iframe")
    iframe.src = uri + box.getAttribute('func') + '?hap_id=' + hap_id + '&repo_type=' + box.getAttribute('type') + '&unit_fund='
    if (box.getAttribute('type') == 4) iframe.src += document.unit_fund
    iframe.height = '50%'
    iframe.width = '50%'
    iframe.style.left = '25%'
    iframe.style.position = 'relative'
    iframe.hidden = true

    iframe.addEventListener('load', function(event){
        rtype = box.getAttribute("type")
        if (rtype ==1 || rtype == 2 || rtype == 4 || rtype == 11) {
            var tab = this.contentDocument.querySelector("table.colwidth")
            tab.removeAttribute('background')
            tab.querySelector("tbody").children[0].hidden = true
            tab.querySelector("tbody").children[1].hidden = true
            tab.querySelector("tbody").children[2].hidden = true
            tab.querySelector("tbody").children[6].hidden = true
            if (rtype == 2) tab.querySelector("tbody").children[9].hidden = true
            tab.setAttribute('date', tr.lastElementChild.innerText)
            box.appendChild(tab)
        } else if (rawDate) {
            var tabs = this.contentDocument.querySelectorAll("table[align='center']:not([class])")
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
            var title = this.contentDocument.querySelectorAll("td.TopTitle")[1].innerText
            var tsrange = this.contentDocument.querySelector("td.fubold").innerText
            var items = this.contentDocument.querySelectorAll("td.tab_td:first-child:not([colspan])")
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
        this.remove()

        if (/*tr.sectionRowIndex + 4 > tr.parentElement.children.length &&*/
            tr.sectionRowIndex > 0) {
            setTimeout(fetch_report_data, 1000, box, tr.previousElementSibling, uri)
        } else {
            box.setAttribute('startDate', document.querySelector("#startDate").value)
            box.setAttribute('endDate', document.querySelector("#endDate").value)
            setTimeout(function(){
                if (progress) progress.remove()
            }, 1000)
        }
    })
    document.body.appendChild(iframe)
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
    title.addEventListener('click', function(event){
        if (!title.querySelector("a") &&
            (document.querySelector("#startDate").value < box.getAttribute('startDate') ||
            box.getAttribute('endDate') < document.querySelector("#endDate").value)) {
            title.querySelector("p").appendChild(document.createElement("a"))
            return
        }
        if (event.path[0].localName=='a') {
            setTimeout(fetch_report_data, 10, box, row, base)
            event.path[0].remove()
            event.path[1].appendChild(document.createElement("span"))
            return
        } else if (event.path[0].localName=='span') {

        }
        this.setAttribute('show', !!this.nextElementSibling.hidden)
        this.nextElementSibling.hidden = !this.nextElementSibling.hidden
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

function unhide_reports() {
    var type=0
    window.location.href.split('&').forEach(function(kv){p=kv.split('='); if (p[0]=='repo_type') type=parseInt(p[1])})
    switch (type) {
    case 1:
        t=document.querySelector("table.tab3").firstElementChild
        s = t.firstElementChild.innerHTML.replace(/\n\t*(<!--|-->)\t*/g,'\n')
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
        break
    case 2:
        t = document.querySelector("table.tab2")
        t.querySelectorAll("tr").forEach(function(r){
            s=r.innerHTML.replace(/\n\t*(<!-- *| *-->)\t*/g,'')
            r.innerHTML = s
        })
        t.querySelector("tr:first-child").children[1].setAttribute('width', '20%')
        t.querySelector("tr:first-child").children[2].setAttribute('width', '18%')
        t.querySelector("tr:first-child").children[3].setAttribute('width', '18%')
        t.querySelector("tr:first-child").children[4].setAttribute('width', '18%')
        for (; t.querySelector("tr:last-child").children.length < 5; )
            t.querySelector("tr:last-child").appendChild(document.createElement("td"))
        
        break
    case 6:
        document.querySelectorAll("table.tab2").forEach(function(t){
            t.querySelectorAll("tr").forEach(function(r){
                s=r.innerHTML.replace(/<!-- *| *-->/g,'')
                r.innerHTML = s
            })
            t.querySelector("tr:last-child").firstElementChild.setAttribute('colspan', '3')
        })
        break
    default:
        break
    }
}

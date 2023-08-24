const { getRandom } = require("./utils")

const reg_mark = /^(.+?)\s/
// 判断#
const reg_sharp = /^\#/

// 判断无序列表的- 
const reg_crossbar = /^\-/

// 判断有序列表中的1.
const reg_number = /^\d\./

function createTree(mdArr) {
    let _htmlPool = {}
    let lastMark = ""
    let _key = 0
    mdArr.forEach((mdFragment) => {
        const matched = mdFragment.match(reg_mark)
        if (matched) {
            const mark = matched[1]
            const input = matched['input'].replace('\r', "")

            // 匹配#
            if (reg_sharp.test(mark)) {
                const tag = `h${mark.length}`
                const tagContent = input.replace(reg_mark, "")

                // 判断当前的mark是否等于上一行的mark,如果相等说明是同一组的
                // 比如 #和- 就不是同一组，一个是h标签，一个是ul中的li标签
                if (lastMark === mark) {
                    _htmlPool[`${tag}-${_key}`].tags = [..._htmlPool[`${tag}-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
                } else {
                    lastMark = mark
                    _key = getRandom()
                    _htmlPool[`${tag}-${_key}`] = {
                        type: 'single',
                        tags: [`<${tag}>${tagContent}</${tag}>`]
                    }
                }
            }

            // 匹配无序列表
            if (reg_crossbar.test(mark)) {
                const tag = 'li'
                const tagContent = input.replace(reg_mark, '')

                if (reg_crossbar.test(lastMark)) {
                    _htmlPool[`ul-${_key}`].tags = [..._htmlPool[`ul-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
                } else {
                    lastMark = mark
                    _key = getRandom()
                    _htmlPool[`ul-${_key}`] = {
                        type: 'wrap',
                        tags: [`<${tag}>${tagContent}</${tag}>`]
                    }
                }
            }

            // 匹配有序列表
            if (reg_number.test(mark)) {
                const tag = 'li'
                const tagContent = input.replace(reg_mark, '')
                
                if (reg_number.test(lastMark)) {
                    _htmlPool[`ol-${_key}`].tags = [..._htmlPool[`ol-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
                } else {
                    lastMark = mark
                    _key = getRandom()
                    _htmlPool[`ol-${_key}`] = {
                        type: 'wrap',
                        tags: [`<${tag}>${tagContent}</${tag}>`]
                    }
                }
            }
        }
    })
    return _htmlPool
}

function complierHtml(mdArr) {
    const _htmlPool = createTree(mdArr)
    let _htmlStr = ''
    let item
    for (let k in _htmlPool) {
        item = _htmlPool[k]

        if (item.type === 'single') {
            item.tags.forEach(tag => {
                _htmlStr += tag
            })
        } else if (item.type === 'wrap') {
            let _list = `<${k.split('-')[0]}>`
            item.tags.forEach(tag => {
                _list += tag;
            })
            _list += `</${k.split('-')[0]}>`

            _htmlStr += _list
        }
    }
    return _htmlStr;
}

module.exports = {
    complierHtml
}

// _htmlPool:
// {
//     'h1-1689180739898': { type: 'single', tags: [ '<h1>这是一个h1的标题\r</h1>' ] },
//     'ul-129024842047': {
//       type: 'wrap',
//       tags: [
//         '<li>这是ul列表第一项\r</li>',
//         '<li>这是ul列表第二项\r</li>',
//         '<li>这是ul列表第三项\r</li>',
//         '<li>这是ul列表第四项\r</li>'
//       ]
//     },
//     'h2-970982290076': { type: 'single', tags: [ '<h2>这是一个h2的标题\r</h2>' ] },
//     'ol-719962307146': {
//       type: 'wrap',
//       tags: [
//         '<li>这是ol列表第一项\r</li>',
//         '<li>这是ol列表第二项\r</li>',
//         '<li>这是ol列表第三项\r</li>',
//         '<li>这是ol列表第四项\r</li>',
//         '<li>这是ol列表第五项</li>'
//       ]
//     }
//   }
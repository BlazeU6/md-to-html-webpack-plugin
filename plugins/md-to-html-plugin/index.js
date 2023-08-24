const { readFileSync }  = require("fs")
const { resolve } = require('path')
const { complierHtml } = require("./compiler")
const INNER_MARK = '<!-- inner -->'

class MdToHtmlPlugin {
    constructor({template, filename}) {
        if (!template) {
            throw new Error("The config for 'template' must be  configured")
        }
        this.template = template
        this.filename = filename ? filename : 'md.html'
    }
    
    apply(compiler) {
        compiler.hooks.emit.tap("md-to-html-plugin", (compilation) => {
            const _assets = compilation.assets
            // 要处理的md文件
            const _mdContent = readFileSync(this.template, 'utf8')
            // 要处理成html文件需要的模板
            const _templateHTML = readFileSync(resolve(__dirname, 'template.html'), 'utf-8')
            //  将md文件根据换行符转换成一个数组
            const _mdContentArr = _mdContent.split('\n')
            //  md -> html标签
            const _htmlStr = complierHtml(_mdContentArr)
            // 最后的html文件
            const _finalHtml = _templateHTML.replace(INNER_MARK, _htmlStr)

            _assets[this.filename] = {
                source() {
                    return _finalHtml
                },
                size() {
                    return _finalHtml.length
                }
            }
        })
    }
}

module.exports = MdToHtmlPlugin;
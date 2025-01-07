# 快速开始

## 介绍

欢迎使用`es-project`，这是一个脚手架工具，旨在帮助你快速创建一个项目。

制作这个项目的起因，是因为我平时在冒出一些新想法的时候，总想创一个新项目来试试，于是我自己就自备了一些我自己常用的模版存放在github的我自己的一个组织里：[zero的模版裤](https://github.com/zero-template)，比如我经常用的私人的`tsup`模版啥的。

后面涉猎的多了，感觉为每一个模版都创建一个github仓库的方式，还是有很多不足，比如模版多了，管理起来不方便。

所以我就制作了这么一个工具。工具的原理非常简单，就是去`npm`上搜索`@es-project-template`组织里面的所有模版，然后在脚手架中显示出来，我就能直接选择我需要创建一个什么样的项目了。

后来，我又发现，模版不能像类似`create-vite`那样，具备一些交互式的选项，让我在创建项目的时候，可以自定义一些配置，比如`是否立即安装依赖`，`项目名称`，`项目描述`，等等之类的信息。所以我升级了这个工具到`v2`版本，完全给重构了，扩展性拉到满。

现在，任何人都能上传一个规定好的模版到npm上，然后就能在`es-project`中展示。同时，每个模版可以自定义自己的交互选项，比如`tsup`模版，就可以自定义`是否生成d.ts文件`，`是否生成sourcemap文件`，以及需要构建哪些文件格式（如`commonjs`，`esm`，`iife`等），等等之类的信息。

## 开始使用

其实针对普通用户真没什么好说的，直接执行这个命令就能开始：

```bash
pnpm create es-project [克隆路径]
```

然后按键盘上下键选择一个模版，回车确认：

```bash
✔ 模板获取成功。
? 选择一个模板: ›
❯   monorepo-antfu - Create a monorepo with antfu's code style.
    tsup - Create a project with tsup.
    father - Create a es-project template.
    unplugin - Create a unplugin with unplugin-starter
    vite - Shortcut to redirect es-project cli to vite cli.
```

然后会展示出选中的模版的相关信息：

```bash
✔ 模板信息获取成功，正在检查模板...

  名称: @es-project-template/tsup
  版本: 1.0.2
  描述: Create a project with tsup.
  许可证: None
  生成位置: /Users/naily/Profiles/Naily/Projects/nailymo/v3

? 是否要生成项目？ › (y/N)
```

es-project 会创建一个临时目录`.es-project`，将模版下载到此目录，之后会执行该模版自定义的一些选项脚本，比如目前官方提供的`tsup`模版还会有以下几个步骤：

```bash
? Project name: test
? Project description: test
? Project author: nailymo
? Please enter the entry filename, you can enter multiple files separated by `,` like `index,main`: index
? Generate d.ts file? (Y/n) Yes
? Generate sourcemap file? (Use arrow keys) yes
❯ yes
  no
  inline
? Clean build directory? (Y/n) Yes
? What do you want to build? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯ ◉ commonjs
  ◉ esm
  ◯ iife
```

最后就会生成出一个自定义模版了。

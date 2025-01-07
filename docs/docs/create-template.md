# 创建模版

正如开篇介绍里所说的，任何人都能上传一个规定好的模版到npm上，然后就能在`es-project`中展示，具体的要求如下：

- 模版名称必须以`es-project-template-`开头，比如`es-project-template-tsup`。
- 模版的`package.json`的`keywords`里必须包含`es-project-template`。
- 模版的`package.json`必须包含`es-project`字段，并且至少要有一个`version`来指定当前模版的版本。

`es-project`会搜索并筛选npm上符合要求的模版并将其展示出来。

## 创建模版的模版

可以直接使用`es-project`的`father`模版来创建一个模版项目，然后根据你的需要修改发布到npm上。

```bash
✔ 模板获取成功。
? 选择一个模板: ›
    monorepo-antfu - Create a monorepo with antfu's code style.
    tsup - Create a project with tsup.
❯   father - Create a es-project template.
    unplugin - Create a unplugin with unplugin-starter
    vite - Shortcut to redirect es-project cli to vite cli.
```

确认生成位置等信息，然后按下`y`键：

```bash
✔ 模板信息获取成功，正在检查模板...

  名称: @es-project-template/father
  版本: 1.0.3
  描述: Create a es-project template.
  许可证: None
  生成位置: /Users/naily/Profiles/Naily/Projects/nailymo/v3

? 是否要生成项目？ › (y/N)
```

输入模版名称，比如你想创建一个`tsup`模版，那么输入`es-project-template-my-tsup`:

```bash
? Template name: es-project-template-my-tsup
? Template description: Create a tsup project with my-tsup.
```

然后按下回车，`es-project`会根据你输入的模版名称，生成一个模版项目，此时再安装依赖即可。

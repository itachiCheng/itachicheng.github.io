---
title: Markdown
date: 2022-09-16 21:52:00
tags:
---

### With Mermaid
VS Code插件 Markdown Preview Mermaid Support

官网地址： https://mermaid-js.github.io/mermaid/#/

部署方式：
```
<script src='https://unpkg.com/mermaid@7.1.2/dist/mermaid.min.js'></script>
<script>mermaid.initialize({startOnLoad:true});</script>
<div class="mermaid">
gitGraph
    commit
    commit
    branch develop
    commit
    commit
    commit
    checkout main
    commit
    commit
</div>
```

<script src='https://unpkg.com/mermaid@7.1.2/dist/mermaid.min.js'></script>
<script>mermaid.initialize({startOnLoad:true});</script>
<div class="mermaid">
gitGraph
    commit
    commit
    branch develop
    commit
    commit
    commit
    checkout main
    commit
    commit
</div>

以下内容转自链接：https://www.jianshu.com/p/e74eb43960a1


```markdown
行内公式：将公式插入到本行内，符号：$公式内容$，如：$xyz$
独行公式：将公式插入到新的一行内，并且居中，符号：$$公式内容$$，如：$$xyz$$

上标符号，符号：^，如：$x^4$
下标符号，符号：_，如：$x_1$
组合符号，符号：{}，如：${16}_{8}O{2+}_{2}$

字体控制，符号：\displaystyle，如：$\displaystyle \frac{x+y}{y+z}$
下划线符号，符号：\underline，如：$\underline{x+y}$
上大括号，符号：\overbrace{算式}，如：$\overbrace{a+b+c+d}^{2.0}$
下大括号，符号：\underbrace{算式}，如：$a+\underbrace{b+c}_{1.0}+d$
上位符号，符号：\stacrel{上位符号}{基位符号}，如：$\vec{x}\stackrel{\mathrm{def}}{=}{x_1,\dots,x_n}$

希腊字母
字母	实现	字母	实现
A	A	α	\alhpa
B	B	β	\beta
Γ	\Gamma	γ	\gamma
Δ	\Delta	δ	\delta
E	E	ϵ	\epsilon
Z	Z	ζ	\zeta
H	H	η	\eta
Θ	\Theta	θ	\theta
I	I	ι	\iota
K	K	κ	\kappa
Λ	\Lambda	λ	\lambda
M	M	μ	\mu
N	N	ν	\nu
Ξ	\Xi	ξ	\xi
O	O	ο	\omicron
Π	\Pi	π	\pi
P	P	ρ	\rho
Σ	\Sigma	σ	\sigma
T	T	τ	\tau
Υ	\Upsilon	υ	\upsilon
Φ	\Phi	ϕ	\phi
X	X	χ	\chi
Ψ	\Psi	ψ	\psi
Ω	\v	ω	\omega


占位符
两个quad空格，符号：\qquad，如：$x \qquad y$
quad空格，符号：\quad，如：$x \quad y$
大空格，符号\，如：$x \ y$
中空格，符号\:，如：$x : y$
小空格，符号\,，如：$x , y$
没有空格，符号``，如：$xy$
紧贴，符号\!，如：$x ! y$
定界符与组合
括号，符号：（）\big(\big) \Big(\Big) \bigg(\bigg) \Bigg(\Bigg)，如：$（）\big(\big) \Big(\Big) \bigg(\bigg) \Bigg(\Bigg)$
中括号，符号：[]，如：$[x+y]$
大括号，符号：\{ \}，如：${x+y}$
自适应括号，符号：\left \right，如：$\left(x\right)$，$\left(x{yz}\right)$
组合公式，符号：{上位公式 \choose 下位公式}，如：${n+1 \choose k}={n \choose k}+{n \choose k-1}$
组合公式，符号：{上位公式 \atop 下位公式}，如：$\sum_{k_0,k_1,\ldots>0 \atop k_0+k_1+\cdots=n}A_{k_0}A_{k_1}\cdots$
四则运算
加法运算，符号：+，如：$x+y=z$
减法运算，符号：-，如：$x-y=z$
加减运算，符号：\pm，如：$x \pm y=z$
减甲运算，符号：\mp，如：$x \mp y=z$
乘法运算，符号：\times，如：$x \times y=z$
点乘运算，符号：\cdot，如：$x \cdot y=z$
星乘运算，符号：\ast，如：$x \ast y=z$
除法运算，符号：\div，如：$x \div y=z$
斜法运算，符号：/，如：$x/y=z$
分式表示，符号：\frac{分子}{分母}，如：$\frac{x+y}{y+z}$
分式表示，符号：{分子} \voer {分母}，如：${x+y} \over {y+z}$
绝对值表示，符号：||，如：$|x+y|$
高级运算
平均数运算，符号：\overline{算式}，如：$\overline{xyz}$
开二次方运算，符号：\sqrt，如：$\sqrt x$
开方运算，符号：\sqrt[开方数]{被开方数}，如：$\sqrt[3]{x+y}$
对数运算，符号：\log，如：$\log(x)$
极限运算，符号：\lim，如：$\lim^{x \to \infty}_{y \to 0}{\frac{x}{y}}$
极限运算，符号：\displaystyle \lim，如：$\displaystyle \lim^{x \to \infty}_{y \to 0}{\frac{x}{y}}$
求和运算，符号：\sum，如：$\sum^{x \to \infty}_{y \to 0}{\frac{x}{y}}$
求和运算，符号：\displaystyle \sum，如：$\displaystyle \sum^{x \to \infty}_{y \to 0}{\frac{x}{y}}$
积分运算，符号：\int，如：$\int^{\infty}_{0}{xdx}$
积分运算，符号：\displaystyle \int，如：$\displaystyle \int^{\infty}_{0}{xdx}$
微分运算，符号：\partial，如：$\frac{\partial x}{\partial y}$
矩阵表示，符号：\begin{matrix} \end{matrix}，如：$\left[ \begin{matrix} 1 &2 &\cdots &4\5 &6 &\cdots &8\\vdots &\vdots &\ddots &\vdots\13 &14 &\cdots &16\end{matrix} \right]$
逻辑运算
等于运算，符号：=，如：$x+y=z$
大于运算，符号：>，如：$x+y>z$
小于运算，符号：<，如：$x+y<z$
大于等于运算，符号：\geq，如：$x+y \geq z$
小于等于运算，符号：\leq，如：$x+y \leq z$
不等于运算，符号：\neq，如：$x+y \neq z$
不大于等于运算，符号：\ngeq，如：$x+y \ngeq z$
不大于等于运算，符号：\not\geq，如：$x+y \not\geq z$
不小于等于运算，符号：\nleq，如：$x+y \nleq z$
不小于等于运算，符号：\not\leq，如：$x+y \not\leq z$
约等于运算，符号：\approx，如：$x+y \approx z$
恒定等于运算，符号：\equiv，如：$x+y \equiv z$
集合运算
属于运算，符号：\in，如：$x \in y$
不属于运算，符号：\notin，如：$x \notin y$
不属于运算，符号：\not\in，如：$x \not\in y$
子集运算，符号：\subset，如：$x \subset y$
子集运算，符号：\supset，如：$x \supset y$
真子集运算，符号：\subseteq，如：$x \subseteq y$
非真子集运算，符号：\subsetneq，如：$x \subsetneq y$
真子集运算，符号：\supseteq，如：$x \supseteq y$
非真子集运算，符号：\supsetneq，如：$x \supsetneq y$
非子集运算，符号：\not\subset，如：$x \not\subset y$
非子集运算，符号：\not\supset，如：$x \not\supset y$
并集运算，符号：\cup，如：$x \cup y$
交集运算，符号：\cap，如：$x \cap y$
差集运算，符号：\setminus，如：$x \setminus y$
同或运算，符号：\bigodot，如：$x \bigodot y$
同与运算，符号：\bigotimes，如：$x \bigotimes y$
实数集合，符号：\mathbb{R}，如：\mathbb{R}
自然数集合，符号：\mathbb{Z}，如：\mathbb{Z}
空集，符号：\emptyset，如：$\emptyset$
数学符号
无穷，符号：\infty，如：$\infty$
虚数，符号：\imath，如：$\imath$
虚数，符号：\jmath，如：$\jmath$
数学符号，符号\hat{a}，如：$\hat{a}$
数学符号，符号\check{a}，如：$\check{a}$
数学符号，符号\breve{a}，如：$\breve{a}$
数学符号，符号\tilde{a}，如：$\tilde{a}$
数学符号，符号\bar{a}，如：$\bar{a}$
矢量符号，符号\vec{a}，如：$\vec{a}$
数学符号，符号\acute{a}，如：$\acute{a}$
数学符号，符号\grave{a}，如：$\grave{a}$
数学符号，符号\mathring{a}，如：$\mathring{a}$
一阶导数符号，符号\dot{a}，如：$\dot{a}$
二阶导数符号，符号\ddot{a}，如：$\ddot{a}$
上箭头，符号：\uparrow，如：$\uparrow$
上箭头，符号：\Uparrow，如：$\Uparrow$
下箭头，符号：\downarrow，如：$\downarrow$
下箭头，符号：\Downarrow，如：$\Downarrow$
左箭头，符号：\leftarrow，如：$\leftarrow$
左箭头，符号：\Leftarrow，如：$\Leftarrow$
右箭头，符号：\rightarrow，如：$\rightarrow$
右箭头，符号：\Rightarrow，如：$\Rightarrow$
底端对齐的省略号，符号：\ldots，如：$1,2,\ldots,n$
中线对齐的省略号，符号：\cdots，如：$x_1^2 + x_2^2 + \cdots + x_n^2$
竖直对齐的省略号，符号：\vdots，如：$\vdots$
斜对齐的省略号，符号：\ddots，如：$\ddots$


```


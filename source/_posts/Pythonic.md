---
title: Pythonic之旅
date: 2022-04-16 22:04:44
tags:
cover: Python-language.png
---



## <center>类的简化版——闭包</center>

闭包（Closures）从形式上来看是一个嵌套的函数，同时内嵌函数引用了外层函数的`变量`，外层函数将内嵌函数作为返回值。以上表述只是讲清楚了闭包的特征，但毫无insights。我们可以对比面向对象的概念，当类实例化出一个对象后，对象可以进行“自管理”。例如用属性记录自身的状态。而闭包中也有这样一个状态，即定义在外层函数中的`变量`。

```python
# 比较常见的是以下几种使用范式
# F1 记录某种状态变化，需要维护某个状态变量
def counter():
    value = 0
    def _counter():
        nonlocal value
        value += 1
        return value
    return _counter

c = counter()
c() ## 1
c() ## 2

# F2
def make_multiplier_of(n):
    def multiplier(x):
        return x * n
    return multiplier

timers3 = make_multiplier_of(3)
timers5 = make_multiplier_of(5)

print(times3(3)) #调用三倍乘法器 3 * 3 = 9
print(times5(10)) #调用五倍乘法器 5 * 10 = 50
```

可以发现，闭包如同某个属性不多的类，一旦属性增多，最好还是实现一个类。在这里，外层函数的局部变量相当于内嵌函数的全局变量，这个局部变量记录的是内嵌函数的`状态`。通过这种方式我们既可以减少对全局变量的依赖场景，又能恰到好处地为函数加上状态。

有这样一个场景：我们希望轮换使用*和x替换一个句子中的数字，例如，今天早上去公司骑车花了10分钟，中午吃饭花了10块钱，晚上花了1个小时写博客。

```python
# 全局变量版本
import re

_index = 0

def mosaic_global_var(matchobj):
    global _index
    element_list = ['*', 'x']
    def mosaic_string(s):
    _index = (_index + 1) % len(element_list)
    return element_list[index] * len(matchobj.group())

print(re.sub(r'\d+', mosaic_global_var, '今天早上去公司骑车花了10分钟，中午吃饭花了10块钱，晚上花了1个小时写博客.'))
# 今天早上去公司骑车花了**分钟，中午吃饭花了xx块钱，晚上花了*个小时写博客.
# 但是如果没有对全局变量进行置零，接着调用上面这行代码的话，会得到以下输出。
print(re.sub(r'\d+', mosaic_global_var, '今天早上去公司骑车花了10分钟，中午吃饭花了10块钱，晚上花了1个小时写博客.'))
# 今天早上去公司骑车花了xx分钟，中午吃饭花了**块钱，晚上花了x个小时写博客.

# 闭包版本

import re
def mosaic_closure_var():
    index = 0
    element_list = ['*', 'x']
    def mosaic_string(matchobj):
        nonlocal index
        e = element_list[index]
        index = (index + 1) % len(element_list)
        return e * len(matchobj.group())
    return mosaic_string

print(re.sub(r'\d+', mosaic_closure_var(), '今天早上去公司骑车花了xx分钟，中午吃饭花了**块钱，晚上花了x个小时写博客.'))
print(re.sub(r'\d+', mosaic_closure_var(), '今天早上去公司骑车花了xx分钟，中午吃饭花了**块钱，晚上花了x个小时写博客.'))

# 今天早上去公司骑车花了xx分钟，中午吃饭花了**块钱，晚上花了x个小时写博客.
# 今天早上去公司骑车花了xx分钟，中午吃饭花了**块钱，晚上花了x个小时写博客.
```

全局变量版本要实现相同的效果，需要进行重置，这对可读性并不友好，用闭包可以规避这样的问题，原因是`mosaic_closure_var()`创建了一个新的闭包对象。

- 参考文献：《Python 工匠 案例、技巧与工程实践》

## <center>迭代器与可迭代对象</center>

工作中的可信考试往往出的是`不可信`的题目，就像之前培训时候老师讲过的一句话：`好代码就是不是坏代码的代码`，所以考试题总喜欢给考生做排除法，于是有了一些非常别扭的题目。对`迭代器与可迭代对象`的整理也是源于一道考试题：

```python

# 下面代码的输出是
list = [1, 2, 3, 4, 5]
li = iter(list)
print(2 in li)
print(2 in li)

## True
## False
```

在`for in range(10)`这样最基本的循环中，`range(10)`是一个可迭代对象，从`dir(range(10))`可以看出，它实现了`__iter__()`，判断一个对象obj是否可迭代的唯一标准，就是调用`iter(obj)`或者`obj.__iter__()`的结果是不是一个迭代器（iterator），如果是，那么我们说这个对象obj是可迭代的（iterable）。因此，可迭代对象只需要实现`__iter__`方法，而迭代器不仅要实现`__iter__`，还要实现`__next__`。

回顾上面的题目，第一个`print(2 in li)`通过不断调用`li.__next__()`匹配第一个2后（返回`True`），将当前的定位指针指向了`li[2]`,当第二次开始查找时，`li.__next__()`从3开始返回，也就是说，之后的3、4、5均没有和2形成匹配，所以没找到返回的`False`。

## <center>变量与注释</center>

### 1. 遵循PEP 8 原则

- 普通变量，使用蛇形命名法，比如max_value;
- 对于常量，采用全大写字母，使用下划线连接，比如MAX_VALUE;
- 如果变量标记为“仅内部使用”，为其增加下划线前缀，比如_local_var;
- 当名字与python关键字冲突时，在变量末尾追加下划线，比如class_.

### 2. 描述性强

| 描述性弱的名字 | 描述性强的名字   | 说明                                                         |
| -------------- | ---------------- | ------------------------------------------------------------ |
| data           | file_chunks      | data泛指所有“数据”，但如果数据是来自文件的碎块，我们可以直接叫它file_chunks |
| temp           | pending_id       | temp 泛指所有“临时”的东西，但其实它存放的是一个等待处理的数据ID,因此直接叫它pending_id更好 |
| result(s)      | active_member(s) | result(s)指代函数执行结果，但如果执行结果是“活跃会员”，可以直接叫active_member(s) |

### 3. 匹配类型

- 匹配布尔值类型的变量名

| 变量名       | 含义           | 说明        |
| ------------ | -------------- | ----------- |
| is_superuser | 是否是超级用户 | 是/不是     |
| has_errors   | 有没有错误     | 有/没有     |
| allow_empty  | 是否允许空值   | 允许/不允许 |

- 匹配int/float类型的变量名

  - 使用以_id结尾的单词，比如user_id、host_id

  - 释义为数字的所有单词：port、age(年龄)、radius(半径)
  - 使用以length/count开头或者结尾的单词，比如length_of_username、max_length、users_count。

### 4. 命名风格

| 类别                       | 公有               | 私有                                                        |
| -------------------------- | ------------------ | ----------------------------------------------------------- |
| Packages                   | lower_with_under   |                                                             |
| Modules                    | lower_with_under   | _lower_with_under                                           |
| Classes                    | CapWords           |                                                             |
| Exceptions                 | CapWords           |                                                             |
| Functions                  | lower_with_under() | _lower_with_under()                                         |
| Global/Class Constants     | CAPS_WITH_UNDER    | _CAPS_WITH_UNDER                                            |
| Instance Variables         | lower_with_under   | _lower_with_under or __lower_with_under（当需要名字修饰时） |
| Method Names               | lower_with_under() | _lower_with_under() or __lower_with_under()                 |
| Function/Method Parameters | lower_with_under   |                                                             |
| Local Variables            | lower_with_under   |                                                             |

- 类中的私有成员一般用单下划线_开头，这是业界的约定俗成，用单下划线开头来暗示此成员仅供内部使用。当需要设计被继承的工具类时，解释器可以为双下划线成员自动改名，防止在类继承场景出现名字冲突。
- 如果变量名与内置函数、内置模块或者标准库名字重合，可以在后面加下划线以作区分，如class_。

### 5. 文档注释

docstring一般位于shebang、文件编码以及版权信息之后，尽量采用“”“三双引号进行注释，其内容是对当前模块文件进行简要描述，该模块中的类、函数等信息应该以每个一段的形式简要描述。

## <center>数值与字符串</center>

### 1. 数值基础
- 常用的数值类型

在python3中，一共存在三种内置数值类型：整型、浮点型和复数类型，原先的python2还有long类型。

```python
score = 100
tmp = 37.2
com = 1+2j
print(type(score))
print(type(tmp))
print(type(com))

# <class 'int'>
# <class 'float'>
# <class 'complex'>
```

Python使用的是“双精度”，符合IEEE-754规范，它使用53个比特的精度来表达十进制浮点数，具体的实施规范可以参见《深入理解计算机系统》。

Python内置模块：decimal。假如你的程序需要精确的浮点数计算，最好使用decimal.Decimal对象来替代普通浮点数，它在做四则运算时不会损失任何精度，但是必须使用字符串来表示数字。

```python
from decimal import Decimal
Decimal("0.11")+Decimal("0.34")
```

- 布尔值其实也是数字

```python
# 统计偶数的个数
count = sum(i % 2 == 0 for i in numbers)
```

### 2. 字符串基础

- 字符串的序列操作

在《Learning Python 5th》中，有一个对切片很形象的解释，我们所看到的索引数字其实表现为“数字隔板”，`|R|i|t|e|r| |S|p|o|r|t|`,`s[:5]`表示0号隔板和5号隔板之间的字符串序列，`左闭右开`只是一种表象，内在的设计方式更为直接。

```python
s = "Riter Sport"
print(s[:5])
# Riter
print(s[::-1])
# tropS rettiR
```

- 字符串格式化

```python
# 方式一
print('hello, %s' % 'world')
# 方式二
print('hello, {}'.format('world'))
# 方式三
name = 'world'
print(f'hello, {name}') # python3.6新增
```

- split与partition

```python
"key".partition(':')[-1]
"key:value".partition(':')[-1]
# ''
# 'value'

```

- translate

```python
s = '明明是中文,却使用了英文标点.'
table = s.maketrans(',.','，。')
s.translate(table)
# '明明是中文，却使用了英文标点。'
```

- 字符串与字节串

普通字符串是给人看的，常称为“文本”，对应Unicode标准，可通过.encode()方法编码为字节串。

二进制字符串是给计算机看的，属于字节串（bytes）类型。bytes一定包含某种真正的字符串编码格式（默认为UTF-8）,可通过.decode()解码为字符串。

```python
bin_obj = 'Riter Sport(瑞特斯波德)'.encode('GBK')
str_obj = bin_obj.decode('GBK')
# Riter Sport(瑞特斯波德)
```

### 3. 编程技巧

把数字字面常量改写成常量和枚举类型后，我们可以很好地规避输入错误问题。

```python
# 如果'vip'字符串打错了，不会有任何提示
if user.type == 'vip':
if user.type == 'vlp':

# 正确写法
if user.type == UserType.VIP:
# 错误写法
if user.type == UserType.VLP:
# 报错 AttributeError: VLP

```

## <center>Static and Class Methods</center>

对于无实例化的类方法调用，可以归结为staticmethod和classmethod。

```python

## A class'method is normally passed an instance object in its first argument, to serve as the implied subject of the method call—that’s the “object” in “object-oriented programming.” —— 类是对象的抽象，对象是类的实例，这里的self是代表实例的形参。
class Spam:
    numInstances = 0
    def __init__(self):
        Spam.numInstances = Spam.numInstances + 1
    def printNumInstances():
        print("Number of instances created: %s" % Spam.numInstances)
           
```

那么，什么时候需要无实例化的类方法调用？`Consider keeping track of the number of instances created from a class, or maintaining a list of all of a class’s instances that are currently in memory. `即数据处理位于整个类空间时，我们不需要实例化调用。

事实上，在类外定义这样的参数空间也可以保持数据处理在一个全局维度，但是将这样的类方法设计在类内可以灵活应用继承特性，从而达到同样的效果。

在此之前，明确一下Python 2.X和Python 3.X关于绑定类方法的区别：

- Both Python 2.X and 3.X produce a bound method when a method is fetched through an instance.
- In Python 2.X, fetching a method from a class produces an unbound method, which  cannot be called without manually passing an instance.
- In Python 3.X, fetching a method from a class produces a simple function, which can be called normally with no instance present.

```shell
C:\code> c:\python27\python
>>> from spam import Spam
>>> a = Spam() # Cannot call unbound class methods in 2.X
>>> b = Spam() # Methods expect a self object by default
>>> c = Spam()
>>> Spam.printNumInstances()
TypeError: unbound method printNumInstances() must be called with Spam instance
as first argument (got nothing instead)
>>> a.printNumInstances()
TypeError: printNumInstances() takes no arguments (1 given)	
```

```shell
C:\code> c:\python33\python
>>> from spam import Spam
>>> a = Spam() # Can call functions in class in 3.X
>>> b = Spam() # Calls through instances still pass a self
>>> c = Spam()
>>> Spam.printNumInstances() # Differs in 3.X
Number of instances created: 3
>>> a.printNumInstances()
TypeError: printNumInstances() takes 0 positional arguments but 1 was given

```

```python
Spam.printNumInstances() # Fails in 2.X, works in 3.X
instance.printNumInstances() # Fails in both 2.X and 3.X (unless static)
```



### Static Method Alternatives：

- #### outside the class

```python
def printNumInstances():
 print("Number of instances created: %s" % Spam.numInstances)
class Spam:
 numInstances = 0
 def __init__(self):
 Spam.numInstances = Spam.numInstances + 1

```

```shell
C:\code> c:\python33\python
>>> import spam
>>> a = spam.Spam()
>>> b = spam.Spam()
>>> c = spam.Spam()
>>> spam.printNumInstances() # But function may be too far removed
Number of instances created: 3 # And cannot be changed via inheritance
>>> spam.Spam.numInstances
3

```

- #### through an instance

```python
class Spam:
 numInstances = 0
 def __init__(self):
 Spam.numInstances = Spam.numInstances + 1
 def printNumInstances(self):
 print("Number of instances created: %s" % Spam.numInstances)
```

```shell
C:\code> c:\python33\python
>>> from spam import Spam
>>> a, b, c = Spam(), Spam(), Spam()
>>> a.printNumInstances()
Number of instances created: 3
>>> Spam.printNumInstances(a)
Number of instances created: 3
>>> Spam().printNumInstances() # But fetching counter changes counter!
Number of instances created: 4
```

技术上，Python现在支持三种类相关方法，包含如下不同的参数协议：

- Instance methods, passed a **self** instance object(the default)
- Static methods, passed no extra object(via **staticmethod**)
- Class methods, passed a class object(via **classmethod**, and inherent in metaclasses)

### 1. Static Method

Static Methods never receive an automatic **self** argument, whether called through a class or an instance.

```python
class Spam:
 numInstances = 0 # Use static method for class data
 def __init__(self):
        Spam.numInstances += 1
 def printNumInstances():
        print("Number of instances: %s" % Spam.numInstances)
        printNumInstances = staticmethod(printNumInstances)
```

Both in Python2.X and 3.X:

```shell
>>> from spam_static import Spam
>>> a = Spam()
>>> b = Spam()
>>> c = Spam()
>>> Spam.printNumInstances() # Call as simple function
Number of instances: 3
>>> a.printNumInstances() # Instance argument not passed
Number of instances: 3

```

```python
class Sub(Spam):
 def printNumInstances(): # Override a static method
 print("Extra stuff...") # But call back to original
 Spam.printNumInstances()
 printNumInstances = staticmethod(printNumInstances)

```

```shell
>>> from spam_static import Spam, Sub
>>> a = Sub()
>>> b = Sub()
>>> a.printNumInstances() # Call from subclass instance
Extra stuff...
Number of instances: 2
>>> Sub.printNumInstances() # Call from subclass itself
Extra stuff...
Number of instances: 2
>>> Spam.printNumInstances() # Call original version
Number of instances: 2
```

```shell
>>> class Other(Spam): pass # Inherit static method verbatim
>>> c = Other()
>>> c.printNumInstances()
Number of instances: 3
```

### 2. Class Method

Interestingly, a class method can do similar work here—the following has the same behavior as the static method version listed earlier, but it uses a class method that receives the instance’s class in its first argument. Rather than hardcoding the class name, the class method uses the automatically passed class object generically:

```python
class Spam:
 numInstances = 0 # Use class method instead of static
 def __init__(self):
 Spam.numInstances += 1
 def printNumInstances(cls):
 print("Number of instances: %s" % cls.numInstances)
 printNumInstances = classmethod(printNumInstances)

```

```shell
>>> from spam_class import Spam
>>> a, b = Spam(), Spam()
>>> a.printNumInstances() # Passes class to first argument
Number of instances: 2
>>> Spam.printNumInstances() # Also passes class to first argument
Number of instances: 2

```

当使用classmethod时，调用进行时传递的是最具体的类，因此存在继承关系时，类空间参数会由子类覆盖父类。

```python
class Spam:
 numInstances = 0 # Trace class passed in
 def __init__(self):
 Spam.numInstances += 1
 def printNumInstances(cls):
 print("Number of instances: %s %s" % (cls.numInstances, cls))
 printNumInstances = classmethod(printNumInstances)
class Sub(Spam):
 def printNumInstances(cls): # Override a class method
 print("Extra stuff...", cls) # But call back to original
 Spam.printNumInstances()
 printNumInstances = classmethod(printNumInstances)
class Other(Spam): pass # Inherit class method verbatim
```

```shell
>>> from spam_class import Spam, Sub, Other
>>> x = Sub()
>>> y = Spam()
>>> x.printNumInstances() # Call from subclass instance
Extra stuff... <class 'spam_class.Sub'>
Number of instances: 2 <class 'spam_class.Spam'>
>>> Sub.printNumInstances() # Call from subclass itself
Extra stuff... <class 'spam_class.Sub'>
Number of instances: 2 <class 'spam_class.Spam'>
>>> y.printNumInstances() # Call from superclass instance
Number of instances: 2 <class 'spam_class.Spam'>

>>> z = Other() # Call from lower sub's instance
>>> z.printNumInstances()
Number of instances: 3 <class 'spam_class.Other'>

```

小结，由于class methods总是在实例树中receive the lowest class：

-  Static methods and explicit class names may be a better solution for processing data local to a class.
- Class methods may be better suited to processing data that may differ for each class in a hierarchy.

```python
class Spam:
 numInstances = 0
 def count(cls): # Per-class instance counters
 cls.numInstances += 1 # cls is lowest class above instance
 def __init__(self):
 self.count() # Passes self.__class__ to count
 count = classmethod(count)
class Sub(Spam):
 numInstances = 0
 def __init__(self): # Redefines __init__
 Spam.__init__(self)
class Other(Spam): # Inherits __init__
 numInstances = 0
```

```shell
>>> from spam_class2 import Spam, Sub, Other
>>> x = Spam()
>>> y1, y2 = Sub(), Sub()
>>> z1, z2, z3 = Other(), Other(), Other()
>>> x.numInstances, y1.numInstances, z1.numInstances # Per-class data!
(1, 2, 3)
>>> Spam.numInstances, Sub.numInstances, Other.numInstances
(1, 2, 3)

```


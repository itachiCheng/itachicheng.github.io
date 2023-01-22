---

title: 《基于BERT模型的自然语言处理实践》
date: 2022-04-09 15:44:49
tags: 
- NLP
categories:
- Machine Learning
---

### Chapter I

#### 1.1

BERT（Bidirectional Encoder Representations From Transformers）模型使用预训练和微调的方式来完成自然语言处理任务。这些任务包括问答系统，情感分析和语言推理。



BERTology系列模型：

- XLNet模型——引入了BERT模型中的双向上下文信息的广义自回归模型。
- RoBERTa和SpanBERT模型引入了BERT模型训练方式和目标。
- 结合了多任务及知识蒸馏（Knowledge Distillation)、强化BERT模型功能的MT-DNN模型

这些模型的一个共同特点是极大规模的数据量、训练强度和模型容量，以及利用无监督模型的训练方式，使其能力空前强大。

#### 1.2

BERT模型是通过预测屏蔽字词（先将句子中的部分字词屏蔽，再令模型去预测被屏蔽的字词）进行训练的这种方式在语句级的语义分析中取得了极好的效果。

11项NLP任务：

| 任务     | 类别                                    | 描述                                                         |
| -------- | --------------------------------------- | ------------------------------------------------------------ |
| MultiNLI | 文本语义关系识别                        | 文本间的推理关系，又被称为“文本蕴含关系”。两个文本的关系一共有三种：entailment(蕴含)、contradiction(矛盾)、neutral(中立) |
| QQP      | 文本匹配                                | 类似于分类任务，判断两个问题是否等价。使用的是数据集Quora Question Pairs |
| QNLI     | 自然语言推理                            | 一个二分类任务?。正样本包含正确的answer,负样本包含不正确的answer。 |
| SST-2    | 文本分类                                | 基于文本的感情分类任务，使用的是斯坦福大学的情感分类树数据集The Stanford Sentiment Treebank。 |
| CoLA     | 文本分类                                | 适用于语法错误识别的分类任务，预测一个句子是否是可接受的。使用的是语言可接受性语料库The Corpus of Linguistic Acceptability |
| STS-B    | 求文本相似度                            | 用来评判两个文本语义信息的相似度。使用的是语义相似度数据集The Semantic Textual Similarity Benchmark，样本为文本对，分数为1~5 |
| MRPC     | 求文本相似度                            | 对来源于同一条新闻的两条评论进行处理，判断这两条评论在语义上是否相同。 使用的是微软研究释义语料库Microsoft Research Paraphrase Corpus，样本为文本对。 |
| RTE      | 文本语义关系识别                        | 与MultiNLI任务类似，只不过数据集更少，使用的是文本语义关系识别数据集Recognizing Textual Entailment |
| WNLI     | 自然语言推理                            | 与QNLI任务类似，只不过数据集更少，使用的是文本语义关系识别数据集Recognizing Textual Entailment |
| SQuAD    | 抽取式阅读理解                          | 给出一个问题和一段文字，从文字中抽取出问题的答案。使用的是斯坦福大学问答数据集中的阅读理解数据集The Standford Question Answering Dataset |
| NER      | 命名实体识别（Named Entity Recognition) | 实体词识别（NER)任务是NLP中的基础任务。它用于识别文本中的人名（PER)、地名（LOC）、组织（ORG），以及其他实体（MISC）等。例如：                                          （李 B-PER)、（金 I-PER）、（洪 I-PER）、（在 O）、(办 B-LOC)、（室 I-LOC）。                                                     其中， O表示一个非实体。B表示一个实体块的开始。I表示一个实体块的内部。实体词识别本质上是一个分类任务（又被称为“序列标注任务”）。实体次识别是句法分析的基础，而句法分析又是NLP任务的核心。 |
| SWAG     | 带选择题的阅读理解                      | 给出一个陈述句子和4个备选句子，判断前者与后者中的哪一个句子最有逻辑连续性。使用的是情境数据集The Situations With Adversarial Generations Dataset。 |

以上所有任务涵盖了如下4种场景：

- 场景一：处理类似阅读理解的任务。最为典型的是SQuAD。
- 场景二：处理句子与段落间的匹配任务。例如求文本相似度
- 场景三：提取句子深层语义特征任务。例如文本分类和文本匹配
- 场景四：基于句子或段落级别的短文本（长度小于512个子词的文本）处理任务。



### 1.3

BERT模型是由“Transformer模型中的编码器（Encoder) + 双向（正向序列和反向序列）结构”组成的。



BERT模型的主要创新点是其独特的预训练方法，这种方法使用Masked Language Model和Next Sentence Prediction两种方法分别捕捉“词语”和“句子”级别的表示。



###### 四件套：

- 神经网络的基础知识
- NLP的基础知识
- 编程框架的基础知识
- BERT模型的原理及应用



我作为读者，对1和3部分有一定基础，所以整理至此，希望直接跳过第二章神经网络基础进入代码任务实战。



### Chapter III

### 3.1

NLP的主要目的是让计算机像人一样去理解自然语言。在NLP中，大量使用了编译原理的相关技术，例如词法分析、语法分析等。除此之外，在“理解”这个层面中，NLP则使用到语义理解、机器学习等技术。



文字只是信息的载体，而非信息本身。首先需要将文本数据换一种载体（表示形式）——数值化；再将数值化后的文本数据输入计算机中进行处理，从而完成特定的计算任务。这便是NLP的本质，即

	自然语言处理 = 文本处理 + 机器学习



#### 3.1.1 情感分析、相似度分析等任务的本质

情感分析、相似度分析等任务属于NLP中的自然语言理解子任务，即对句子级别的文字进行理解，并根据理解的语义完成具体的要求。表1.1中前九项数据集加上SWAG都可以嵌入这两个场景中。

- 在情感分析任务中，输出这段文字所属的情感级别（满意、一般、不满意等）。
- 在相似度分析任务中，输出两个句子相似的概率。



#### 3.1.2 完型填空、实体词识别（NER）等任务的本质

同样的，这也是自然语言理解中的子任务。他们是基于句子中的子词进行处理的，所以又被称为“子词级别任务”。

1. 子词级别任务与BERT模型

子词级别任务属于BERT模型的预训练任务之一，它等价于完型填空任务，即根据句子的上下子词推测出当前位置应当是什么子词。

2. 实体词识别任务及常用模型



​	

#### 3.1.3 文章摘要任务、问答任务、翻译任务的本质

文章摘要任务、问答任务、翻译任务包括自然语言理解和自然语言生成两种子任务。它需要先理解输入文本的语义特征，再根据语义特征生成指定的描述。



文章摘要任务主要基于文章级别进行处理，而问答任务和翻译任务主要基于句子级别进行处理。它们的本质都是“序列到序列”任务。



###### 自然语言处理工具包

SpaCy

```python
pip install spacy
pip install en_core_web_sm-3.2.0.tar.gz
## 20220410最新3.2.0版本
```



###### 中文分词工具

Jieba

```python
pip install jiebe
```

```python
import jieba
seg_list = jieba.cut("jieba是一个中文分词工具")
print(" ".join(seg_list))

#Output:
#jieba 是 一个 中文 分词 工具
```



###### 中文转拼音工具

Pypinyin

```
pip install pypinyin
```

```python
from pypinyin import lazy_pinyin, Style
a = lazy_pinyin('牟')
print(a)
#Output:
#['mou2']
b = lazy_pinyin('张首晟', style = Style.TONE3)
print(b)
#Output:
#['zhang1', 'shou3', 'cheng2']
## 拼音模块甚至还具有分词功能
from pypinyin.contrib.mmseg import seg
text = '斩断这世间的因果'
b = list(seg.cut(text))
print(b)
## Output:
['斩', '断', '这', '世间', '的', '因', '果']
```



###### 评估翻译质量的算法库——SacreBLEU

```
pip install sacrebleu
```



```python
import sacrebleu

sys = ['I am a student.']
sysorg = ['He is a student.']
refs = [['He is a student']]
print(sacrebleu.corpus_bleu(sysorg, refs).score)
print(sacrebleu.corpus_bleu(sys, refs).score)
## Output:
# 66.87403049764218
# 21.3643503198117
```



###### 借助Unicode处理中文字符的常用操作

1. 判断是否是汉字

```python
def is_chinese(ch):
    if '\u4e00' <= ch <= '\u9fff':
        return True
    return False
print(is_chinese('光'))
print(is_chinese('a'))
# Output:
# True
# False
```



2.  判断是否是分隔符

```python
import unicodedata
def is_punctuation(ch):
    if ch in ("\n", "\t", "\r") or unicodedata.category(ch) in ("Zs", "Zp", "Zl"):
        return True
    return False
is_punctuation(' ')
# Output:
# True
```



3. 判断是否为标点符号

判断标点符号的方法需要分解成两部分：根据ASCII判断是否为英文标点符号和根据Unicode的通用类型，判断是否为中文标点符号。

```python
import unicodedata
def is_punctuation(char):
    cp = ord(char) ## 转换成ASCII码
    print(cp) #65292
    if ((cp >= 33 and cp <= 47) or (cp >= 58 and cp <=64 ) or
    (cp >= 91 and cp <= 96) or (cp >= 123 and cp <= 126)):
        return True
    cat = unicodedata.category(char)
    if cat.startswith("P"):
        return True
    return False

is_punctuation('，') ## 注意这是中文逗号
# Output: True
```



4. 全角和半角的转换

在Unicode中，半角字符的编码范围是：33（0x21)~126（0x7E)，全角字符的编码范围是：

65281（0xFF01) ~ 65374（0xFF5E）。全角字符与相应的半角字符相差65248（0xFEE0）。

```python
def strQ2B(ustring):
    rstring = ""
    for uchar in ustring:
        inside_code=ord(uchar)
        if inside_code == 12288:
            inside_code = 32
        elif (inside_code >= 65281 and inside_code <= 65374):
            inside_code -=65248
        rstring += chr(inside_code)
    return rstring

print("Before: ","ｗｏ们是冠军")# 全角
print("After: ", strQ2B("ｗｏ们是冠军")) #转换后的半角

# Output:
# Before:  ｗｏ们是冠军 
# After:  wo们是冠军
```



... ...

#### 3.4.4 什么是依存关系分析

句法分析分为句法结构分析和依存关系分析。句法结构分析用于获取整个句子的句法结构，依存关系分析用于获取词汇之间的依存关系。目前的句法分析已经从句法结构分析转向依存句法分析。

依存语法中关于依存关系的四条公理：

- 在一个句子中只有一个成分是独立的（中心成分）。
- 受支配的其他成分直接依存于它的支配者。
- 任何一个成分都不能依存于两个或两个以上的支配者。
- 如果A成分直接依存于B成分，而C成分在句中位于A成分和B成分之间，那么C成分或者依存于A成分，或者依存于B成分，或者依存于A成分和B成分之间的某一个成分。



```python
import spacy
from spacy import displacy
from pathlib import Path
parser = spacy.load("en_core_web_sm")
doc = "We focus on the research and education of AI technology"
doc = parser(doc)
svg = displacy.render(doc, style = 'dep', jupyter = False)
output_path = Path("./dependency_plot.svg")
output_path.open("w", encoding="utf-8").write(svg)
```

![](dependency_plot.svg)

###### 弧线的解释

图中的弧线部分表示单词之间的关系。该关系有如下几种：nsubj(名词主语)、prep(介词修饰语)、pobj(介词的宾语)、det(限定词)、cc(连词)、conj(连词)、compound(组合词)。

###### 词性的解释

最下面一行，是每个单词的词性。词性有如下几种：PROPN(代词)、VERB(动词)、ADP(介词)、DET(动词)、NOUN(名词)、CCONJ(连接词)、ADJ(形容词)、

PUNCT(标点)。



###### 依存关系的内部结构

```python
parse_ret = doc.to_json()
print(parse_ret['tokens'])
[{'id': 0, 'start': 0, 'end': 2, 'tag': 'PRP', 'pos': 'PRON', 'morph': 'Case=Nom|Number=Plur|Person=1|PronType=Prs', 'lemma': 'we', 'dep': 'nsubj', 'head': 1}, 
 {'id': 1, 'start': 3, 'end': 8, 'tag': 'VBP', 'pos': 'VERB', 'morph': 'Tense=Pres|VerbForm=Fin', 'lemma': 'focus', 'dep': 'ROOT', 'head': 1}, 
 {'id': 2, 'start': 9, 'end': 11, 'tag': 'IN', 'pos': 'ADP', 'morph': '', 'lemma': 'on', 'dep': 'prep', 'head': 1}, 
 {'id': 3, 'start': 12, 'end': 15, 'tag': 'DT', 'pos': 'DET', 'morph': 'Definite=Def|PronType=Art', 'lemma': 'the', 'dep': 'det', 'head': 4}, 
 {'id': 4, 'start': 16, 'end': 24, 'tag': 'NN', 'pos': 'NOUN', 'morph': 'Number=Sing', 'lemma': 'research', 'dep': 'pobj', 'head': 2}, 
 {'id': 5, 'start': 25, 'end': 28, 'tag': 'CC', 'pos': 'CCONJ', 'morph': 'ConjType=Cmp', 'lemma': 'and', 'dep': 'cc', 'head': 4}, 
 {'id': 6, 'start': 29, 'end': 38, 'tag': 'NN', 'pos': 'NOUN', 'morph': 'Number=Sing', 'lemma': 'education', 'dep': 'conj', 'head': 4}, 
 {'id': 7, 'start': 39, 'end': 41, 'tag': 'IN', 'pos': 'ADP', 'morph': '', 'lemma': 'of', 'dep': 'prep', 'head': 4}, 
 {'id': 8, 'start': 42, 'end': 44, 'tag': 'NNP', 'pos': 'PROPN', 'morph': 'Number=Sing', 'lemma': 'AI', 'dep': 'compound', 'head': 9}, 
 {'id': 9, 'start': 45, 'end': 55, 'tag': 'NN', 'pos': 'NOUN', 'morph': 'Number=Sing', 'lemma': 'technology', 'dep': 'pobj', 'head': 7}]
```

- id:单词的序号。
- start:单词的起始位置
- end:单词的结束位置
- pos:词性标注
- tag:另一种格式的词性标注
- dep:依存关系
- head:所依赖的单词



#### 3.4.5 TF-IDF

字词的重要性，随着它在文件中出现的次数呈正比增加，但同时会随着它在语料库中出现的频率呈反比下降。TFIDF算法是建立在这样一个假设之上的：对区别文档最有意义的词语应该是那些在文档中出现频率高，而在整个文档集合的其他文档中出现频率少的词语。





### Chapter V

#### 5.3.3 张量的基本操作

- 获取张量中的元素的个数

```python
import torch
a = torch.Tensor(2)
print(torch.numel(a)) ## print 2
b = torch.tensor(2)
print(torch.numel(b)) ## print 1 
```

- 张量的判断

```python
a = torch.Tensor(2)
print(torch.is_tensor(a))
```

- 张量的类型转换

```python

a = torch.FloatTensor([4])
print(a.type(torch.IntTensor))
print(a.to(torch.int))
## tensor([4], dtype=torch.int32)
## tensor([4], dtype=torch.int32)
```

- 张量类中的重载操作符函数

```python

a = torch.FloatTensor([4])
a.add(a)
print(a)
a.add_(a)

## tensor([4.])
## tensor([8.])
```

- 张量与Numpy间的互相转换(张量与Numpy类型数据的转换是基于零copy技术实现的)

```python
## 在转换过程中，Pytorch张量和Numpy数组对象共享一个内存区域，PyTorch张量会保留一个指向内部Numpy数组的指针，而不是直接复制Numpy的值。
import numpy as np
a = torch.FloatTensor([4])
print(a.numpy())
anp = np.array([4])

print(torch.from_numpy(anp))
print(torch.tensor(anp))
## [4.]
## tensor([4], dtype=torch.int32)
## tensor([4], dtype=torch.int32)
```



- 张量与Numpy互相转换的陷阱

Numpy转换成张量后，如果对Numpy的值进行修改会有以下两种情况：

- - 使用替换内存的运算符

    ```python
    nparray = np.array([1,1])
    x = torch.from_numpy(nparray)
    print(x)
    nparray+=1
    print(x)
    ## tensor([1, 1], dtype=torch.int32)
    ## tensor([2, 2], dtype=torch.int32)
    ```

  - 不使用内存替换运算符

    ```python
    
    nparray = np.array([1,1])
    x = torch.from_numpy(nparray)
    print(x)
    nparray = nparray + 1
    print(x)
    ## tensor([1, 1], dtype=torch.int32)
    ## tensor([1, 1], dtype=torch.int32)
    ```


#### 5.3.4 在CPU和GPU控制的内存中定义张量

- 将CPU内存中的张量复制到GPU内存中

```python
import torch
a = torch.FloatTensor([4])
b = a.cuda()
print(b)
## tensor([4.], device='cuda:0')
```

- 直接在GPU内存中定义张量

```python
a = torch.tensor([4], device=
                'cuda')

## tensor([4], device='cuda:0')
```

- 使用to()方法来指定设备

```python
a = torch.FloatTensor([4])
print(a)
print(a.to("cuda:0"))
```

- 使用环境变量CUDA_VISIBLE_DEVICES来指定设备

```python
import os
os.environ["CUDA_VISIBLE_DEVICES"]  = "0"
a = torch.FloatTensor([4])
print(a)
```

#### 5.3.5 张量间的数据操作

1. view()方法与contiguous()方法

view方法作用于原来的张量，传入改变新张量的形状，新张量的总元素数目和原来张量的元素数目相同。view方法不会改变张量底层的数据，只是改变维度步长的信息，所以view方法无法对分布在不同内存块的数据做处理。contiguous()方法可以把张量复制到连续的整块内存中。

```python
t = torch.randn(12)
print(t.is_contiguous())
t.view(4, 3).is_contiguous()
print(t.data_ptr())
print(t.view(3, 4).data_ptr())
print(t.view(3, 4).contiguous().data_ptr())
print(t.view(3, 4).transpose(0, 1).data_ptr())
print(t.view(3,4))
print(t.view(3, 4).transpose(0, 1))
print(t.view(3, 4).transpose(0, 1).is_contiguous())

# 
# True
# 1726440683072
# 1726440683072
# 1726440683072
# 1726440683072
# tensor([[-1.4617,  0.2328,  0.1896, -0.2204],
#         [ 0.1491,  0.0100, -0.1243,  1.4697],
#         [-0.3951, -0.5101,  1.1163, -0.5926]])
# tensor([[-1.4617,  0.1491, -0.3951],
#         [ 0.2328,  0.0100, -0.5101],
#         [ 0.1896, -0.1243,  1.1163],
#         [-0.2204,  1.4697, -0.5926]])
# False
# 1726440684352
# True
```

2. transpose()方法

transpose()方法产生的张量存储并不一定都是不连续的，当我们考察连续性是C数组连续的时候，如果用transpose()交换完维度后，row方向的步长max(1 byte, x % byte_len)为1 byte,那么仍然可以作为C 数组连续，如下试验：

```python
import torch
t = torch.randn(12)
print(t.view(1, 12))
print(t.view(1, 12).transpose(0,1).is_contiguous())

print(t.view(3, 4))
print(t.view(3, 4).transpose(0,1).is_contiguous())

print(t.view(6, 2))
print(t.view(6, 2).transpose(0,1).is_contiguous())

print(t.view(12, 1))
print(t.view(12, 1).transpose(0,1).is_contiguous())


# tensor([[-0.2065,  0.7754,  0.5719,  1.1224, -0.5870,  0.8254, -0.1786, -0.0678,
#           0.7953, -1.5381,  1.2669, -0.6384]])
# True
# tensor([[-0.2065,  0.7754,  0.5719,  1.1224],
#         [-0.5870,  0.8254, -0.1786, -0.0678],
#         [ 0.7953, -1.5381,  1.2669, -0.6384]])
# False
# tensor([[-0.2065,  0.7754],
#         [ 0.5719,  1.1224],
#         [-0.5870,  0.8254],
#         [-0.1786, -0.0678],
#         [ 0.7953, -1.5381],
#         [ 1.2669, -0.6384]])
# False
# tensor([[-0.2065],
#         [ 0.7754],
#         [ 0.5719],
#         [ 1.1224],
#         [-0.5870],
#         [ 0.8254],
#         [-0.1786],
#         [-0.0678],
#         [ 0.7953],
#         [-1.5381],
#         [ 1.2669],
#         [-0.6384]])
# True

```

在此，调用view()之前一定要保证张量是contiguous()，可以用is_contiguous()来判断。

3. reshape()方法

相当于contiguous().view()的调用，重新拷贝出数组的连续表示。

4. 用torch.cat()函数实现数据连接

```python
a = torch.tensor([[1,2],[3,4]])
b = torch.tensor([[5,6],[7,8]])
print(torch.cat([a,b],dim=0))
print(torch.cat([a,b],dim=1))
```

torch.stack()函数和torch.cat()函数类似，但是stack之后张量维度会改变。

5. 用torch.chunk()函数实现数据均匀分割

```python
a = torch.tensor([[1,2],[3,4]])
torch.chunk(a, chunks = 2, dim = 0)
# (tensor([[1, 2]]), tensor([[3, 4]]))
# (tensor([[1],
#          [3]]), tensor([[2],
#          [4]]))
```

6. 用torch.split()函数实现数据不均匀分割

```python
b = torch.tensor([[1,2,3], [4,5,6]])
print(torch.split(b, split_size_or_sections=1, dim = 0))
b = torch.tensor([[1,2,3], [4,5,6]])
print(torch.split(b, split_size_or_sections=1, dim = 1))
# (tensor([[1, 2, 3]]), tensor([[4, 5, 6]]))
# (tensor([[1],
#        [4]]), tensor([[2],
#        [5]]), tensor([[3],
#        [6]]))
```

7. 用torch.gather()函数对张量数据进行检索

```python
b = torch.tensor([[5,6,7],[1,2,3]])
print(torch.gather(b, dim=1, index=torch.tensor([[0,1,0],[1,2,1]])))
b = torch.tensor([[5,6,7],[1,2,3]])
print(torch.gather(b, dim=0, index=torch.tensor([[0,1],[1,0]])))
# tensor([[5, 6, 5],
#         [2, 3, 2]])
# tensor([[5, 2],
#         [1, 6]])
```

8. 获取数据中最大值、最小值的索引

torch.argmax()函数用于返回最大值索引，torch.argmin()函数用于返回最小值索引。

```python
a = torch.tensor([[1,2],[3,4]])
print(torch.argmax(a, dim=0))
print(torch.argmin(a, dim=0))
```

9. 大多数常用的函数sqrt一般有两种调用方式，第一种是调用张量的内置方法，第二种是调用torch自带的函数。
10. 矩阵的乘法和张量的缩并

- [Einstein Summation Convention](https://rockt.github.io/2018/04/30/einsum)

11. 张量的广播

完成扩增维度的两个张量必须能够在维度上对齐，即两个张量之间对应的维度存在两种情况，至少有一个维度大小为1，或者两个维度大小大小均不为1，但是相等。

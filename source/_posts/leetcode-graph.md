---
title: leetcode-graph
date: 2022-01-02 14:41:37
tags:
cover: graph.png
---
## 997. [找到小镇的法官](https://leetcode-cn.com/problems/find-the-town-judge)

在一个小镇里，按从 1 到 n 为 n 个人进行编号。传言称，这些人中有一个是小镇上的秘密法官。

如果小镇的法官真的存在，那么：

- 小镇的法官不相信任何人。
- 每个人（除了小镇法官外）都信任小镇的法官。
- 只有一个人同时满足条件 1 和条件 2 。

给定数组 trust，该数组由信任对 trust[i] = [a, b] 组成，表示编号为 a 的人信任编号为 b 的人。

如果小镇存在秘密法官并且可以确定他的身份，请返回该法官的编号。否则，返回 -1。

![](graph.png)

### 解析

在如上有向图中，d满足题干中所给的三个条件，条件1表明节点的出度应当为零，条件2表明节点的入度应当为n-1,同时能满足上述条件的节点必然只有一个。

```
PYTHON

## 解法1，常规处理：
class Solution(object):
    def findJudge(self, n, trust):
        """
        :type n: int
        :type trust: List[List[int]]
        :rtype: int
        """
        nodeIn, nodeOut = [0] * n, [0] * n
        for node in trust:
            nodeOut[node[0]-1]+=1
            nodeIn[node[1]-1]+=1
        for i in range(n):
            if nodeOut[i]==0 and nodeIn[i]==n-1:
                return i + 1
            
        return -1
## 解法2，偏贪心的处理，出度不为零则一定不是法官，减少了出度的累加计算：
class Solution(object):
    def findJudge(self, n, trust):
        """
        :type n: int
        :type trust: List[List[int]]
        :rtype: int
        """
        array = [0] * n
        ans = []
        for num in trust:
            array[num[1]-1] += 1 
        for index,nums in enumerate(array):
            if nums == n - 1:
                ans.append(index+1)
        if len(ans) != 1:
            return -1
        for check in trust:
            if check[0] == ans[0]:
                return -1
        return ans[0]
```

------

# 拓扑排序

- 构建邻接矩阵
-

## 207. [课程表](https://leetcode-cn.com/problems/course-schedule/)

你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。

在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程 bi 。

例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。

### 解析

通过检测有向闭环，采用深度优先搜索进行求解：

```
PYTHON
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        """
        :type numCourses: int
        :type prerequisites: List[List[int]]
        :rtype: bool
        """
        ## 检测环结构
        valid = True        
        visited = [0] * numCourses
        adj = collections.defaultdict(list) ## [[]] * numCourses是一种浅拷贝
        for edge in prerequisites:
            adj[edge[1]].append(edge[0])
        def dfs(node):
            nonlocal valid
            visited[node] = 1
            for n in adj[node]:
                if visited[n] == 0:
                    dfs(n)
                    if not valid:
                        return
                elif visited[n] == 1:
                    valid = False
                    return
            visited[node] = 2
        for i in range(numCourses):
            if valid and visited[i] == 0:
                dfs(i)
        return valid
```

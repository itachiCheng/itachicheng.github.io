---
title: leetcode-array
date: 2022-01-05 18:48:37
tags:
- leetcode
categories:
- [Coding]
cover: graph.png
---



### 二分法

#### 寻找第一个大于等于目标值的数

- 默认升序
- 如果没有找到，假象值会导致索引越界（因为升序，所以在长度以外）
- frt 靠近 lst，向下取整可以避免数组越界

```python
frt, lst = 0, len(nums)
while frt < lst:
    mid = frt + (lst - frt) // 2
    if target > nums[mid]:
        frt = mid + 1
    else:
        lst = mid
    return frt
```

#### 寻找最后一个小于等于目标值的数

- 默认升序
- 如果没有找到，假象值会导致索引越界（因为升序，所以在索引-1的位置）
- lst靠近 frt，向上取整可以避免数组越界

```python
frt, lst = -1, len(nums) - 1
while frt < lst:
    mid = frt + (lst - frt + 1) // 2
    if target >= nums[mid]:
        frt = mid
    else:
        lst = mid - 1
    return lst
```

#### 练习模板

[35. 搜索插入位置](https://leetcode-cn.com/problems/search-insert-position/)

[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)



### 指针移动法

双指针法或者多指针法中，pointer的功能可以大致分为两种定位赋值和遍历判断。

```python
## 移除元素中 fix 用于定位赋值， mov 用于遍历判断
class Solution(object):
    def removeElement(self, nums, val):
        """
        :type nums: List[int]
        :type val: int
        :rtype: int
        """
        fix, mov = 0, 0
        while mov < len(nums):
            if nums[mov] != val:
                nums[fix] = nums[mov]
                fix += 1
            mov += 1
        return fix		
 
## 有序数组表明重复出现的数字必然是多个出现，对于移除目标元素，判断条件是是否和目标值相等，这里是否和前值相等    
 class Solution(object):
    def removeDuplicates(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """

        frt, lst = 0, 0
        lenNums = len(nums)
        while lst < lenNums:
            if lst == 0 or nums[lst] != nums[lst - 1]:
                nums[frt] = nums[lst]
                frt += 1
            lst += 1
        return frt
    
 class Solution(object):
    def removeDuplicates(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        frt, lst = 0, 0
        reg = {}
        while lst < len(nums):
            if lst == 0 or lst == 1 or nums[lst] != nums[lst - 1] or reg[nums[lst]] < 2:
                reg[nums[lst]] = reg.get(nums[lst],0) + 1
                nums[frt] = nums[lst]
                frt += 1
            lst += 1
        return frt
    
class Solution(object):
    def moveZeroes(self, nums):
        """
        :type nums: List[int]
        :rtype: None Do not return anything, modify nums in-place instead.
        """
        ## 类似移除元素，同样是指针的定位赋值和遍历判断
        frt, lst = 0,0
        lenNums = len(nums)
        while lst < lenNums:
            if nums[lst] != 0:
                nums[frt] = nums[lst]
                frt += 1
            lst += 1
        while frt < lenNums:
            nums[frt] = 0
            frt += 1
        return nums
    
class Solution(object):
    def sortedSquares(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        frt, lst = 0, len(nums) - 1
        ans = [-1] * len(nums)
        ind = len(nums) - 1
        while frt<=lst:
            vfrt = nums[frt]**2
            vlst = nums[lst]**2 
            if vfrt > vlst:
                ans[ind] = vfrt
                frt += 1
            else:
                ans[ind] = vlst
                lst -= 1
            ind-=1
        return ans 
## 从后往前遍历
class Solution(object):
    def backspace(self, s):
        frt, lst = '', len(s) - 1
        numshap = 0
        while lst >= 0:
            if s[lst] != '#':
                if numshap == 0:
                    frt = frt + s[lst]
                else:
                    numshap -= 1
            else:
                numshap += 1
            lst -= 1
        return frt
    def backspaceCompare(self, s, t):
        """
        :type s: str
        :type t: str
        :rtype: bool
        """
        return self.backspace(s) == self.backspace(t)
```

#### 练习模板

[283. 移动零](https://leetcode-cn.com/problems/move-zeroes/)

[26. 删除有序数组中的重复项](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array)

[80. 删除有序数组中的重复项 II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array-ii)

[844. 比较含退格的字符串](https://leetcode-cn.com/problems/backspace-string-compare/)

[977. 有序数组的平方](https://leetcode-cn.com/problems/squares-of-a-sorted-array)


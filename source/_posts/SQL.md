---
title: SQL
date: 2022-01-23 18:00:05
tags:
categories:
- SQL 
cover: Ulchiha.png
---

### 引言

这里的SQL无指代含义，只是想写一点和数据库以及**Structured Query Language**（结构化查询语言）相关的笔记。

### SQLite

SQLite是一个嵌入式SQL数据库引擎。与大多数其他SQL数据库不同（例如MySql），SQLite没有单独的服务器进程，SQLite直接读写普通磁盘文件。Anaconda中已经有了SQLite的相应版本，因此可以直接调用sqlite3模块来对接相应的API接口。

![image-20220123214313577](image-20220123214313577.png)

![image-20220123214408549](image-20220123214408549.png)

- 建库

```Python
import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    create_connection(r"C:\Docs\[---SQL---]\pythonsqlite.db")
    
# 2.6.0

```

返回`Connection`对象可以用于不同的数据库操作，如果传`:memory:`给`connect()`,那么新的数据库就会存在与内存（RAM）中而不是磁盘（disk)上，像下面这样。

```python
import sqlite3
from sqlite3 import Error

def create_connection():
    """ create a database connection to a database that resides
        in the memory
    """
    conn = None;
    try:
        conn = sqlite3.connect(':memory:')
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    create_connection()
```

- 建表

在建表之前，我们需要获取一个Cursor中间件对象用于连接SQLite数据库和SQL查询。

```python
def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)
```

然后结合DDL语句进行table创建,在这里我们创建一张天气数据表

```SQL
CREATE TABLE IF NOT EXISTS weather (
    id integer PRIMAY KEY,
	logTime integer NOT NULL,
    humidity double NOT NULL,
    temp double NOT NULL,
    type integer NOT NULL
);
```

```python
database = r'C:\Docs\[---SQL---]\pythonsqlite.db'
# create a database connection
conn = create_connection(database)
# create tables

if conn is not None:
    # create weather table
    create_table(conn, sql_create_weather_table)
else:
    print("Error! cannot create the database connection.")
```

注意，完整代码需要去掉finally子句，否则类似析构函数的作用一样conn会被关闭。

- 插值

插入相应的日志数据，`INSERT  INTO`sql如下,并附上完整代码：

```sql
INSERT INTO weather(id,logTime,humidity,temp,type)
VALUES(?,?,?,?,?,?)
```

```python
import sqlite3
from sqlite3 import Error


def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)
def create_table(conn, weather):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    sql = """INSERT INTO weather(id,logTime,humidity,temp,type)
		     VALUES(?,?,?,?,?)
          """
    try:
        c = conn.cursor()
        c.execute(sql, wheather)
        conn.commit()
        return c.lastrowid
    except Error as e:
        print(e)
sql_create_weather_table = """CREATE TABLE IF NOT EXISTS weather (
                                id integer PRIMAY KEY,
                                logTime integer NOT NULL,
                                humidity double NOT NULL,
                                temp double NOT NULL,
                                type integer NOT NULL
                            );
                           """
if __name__ == '__main__':
    conn = create_connection(r"C:\Docs\[---SQL---]\pythonsqlite.db")
    with conn:
        weather = (1,1000,1.0,2.0,1)
        weather_id = create_table(conn, weather)
		print(weather_id)
      
```




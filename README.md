# storage-awesome
**一个简单好用的storage方法库**


## 特性：
- API简洁，功能齐全【has、get、set、delete、clear、isEmpty】
- 条件查询【SS.get((key, value)=> value > 700)】
- 数据超时过期【SS.set({c: 789}, 60*24)】
- 数据隔离，互不干扰【见下“基本使用”】
- 基本的数据混淆，不明文存储
- Typescript


## 功能简介：

**storage-awesome** 的核心是工厂方法storageFactory，该方法接受两个入参，第一入参是Storage对象，如window.localStorage；第二入参是用来标识各实例唯一性的name，不同name的storage实例数据互相隔离。

工厂方法输出storage实例对象。实例对象有has、get、set、delete、clear、isEmpty几个方法，其中set、delete、clear支持链式操作。这些方法可以根据使用场景接收不同格式入参。

基于工厂方法，**storage-awesome** 预设了SessionStorage和LocalStorage两个实例对象，可以直接使用。SS和LS是它们的简写。



```javascript
/* 基本使用 */
import storageFactory, {SessionStorage, LocalStorage, SS, LS} from 'storage-awesome';

let SessionA = storageFactory(window.sessionStorage, 'SessionA');
let SessionB = storageFactory(window.sessionStorage, 'SessionB');

SessionA.set({
	test: '123'
})
SessionB.set({
	test: '456'
})
//// SessionA 和 SessionB 相互隔离
SessionA.get('test') //'123'
SessionB.get('test') //'456'

LocalStorage
	.clear()
	.set({
		a: 1,
		b: 2
	})
	.set({
		c: 3,
		d: 4
	}, 10)
	.delete(['a', 'c'])
	.get();
//结果： {b: 2, d: 4} 

```

## 安装使用：
**安装**
```shell
npm install storage-awesome --save
```
**使用**

ES module:
```javascript
import storageFactory, {SessionStorage, LocalStorage, SS, LS} from 'storage-awesome';

SS.set({abc: 123});
SS.has('abc');
//true
```
CommonJS:
```javascript
const {storageFactory, SessionStorage, LocalStorage, SS, LS} = require('storage-awesome');

SS.set({abc: 123});
SS.delete('abc')
SS.has('abc');
//false
```

用 **script 标签** 引入：
```html
<script src='https://unpkg.com/storage-awesome@1.1.1/dist/storage-awesome.min.js'></script>
```
```javascript
const {storageFactory, SessionStorage, LocalStorage, SS, LS} = storage;
LS.clear();
```

## API:
storageFactory：

入参（按顺序）          | 类型      | 是否必填              | 默认值
----------        | -----              | ------            | ------------
Storage对象，可以是window.sessionStorage或者window.localStorage，或者其它实现了getItem和setItem方法的对象           | Storage       | 是   |  window.sessionStorage
全局唯一name         | string    |是       | "storageAwesome"

实例方法：

<table>
	<tr>
		<th>方法</th>
		<th>简介</th>
		<th>入参</th>
		<th>入参类型</th>
		<th>返回值</th>
	</tr>
	<tr>
		<td rowspan="4">has</td>
		<td>查询某key在该storage是否有值</td>
		<td>key名</td>
		<td>string</td>
		<td>boolean</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.has('a') // 返回：true</td>
	</tr>
	<tr>
		<td>查询多个key在该storage是否有值，全部为true时才返回true</td>
		<td>存放key名的数组</td>
		<td>string[]</td>
		<td>boolean</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.has(['a', 'no']) // 返回：false</td>
	</tr>
	<tr>
		<td rowspan="8">get</td>
		<td>获取某key在该storage的值</td>
		<td>key名</td>
		<td>string</td>
		<td>any，该key对应的值</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.get('a') // 返回：123</td>
	</tr>
	<tr>
		<td>获取多个key在该storage的值，以键值对的形式返回</td>
		<td>存放key名的数组</td>
		<td>string[]</td>
		<td>json对象</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.get(['a', 'b']) // 返回：{a: 123, b: 456}</td>
	</tr>
	<tr>
		<td>获取该storage保存的所有值，以键值对的形式返回</td>
		<td>无</td>
		<td>void</td>
		<td>json对象</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.get() // 返回：{a: 123, b: 456, c: 789}</td>
	</tr>
	<tr>
		<td>获取符合查询条件的值，以键值对的形式返回</td>
		<td>查询函数</td>
		<td>(key: string, value: any) => boolean</td>
		<td>json对象</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.get((key, value)=> value > 700) // 返回：{c: 789}</td>
	</tr>
	<tr>
		<td rowspan="2">set</td>
		<td>向该storage存入键值对</td>
		<td>入参1：json对象；入参2：超时时间（分钟），非必填</td>
		<td>obj: { [key: string]: any }, minute?: number</td>
		<td>返回该storage对象</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.set({a: 123, b: 456}, 60 * 24).set({c: 789}) // 返回：SS</td>
	</tr>
	<tr>
		<td rowspan="4">delete</td>
		<td>删除该storage中的某键值对</td>
		<td>key名</td>
		<td>string</td>
		<td>返回该storage对象</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.delete('a').delete('b') // 返回：SS</td>
	</tr>
	<tr>
		<td>删除该storage中的多个键值对</td>
		<td>存放key名的数组</td>
		<td>string[]</td>
		<td>返回该storage对象</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.delete(['a', 'b']) // 返回：SS</td>
	</tr>
	<tr>
		<td rowspan="2">clear</td>
		<td>清空该storage的存储</td>
		<td>无</td>
		<td>void</td>
		<td>返回该storage对象</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.clear() // 返回：SS</td>
	</tr>
	<tr>
		<td rowspan="2">isEmpty</td>
		<td>判断该storage是否无数据</td>
		<td>无</td>
		<td>void</td>
		<td>boolean</td>
	</tr>
	<tr>
		<td colspan="4"><b>示例：</b>SS.isEmpty() // 返回：false</td>
	</tr>
</table>



## 当前版本包大小（取自webpack打包数据）：
min：4.8KB  
gzip：1.83KB


## TODO:
- 优化除虫
- 完善测试
- 完善数据混淆

## 更新日志：
- **20210918（version 1.0.1）：**
	* 实例方法新增isEmpty，用以判断该storage是否无数据。
- **20220908（version 1.1.1）：**
	* 加入简单的数据混淆
	* 工厂函数入参改为必填
	* 修复数据超时后isEmpty不准确的问题
	* 优化重复set入同一个字段数据时的超时逻辑（重复set入的时候，如果之前的数据未超时且没有重新输入超时时间，则默认按原设定的超时时间；如想取消之前设定的超时时间，可传入超时时间为0）
	* 优化readme和package.json
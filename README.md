# storage-awesome
**一个简单好用的storage方法库**


## 开发背景：
在开发中使用过localStorage和sessionStorage的朋友大概都会自己封装一套使用方法或者使用别人封装好的方法，而不是直接使用getItem、setItem这些原生api。

但是我在NPM上却没找到符合我使用习惯的封装库。一来可能是我检索的方法不对；二大概是因为每个人的理解不同，封装的结果也就不一样。

于是打算自己封装一套。我的诉求很简单，就是api要足够简洁好记，而功能又足够全面。

## 功能简介：
**storage-awesome** 的核心是一个工厂方法storageFactory，该方法接受两个入参，第一个入参是Storage对象，比如window.localStorage；第二个入参是字符串，对应localStorage的key，利用这一点可以实现不同的storage对象的作用域相互隔离的效果。

工厂方法产出封装好的storage对象。这个对象有has、get、set、delete、clear五个方法，包含了常用的功能。其中set、delete、clear支持链式操作。给这些方法传入不同形式的参数产出也会不一样，以此满足不同的场景。

基于工厂方法，**storage-awesome** 预设了SessionStorage和LocalStorage两个实例对象，可以直接使用。SS和LS是它们的简写。

**storage-awesome** 支持超时逻辑，支持TS，支持IE11。storageFactory的第一个入参理论上支持传入所有实现了getItem和setItem方法（参考浏览器端的Storage）的对象，所以 **storage-awesome** 理论上支持所有JS运行环境。

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
<script src='https://unpkg.com/storage-awesome@1.0.0/dist/storage-awesome.min.js'></script>
```
```javascript
const {storageFactory, SessionStorage, LocalStorage, SS, LS} = storage;
LS.clear();
```

## API:
storageFactory：

入参（按顺序）          | 类型      | 是否必填              | 默认值
----------        | -----              | ------            | ------------
Storage对象，可以是window.sessionStorage或者window.localStorage，或者其它实现了getItem和setItem方法的对象           | Storage       | 否   |  window.sessionStorage
全局key名          | string    |否       | "storageAwesome"

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
min：3.84kb  
gzip：1.43kb


## TODO:
- 优化除虫
- 优化工厂方法storageFactory的使用，调整第二个入参逻辑

## 更新日志：
- **20210918（version 1.0.1）：**
	* 实例方法新增isEmpty，用以判断该storage是否无数据。
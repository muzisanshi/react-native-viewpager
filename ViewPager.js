
/**
 *	@date:2016.06.30
 *	@author:李磊
 *	@description:这是一个基于React Native的纯JS的类似于Android的ViewPager控件，
 *	目前支持iOS和Android平台。
 */

'use strict';

import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	Easing
} from 'react-native';

var Animated = require('Animated');
var PanResponder = require('PanResponder');

var ViewPager = React.createClass({

	getInitialState: function(){
		console.log('调用了ViewPager中的getInitialState()函数');
		return {
			pageViews:this.props.pageViews,
			pageWidth:this.props.style.width/3,
			curPageIndex:0,
			lastdX: new Animated.Value(0),
			dX: new Animated.Value(0),
			factor:1/4,
		};
	},

	componentWillMount: function(){
		console.log('调用了ViewPager里的componentWillMount()函数');
		// 用于获取手势的触摸点的X、Y的偏移量等
		this.panResponder = PanResponder.create({
			// View可以监听触摸事件
			onStartShouldSetPanResponder:function(){
				console.log('调用了onStartShouldSetPanResponder()函数');
				return true;
			},
			// 监听触摸开始事件
			onPanResponderGrant:function(evt, gestureState){
				console.log('调用了onPanResponderGrant()函数');
			},
			//监听触摸移动事件
			onPanResponderMove: (function(evt, gestureState){
				console.log('调用了onPanResponderMove()函数');
				console.log('gestureState.dx的值是：' + gestureState.dx);
				// 手势方向，向左为0，向右为1
				var direction = gestureState.dx < 0 ? 0 : 1;
				// 判断是否第一页往右滑动
				if(this.state.curPageIndex == 0){
					if(direction == 1){
						return;
					}
				}
				// 判断是是否是最后一页往左移
				if(this.state.curPageIndex == this.state.pageViews.length - 1){
					if(direction == 0){
						return;
					}
				}
				// 重新计算新的X坐标的Animated.Value的值
				var newDx = new Animated.Value(gestureState.dx + this.state.lastdX._value);
				this.setState({dX:newDx});

			}).bind(this),
			onPanResponderRelease:(function(evt, gestureState){
				console.log('调用了onPanResponderRelease()函数');
				console.log('gestureState.dx的最后值是：' + gestureState.dx);
				// 备份X坐标的Animated.Value值以备下次使用
				this.setState({lastdX:this.state.dX});
				// 判断是恢复还是切换
				this.flingOrBack(gestureState.dx);

			}).bind(this),
		});
	},

	animateTo:function(position){
		// 吧dX转化为Animated.Value
		console.log('当前dX的value值是：' + this.state.dX._value);
		console.log('调用了animateTo()函数,position的值是：' + position);
		// 执行定时动画
		var animater = Animated.timing(
            this.state.dX,
            {
              toValue: position,
              duration: 300,
              easing: Easing.linear,
            },
        );
		animater.start();
	},

	flingOrBack: function(dx){
		console.log('调用了flingOrBack()函数');
		// 手势方向，向左为0，向右为1
		var direction = dx < 0 ? 0 : 1;
		// 获取偏移量的绝对值
		var dxAbs = Math.abs(dx);
		if(dxAbs > this.state.pageWidth*this.state.factor){
			console.log('符合切换条件');
			// 进行切换
			if(direction == 0){
				console.log('手势方向：左');
				// 判断是否是最后一页
				if(this.state.curPageIndex != this.state.pageViews.length - 1){
					// 计算左滑一页后的X坐标位置
					var position = -(this.state.curPageIndex + 1)*this.state.pageWidth;
					// 计算下一页的Index的值
					var index = this.state.curPageIndex + 1;
					// 执行滑动的动画
					this.animateTo(position);
					// 保存下一页的Index值
					this.setState({curPageIndex:index});
				}
			}else if(direction == 1){
				console.log('手势方向：右');
				// 判断是否是第一页
				if(this.state.curPageIndex != 0){
					var position2 = -(this.state.curPageIndex - 1)*this.state.pageWidth;
					var index = this.state.curPageIndex - 1;
					this.animateTo(position2);
					this.setState({curPageIndex:index});
				}
			}
		}else{
			console.log('不符合切换条件');
			// 恢复原来状态
			var position3 = -this.state.curPageIndex*this.state.pageWidth;
			// 执行恢复动画
			this.animateTo(position3);
		}
	},
	
	render: function(){
		console.log('调用了render()函数');
		// 这里把View设置为可响应触摸事件
		return (
			<Animated.View 
				{...this.panResponder.panHandlers} 
				style={[styles.wrapViewStyle,this.props.style,{transform:[
					{translateX:this.state.dX}
				]}]}>

				{this.state.pageViews}
			</Animated.View>
		);
	},
});

// 样式
const styles = StyleSheet.create({
	wrapViewStyle:{
		flexDirection:'row',
		backgroundColor:'#ffffff',
	}
});

module.exports = ViewPager;
# react-native-viewpager
This is a React Native component like ViewPager on Android that supports iOS and Android platforms.

# Usage

var ViewPager = require('xxx/ViewPager.js');

render(){

    console.log('调用了renderPage()函数');
    var pageWidth = this.state.screenWidth;
    var pageHeight = this.state.screenHeight-51;

    var page1 = <View key='1' style={{width:pageWidth,height:pageHeight,backgroundColor:'#00ffff'}}></View>;
    var page2 = <View key='2' style={{width:pageWidth,height:pageHeight,backgroundColor:'#ff00ff'}}></View>;
    var page3 = <View key='3' style={{width:pageWidth,height:pageHeight,backgroundColor:'#ffff00'}}></View>;
    var pages = [page1,page2,page3];
    
    if(this.state.isShow){
      return (
        <View style={{backgroundColor:'#0000ff',flexDirection:'column',flex:1}}>
          <ViewPager 
            style={{width:pageWidth*3,height:pageHeight}}
            pageViews={pages}>
          </ViewPager>
        </View>
      );
    }else{
      return null;
    }
}

module.exports = {
  devServer: {
    proxy: 'http://3.37.186.158:1004',
    
    // vue에서 일부 코드가 잘못 되었을 때 아예 화면 자체가 실행이 안되는걸 막음
    // overlay : false,
  }
}

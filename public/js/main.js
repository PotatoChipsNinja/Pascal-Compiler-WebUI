const app = new Vue({
  el: '#app',
  data: {
    source: '',
    info: '',
    code: '',
    submitted: false,
    hasResult: false,
    chart: null,
    hasAST: false,
    option: null,
    chartStyle: {
      width: document.body.clientWidth + "px",
      height: document.body.clientHeight*1 + "px",
      margin: "-5% -20%"
    }
  },
  mounted: function() {
    this.chart = echarts.init(document.getElementById('tree'))
    this.option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [],
          symbolSize: 10,  // 节点大小
          label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',  // 非叶节点标签在右侧
              fontSize: 15     // 节点文字大小
          },
          leaves: {
              label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'  // 叶节点标签在右侧
              }
          },
          emphasis: {
              focus: 'descendant'  // 鼠标悬浮时只聚焦子孙节点
          },
          expandAndCollapse: true,  // 自动折叠
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    }
  },
  methods: {
    reload: function() {
      location.reload()
    },
    openFile: function() {
      this.$refs.inputFile.click()
    },
    selectFile: function() {
      let reader = new FileReader()
      reader.readAsText(this.$refs.inputFile.files[0], "UTF-8")
      reader.onload = (event) => {
        let fileString = event.target.result
        this.source = fileString
      }
    },
    clear: function() {
      this.source = ''
    },
    submit: function() {
      this.submitted = true
      axios.get("/compile", {
        params: { program: this.source }
      }).then((res) => {
        this.info = res.data.info
        this.code = res.data.code
        if(res.data.ast) {
          this.hasAST = true
          this.option.series[0].data = [res.data.ast]
          this.chart.setOption(this.option)
        }
        this.hasResult = true
        setTimeout("Prism.highlightAll()", 200)
      }).catch((err) => {
        console.log(err)
        this.$message.error('与服务器连接出错')
      })
    }
  }
})
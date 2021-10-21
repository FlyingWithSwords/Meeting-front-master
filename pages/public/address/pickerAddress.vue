<template>
    <picker @change="bindPickerChange" @columnchange="columnchange" :range="array" range-key="name" :value="value" mode="multiSelector">
        <slot></slot>
    </picker>
</template>

<script>
	var objstr = "";
    let selectVal = ['','',''];
    
    export default {
        data() {
            return{
				allAddress: [],
                value: [0,0],
                array: [],
                index: 0
            }
        },
        created() {
            this.initSelect();
        },
        methods:{
			changelist(){
				uni.request({
						url: 'http://mikv9s.natappfree.cc/sys/dict/info/provCity', //接口地址。
						header: {
							'custom-header': 'hello' //自定义请求头信息
						},
						success: function(res) {
							objstr = "[";
							var datalist = res.data.page.list;
							for(var i=0;i<datalist.length;i++){
								objstr+="{name"+": '"+datalist[i].value+"',city:[{";
								for(var j=0;j<datalist[i].citys.length;j++){
									objstr+="name: '"+datalist[i].citys[j].value+"'";
									if(j!=datalist[i].citys.length-1){
										objstr+="},{";
									}
									else{
										objstr+="}]";
									}
								}
								if(i!=datalist.length-1){
									objstr+=", ";
								}
							}
							objstr+="}]";
							this.allAddress=objstr;
							console.log(eval("("+objstr+")"));
							console.log('request success');
						}.bind(this),
						fail: (res) => {
							console.log(res.data);
							console.log('request failure');
						}
					});
			},
            // 初始化地址选项
            initSelect() {
				console.log(this.allAddress)
                this.updateSourceDate() // 更新源数据
                .updateAddressDate() // 更新结果数据
                .$forceUpdate()  // 触发双向绑定
            },
            // 地址控件改变控件
            columnchange(d) {
                this.updateSelectIndex(d.detail.column, d.detail.value) // 更新选择索引
                .updateSourceDate() // 更新源数据
                .updateAddressDate() // 更新结果数据
                .$forceUpdate()  // 触发双向绑定
            },
            
            /**
             * 更新源数据
             * */
            updateSourceDate() {
                this.array = []
                this.array[0] = this.allAddress.map(obj => {
                    return {
                        name: obj.name
                    }
                })
                this.array[1] = this.allAddress[this.value[0]].city.map(obj => {
					console.log(obj);
                    return {
                        name: obj.name
                    }
                })
                // this.array[2] = AllAddress[this.value[0]].city[this.value[1]].area.map(obj => { 
                //     return {
                //         name: obj
                //     }
                // })
                return this
            },
            
            /**
             * 更新索引
             * */
            updateSelectIndex(column, value){
                let arr = JSON.parse(JSON.stringify(this.value)) 
                arr[column] = value
                if(column === 0 ) {
                    arr[1] = 0
                }
                this.value = arr
                return this
            },
            
            /**
             * 更新结果数据 
             * */
            updateAddressDate() {
                selectVal[0] = this.array[0][this.value[0]].name
                selectVal[1] = this.array[1][this.value[1]].name 
                // selectVal[2] = this.array[2][this.value[2]].name 
                return this
            },
            
            /**
             * 点击确定
             * */
            bindPickerChange(e) {
                this.$emit('change', {
                    index: this.value,
                    data: selectVal
                })
                return this
            }
        }
		
    }
</script>

<style>
</style>

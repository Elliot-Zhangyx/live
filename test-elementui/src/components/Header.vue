<template>
    <div style="font-size: 12px;line-height: 60px;display: flex;">
        <div style="flex:1;">
            <span :class="collapseBtnClass" style="cursor: pointer;font-size: 18px;" @click="collapse"></span>

            <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
                <el-breadcrumb-item :to="'/home'">首页</el-breadcrumb-item>
                <!-- <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item> -->
            </el-breadcrumb>
        </div>
        <el-dropdown style="width: 150px;cursor: pointer;text-align: right">
          <div style="display: inline-block">
            <img :src="user.avatarUrl" alt="" style="width: 30px;border-radius: 50%;position: relative;top: 10px;right:5px">
            <!-- <span>{{user.nickname}}</span>  <i class="el-icon-arrow-down" style="margin-left: 5px"></i> -->
          </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center;top: 5px ">
                <el-dropdown-item style="font-size: 14px;padding: 5px 0" @click.native="password">修改密码
                  <!--                 <router-link to="/person">个人信息</router-link>-->
                </el-dropdown-item>
                <el-dropdown-item style="font-size: 14px;padding: 5px 0" @click.native="person">个人信息
<!--                 <router-link to="/person">个人信息</router-link>-->
                </el-dropdown-item>
                <el-dropdown-item style="font-size: 14px;padding: 5px 0">
                  <span style="text-decoration: none" @click="logout">退出</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: "",
        props:{
            collapseBtnClass:String,
            collapse:Function,
        },
        computed: {
            currentPathName () {
                //return this.$store.state.currentPathName;　　//需要监听的数据
            },
            user(){
                //return this.$store.state.user;
            }
        },
        watch: {
            currentPathName (newVal, oldVal) {
                console.log(newVal)
            },
            user(newVal, oldVal){
              console.log(newVal)
            }
        },
      data(){
          return{
             // user : this.$store.state.user
          }
      },
      methods:{
          logout(){
            // this.$store.commit("logout")
            // this.$message.success("退出成功")
          },
          person(){
            // this.$router.push("/person",() => {})
          },
          password(){
            // this.$router.push("/password",() => {})
          }
      },
    }
</script>

<style scoped>


</style>

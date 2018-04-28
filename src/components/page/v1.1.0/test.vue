  <yd-layout >
    <v-topbar :title="titleAttr" slot="navbar">
      <router-link :to="{path:'/search'}">
        <span id="opt" style="right:0.3rem">
        <yd-icon name="search" size=".3rem" color="#fff"></yd-icon>
      </span>
      </router-link>
    </v-topbar>

    <v-navbar slot="tabbar"></v-navbar>
  </yd-layout>
</template>

<script>
  import VNavbar from './../../base/navBar.vue'
  import VTopbar from './../../base/topBar.vue'
  export default {
    data () {
    return {
      titleAttr: {'isShow': false, 'name': '老友码头'},
    }
  },
    components: {
      VTopbar,
      VNavbar
    }
  }
</script>

<style>

</style>

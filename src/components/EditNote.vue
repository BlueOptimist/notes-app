<template>
  <div id="edit-note">
    <h3>Edit Note</h3>
    <div class="row">
      <form @submit.prevent="updateNote" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="title" required />
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="content" required />
          </div>
        </div>
        <router-link to="/" class="btn grey">Cancel</router-link>
        <button type="submit" class="btn">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
const db = firebase.firestore();
export default {
  name: "view-note",
  data() {
    return {
      note_id: null,
      title: null,
      content: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("notes")
      .where("note_id", "==", to.params.note_id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          next((vm) => {
            vm.note_id = doc.data().note_id;
            vm.title = doc.data().title;
            vm.content = doc.data().content;
            vm.status = doc.data().status;
          });
        });
      });
  },
  watch: {
    $route: "fetchData",
  },
  methods: {
    fetchData() {
      db.collection("notes")
        .where("note_id", "==", this.$route.params.note_id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.note_id = doc.data().note_id;
            this.title = doc.data().title;
            this.content = doc.data().content;
            this.status = doc.data().status;
          });
        });
    },
    updateNote() {
      db.collection("notes")
        .where("note_id", "==", this.$route.params.note_id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              doc.ref.update({
                 title: this.title,
                 content: this.content
              }).then( () => {
                  this.$router.push({name: 'view-note', params: {note_id: this.note_id}})
              })
          });
        });
    },
  },
};
</script>
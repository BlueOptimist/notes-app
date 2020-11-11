<template>
  <div id="view-note">
    <ul class="collection with-header">
      <li class="collection-header">
        <h5>{{ title }}</h5>
      </li>
      <li class="collection-item">{{ content }}</li>
    </ul>
    <router-link to="/" class="btn grey">Back</router-link>
    <button @click="deleteNote" class="btn red">Delete</button>
    <router-link
      v-bind:to="{ name: 'edit-note', params: { note_id: note_id } }"
      class="btn orange"
      >Edit</router-link
    >
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
    deleteNote() {
      if (confirm("Are you sure?")) {
        db.collection("notes")
          .where("note_id", "==", this.$route.params.note_id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete().then((docRef) => this.$router.push("/"));
            });
          });
      }
    },
  },
};
</script>
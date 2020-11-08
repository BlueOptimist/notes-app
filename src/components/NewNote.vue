<template>
  <div id="new-note">
    <h3>New Note</h3>
    <div class="row">
      <form @submit.prevent="saveNote" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="title" required />
            <label for="">Title</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="content" required />
            <label for="">Content</label>
          </div>
        </div>
        <router-link to="/" class="btn grey">Cancel</router-link>
        <button type="submit" class="btn">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import db from "./firebaseInit";
export default {
  name: "new-note",
  data() {
    return {
      title: null,
      content: null,
      status: null,
    };
  },
  methods: {
    saveNote() {
      db.collection("notes")
        .add({
          note_id: this._uid,
          title: this.title,
          content: this.content,
          status: false,
        })
        .then((docRef) => this.$router.push("/"))
        .catch((error) => console.log(err));
    },
  },
};
</script>
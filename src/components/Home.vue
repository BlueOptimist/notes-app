<template>
  <div id="dashboard">
    <router-link to="/new" class="btn grey add"> Write a note </router-link>
    <ul class="collection with-header">
      <li class="collection-header">
        <h5>Notes</h5>
        <label>
          <input
            name="group1"
            type="radio"
            v-model="selectedCategory"
            value="All"
            checked
          />
          <span class="black-text">All</span>
        </label>
        <label>
          <input
            name="group1"
            type="radio"
            v-model="selectedCategory"
            value="false"
          />
          <span class="black-text">Pending</span>
        </label>
        <label>
          <input
            name="group1"
            type="radio"
            v-model="selectedCategory"
            value="true"
          />
          <span class="black-text">Finished</span>
        </label>
      </li>
      <li
        v-for="note in filteredNotes"
        v-bind:key="note.id"
        class="collection-item"
      >
        <label>
          <input
            type="checkbox"
            class="filled-in"
            :checked="note.status"
            v-on:change="isCompleted(note.note_id, $event)"
          />
          <span class="black-text">{{ note.title }}</span>
        </label>
        <router-link
          class="secondary-content"
          v-bind:to="{ name: 'view-note', params: { note_id: note.note_id } }"
        >
          <i class="fa fa-eye"></i>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import db from "./firebaseInit";
export default {
  name: "dashboard",
  data() {
    return {
      selectedCategory: "All",
      notes: [],
    };
  },
  created() {
    db.collection("notes")
      .orderBy("title")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            note_id: doc.data().note_id,
            title: doc.data().title,
            status: doc.data().status,
          };
          this.notes.push(data);
        });
      });
  },
  computed: {
    filteredNotes: function () {
      var category = this.selectedCategory;
      if (category == "All") {
        return this.notes;
      } else if (category == "false") {
        return this.notes.filter(function (note) {
          return note.status === false;
        });
      } else if (category == "true") {
        return this.notes.filter(function (note) {
          return note.status === true;
        });
      }
    },
  },
  methods: {
    isCompleted(note_id, e) {
      var isChecked = e.target.checked;
      db.collection("notes")
        .where("note_id", "==", note_id)
        .get()
        .then((querySnapshot) => {
          this.notes = [];
          querySnapshot.forEach((doc) => {
            doc.ref
              .update({
                status: isChecked,
              })
              .then(() => {
                db.collection("notes")
                  .orderBy("title")
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      const data = {
                        id: doc.id,
                        note_id: doc.data().note_id,
                        title: doc.data().title,
                        status: doc.data().status,
                      };
                      this.notes.push(data);
                    });
                  });
              });
          });
        });
    },
  },
};
</script>
<style scoped>
.add {
  margin-top: 10px;
}
</style>
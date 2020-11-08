<template>
  <div id="dashboard">
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>Notes</h4>
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
    <div class="fixed-action-btn">
      <router-link to="/new" class="btn-floating btn-large red">
        <i class="fa fa-plus"></i>
      </router-link>
    </div>
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
      var vm = this;
      var category = vm.selectedCategory;
      if (category == "All") {
        return vm.notes;
      } else if (category == "false") {
        return vm.notes.filter(function (note) {
          return note.status === false;
        });
      } else if (category == "true") {
        return vm.notes.filter(function (note) {
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
          querySnapshot.forEach((doc) => {
            doc.ref
              .update({
                status: isChecked,
              })
              .then(() => {
                this.$router.go({ path: this.$router.path });
              });
          });
        });
    },
    fetchData() {
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
  },
};
</script>
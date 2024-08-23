<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const newBookmark = ref("")
const newName = ref("")
const newBio = ref("")
const newPage = ref("")
const message = ref("")


const { pending, data: bookmarks } = useAsyncData(async () =>
  $fetch("/api/bookmarks?userId=" + localStorage.getItem('userId')))

const { data: pages } = useAsyncData(async () =>
  $fetch("/api/pages?userId=" + localStorage.getItem('userId')))

const { data: bios } = useAsyncData(async () =>
  $fetch("/api/bio?userId=" + localStorage.getItem('userId')))


const addBookmark = async () => {
  message.value = "";
  if (bookmarks.value == null) return;
  if (newBookmark.value == "") return;
  if (newName.value == "") return;

  const bookmark = await $fetch('/api/bookmarks/create', {
  method: 'post',
  body: {
    url: newBookmark.value,
    userId: localStorage.getItem('userId'),
    name: newName.value, // Ensure this is passed correctly
  }
});

// @ts-ignore
  bookmarks.value.push(bookmark);
  newBookmark.value = "";
  newName.value = "";
}

const addBio = async () => {
  message.value = "";
  if (bios.value == null) return;
  if (newBio.value == "") return;

  const bio = await $fetch('/api/bio/create', {
    method: 'post',
    body: {
      bios: newBio.value,
      id: localStorage.getItem('userId'),
    }
  });

  // Update local state
  if (bios.value && bios.value.length > 0) {
    bios.value[0].bio = newBio.value; // Update existing bio
  } else {
    bios.value = [{ bio: newBio.value }]; // Add new bio if none existed
  }

  newBio.value = "";
  
}




const fetchBio = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const response = await fetch('/api/getBio?userId=' + userId);
      const data = await response.json();
      newBio.value = data[0]?.bio ?? ''; // Assuming the API returns an array
    }
  } catch (error) {
    console.error('Error fetching bio:', error);
  }
};

onMounted(fetchBio);





const addPages = async () => {
  message.value = "";
  if (pages.value == null) return;
  if (newPage.value == "") return;

  const page = await $fetch('/api/pages/create', {
    method: 'post',
    body: {
      title: newPage.value,
      user_id: localStorage.getItem('userId')
    }
  });
// @ts-ignore

if (page){
  localStorage.setItem('test', page.title)

}


  pages.value.push(page);
  newPage.value = "";

  // await navigateTo('/dashboard/page1/' + page.id)
}

const editPage = async () => {

}

// const deletePage = async (id: string) => {
//   if (pages.value == null) return;
//   if (id == "") return;

//   // Ensure that id is a valid number 
//   // @ts-ignore
//   if (isNaN(id)) {
//     console.error('Invalid page ID provided.');
//     return;
//   }

//   try {
//     // Call the deletePage function with the validated page ID
//     const response = await $fetch('/api/pages/delete', {
//       method: 'post',
//       body: {
//         id: id,
//       },
//     });

//     // Display response.message somehow
//     // message.value = response.message;

//     // Remove the deleted page from the pages list
//     // @ts-ignore
//     pages.value = pages.value.filter((page) => page.id !== id);
//   } catch (error) {
//     console.error('Error deleting page:', error);
//     // Handle the error and show an error message to the user
//   }
// }

//function that deletes a bookmark
const deletePage = async (id: number) => {
  if (pages.value == null) return;
  // if (id == "") return;

  const response = await $fetch('/api/pages/delete', {
    method: 'post',
    body: {
      id: id,
    }
  });

  // display response.message somehow
  message.value = response.message;
// @ts-ignore
  pages.value = pages.value.filter(page => page.id !== id);
}



const deleteBookmark = async (id: string) => {
  if (bookmarks.value == null) return;
  if (id == "") return;

  const response = await $fetch('/api/bookmarks/delete', {
    method: 'post',
    body: {
      id: id,
    }
  });

  // display response.message somehow
  // message.value = response.message;
// @ts-ignore
  bookmarks.value = bookmarks.value.filter(bookmark => bookmark.id !== id);
}


// Check if the localStorage item "isLoggedIn" is true or false
function checkIsLoggedInLocalStorage () {
  if (typeof localStorage === 'undefined') {
    return null; // localStorage is not available
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === "true") {
    return true;
  } else if (isLoggedIn === "false") {
    return false;
  } else {
    return null; // The item is not set or has an invalid value
  }
}





// Usage example:
const isLoggedInValue = checkIsLoggedInLocalStorage();

if (isLoggedInValue === true) {
  console.log("The user is logged in.");


  ;
} else if (isLoggedInValue === false) {
  console.log("The user is not logged in.")
  // await navigateTo('/login')


} else {
  console.log("The isLoggedIn in localStorage is not set or has an invalid value.");
  // await navigateTo('/login')


}

const storedUsername = localStorage.getItem('username');

</script>


<template>
  <main class="container">
    <form class="bookmark-form" @submit.prevent>

      <!-- <div class="flex justify-center items-center">
          <img class="w-32 h-32 rounded-full overflow-hidden " src="pfp.jpg" alt="">
      </div> -->
      <div>
        <div class="container mt-10">
          <div class="flex justify-center items-center">

            <img class="w-32 h-32 rounded-full overflow-hidden mt-12"  :src="image || 'pfp.jpg'" alt="">
          </div>
          <div class="">
            <button @click="togglepfp" class="text-gray-700" style="font-size: 20px;">{{ inputmenu ? '⊗' : ' ✎' }}</button>
            
            <ul class="trans " :class="{ 'active': inputmenu }">
            <input @change="handleImage" type="file" accept="image/*" class="text-gray-800">
            </ul>

            
          </div>
        </div>
      </div>




      <div class="absolute mt-40 right-72 bg-gray-200 p-4 rounded-xl hidden sm:grid">
<div class="flex text-black justify-center items-center">
  <p>View your page here!</p>
</div>
  <div class="flex justify-center items-center mt-3">
    <a :href="`/${storedUsername}`" class=" bg-gray-300 text-black hover:bg-gray-400 rounded-xl py-2 px-2.5">socify.no/<b>{{ storedUsername }}</b></a>
  </div>
</div>


      <!-- display username of user -->
      <h1 class="text-center text-2xl text-black font-bold">{{ storedUsername }}</h1>
      <!-- <p class="text-xs text-center text-gray-700">{{ bios }}</p> -->
      <p class="text-s text-center cursor-pointer text-gray-700 " @click="togglebio">
  {{
    bios && bios.length > 0 && bios[0].bio ? bios[0].bio : 'no biograpy'
    
  }} {{ biomenu ? ' ⊗' : ' ✎' }}</p>
  <!-- <button @click="togglebio" class="text-gray-700" style="font-size: 17px;">{{ biomenu ? '⊗' : ' ✎' }}</button> -->


      <ul class="trans " :class="{ 'active': biomenu }">
              
              <input v-model="newBio" type="text" name="bio" id="bio" placeholder="add bio here">  <br>
              <button class="bg-gray-300 text-black hover:bg-gray-400" @click="addBio(), togglebio()">Save</button>
       
            </ul>

<br>



      <input v-model="newBookmark" type="url" name="url" id="url" class="bg-white" placeholder="Add your links here" />
      <input v-model="newName" type="text" name="name" id="text" class="bg-white" placeholder="Pagename" />

      <button class="bg-gray-300 text-black hover:bg-gray-400" @click="addBookmark">Add</button>
      <!-- <NuxtLink :to="`/dashboard/page1/${page.id}`"  @click="addBookmark" class="bg-gray-300 hover:bg-gray-400">Add</NuxtLink> -->

    </form>
    <!-- <div>{{ newBookmark }}</div> -->
    <!-- <div class="flex justify-center items-center" v-if="message">{{ message }}</div> -->
    <div class="flex justify-center items-center" v-if="pending">Loading...</div>

    <div class="flex justify-center items-center" v-else-if="bookmarks && bookmarks.length > 0">
      <ol>
        <li class="bookmark-list--item" v-for="bookmark in bookmarks" :key="bookmark.id">
          <div class="flex">
            <div class="flex-none w-24 h-14"></div>
            <div class="flex-initial w-64">
              <a class="bookmark-link bg-gray-200 hover:bg-gray-300 text-white px-3 py-2 rounded-md text-sm inline-block"
                :href="bookmark.url" target="_blank" rel="noopener noreferrer">
                <img :src="bookmark.icon_url" />
                {{ bookmark.name }}
              </a>
            </div>
            <div class=" absolute">
              <button class="bg-red-400 text-black hover:bg-red-500 rounded px-1 py-4 text-xs absolute left-10 inline-block"
                @click="deleteBookmark(bookmark.id)">Delete</button>
            </div>
          </div>

        </li>
      </ol>

    </div>
  

    <div class="flex justify-center items-center text-gray-900 text-sm" v-else>No links yet...</div>
    <hr><br>
    <div class=" bg-gray-200 p-4 rounded-xl mr-8 ml-8 sm:hidden">
<div class="flex text-black justify-center items-center">
  <p>View your page here!</p>
</div>
  <div class="flex justify-center items-center mt-3">
    <a :href="`/${storedUsername}`" class=" bg-gray-300 text-black hover:bg-gray-400 rounded-xl py-2 px-2.5">socify.no/<b>{{ storedUsername }}</b></a>
  </div>

  <br><hr>
</div>

<br>
<button @click="toggleMenu" class="hamburger-button py-2 px-3 bg-gray-300 rounded text-black hover:bg-gray-400 mb-14">{{ isMenuOpen ? 'close' : ' my pages' }}</button>

<ul class="trans" :class="{ 'active': isMenuOpen }">

  <div>
    <form class="bookmark-form" @submit.prevent>
      <input v-model="newPage" type="text" name="newpage" id="newpage" class="bg-white" placeholder="Add page here" />
      <button class="bg-gray-300 text-black hover:bg-gray-400" @click="addPages">Add</button>
    </form>
    <!-- <div class="flex justify-center items-center" v-if="message">{{ message }}</div> -->
    <div class="flex justify-center items-center" v-if="pending">Loading...</div>

    <div class="flex justify-center items-center" v-else-if="pages && pages.length > 0">
      <ul class="trans" :class="{ 'active': isMenuOpen }">
        <li class="bookmark-list--item" v-for="page in pages" :key="page.id">
          <div class="flex">
            <div class="flex-none w-24 h-14"></div>
            <div class="flex-initial w-64">
              <a class="bookmark-link bg-gray-200 hover:bg-gray-300 text-white px-3 py-3 rounded-md text-sm inline-block"
                :href="/p/ + page.title" target="_blank" rel="noopener noreferrer">
                
                {{ page.title }}
              </a>
            </div>

            
            <div class="flex-initial w-32 absolute">
  
  <NuxtLink :to="`/dashboard/page1/${page.id}`" class="bg-gray-400 text-black hover:bg-gray-500 absolute rounded px-3 py-4 text-xs inline-block">Edit links</NuxtLink>
  
  <button class="hidden sm:flex bg-red-400 text-black hover:bg-red-500 rounded px-1 py-4 text-xs ml-20 absolute left-64"
  @click="deletePage(page.id)">Delete</button>
  
</div>

                <button class="sm:hidden bg-red-400 hover:bg-red-500 rounded px-1 py-4 text-xs right-8 absolute"
                @click="deletePage(page.id)">Delete</button>
                
            
          </div>

        </li>
      </ul>

    </div>
</div>
</ul>


  </main>
</template>

<script lang="ts">
export default {
  // middleware: 'auth',
  name: 'home',
  data() {
    return {
      image: '',
      inputUsername: '',
      isMenuOpen: false,
      inputmenu: false,
      biomenu: false,
    }
  },

  methods: {
    toggleMenu() {
      // @ts-ignore
      this.isMenuOpen2 = false;
      this.isMenuOpen = !this.isMenuOpen;
      },

      togglepfp() {
      // @ts-ignore
      this.inputmenu = !this.inputmenu;

      },
      togglebio() {
      // @ts-ignore
      this.biomenu = !this.biomenu;
      },

    async searchuser() {
      const usr = await $fetch('/api/user/search', {
        method: 'post',
        body: {
          name: this.inputUsername,
        }
      })
    },
    handleImage(e) {
      const file = e.target.files[0];
      this.createBase64Image(file);
      console.log(file);
    },
    // @ts-ignore
    createBase64Image(fileObject) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // @ts-ignore
        this.image = e.target.result;// @ts-ignore
        console.log(image);
      };
      reader.readAsDataURL(fileObject);

    },
  }
}
</script>

<style scoped>

.hamburger-button {
  cursor: pointer;
}
ul {
  list-style-type: none;
  display: none;
}
ul.active {
  display: block;
}


* {
  font-family: sans-serif;
}

.container {
  max-width: max(95vh, 600px);
  margin-inline: auto;
}


.container .bookmark-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 50px;
}

.b ,
.b  {
  padding: 0.5em;
  width: 100px;
}
.bookmark-form input,
.bookmark-form button {
  padding: 0.5em;
  width: 300px;
}


.bookmark-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.bookmark-list--item img {
  aspect-ratio: 1;
  width: 32px;
  height: 32px;
  /* border-radius: 100%; */
  transition: all 100ms linear;
}

.bookmark-list--item {
  margin-block: 10px;
}

.bookmark-list--item:hover img {
  border-radius: 3px;
  scale: 1.15;

}


.bookmark-list--item a {
  text-decoration: none;
  font-size: 0.75rem;
  color: rgb(0, 0, 0);
  display: flex;
  align-items: center;
  gap: 10px;
}</style>


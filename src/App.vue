<template>
  <div>
    <!-- Auth Block -->
    <div>
      <div v-if="!beverageStore.user">
        <button @click="withGoogle">Sign in with Google</button>
      </div>

      <div v-else>
        <p>Signed in as {{ beverageStore.user.email }}</p>
        <button @click="logout">Sign out</button>
      </div>

      <p>{{ message }}</p>

      <div v-if="beverageStore.user && beverageStore.beverages.length">
        <h3>Your Saved Beverages</h3>
        <div v-for="b in beverageStore.beverages" :key="b.id">
          <input 
            type="radio" 
            name="bev" 
            :value="b" 
            v-model="beverageStore.currentBeverage"
            @change="beverageStore.showBeverage()"
          />
          {{ b.name }}
        </div>
      </div>
    </div>

    <!-- Beverage Preview -->
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />

    <!-- Temperature -->
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
              :disabled="!beverageStore.user"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Base -->
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
              :disabled="!beverageStore.user"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Syrup -->
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
              :disabled="!beverageStore.user"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Creamer -->
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
              :disabled="!beverageStore.user"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Name input -->
    <input
      v-model="beverageStore.currentName"
      type="text"
      placeholder="Beverage Name"
      :disabled="!beverageStore.user"
    />

    <button 
      @click="handleMakeBeverage"
      :disabled="!beverageStore.user"
    >
      🍺 Make Beverage
    </button>

    <p v-if="message" class="status-message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

const beverageStore = useBeverageStore();
beverageStore.init();

const message = ref("");

const showMessage = (txt: string) => {
  message.value = txt;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

async function withGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    beverageStore.setUser(result.user);
  } catch (err: any) {
    message.value = err.message;
  }
}

function logout() {
  signOut(auth);
  beverageStore.setUser(null);
}

const handleMakeBeverage = () => {
  const txt = beverageStore.makeBeverage();
  showMessage(txt);
};

// Keep store in sync with Firebase Auth
onAuthStateChanged(auth, user => {
  beverageStore.setUser(user);
});
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}

ul {
  list-style: none;
}

.auth-row {
  margin-top: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-label {
  color: #ffffff;
  font-size: 0.9rem;
}

.hint {
  margin-top: 4px;
  color: #ffffff;
  font-size: 0.85rem;
}

.status-message {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  font-size: 0.9rem;
}
</style>
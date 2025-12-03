import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";

import tempretures from "../data/tempretures.json";
import bases from "../data/bases.json";
import syrups from "../data/syrups.json";
import creamers from "../data/creamers.json";

import { auth, db } from "../firebase";

import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import type { User } from "firebase/auth";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],

    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,

    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,

    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,

    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,

    currentName: "",
    user: null as User | null,
    snapshotUnsubscribe: null as Unsubscribe | null,
  }),

  actions: {
    async init() {
      // Load bases
      const baseCollection = collection(db, "bases");
      const baseSnap = await getDocs(baseCollection);

      if (baseSnap.empty) {
        for (const b of bases) {
          await setDoc(doc(db, `bases/${b.id}`), {
            name: b.name,
            color: b.color,
          });
        }
        this.bases = bases;
      } else {
        this.bases = baseSnap.docs.map((qd: QueryDocumentSnapshot) => ({
          id: qd.id,
          name: qd.data().name,
          color: qd.data().color,
        })) as BaseBeverageType[];
      }
      this.currentBase = this.bases[0];

      // Load syrups
      const syrupCollection = collection(db, "syrups");
      const syrupSnap = await getDocs(syrupCollection);

      if (syrupSnap.empty) {
        for (const s of syrups) {
          await setDoc(doc(db, `syrups/${s.id}`), {
            name: s.name,
            color: s.color,
          });
        }
        this.syrups = syrups;
      } else {
        this.syrups = syrupSnap.docs.map((qd: QueryDocumentSnapshot) => ({
          id: qd.id,
          name: qd.data().name,
          color: qd.data().color,
        })) as SyrupType[];
      }
      this.currentSyrup = this.syrups[0];

      // Load creamers
      const creamerCollection = collection(db, "creamers");
      const creamerSnap = await getDocs(creamerCollection);

      if (creamerSnap.empty) {
        for (const c of creamers) {
          await setDoc(doc(db, `creamers/${c.id}`), {
            name: c.name,
            color: c.color,
          });
        }
        this.creamers = creamers;
      } else {
        this.creamers = creamerSnap.docs.map((qd: QueryDocumentSnapshot) => ({
          id: qd.id,
          name: qd.data().name,
          color: qd.data().color,
        })) as CreamerType[];
      }
      this.currentCreamer = this.creamers[0];
    },

    showBeverage() {
      if (!this.currentBeverage) return;
      this.currentName = this.currentBeverage.name;
      this.currentTemp = this.currentBeverage.temp;
      this.currentBase = this.currentBeverage.base;
      this.currentSyrup = this.currentBeverage.syrup;
      this.currentCreamer = this.currentBeverage.creamer;
    },

    async makeBeverage() {
      if (!this.user) return;
      const uid = this.user.uid;

      const beverageRef = doc(
        db,
        `users/${uid}/beverages/${this.currentName}`
      );

      await setDoc(beverageRef, {
        name: this.currentName,
        temp: this.currentTemp,
        base: this.currentBase,
        syrup: this.currentSyrup,
        creamer: this.currentCreamer,
      });

      console.log("Saved beverage for:", uid);
    },

    setUser(user: User | null) {
      this.user = user;

      if (this.snapshotUnsubscribe) {
        this.snapshotUnsubscribe();
        this.snapshotUnsubscribe = null;
      }

      if (!user) {
        this.beverages = [];
        return;
      }

      const beverageCollection = collection(
        db,
        `users/${user.uid}/beverages`
      );

      this.snapshotUnsubscribe = onSnapshot(beverageCollection, (snap) => {
        this.beverages = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as BeverageType),
        }));
      });
    },
  },
});
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const StorageHelper = {
  // Save a discovered song to Firebase
  async saveDiscoveredSong(track, userId) {
    try {
      if (!userId) {
        console.log('💾 No user ID provided');
        return [];
      }

      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const existingSongs = userData.discoveredSongs || [];
        
        // Check if already exists
        const exists = existingSongs.find(song => song.id === track.id);
        if (exists) {
          console.log('💾 Song already discovered');
          return existingSongs;
        }
        
        // Add timestamp to track
        const trackWithTimestamp = {
          ...track,
          discoveredAt: new Date().toISOString()
        };
        
        // Keep only the most recent 20 songs
        const updatedSongs = [trackWithTimestamp, ...existingSongs].slice(0, 20);
        
        // Update Firebase
        await updateDoc(userDocRef, {
          discoveredSongs: updatedSongs
        });
        
        console.log('💾 Saved discovered song to Firebase:', track.name);
        return updatedSongs;
      } else {
        // Create new user document with first discovered song
        const trackWithTimestamp = {
          ...track,
          discoveredAt: new Date().toISOString()
        };
        
        await setDoc(userDocRef, {
          discoveredSongs: [trackWithTimestamp]
        }, { merge: true });
        
        console.log('💾 Created user document with first discovered song');
        return [trackWithTimestamp];
      }
    } catch (error) {
      console.error('💾 Error saving discovered song to Firebase:', error);
      return [];
    }
  },

  // Get all discovered songs from Firebase
  async getDiscoveredSongs(userId) {
    try {
      if (!userId) {
        console.log('💾 No user ID provided');
        return [];
      }

      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.discoveredSongs || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('💾 Error getting discovered songs from Firebase:', error);
      return [];
    }
  },

  // Remove a discovered song from Firebase
  async removeDiscoveredSong(trackId, userId) {
    try {
      if (!userId) {
        console.log('💾 No user ID provided');
        return [];
      }

      const existingSongs = await this.getDiscoveredSongs(userId);
      const updatedSongs = existingSongs.filter(song => song.id !== trackId);
      
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        discoveredSongs: updatedSongs
      });
      
      console.log('💾 Removed discovered song from Firebase:', trackId);
      return updatedSongs;
    } catch (error) {
      console.error('💾 Error removing discovered song from Firebase:', error);
      return [];
    }
  },

  // Clear all discovered songs from Firebase
  async clearDiscoveredSongs(userId) {
    try {
      if (!userId) {
        console.log('💾 No user ID provided');
        return [];
      }

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        discoveredSongs: []
      });
      
      console.log('💾 Cleared all discovered songs from Firebase');
      return [];
    } catch (error) {
      console.error('💾 Error clearing discovered songs from Firebase:', error);
      return [];
    }
  }
};

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const AdminPanel = ({ route, navigation }) => {
  const [adminEmail, setAdminEmail] = useState(route?.params?.adminEmail || '');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      let storedAdmin, flag;
      try {
        storedAdmin = await AsyncStorage.getItem('adminEmail');
        flag = await AsyncStorage.getItem('adminLoggedIn');
      } catch (e) {
        flag = null;
        storedAdmin = null;
      }
      if (flag === 'true' && storedAdmin) {
        setAdminEmail(storedAdmin);
        setLoadingSession(false);
        fetchUsers();
      } else {
        setLoadingSession(false);
        navigation.replace('Welcome');
      }
    };
    checkAdmin();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      snapshot.forEach(docSnap => {
        usersList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUsers(usersList);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch users');
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(u =>
    u.email && u.email.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const togglePremium = async (user) => {
    try {
      const newPremium = !user.premium;
      await updateDoc(doc(db, 'users', user.id), { premium: newPremium });
      await addDoc(collection(db, 'admin_audit_logs'), {
        adminEmail,
        userEmail: user.email || user.id,
        action: `Set premium to ${newPremium}`,
        timestamp: serverTimestamp(),
      });
      setUsers(users =>
        users.map(u => (u.id === user.id ? { ...u, premium: newPremium } : u))
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update premium/VIP');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('adminLoggedIn');
    await AsyncStorage.removeItem('adminEmail');
    navigation.replace('Welcome');
  };

  if (loadingSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191414' }}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Loading Admin Session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#191414', '#1DB954']} style={styles.backgroundGradient}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Admin Panel</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formCard}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search users by email"
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
          {loading ? (
            <Text style={styles.statusText}>Loading...</Text>
          ) : filteredUsers.length === 0 ? (
            <Text style={styles.statusText}>No users found</Text>
          ) : (
            <FlatList
              style={{ flex: 1 }} // Make FlatList fill container height to enable scrolling
              data={filteredUsers}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  <View style={styles.emailColumn}>
                    <Ionicons name="person-outline" size={16} color="#1DB954" />
                    <Text style={styles.userEmail}>{item.email || item.id}</Text>
                  </View>
                  <View style={styles.vipToggle}>
                    <Text style={styles.vipLabel}>Premium</Text>
                    <Switch
                      value={!!item.premium}
                      onValueChange={() => togglePremium(item)}
                      trackColor={{ false: "#ccc", true: "#1DB954" }}
                      thumbColor={item.premium ? "#1DB954" : "#eee"}
                    />
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  backgroundGradient: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 60 : 75,
    paddingHorizontal: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: "#fff", marginBottom: 14 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    borderRadius: 8,
    padding: 8,
  },
  logoutText: { marginLeft: 6, color: "#fff", fontWeight: "600", fontSize: 16 },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginHorizontal: 60,
    marginTop: 18,
    height: 600, // Fixed height for scrollable list area
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  searchBar: {
    fontSize: 16,
    backgroundColor: "#eaeaea",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#dadada",
    color: "#333",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 5,
  },
  emailColumn: { flexDirection: "row", alignItems: "center" },
  userEmail: { fontSize: 15, color: "#191414", marginLeft: 8, maxWidth: 300 },
  vipToggle: { flexDirection: "row", alignItems: "center", gap: 5 },
  vipLabel: { fontSize: 15, color: "#333", marginRight: 8 },
  statusText: { textAlign: "center", fontSize: 16, marginTop: 20, color: "#888", fontWeight: "600" },
});

export default AdminPanel;

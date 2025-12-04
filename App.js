import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const BASE_URL = 'https://prayer-times-api-q5c6.onrender.com';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // ← Fixed error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [dates, setDates] = useState([new Date().toISOString().split('T')[0]]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [hijriEnglish, setHijriEnglish] = useState('');
  const [hijriUrdu, setHijriUrdu] = useState('');
  const [athanFajr, setAthanFajr] = useState('');
  const [athanDhuhr, setAthanDhuhr] = useState('');
  const [athanAsr, setAthanAsr] = useState('');
  const [athanMaghrib, setAthanMaghrib] = useState('');
  const [athanIsha, setAthanIsha] = useState('');
  const [athanJuma, setAthanJuma] = useState('');
  const [jamaatFajr, setJamaatFajr] = useState('');
  const [jamaatDhuhr, setJamaatDhuhr] = useState('');
  const [jamaatAsr, setJamaatAsr] = useState('');
  const [jamaatMaghrib, setJamaatMaghrib] = useState('');
  const [jamaatIsha, setJamaatIsha] = useState('');
  const [jamaatJuma, setJamaatJuma] = useState('');
  const [iftarTime, setIftarTime] = useState('');
  const [sehriTime, setSehriTime] = useState('');
  const [newsItems, setNewsItems] = useState([{ title: '', content: '' }]);
  const [adsItems, setAdsItems] = useState([{ title: '', content: '' }]);
  const [mosqueName, setMosqueName] = useState('');
  const [address, setAddress] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerFor, setTimePickerFor] = useState('');
  const [scrollingText, setScrollingText] = useState('');
  const [scrollingTitle, setScrollingTitle] = useState('Scrolling Message');

  useEffect(() => {
    const load = async () => {
      const login = await AsyncStorage.getItem('isLoggedIn');
      if (login === 'true') setIsLoggedIn(true);
    };
    load();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Email & password required');
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        Alert.alert('Success', 'Login ho gaya bhai!');
      } else {
        Alert.alert('Error', data.error || 'Wrong email or password');
      }
    } catch {
      Alert.alert('Error', 'Server not reachable');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setShowMenu(false);
  };

  // ← YE SABSE BADI FIX — ab time 04:30 AM / 06:45 PM exactly save hoga → NaN kabhi nahi aayega
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const timeStr = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

      const setters = {
        athanFajr: setAthanFajr,
        athanDhuhr: setAthanDhuhr,
        athanAsr: setAthanAsr,
        athanMaghrib: setAthanMaghrib,
        athanIsha: setAthanIsha,
        athanJuma: setAthanJuma,
        jamaatFajr: setJamaatFajr,
        jamaatDhuhr: setJamaatDhuhr,
        jamaatAsr: setJamaatAsr,
        jamaatMaghrib: setJamaatMaghrib,
        jamaatIsha: setJamaatIsha,
        jamaatJuma: setJamaatJuma,
        iftar: setIftarTime,
        sehri: setSehriTime,
      };
      setters[timePickerFor]?.(timeStr);
    }
  };

  const showTimePickerModal = (field) => {
    setTimePickerFor(field);
    setShowTimePicker(true);
  };

  const addDate = () => {
    const next = new Date(dates[dates.length - 1]);
    next.setDate(next.getDate() + 1);
    setDates([...dates, next.toISOString().split('T')[0]]);
  };

  const removeDate = (index) => {
    if (dates.length === 1) return;
    const updated = dates.filter((_, i) => i !== index);
    setDates(updated);
    if (selectedDateIndex >= updated.length) setSelectedDateIndex(updated.length - 1);
  };

  const addNewsItem = () => setNewsItems([...newsItems, { title: '', content: '' }]);
  const addAdsItem = () => setAdsItems([...adsItems, { title: '', content: '' }]);

  const updateNewsItem = (index, field, value) => {
    const updated = [...newsItems];
    updated[index][field] = value;
    setNewsItems(updated);
  };

  const updateAdsItem = (index, field, value) => {
    const updated = [...adsItems];
    updated[index][field] = value;
    setAdsItems(updated);
  };

  const submitPrayerTimes = async () => {
    const athanTimings = { Fajr: athanFajr, Dhuhr: athanDhuhr, Asr: athanAsr, Maghrib: athanMaghrib, Isha: athanIsha, Juma: athanJuma };
    const jamaatTimings = { Fajr: jamaatFajr, Dhuhr: jamaatDhuhr, Asr: jamaatAsr, Maghrib: jamaatMaghrib, Isha: jamaatIsha, Juma: jamaatJuma };

    try {
      await fetch(`${BASE_URL}/api/namaz-end-start-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dates[selectedDateIndex],
          hijriDate: { english: hijriEnglish || 'Outside Ramadan', urdu: hijriUrdu || 'رمضان سے باہر' },
          athanTimings,
          jamaatTimings,
          iftarTime,
          sehriTime,
        }),
      });
      Alert.alert('Success', 'Prayer times uploaded — ab website pe sahi dikhega!');
    } catch {
      Alert.alert('Error', 'Upload failed');
    }
  };

  const submitNewsAds = async (type, items) => {
    for (const item of items) {
      if (item.title && item.content) {
        await fetch(`${BASE_URL}/api/news-ads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, ...item, date: dates[selectedDateIndex] }),
        });
      }
    }
    Alert.alert('Success', `${type} uploaded!`);
  };

  const submitMosqueInfo = async () => {
    if (!mosqueName || !address) return Alert.alert('Error', 'Fill mosque name & address');
    await fetch(`${BASE_URL}/api/mosque-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mosqueName, address }),
    });
    Alert.alert('Success', 'Mosque info updated!');
  };

  const submitScrollingText = async () => {
    if (!scrollingText) return Alert.alert('Error', 'Enter text');
    await fetch(`${BASE_URL}/api/news-ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'scrolling', title: scrollingTitle, content: scrollingText, date: dates[selectedDateIndex] }),
    });
    Alert.alert('Success', 'Scrolling text updated!');
  };

  if (!isLoggedIn) {
    return (
      <LinearGradient colors={['#1E3A8A', '#3B82F6', '#60A5FA']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaM6g9HGYnbnfuWivoyRv5ysROvFvgP3g7mQ&s' }} style={{ width: 120, height: 120 }} />
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 30 }}>Smart Masjid</Text>
            <View style={{ width: '100%', backgroundColor: '#fff', padding: 30, borderRadius: 25 }}>
              <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#1E40AF' }}>Admin Login</Text>
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <TouchableOpacity style={styles.authBtn} onPress={handleLogin}>
                <Text style={styles.authBtnText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f9ff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Masjid Admin Panel</Text>
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Text style={styles.menuDots}>...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 15 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Smart Masjid Dashboard</Text>

          {/* Dates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <FlatList
              horizontal
              data={dates}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.dateChip, selectedDateIndex === index && styles.activeChip]}
                  onPress={() => setSelectedDateIndex(index)}
                >
                  <Text style={[styles.chipText, selectedDateIndex === index && styles.activeChipText]}>
                    {item}
                  </Text>
                  {dates.length > 1 && (
                    <TouchableOpacity onPress={() => removeDate(index)} style={styles.remove}>
                      <Text style={styles.removeText}>×</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addDate}>
              <Text style={styles.addBtnText}>+ Add Next Date</Text>
            </TouchableOpacity>
          </View>

          {/* Hijri */}
          <View style={styles.section}>
            <TextInput style={styles.input} placeholder="Hijri English" value={hijriEnglish} onChangeText={setHijriEnglish} />
            <TextInput style={styles.input} placeholder="Hijri Urdu" value={hijriUrdu} onChangeText={setHijriUrdu} />
          </View>

          {/* Athan Times */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Athan Times</Text>
            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Juma'].map(p => (
              <TouchableOpacity key={p} style={styles.timeRow} onPress={() => showTimePickerModal(`athan${p}`)}>
                <Text style={styles.label}>{p}:</Text>
                <Text style={styles.value}>
                  {p === 'Fajr' ? athanFajr : p === 'Dhuhr' ? athanDhuhr : p === 'Asr' ? athanAsr : p === 'Maghrib' ? athanMaghrib : p === 'Isha' ? athanIsha : athanJuma || 'Tap to set'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Jamaat Times */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jamaat Times</Text>
            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Juma'].map(p => (
              <TouchableOpacity key={p} style={styles.timeRow} onPress={() => showTimePickerModal(`jamaat${p}`)}>
                <Text style={styles.label}>{p} Jamaat:</Text>
                <Text style={styles.value}>
                  {p === 'Fajr' ? jamaatFajr : p === 'Dhuhr' ? jamaatDhuhr : p === 'Asr' ? jamaatAsr : p === 'Maghrib' ? jamaatMaghrib : p === 'Isha' ? jamaatIsha : jamaatJuma || 'Tap to set'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Special Times */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Times</Text>
            <TouchableOpacity style={styles.timeRow} onPress={() => showTimePickerModal('iftar')}>
              <Text style={styles.label}>Iftar:</Text>
              <Text style={styles.value}>{iftarTime || 'Tap to set'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeRow} onPress={() => showTimePickerModal('sehri')}>
              <Text style={styles.label}>Sehri:</Text>
              <Text style={styles.value}>{sehriTime || 'Tap to set'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={submitPrayerTimes}>
            <Text style={styles.submitText}>Submit Prayer Timings</Text>
          </TouchableOpacity>

          {/* News */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>News Items</Text>
            {newsItems.map((item, i) => (
              <View key={i} style={styles.itemBox}>
                <TextInput style={styles.input} placeholder="Title" value={item.title} onChangeText={t => updateNewsItem(i, 'title', t)} />
                <TextInput style={[styles.input, { height: 100 }]} placeholder="Content" value={item.content} onChangeText={t => updateNewsItem(i, 'content', t)} multiline />
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={addNewsItem}>
              <Text style={styles.addBtnText}>+ Add News</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={() => submitNewsAds('news', newsItems)}>
              <Text style={styles.submitText}>Submit News</Text>
            </TouchableOpacity>
          </View>

          {/* Ads */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ads Items</Text>
            {adsItems.map((item, i) => (
              <View key={i} style={styles.itemBox}>
                <TextInput style={styles.input} placeholder="Title" value={item.title} onChangeText={t => updateAdsItem(i, 'title', t)} />
                <TextInput style={[styles.input, { height: 100 }]} placeholder="Content" value={item.content} onChangeText={t => updateAdsItem(i, 'content', t)} multiline />
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={addAdsItem}>
              <Text style={styles.addBtnText}>+ Add Ad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={() => submitNewsAds('ads', adsItems)}>
              <Text style={styles.submitText}>Submit Ads</Text>
            </TouchableOpacity>
          </View>

          {/* Mosque Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mosque Info</Text>
            <TextInput style={styles.input} placeholder="Mosque Name" value={mosqueName} onChangeText={setMosqueName} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Address" value={address} onChangeText={setAddress} multiline />
            <TouchableOpacity style={styles.submitBtn} onPress={submitMosqueInfo}>
              <Text style={styles.submitText}>Submit Info</Text>
            </TouchableOpacity>
          </View>

          {/* Scrolling Text */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scrolling Message</Text>
            <TextInput style={styles.input} placeholder="Title" value={scrollingTitle} onChangeText={setScrollingTitle} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Message" value={scrollingText} onChangeText={setScrollingText} multiline />
            <TouchableOpacity style={styles.submitBtn} onPress={submitScrollingText}>
              <Text style={styles.submitText}>Submit Text</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showTimePicker && <DateTimePicker mode="time" value={new Date()} onChange={onTimeChange} />}

      <Modal transparent visible={showMenu}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowMenu(false)} />
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Masjid Made Easy — Anytime, Anywhere, for Every Prayer
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { height: 70, backgroundColor: '#1E40AF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  menuDots: { fontSize: 32, color: '#fff' },
  menu: { position: 'absolute', top: 80, right: 20, backgroundColor: '#fff', borderRadius: 16, elevation: 10, padding: 10 },
  menuItem: { padding: 15 },
  menuText: { fontSize: 16, color: '#1E40AF' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 8 },
  title: { fontSize: 28, textAlign: 'center', color: '#1E40AF', marginBottom: 20, fontWeight: 'bold' },
  input: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  authBtn: { backgroundColor: '#1E40AF', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  authBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  footer: { backgroundColor: '#1E293B', padding: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#334155' },
  footerText: { color: '#E2E8F0', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E40AF', marginBottom: 10 },
  dateChip: { backgroundColor: '#E0E7FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 30, marginRight: 10 },
  activeChip: { backgroundColor: '#4F46E5' },
  chipText: { color: '#1E40AF', fontWeight: '600' },
  activeChipText: { color: '#fff' },
  remove: { marginLeft: 8, backgroundColor: '#EF4444', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  removeText: { color: '#fff', fontWeight: 'bold' },
  addBtn: { backgroundColor: '#10B981', padding: 12, borderRadius: 30, alignSelf: 'center', marginTop: 10 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F0F9FF', padding: 14, borderRadius: 12, marginBottom: 8 },
  label: { fontWeight: '600', color: '#1E40AF' },
  value: { color: '#64748B' },
  submitBtn: { backgroundColor: '#10B981', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  itemBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginBottom: 12 },
});

export default App;
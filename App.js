import 'react-native-gesture-handler';
import 'react-native-worklets';
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
  FlatList,
  Modal,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // ────── Auth State (ADD) ──────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [authScreen, setAuthScreen] = useState('Login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // ────── TUMHARA ORIGINAL STATE ──────
  const [dates, setDates] = useState([new Date().toISOString().split('T')[0]]);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  // ────── Load Data ──────
  useEffect(() => {
    const loadData = async () => {
      const savedLogin = await AsyncStorage.getItem('isLoggedIn');
      if (savedLogin === 'true') setIsLoggedIn(true);
      const savedScrollingText = await AsyncStorage.getItem('scrollingText');
      if (savedScrollingText) setScrollingText(savedScrollingText);
    };
    loadData();
  }, []);

  // ────── SIGNUP (ADD) ──────
  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      const res = await fetch('http://192.168.68.110:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Account created! Please login.');
        setAuthScreen('Login');
        setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setPassword('');
      } else {
        Alert.alert('Error', data.error || 'Signup failed');
      }
    } catch (e) {
      Alert.alert('Network Error', e.message);
    }
  };

  // ────── LOGIN (ADD) ──────
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required');
      return;
    }
    try {
      const res = await fetch('http://192.168.68.110:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
      } else {
        Alert.alert('Error', data.error || 'Login failed');
      }
    } catch (e) {
      Alert.alert('Network Error', e.message);
    }
  };

  // ────── LOGOUT (ADD) ──────
  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setShowMenu(false);
  };

  // ────── TUMHARA ORIGINAL CODE (As-Is) ──────
  const validateTimeFormat = (time) => {
    if (!time || typeof time !== 'string') {
      console.warn(`Invalid time: ${time}`);
      return false;
    }
    const timeRegex = /^(\d{1,2}:\d{2}\s?(AM|PM))$/i;
    return timeRegex.test(time.trim());
  };

  const normalizeTime = (time) => {
    if (!time || typeof time !== 'string') return time;
    return time.replace(/\u202F/g, ' ').trim();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = selectedDate.toISOString().split('T')[0];
      const updatedDates = [...dates];
      updatedDates[selectedDateIndex] = newDate;
      setDates(updatedDates);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const timeStr = normalizeTime(
        selectedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      );
      if (!validateTimeFormat(timeStr)) {
        Alert.alert('Error', `Invalid time format for ${timePickerFor}: ${timeStr}. Use HH:MM AM/PM (e.g., 4:45 AM).`);
        return;
      }
      switch (timePickerFor) {
        case 'athanFajr': setAthanFajr(timeStr); break;
        case 'athanDhuhr': setAthanDhuhr(timeStr); break;
        case 'athanAsr': setAthanAsr(timeStr); break;
        case 'athanMaghrib': setAthanMaghrib(timeStr); break;
        case 'athanIsha': setAthanIsha(timeStr); break;
        case 'athanJuma': setAthanJuma(timeStr); break;
        case 'jamaatFajr': setJamaatFajr(timeStr); break;
        case 'jamaatDhuhr': setJamaatDhuhr(timeStr); break;
        case 'jamaatAsr': setJamaatAsr(timeStr); break;
        case 'jamaatMaghrib': setJamaatMaghrib(timeStr); break;
        case 'jamaatIsha': setJamaatIsha(timeStr); break;
        case 'jamaatJuma': setJamaatJuma(timeStr); break;
        case 'iftar': setIftarTime(timeStr); break;
        case 'sehri': setSehriTime(timeStr); break;
        default: break;
      }
    }
  };

  const showTimePickerModal = (field) => {
    setTimePickerFor(field);
    setShowTimePicker(true);
  };

  const addDate = () => {
    const nextDate = new Date(dates[dates.length - 1]);
    nextDate.setDate(nextDate.getDate() + 1);
    setDates([...dates, nextDate.toISOString().split('T')[0]]);
  };

  const removeDate = (index) => {
    if (dates.length > 1) {
      const updatedDates = dates.filter((_, i) => i !== index);
      setDates(updatedDates);
      if (selectedDateIndex >= updatedDates.length) setSelectedDateIndex(updatedDates.length - 1);
    }
  };

  const addNewsItem = () => {
    setNewsItems([...newsItems, { title: '', content: '' }]);
  };

  const addAdsItem = () => {
    setAdsItems([...adsItems, { title: '', content: '' }]);
  };

  const updateNewsItem = (index, field, value) => {
    const updatedItems = [...newsItems];
    updatedItems[index][field] = value;
    setNewsItems(updatedItems);
  };

  const updateAdsItem = (index, field, value) => {
    const updatedItems = [...adsItems];
    updatedItems[index][field] = value;
    setAdsItems(updatedItems);
  };

  // ────── SUBMIT PRAYER TIMES (Tumhara Original) ──────
  const submitPrayerTimes = async () => {
    const requiredFields = [athanFajr, athanDhuhr, athanAsr, athanMaghrib, athanIsha, athanJuma];
    const requiredFieldNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Juma'];
    for (let i = 0; i < requiredFields.length; i++) {
      const normalizedTime = normalizeTime(requiredFields[i]);
      if (!normalizedTime || !validateTimeFormat(normalizedTime)) {
        Alert.alert('Error', `Athan time for ${requiredFieldNames[i]} is missing or invalid. Please enter a valid time in HH:MM AM/PM format (e.g., 4:45 AM).`);
        return;
      }
    }

    const optionalFields = [jamaatFajr, jamaatDhuhr, jamaatAsr, jamaatMaghrib, jamaatIsha, jamaatJuma, iftarTime, sehriTime];
    const optionalFieldNames = ['Jamaat Fajr', 'Jamaat Dhuhr', 'Jamaat Asr', 'Jamaat Maghrib', 'Jamaat Isha', 'Jamaat Juma', 'Iftar', 'Sehri'];
    for (let i = 0; i < optionalFields.length; i++) {
      if (optionalFields[i]) {
        const normalizedTime = normalizeTime(optionalFields[i]);
        if (!validateTimeFormat(normalizedTime)) {
          Alert.alert('Error', `Invalid time format for ${optionalFieldNames[i]}: ${optionalFields[i]}. Use HH:MM AM/PM (e.g., 5:00 AM).`);
          return;
        }
      }
    }

    const data = {
      date: dates[selectedDateIndex],
      hijriDate: { english: hijriEnglish || 'Outside Ramadan', urdu: hijriUrdu || 'رمضان سے باہر' },
      athanTimings: {
        Fajr: normalizeTime(athanFajr),
        Dhuhr: normalizeTime(athanDhuhr),
        Asr: normalizeTime(athanAsr),
        Maghrib: normalizeTime(athanMaghrib),
        Isha: normalizeTime(athanIsha),
        Juma: normalizeTime(athanJuma),
      },
      jamaatTimings: {
        Fajr: normalizeTime(jamaatFajr) || '',
        Dhuhr: normalizeTime(jamaatDhuhr) || '',
        Asr: normalizeTime(jamaatAsr) || '',
        Maghrib: normalizeTime(jamaatMaghrib) || '',
        Isha: normalizeTime(jamaatIsha) || '',
        Juma: normalizeTime(jamaatJuma) || '',
      },
      endTimings: {},
      iftarTime: normalizeTime(iftarTime) || '',
      sehriTime: normalizeTime(sehriTime) || '',
    };

    console.log('Submitting prayer times:', JSON.stringify(data, null, 2));

    try {
      const response = await fetch('http://192.168.68.110:3000/api/namaz-end-start-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      console.log('Raw response for prayer times:', text);
      try {
        const result = JSON.parse(text);
        if (response.ok) {
          Alert.alert('Success!', `Timings for ${dates[selectedDateIndex]} uploaded successfully! Check website.`);
          // Reset fields after successful submission
          setAthanFajr('');
          setAthanDhuhr('');
          setAthanAsr('');
          setAthanMaghrib('');
          setAthanIsha('');
          setAthanJuma('');
          setJamaatFajr('');
          setJamaatDhuhr('');
          setJamaatAsr('');
          setJamaatMaghrib('');
          setJamaatIsha('');
          setJamaatJuma('');
          setIftarTime('');
          setSehriTime('');
        } else {
          Alert.alert('Error', result.error || 'Failed to upload timings');
        }
      } catch (jsonError) {
        console.error('JSON Parse Error for prayer times:', jsonError, 'Response:', text);
        Alert.alert('Error', `Invalid server response: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Network Error', 'Server not reachable: ' + error.message);
    }
  };

  const submitNewsAds = async (type, items) => {
    if (!items.length || items.every(item => !item.title || !item.content)) {
      Alert.alert('Error', `Please enter at least one ${type} item with title and content`);
      return;
    }

    try {
      for (const item of items) {
        if (item.title && item.content) {
          const data = { type, title: item.title, content: item.content, date: dates[selectedDateIndex] };
          const response = await fetch('http://192.168.68.110:3000/api/news-ads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const text = await response.text();
          console.log(`Raw response for ${type}:`, text);
          try {
            const result = JSON.parse(text);
            if (!response.ok) {
              Alert.alert('Error', result.error || `Failed to add ${type}`);
              return;
            }
          } catch (jsonError) {
            console.error(`JSON Parse Error for ${type}:`, jsonError, 'Response:', text);
            Alert.alert('Error', `Invalid server response for ${type}: ${text.substring(0, 100)}...`);
            return;
          }
        }
      }
      Alert.alert('Success!', `${type.charAt(0).toUpperCase() + type.slice(1)} for ${dates[selectedDateIndex]} added successfully! Check website.`);
      if (type === 'news') setNewsItems([{ title: '', content: '' }]);
      else if (type === 'ads') setAdsItems([{ title: '', content: '' }]);
    } catch (error) {
      console.error(`Network Error (${type}):`, error);
      Alert.alert('Network Error', `Server not reachable for ${type}: ${error.message}`);
    }
  };

  const submitMosqueInfo = async () => {
    if (!mosqueName || !address) {
      Alert.alert('Error', 'Please enter both Mosque Name and Address');
      return;
    }

    const data = { mosqueName, address, date: dates[selectedDateIndex] };

    try {
      const response = await fetch('http://192.168.68.110:3000/api/mosque-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      console.log('Raw response for mosque info:', text);
      try {
        const result = JSON.parse(text);
        if (response.ok) {
          Alert.alert('Success!', `Mosque info for ${dates[selectedDateIndex]} updated successfully! Check website.`);
          setMosqueName('');
          setAddress('');
        } else {
          Alert.alert('Error', result.error || 'Failed to update mosque info');
        }
      } catch (jsonError) {
        console.error('JSON Parse Error for mosque info:', jsonError, 'Response:', text);
        Alert.alert('Error', `Invalid server response: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Network Error (mosque info):', error);
      Alert.alert('Network Error', 'Server not reachable: ' + error.message);
    }
  };

  const submitScrollingText = async () => {
    if (!scrollingText) {
      Alert.alert('Error', 'Please enter scrolling text');
      return;
    }

    try {
      const data = { type: 'scrolling', title: scrollingTitle || 'Scrolling Message', content: scrollingText, date: dates[selectedDateIndex] };
      console.log('Submitting scrolling text with data:', data);
      const response = await fetch('http://192.168.68.110:3000/api/news-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      console.log('Raw response for scrolling text:', text);
      try {
        const result = JSON.parse(text);
        if (response.ok) {
          await AsyncStorage.setItem('scrollingText', scrollingText);
          Alert.alert('Success!', `Scrolling text updated successfully! Check website.`);
        } else {
          Alert.alert('Error', result.error || 'Failed to update scrolling text');
        }
      } catch (jsonError) {
        console.error('JSON Parse Error for scrolling text:', jsonError, 'Response:', text);
        Alert.alert('Error', `Invalid server response: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Network Error (scrolling text):', error);
      Alert.alert('Network Error', 'Server not reachable: ' + error.message);
    }
  };

  // ────── RENDER ──────
  return (
    <View style={styles.pageContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Masjid</Text>
        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuBtn}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* 3-Dot Menu */}
      <Modal transparent visible={showMenu} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)} />
        <View style={styles.menuModal}>
          {!isLoggedIn ? (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setAuthScreen('Login'); setShowMenu(false); }}>
                <Text style={styles.menuText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setAuthScreen('Signup'); setShowMenu(false); }}>
                <Text style={styles.menuText}>Signup</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* Auth Screens */}
      {!isLoggedIn ? (
        <View style={styles.authContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.logo} />
          {authScreen === 'Signup' ? (
            <View style={styles.formCard}>
              <Text style={styles.authTitle}>Create Account</Text>
              <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
              <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <TouchableOpacity style={styles.authBtn} onPress={handleSignup}>
                <Text style={styles.authBtnText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAuthScreen('Login')}>
                <Text style={styles.switchText}>Already have an account? <Text style={styles.link}>Login</Text></Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formCard}>
              <Text style={styles.authTitle}>Welcome Back</Text>
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <TouchableOpacity style={styles.authBtn} onPress={handleLogin}>
                <Text style={styles.authBtnText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAuthScreen('Signup')}>
                <Text style={styles.switchText}>Don't have an account? <Text style={styles.link}>Sign Up</Text></Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        /* TUMHARA ORIGINAL MAIN PANEL */
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title}>Smart Masjid </Text>
          <Text style={styles.sectionTitle}>Select or Add Dates</Text>
          <FlatList
            data={dates}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.dateButton, selectedDateIndex === index && styles.selectedDateButton]}
                onPress={() => setSelectedDateIndex(index)}
              >
                <Text style={styles.dateText}>{item}</Text>
                <TouchableOpacity onPress={() => removeDate(index)} style={styles.removeButton}>
                  <Text style={styles.removeText}>X</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.addButton} onPress={addDate}>
            <Text style={styles.buttonText}>Add Next Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(dates[selectedDateIndex])}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>Change Selected Date: {dates[selectedDateIndex]}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Hijri English (e.g., 15 Rabi' al-Thani 1447)"
            value={hijriEnglish}
            onChangeText={setHijriEnglish}
          />
          <TextInput
            style={styles.input}
            placeholder="Hijri Urdu (e.g., ۱۵ ربیع الثانی ۱۴۴۷)"
            value={hijriUrdu}
            onChangeText={setHijriUrdu}
          />
          <Text style={styles.sectionTitle}>Athan Timings</Text>
          <TouchableOpacity onPress={() => showTimePickerModal('athanFajr')} style={styles.input}>
            <Text>Fajr: {athanFajr || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('athanDhuhr')} style={styles.input}>
            <Text>Dhuhr: {athanDhuhr || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('athanAsr')} style={styles.input}>
            <Text>Asr: {athanAsr || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('athanMaghrib')} style={styles.input}>
            <Text>Maghrib: {athanMaghrib || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('athanIsha')} style={styles.input}>
            <Text>Isha: {athanIsha || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('athanJuma')} style={styles.input}>
            <Text>Juma: {athanJuma || 'Select Time'}</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Jamaat Timings</Text>
          <TouchableOpacity onPress={() => showTimePickerModal('jamaatFajr')} style={styles.input}>
            <Text>Fajr Jamaat: {jamaatFajr || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('jamaatDhuhr')} style={styles.input}>
            <Text>Dhuhr Jamaat: {jamaatDhuhr || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('jamaatAsr')} style={styles.input}>
            <Text>Asr Jamaat: {jamaatAsr || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('jamaatMaghrib')} style={styles.input}>
            <Text>Maghrib Jamaat: {jamaatMaghrib || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('jamaatIsha')} style={styles.input}>
            <Text>Isha Jamaat: {jamaatIsha || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('jamaatJuma')} style={styles.input}>
            <Text>Juma Jamaat: {jamaatJuma || 'Select Time'}</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Special Times</Text>
          <TouchableOpacity onPress={() => showTimePickerModal('iftar')} style={styles.input}>
            <Text>Iftar: {iftarTime || 'Select Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showTimePickerModal('sehri')} style={styles.input}>
            <Text>Sehri: {sehriTime || 'Select Time'}</Text>
          </TouchableOpacity>

          {/* SUBMIT PRAYER BUTTON - SEHRI KE NICHE */}
          <TouchableOpacity style={styles.submitButton} onPress={submitPrayerTimes}>
            <Text style={styles.buttonText}>Submit Prayer Timings</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>News Items</Text>
          {newsItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <TextInput
                style={styles.input}
                placeholder={`News Title ${index + 1} (e.g., Ramadan Announcement)`}
                value={item.title}
                onChangeText={(text) => updateNewsItem(index, 'title', text)}
              />
              <TextInput
                style={[styles.input, { height: 120 }]}
                placeholder={`News Content ${index + 1} (up to 5-6 lines)`}
                value={item.content}
                onChangeText={(text) => updateNewsItem(index, 'content', text)}
                multiline
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addNewsItem}>
            <Text style={styles.buttonText}>Add Another News Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={() => submitNewsAds('news', newsItems)}>
            <Text style={styles.buttonText}>Submit News Items</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Ads Items</Text>
          {adsItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <TextInput
                style={styles.input}
                placeholder={`Ad Title ${index + 1} (e.g., Local Business Offer)`}
                value={item.title}
                onChangeText={(text) => updateAdsItem(index, 'title', text)}
              />
              <TextInput
                style={[styles.input, { height: 120 }]}
                placeholder={`Ad Content ${index + 1} (up to 5-6 lines)`}
                value={item.content}
                onChangeText={(text) => updateAdsItem(index, 'content', text)}
                multiline
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addAdsItem}>
            <Text style={styles.buttonText}>Add Another Ad Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={() => submitNewsAds('ads', adsItems)}>
            <Text style={styles.buttonText}>Submit Ads Items</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Mosque Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Mosque Name (e.g., Baitul Mukkaram Masjid)"
            value={mosqueName}
            onChangeText={setMosqueName}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Address (e.g., Millat Colony Bhadauni Sharif Nawada Bihar, Mob No: 8271565060)"
            value={address}
            onChangeText={setAddress}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitMosqueInfo}>
            <Text style={styles.buttonText}>Submit Mosque Info</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onTimeChange}
            />
          )}
          <Text style={styles.sectionTitle}>Change Scrolling Text</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Scrolling Title (e.g., Masjid Announcement)"
            value={scrollingTitle}
            onChangeText={setScrollingTitle}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Enter Scrolling Text (e.g., Welcome to Masjid...)"
            value={scrollingText}
            onChangeText={setScrollingText}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitScrollingText}
          >
            <Text style={styles.buttonText}>Submit Scrolling Text</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            Note: Submit ke baad backend auto NamazEndStartTime, News/Ads, aur Mosque Info save karega. Website pe check karo.
          </Text>
        </ScrollView>
      )}

      {/* FOOTER - HAR PAGE PAR */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Smart Masjid App. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { height: 60, backgroundColor: '#007BFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  menuBtn: { padding: 10 },
  menuDots: { fontSize: 28, color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuModal: { position: 'absolute', top: 70, right: 15, backgroundColor: '#fff', borderRadius: 8, elevation: 5, padding: 10 },
  menuItem: { paddingVertical: 12, paddingHorizontal: 20 },
  menuText: { fontSize: 16 },
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 30, borderRadius: 60 },
  formCard: { width: '100%', backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 8 },
  authTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#007BFF' },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, marginBottom: 15 },
  authBtn: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  authBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  switchText: { textAlign: 'center', marginTop: 15, color: '#666' },
  link: { color: '#007BFF', fontWeight: 'bold' },
  scrollContainer: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#007BFF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 10, color: '#333' },
  dateButton: { padding: 12, marginRight: 12, backgroundColor: '#e0e0e0', borderRadius: 8, position: 'relative' },
  selectedDateButton: { backgroundColor: '#4CAF50' },
  dateText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  removeButton: { position: 'absolute', top: -8, right: -8, backgroundColor: '#f44336', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  removeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  addButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  note: { textAlign: 'center', marginTop: 20, fontSize: 12, color: '#666', fontStyle: 'italic' },
  footer: { height: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#fff', fontSize: 14 },
});

export default App;
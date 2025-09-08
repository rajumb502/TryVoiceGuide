import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { StorageService } from '../services/StorageService';

export default function SettingsScreen() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      setIsLoading(true);
      const storage = StorageService.getInstance();
      const apiKey = storage.getItem('gemini_api_key');
      if (apiKey) {
        setGeminiApiKey(apiKey);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = () => {
    if (!geminiApiKey.trim()) {
      Alert.alert('Error', 'Gemini API Key is required');
      return;
    }

    setIsSaving(true);
    try {
      const storage = StorageService.getInstance();
      storage.setItem('gemini_api_key', geminiApiKey.trim());
      Alert.alert('Success', 'Settings saved successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const testApiKey = () => {
    if (!geminiApiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key first');
      return;
    }

    // Simple validation - check if key looks like a valid Gemini API key
    const apiKey = geminiApiKey.trim();
    
    if (apiKey.length < 30 || !apiKey.startsWith('AIza')) {
      Alert.alert('Error', 'Invalid API key format. Gemini API keys start with "AIza" and are longer than 30 characters.');
      return;
    }
    
    Alert.alert('Success', 'API key format is valid! You can now save the settings.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Configuration</Text>
          
          <Text style={styles.label}>Gemini API Key *</Text>
          <TextInput
            style={styles.input}
            value={geminiApiKey}
            onChangeText={setGeminiApiKey}
            placeholder="Enter your Gemini API key"
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[styles.testButton, (isLoading || !geminiApiKey.trim()) && styles.disabledButton]}
            onPress={testApiKey}
            disabled={isLoading || !geminiApiKey.trim()}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Testing...' : 'Test API Key'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.helpTitle}>How to get Gemini API Key:</Text>
          <Text style={styles.helpText}>
            1. Visit https://makersuite.google.com/app/apikey{'\n'}
            2. Sign in with your Google account{'\n'}
            3. Click "Create API Key"{'\n'}
            4. Copy and paste the key above
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, (isSaving || !geminiApiKey.trim()) && styles.disabledButton]}
          onPress={saveSettings}
          disabled={isSaving || !geminiApiKey.trim()}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  testButton: {
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
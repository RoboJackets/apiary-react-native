import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Modal, RadioButton } from 'react-native-paper';
import { APP_ENVIRONMENTS, useAppEnvironment } from '../AppEnvironment';
import RoundedButton from '../Components/RoundedButton';

type EnvironmentSelectProps = {
  visible: boolean;
  onDismiss: () => void;
};

export default function EnvironmentSelect({ visible, onDismiss }: EnvironmentSelectProps) {
  const { environment, setEnvironment } = useAppEnvironment();
  const [selectedEnv, setSelectedEnv] = useState<string>(environment.name.toLowerCase());
  const [customUrl, setCustomUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedEnv(environment.name.toLowerCase());
      setCustomUrl(environment.production ? '' : environment.baseUrl.toLowerCase());
      setError(null);
    }
  }, [visible]);

  async function validateUrl(url: string) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    try {
      const resp = await fetch(`${url}/api/v1/info`, { method: "GET", signal: controller.signal });
      clearTimeout(id);
      return resp.ok;
    } catch (error: unknown) {
      clearTimeout(id);
      return false;
    }
  }

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.sheet}>
      <Text style={styles.title}>Change Server</Text>
      <RadioButton.Group onValueChange={setSelectedEnv} value={selectedEnv}>
        <View style={styles.row}>
          <RadioButton.Android value="production" />
          <Text>Production</Text>
        </View>
        <View style={styles.row}>
          <RadioButton.Android value="other" />
          <Text>Other</Text>
        </View>
      </RadioButton.Group>

      {selectedEnv === 'other' && (
        <TextInput
          style={styles.textInput}
          placeholder="Enter base URL"
          value={customUrl}
          onChangeText={setCustomUrl}
          autoCapitalize="none"
        />
      )}

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      <RoundedButton
        title="Save Changes"
        onPress={async () => {
          if (selectedEnv === 'other') {
            if (!customUrl.trim()) {
              setError('Custom URL cannot be empty.');
              return;
            }
            if (!await validateUrl(customUrl.trim())) {
              setError('Custom URL is invalid.');
              return;
            }
            setEnvironment({
              name: 'Other',
              production: false,
              baseUrl: customUrl,
            });
          } else {
            setEnvironment(APP_ENVIRONMENTS[selectedEnv]);
          }
          setError(null);
          onDismiss();
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  sheet: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 30,
  },
  textInput: {
    marginBottom: 12,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
  },
});

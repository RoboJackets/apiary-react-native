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

  useEffect(() => {
    if (visible) {
      setSelectedEnv(environment.name.toLowerCase());
      setCustomUrl('');
    }
  }, [visible]);

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.sheet}>
      <Text style={styles.title}>Change Server</Text>
      <RadioButton.Group onValueChange={setSelectedEnv} value={selectedEnv}>
        <View style={styles.row}>
          <RadioButton.Android value="production" />
          <Text>Production</Text>
        </View>
        <View style={styles.row}>
          <RadioButton.Android value="test" />
          <Text>Test</Text>
        </View>
        <View style={styles.row}>
          <RadioButton.Android value="demo" />
          <Text>Demo</Text>
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
        />
      )}

      <RoundedButton
        title="Save Changes"
        onPress={() => {
          if (selectedEnv === 'other') {
            if (!customUrl.trim()) {
              onDismiss();
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
});

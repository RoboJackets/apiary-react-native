import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modal, RadioButton } from 'react-native-paper';
import { APP_ENVIRONMENTS, useAppEnvironment } from '../AppEnvironment';
import RoundedButton from '../Components/RoundedButton';

type EnvironmentSelectProps = {
  visible: boolean;
  onDismiss: () => void;
};

export default function EnvironmentSelect({
  visible,
  onDismiss,
}: EnvironmentSelectProps) {
  
  const {environment, setEnvironment} = useAppEnvironment();
  const [selectedEnv, setSelectedEnv] = useState<string>(environment.name.toLowerCase());

    return (
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.sheet}>
          <Text style={styles.title}>Change Server</Text>

          <RadioButton.Group onValueChange={setSelectedEnv} value={selectedEnv}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton.Android value="production" />
              <Text>Production</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton.Android value="test" />
              <Text>Test</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton.Android value="demo" />
              <Text>Demo</Text>
            </View>
          </RadioButton.Group>

          <RoundedButton title="Save Changes" onPress={() => {
            setEnvironment(APP_ENVIRONMENTS[selectedEnv]);
            onDismiss();
          }} />
      </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: 'white',
    padding: 30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
});
